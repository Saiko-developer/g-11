/**
 * Authentic local curriculum data (src/data/**) used by the homepage unit
 * exercises. No mock content: everything here comes from the real Grade 10
 * textbook JSON, the Burmese supplement, the syllabus, and the bundled MP3
 * listening tracks.
 */
import unit1 from "@/data/textbookUnit1.json";
import { SYLLABUS, type SyllabusUnit } from "@/data/syllabus";

export type LocalLesson = {
  id: string;
  code: string;
  type: string;
  title: string;
  titleMy: string;
  intro: string;
  introMy: string;
  questions: { id: number; question: string; suggested_answer: string }[];
  bonusQuestions?: { id: number; question: string; suggested_answer: string }[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const UNIT1 = unit1 as any;

/**
 * Bundled listening / speaking tracks, keyed by unit number.
 * Real MP3 files live in public/audio so they travel with the repo on push/remix.
 */
export const UNIT_AUDIO: Record<number, string> = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, `/audio/unit${i + 1}.mp3`]),
);

export function getUnitAudio(unitNumber: number): string | null {
  return UNIT_AUDIO[unitNumber] ?? null;
}

/** Section 1A / 1B / 1C raw records from the textbook JSON. */
export const SECTION_1A = UNIT1.sections[0];
export const SECTION_1B = UNIT1.sections[1];
export const SECTION_1C = UNIT1.sections[2];

export function getLocalLesson(code: string): LocalLesson | null {
  const all = [...(UNIT1.lessons ?? []), ...(UNIT1.sections ?? [])];
  return (all.find((l: any) => l?.code === code) as LocalLesson) ?? null;
}

export function getSyllabusUnit(unitNumber: number): SyllabusUnit | null {
  return (
    (SYLLABUS.find(
      (n) => n.type === "unit" && n.number === unitNumber,
    ) as SyllabusUnit | undefined) ?? null
  );
}

export const UNIT1_TITLE: string = UNIT1.unitTitle;
