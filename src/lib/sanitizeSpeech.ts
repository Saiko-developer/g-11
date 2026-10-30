/**
 * Text sanitisation middleware shared by every audio pipeline.
 * Strips markdown, HTML/XML tags, emojis and control characters so the TTS
 * engines only ever receive clean, speakable text (Burmese Unicode safe).
 */
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}\u{2190}-\u{21FF}]/gu;

export function sanitizeForSpeech(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/<[^>]+>/g, " ") // any HTML/XML tag
    .replace(/!\[.*?\]\(.*?\)/g, " ") // markdown images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // markdown links
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s*[-*+]\s+/gm, "") // bullets
    .replace(/\|/g, " ") // table pipes
    .replace(/[*_#>~`]/g, "") // stray markdown symbols
    .replace(EMOJI, " ") // emojis
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // control chars
    .replace(/\s+/g, " ")
    .trim();
}
