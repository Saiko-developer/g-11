/**
 * Unit 5 (Trains) curriculum data service.
 *
 * Mirrors `src/lib/curriculumUnit3.ts`, but for Unit 5 only. Reads exclusively
 * from `src/data/textbookUnit5.json` + `src/data/unit5Supplement.ts`.
 */
import localUnit5 from "@/data/textbookUnit5.json";
import {
  grammar5C,
  tense5C,
  partA5A_translations,
  partB5A_translations,
  partC5A_translations,
  partA5B_translations,
  partB5B_translations,
  partA5C_translations,
  partB5C_translations,
  vocab5B,
  partA5A_breakdowns,
  partB5A_breakdowns,
  partC5A_breakdowns,
  type VocabItem,
  type SentenceBreakdown,
} from "@/data/unit5Supplement";

export type Unit5Supplement = {
  partA5A_translations: Record<number, string>;
  partB5A_translations: Record<number, string>;
  partC5A_translations: Record<number, string>;
  partA5B_translations: Record<number, string>;
  partB5B_translations: Record<number, string>;
  partA5C_translations: Record<number, string>;
  partB5C_translations: Record<number, string>;
  grammar5C: typeof grammar5C;
  tense5C: typeof tense5C;
  vocab5B: VocabItem[];
  partA5A_breakdowns: Record<number, SentenceBreakdown>;
  partB5A_breakdowns: Record<number, SentenceBreakdown>;
  partC5A_breakdowns: Record<number, SentenceBreakdown>;
};

export type Unit5Curriculum = {
  unit: {
    unit: string;
    unitTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lessons: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
  };
  supplement: Unit5Supplement;
  source: "local";
};

const UNIT5_SUPPLEMENT: Unit5Supplement = {
  partA5A_translations,
  partB5A_translations,
  partC5A_translations,
  partA5B_translations,
  partB5B_translations,
  partA5C_translations,
  partB5C_translations,
  grammar5C,
  tense5C,
  vocab5B,
  partA5A_breakdowns,
  partB5A_breakdowns,
  partC5A_breakdowns,
};

export const LOCAL_CURRICULUM_UNIT5: Unit5Curriculum = {
  unit: localUnit5 as unknown as Unit5Curriculum["unit"],
  supplement: UNIT5_SUPPLEMENT,
  source: "local",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const UNIT5 = localUnit5 as any;

/** Section records from the Unit 5 textbook JSON. */
export const SECTION_5A = UNIT5.sections[0];
export const SECTION_5B = UNIT5.sections[1];
export const SECTION_5C = UNIT5.sections[2];

export const UNIT5_TITLE: string = UNIT5.unitTitle;

/** Look up a Unit 5 lesson/section record such as "5D" or "5E". */
export function getUnit5Lesson(code: string) {
  const all = [...(UNIT5.lessons ?? []), ...(UNIT5.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

/** Look up a Unit 5 section record by its lesson label, e.g. "5A". */
export function getUnit5Section(code: string) {
  return (
    (UNIT5.sections ?? []).find((s: any) =>
      String(s?.lesson ?? "").toUpperCase().startsWith(code.toUpperCase()),
    ) ?? null
  );
}
