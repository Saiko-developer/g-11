import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { gradeClassAttempt } from "@/lib/class-exam-grade.server";

const BATCH = 3;

/** Scheduled background AI marking: drafts marks for submitted class exams even when no teacher page is open. */
export const Route = createFileRoute("/api/public/cron-auto-grade")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");

        const { data: control } = await db.from("class_exam_ai_control").select("paused,reason").eq("id", true).maybeSingle();
        if (control?.paused) return Response.json({ status: "paused", reason: control.reason });

        const { data: atts } = await db.from("class_exam_attempts").select("id")
          .not("submitted_at", "is", null).is("graded_at", null)
          .order("submitted_at", { ascending: true }).limit(100);
        const ids = (atts ?? []).map((a) => a.id as string);
        if (!ids.length) return Response.json({ status: "idle", processed: 0 });
        const { data: drafts } = await db.from("class_exam_ai_drafts").select("attempt_id,status,lease_until").in("attempt_id", ids);
        const dm = new Map((drafts ?? []).map((d) => [d.attempt_id as string, d]));
        const now = Date.now();
        const todo = ids.filter((id) => {
          const d = dm.get(id);
          if (!d) return true;
          if (d.status === "pending") return true;
          return d.status === "running" && (!d.lease_until || new Date(d.lease_until).getTime() < now);
        }).slice(0, BATCH);

        const results: { id: string; status: string }[] = [];
        for (const id of todo) {
          const r = await gradeClassAttempt(db, id, false);
          results.push({ id, status: r.status });
          if (r.status === "blocked" || r.status === "rate_limited") break; // circuit breaker
        }
        return Response.json({ status: "ok", processed: results.length, results });
      },
    },
  },
});
