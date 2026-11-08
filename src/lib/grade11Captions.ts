import burmese from "@/data/grade11/listeningTranslations.my.json";
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
const translations = burmese.translations as Record<string, string>;
export const GRADE11_TRANSCRIPTS: Record<string, Grade11Transcript> = Object.fromEntries(
  Object.entries(data as Record<string, Grade11Transcript>).map(([unit, transcript]) => [
    unit,
    {
      ...transcript,
      cues: transcript.cues.map((cue) => ({ ...cue, my: translations[cue.id] })),
    },
  ]),
);
const EMPTY: Grade11Caption[] = [];
export const getGrade11Captions = (unit: number) => GRADE11_TRANSCRIPTS[unit]?.cues ?? EMPTY;

/** Keep the last started cue visible until the next starts; highlight only words being spoken. */
export function grade11CaptionAt(cues: Grade11Caption[], time: number) {
  let cueIndex = -1;
  for (let index = cues.length - 1; index >= 0; index--) {
    if (time >= cues[index].start) {
      cueIndex = index;
      break;
    }
  }
  const wordIndex =
    cueIndex < 0
      ? -1
      : cues[cueIndex].words.findIndex((word) => time >= word.start && time < word.end);
  return { cueIndex, wordIndex };
}
