/**
 * Tiny event bridge between the landing-page "Upload Exam Paper" button and the
 * Sayar Owl chatbox. Keeps the two components decoupled — the button just
 * announces the picked file, the chat widget listens and opens itself.
 */
export const EXAM_UPLOAD_EVENT = "saya-owl:exam-upload";

export const EXAM_UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.pdf,.docx,image/jpeg,image/png,application/pdf";

export const EXAM_UPLOAD_MESSAGE =
  "I've uploaded my exam paper! Let's revise and practice it together.";

export function emitExamUpload(file: File) {
  window.dispatchEvent(new CustomEvent<File>(EXAM_UPLOAD_EVENT, { detail: file }));
}

export function onExamUpload(handler: (file: File) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<File>).detail);
  window.addEventListener(EXAM_UPLOAD_EVENT, listener);
  return () => window.removeEventListener(EXAM_UPLOAD_EVENT, listener);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file"));
    reader.readAsDataURL(file);
  });
}
