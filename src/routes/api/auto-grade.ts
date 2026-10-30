import { createFileRoute } from "@tanstack/react-router";
import { gradePaper } from "@/lib/grade-paper.server";
import { z } from "zod";
import { isUploadedPaper, paperFileSchema } from "@/lib/uploaded-paper";
import { gradeUploadedPaper, type GradingDocument } from "@/lib/grade-upload.server";
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
        const { data: control } = await db.from("class_exam_ai_control").select("paused,reason,status_code").eq("id", true).maybeSingle();
        if (control?.paused) return Response.json({ status: "blocked", error: control.reason }, { status: control.status_code || 403 });
        const { data: claimed, error: claimError } = await db.rpc("claim_class_exam_ai", { _attempt: attemptId, _force: !!force });
        if (claimError) return Response.json({ error: claimError.message }, { status: 500 });
        if (!claimed) {
          const { data: current } = await db.from("class_exam_ai_drafts").select("status,error").eq("attempt_id", attemptId).maybeSingle();
          return Response.json({ status: current?.status || "blocked", error: current?.error });
        }
        try {
          const paper = asg?.paper_data as unknown as MockExamPaper;
          const images: string[] = [];
          for (const p of att.image_paths.slice(0, 6)) {
            const { data: blob } = await db.storage.from("exam-photos").download(p);
            if (!blob) throw new Error("An answer photo could not be opened.");
            const buf = new Uint8Array(await blob.arrayBuffer());
            let bin = "";
            for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
            images.push(`data:${blob.type || "image/jpeg"};base64,${btoa(bin)}`);
          }
          if (!images.length) throw new Error("No photos");
          let result;
          if (isUploadedPaper(asg?.paper_data)) {
            const uploaded = asg.paper_data;
            const { data: guide } = await db.from("class_exam_marking_guides").select("files").eq("assignment_id", att.assignment_id).maybeSingle();
            const guideFiles = z.array(paperFileSchema).max(10).parse(guide?.files ?? []);
            const readFiles = async (files: typeof uploaded.files, keys: boolean): Promise<GradingDocument[]> => {
              const docs: GradingDocument[] = [];
              let bytes = 0;
              for (const file of files) {
                if (!file.path.startsWith(`${asg.classroom_id}/`) || file.path.includes("..") || (keys !== file.path.startsWith(`${asg.classroom_id}/keys/`))) throw new Error("Invalid paper file path.");
                const { data: blob, error } = await db.storage.from("class-papers").download(file.path);
                if (error || !blob) throw new Error(`Could not open ${file.name}.`);
                bytes += blob.size;
                if (bytes > 40 * 1024 * 1024) throw new Error("Paper files exceed the AI reading limit of 40 MB.");
                docs.push({ ...file, blob });
              }
              return docs;
            };
            result = await gradeUploadedPaper(uploaded, await readFiles(uploaded.files, false), await readFiles(guideFiles, true), images);
          } else result = await gradePaper(paper, images);
          await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: "done", result: result as never, error: null, updated_at: new Date().toISOString(), lease_until: null });
          return Response.json({ status: "done" });
        } catch (e) {
          const err = e as { statusCode?: number; message?: string; responseBody?: string; refused?: boolean };
          const status = err.statusCode ?? (/\b(402|403|429)\b/.exec(err.message ?? "") ? Number(/\b(402|403|429)\b/.exec(err.message ?? "")?.[1]) : 500);
          let msg = err.message || "AI could not mark this paper.";
          try { const upstream = JSON.parse(err.responseBody || "{}"); msg = upstream.message || upstream.error?.message || msg; } catch { /* keep safe error message */ }
          const blocked = status === 402 || status === 403;
          if (blocked) await db.from("class_exam_ai_control").upsert({ id: true, paused: true, reason: msg, status_code: status });
          await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: blocked ? "blocked" : err.refused ? "refused" : "error", error: msg, lease_until: null, updated_at: new Date().toISOString() });
          return Response.json({ status: blocked ? "blocked" : "error", error: msg }, { status });
        }
      },
    },
  },
});
