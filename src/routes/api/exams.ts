import { createFileRoute } from "@tanstack/react-router";

const maxBytes = 20 * 1024 * 1024;
const types = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const EXAM_BUCKET = "exam-uploads";

/** Anonymous exam-paper upload (no sign-in). Files are write-only for visitors. */
export const Route = createFileRoute("/api/exams")({ server: { handlers: {
  POST: async ({ request }) => {
    const supabaseAdmin: any = (await import("@/integrations/supabase/client.server")).supabaseAdmin;
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File) || !types.has(file.type)) return Response.json({ error: "Upload a JPG, PNG, WebP image, or PDF." }, { status: 400 });
    if (!file.size || file.size > maxBytes) return Response.json({ error: "Files must be smaller than 20 MB." }, { status: 413 });
    const safeName = file.name.replace(/[^\w.-]/g, "_").slice(-160) || "exam-paper";
    const anonId = crypto.randomUUID();
    const key = `anonymous/${anonId}-${safeName}`;
    const { error: uploadError } = await supabaseAdmin.storage.from(EXAM_BUCKET).upload(key, new Uint8Array(await file.arrayBuffer()), { contentType: file.type });
    if (uploadError) {
      console.error("[exam upload] storage failed", uploadError.message);
      return Response.json({ error: "The exam paper could not be saved." }, { status: 500 });
    }
    const { data, error } = await supabaseAdmin.from("exam_uploads").insert({ user_id: anonId, file_name: file.name.slice(0, 255), file_path: key, mime_type: file.type }).select("id").single();
    if (error || !data) {
      await supabaseAdmin.storage.from(EXAM_BUCKET).remove([key]);
      return Response.json({ error: "The exam paper could not be saved." }, { status: 500 });
    }
    return Response.json({ id: data.id, fileName: file.name }, { status: 201 });
  },
} } });
