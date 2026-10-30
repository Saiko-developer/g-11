import { z } from "zod";

export const paperFileSchema = z.object({ path: z.string().min(1), name: z.string().min(1), type: z.string() });
export const uploadedPaperSchema = z.object({ kind: z.literal("upload"), title: z.string(), totalMarks: z.number().positive(), files: z.array(paperFileSchema).min(1).max(10) });
export type PaperFile = z.infer<typeof paperFileSchema>;
export type UploadedPaper = z.infer<typeof uploadedPaperSchema>;
export function isUploadedPaper(paper: unknown): paper is UploadedPaper {
  return uploadedPaperSchema.safeParse(paper).success;
}
export function paperMime(file: Pick<PaperFile, "name" | "type">) {
  const ext = file.name.toLowerCase().split(".").pop();
  const types: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  return types[ext ?? ""] ?? file.type;
}
export function validatePaperFile(file: { name: string; type: string; size: number }) {
  if (!file.size || file.size > 20 * 1024 * 1024) throw new Error("Each paper file must be between 1 byte and 20 MB.");
  if (!["application/pdf", "image/png", "image/jpeg", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(paperMime(file))) throw new Error("Please use PDF, Word, JPEG or PNG files.");
}