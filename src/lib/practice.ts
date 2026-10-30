/**
 * Practice-lesson types and helpers.
 * All lesson content is rendered from the local data in `src/data`
 * (see `src/lib/localData.ts` and `src/components/lesson/UnitSkillView.tsx`).
 */

export type PracticeSkill =
  | "reading"
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "writing";

/** Speaking shares the Listening & Speaking lesson content. */
export function normalizeSkill(skill: string): PracticeSkill | null {
  const s = skill.toLowerCase();
  if (
    s === "speaking" ||
    s === "reading" ||
    s === "vocabulary" ||
    s === "grammar" ||
    s === "listening" ||
    s === "writing"
  ) {
    return s;
  }
  return null;
}

export type PracticeQuestion = {
  id: number;
  number: number;
  question: string;
  suggestedAnswer: string | null;
  answer: string | null;
};

export type PassageParagraph = { english: string; burmese: string | null };

export type VocabEntry = {
  word: string;
  pronunciation: string | null;
  meaningMy: string | null;
  exampleEn: string | null;
};

export type GrammarNote = {
  whatMy?: string;
  whyMy?: string;
  whenMy?: string;
  examples?: { en: string; my?: string }[];
};
