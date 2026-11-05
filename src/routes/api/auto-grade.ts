import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { gradeClassAttempt } from "@/lib/class-exam-grade.server";

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

        const parsed = z.object({ attemptId: z.string().uuid().optional(), assignmentId: z.string().uuid().optional(), force: z.boolean().optional() }).safeParse(await request.json().catch(() => null));
        if (!parsed.success || (!parsed.data.attemptId && !parsed.data.assignmentId)) return Response.json({ error: "Invalid exam request" }, { status: 400 });
        const body = parsed.data;
        const force = body.force;
        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
        const q = db.from("class_exam_attempts").select("*");
        const { data: att } = body.attemptId ? await q.eq("id", body.attemptId).maybeSingle()
          : body.assignmentId ? await q.eq("assignment_id", body.assignmentId).eq("student_id", uid).maybeSingle()
          : { data: null };
        const attemptId = att?.id as string;
        if (!att?.submitted_at) return Response.json({ error: "Not submitted" }, { status: 404 });
        const { data: asg } = await db.from("classroom_assignments").select("classroom_id, paper_data").eq("id", att.assignment_id).maybeSingle();
        const { data: cls } = asg ? await db.from("classrooms").select("teacher_id").eq("id", asg.classroom_id).maybeSingle() : { data: null };
        if (uid !== att.student_id && uid !== cls?.teacher_id) return Response.json({ error: "Not allowed" }, { status: 403 });

        if (force && uid !== cls?.teacher_id) return Response.json({ error: "Only the teacher can re-grade." }, { status: 403 });
        const r = await gradeClassAttempt(db, attemptId, !!force);
        return Response.json({ status: r.status, error: r.error }, { status: r.httpStatus });
      },
    },
  },
});
