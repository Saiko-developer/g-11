import data from "@/data/grade11/listeningCaptions.json";

export type Grade11CaptionWord = { start: number; end: number; word: string };
export type Grade11Caption = {
  id: string;
  start: number;
  end: number;
  en: string;
  my?: string;
  words: Grade11CaptionWord[];
};
export type Grade11Transcript = {
  source: string;
  method: string;
  audioSha256: string;
  cues: Grade11Caption[];
};
export const GRADE11_TRANSCRIPTS = data as Record<string, Grade11Transcript>;
const EMPTY: Grade11Caption[] = [];
export const getGrade11Captions = (unit: number) => GRADE11_TRANSCRIPTS[unit]?.cues ?? EMPTY;

/** End times matter: do not keep showing speech through music or silence. */
export function grade11CaptionAt(cues: Grade11Caption[], time: number) {
  const cueIndex = cues.findIndex((cue) => time >= cue.start && time < cue.end);
  const wordIndex =
    cueIndex < 0
      ? -1
      : cues[cueIndex].words.findIndex((word) => time >= word.start && time < word.end);
  return { cueIndex, wordIndex };
}
