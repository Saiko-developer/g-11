import { z } from "zod";
import { gradePaper } from "@/lib/grade-paper.server";
import { isUploadedPaper, paperFileSchema } from "@/lib/uploaded-paper";
import { gradeUploadedPaper, type GradingDocument } from "@/lib/grade-upload.server";
import type { MockExamPaper } from "@/lib/mockExam";

export type GradeOutcome = { status: string; error?: string | null; httpStatus: number };

/** Claims and AI-marks one submitted class-exam attempt, storing a private draft. Caller must already be authorized. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function gradeClassAttempt(db: any, attemptId: string, force: boolean): Promise<GradeOutcome> {
  const { data: control } = await db.from("class_exam_ai_control").select("paused,reason,status_code").eq("id", true).maybeSingle();
  if (control?.paused) return { status: "blocked", error: control.reason, httpStatus: control.status_code || 403 };
  const { data: claimed, error: claimError } = await db.rpc("claim_class_exam_ai", { _attempt: attemptId, _force: force });
  if (claimError) return { status: "error", error: claimError.message, httpStatus: 500 };
  if (!claimed) {
    const { data: current } = await db.from("class_exam_ai_drafts").select("status,error").eq("attempt_id", attemptId).maybeSingle();
    return { status: current?.status || "blocked", error: current?.error, httpStatus: 200 };
  }
  try {
    const { data: att } = await db.from("class_exam_attempts").select("assignment_id,image_paths").eq("id", attemptId).maybeSingle();
    if (!att) throw new Error("Attempt not found");
    const { data: asg } = await db.from("classroom_assignments").select("classroom_id, paper_data").eq("id", att.assignment_id).maybeSingle();
    const paper = asg?.paper_data as unknown as MockExamPaper;
    const images: string[] = [];
    for (const p of (att.image_paths as string[]).slice(0, 6)) {
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
    await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: "done", result, error: null, updated_at: new Date().toISOString(), lease_until: null });
    return { status: "done", httpStatus: 200 };
  } catch (e) {
    const err = e as { statusCode?: number; message?: string; responseBody?: string; refused?: boolean };
    const m = /\b(402|403|429)\b/.exec(err.message ?? "");
    const status = err.statusCode ?? (m ? Number(m[1]) : 500);
    let msg = err.message || "AI could not mark this paper.";
    try { const upstream = JSON.parse(err.responseBody || "{}"); msg = upstream.message || upstream.error?.message || msg; } catch { /* keep safe error message */ }
    const blocked = status === 402 || status === 403;
    if (blocked) await db.from("class_exam_ai_control").upsert({ id: true, paused: true, reason: msg, status_code: status });
    // 429: release back to pending so the next scheduled run retries it.
    const nextStatus = blocked ? "blocked" : status === 429 ? "pending" : err.refused ? "refused" : "error";
    await db.from("class_exam_ai_drafts").upsert({ attempt_id: attemptId, status: nextStatus, error: msg, lease_until: null, updated_at: new Date().toISOString() });
    return { status: blocked ? "blocked" : status === 429 ? "rate_limited" : "error", error: msg, httpStatus: status };
  }
}
