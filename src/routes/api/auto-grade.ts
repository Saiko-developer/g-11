import { createFileRoute } from "@tanstack/react-router";
import { gradePaper } from "@/lib/grade-paper.server";
import type { MockExamPaper } from "@/lib/mockExam";

/** Creates a private AI draft mark for a submitted class-exam attempt. Only the student or the class teacher may trigger it. */
export const Route = createFileRoute("/api/auto-grade")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (!token) return Response.json({ error: "Please sign in first." }, { status: 401 });
        const authRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
          headers: { Authorization: `Bearer ${token}`, apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "" },
        });
        if (!authRes.ok) return Response.json({ error: "Please sign in again." }, { status: 401 });
        const uid = ((await authRes.json()) as { id: string }).id;

        const { attemptId, force } = (await request.json()) as { attemptId?: string; force?: boolean };
        if (!attemptId) return Response.json({ error: "Missing attempt" }, { status: 400 });

        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
        const { data: att } = await db.from("class_exam_attempts").select("*").eq("id", attemptId).maybeSingle();
        if (!att?.submitted_at) return Response.json({ error: "Not submitted" }, { status: 404 });
        const { data: asg } = await db.from("classroom_assignments").select("classroom_id, paper_data").eq("id", att.assignment_id).maybeSingle();
        const { data: cls } = asg ? await db.from("classrooms").select("teacher_id").eq("id", asg.classroom_id).maybeSingle() : { data: null };
        if (uid !== att.student_id && uid !== cls?.teacher_id) return Response.json({ error: "Not allowed" }, { status: 403 });

        const { data: existing } = await db.from("class_exam_ai_drafts").select("status, updated_at").eq("attempt_id", attemptId).maybeSingle();
        const fresh = existing && Date.now() - new Date(existing.updated_at).getTime() < 5 * 60_000;
        if (existing?.status === "done" || (existing?.status === "pending" && fresh && !force)) {
          return Response.json({ status: existing.status });
        }
        // 402/403 = AI credits/policy block: never retry automatically, only on teacher's explicit force.
        if (existing?.status === "blocked" && !force) return Response.json({ status: "blocked" });

        await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: "pending", error: null, updated_at: new Date().toISOString() });
        try {
          const paper = asg?.paper_data as unknown as MockExamPaper;
          const images: string[] = [];
          for (const p of att.image_paths.slice(0, 6)) {
            const { data: blob } = await db.storage.from("exam-photos").download(p);
            if (!blob) continue;
            const buf = new Uint8Array(await blob.arrayBuffer());
            let bin = "";
            for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
            images.push(`data:${blob.type || "image/jpeg"};base64,${btoa(bin)}`);
          }
          if (!images.length) throw new Error("No photos");
          const result = await gradePaper(paper, images);
          await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: "done", result: result as never, error: null, updated_at: new Date().toISOString() });
          return Response.json({ status: "done" });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown";
          console.error("[auto-grade]", msg);
          const blocked = /\b(402|403)\b/.test(msg);
          await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: blocked ? "blocked" : "error", error: blocked ? "AI credits ran out" : "AI could not mark this paper", updated_at: new Date().toISOString() });
          return Response.json({ status: blocked ? "blocked" : "error" }, { status: 500 });
        }
      },
    },
  },
});
