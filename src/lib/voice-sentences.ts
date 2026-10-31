/**
 * Splits a streaming tutor reply into speakable chunks, so speech can start
 * after the first complete sentence instead of waiting for the full answer.
 */
const BOUNDARY = /[။.!?\n]/;
export const MIN_CHUNK = 40;

export function takeSpeakableChunks(
  text: string,
  from: number,
  final: boolean,
  minChunk = MIN_CHUNK,
): { chunks: string[]; next: number } {
  const chunks: string[] = [];
  let start = from;
  let cursor = from;
  let lastBoundary = -1;
  while (cursor < text.length) {
    const ch = text[cursor];
    if (BOUNDARY.test(ch)) {
      // A "." between digits (e.g. 3.5) is not a sentence end.
      const isDecimal = ch === "." && /\d/.test(text[cursor - 1] ?? "") && /\d/.test(text[cursor + 1] ?? "");
      if (!isDecimal) {
        lastBoundary = cursor;
        const piece = text.slice(start, cursor + 1).trim();
        if (piece.replace(/[\s*#>\-_`]/g, "").length >= minChunk) {
          chunks.push(piece);
          start = cursor + 1;
        }
      }
    }
    cursor++;
  }
  if (final) {
    const rest = text.slice(start).trim();
    if (rest.replace(/[\s*#>\-_`]/g, "").length > 0) chunks.push(rest);
    return { chunks, next: text.length };
  }
  void lastBoundary;
  return { chunks, next: start };
}

/** Removes bracketed section headers and markdown so they are never read aloud. */
export function cleanForSpeech(text: string): string {
  return text
    .replace(/\[[^\]\n]{1,60}\]/g, "")
    .replace(/[*#>`_]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
