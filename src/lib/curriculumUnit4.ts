/**
 * Unit 4 (Painting) curriculum data service.
 *
 * Mirrors `src/lib/curriculumUnit3.ts`, but for Unit 4 only. Reads exclusively
 * from `src/data/textbookUnit4.json` + `src/data/unit4Supplement.ts`.
 */
import localUnit4 from "@/data/textbookUnit4.json";
import {
  grammar4C,
  tense4C,
  partA4A_translations,
  partB4A_translations,
  partC4A_translations,
  partA4A_breakdowns,
  partB4A_breakdowns,
  partA4B_translations,
  partB4B_translations,
  partC4B_translations,
  partD4B_translations,
  partA4C_translations,
  partB4C_translations,
  partC4C_translations,
  vocab4B,
  type VocabItem,
} from "@/data/unit4Supplement";

export type Unit4Supplement = {
  partA4A_translations: Record<number, string>;
  partB4A_translations: Record<number, string>;
  partC4A_translations: Record<number, string>;
  partA4A_breakdowns: Record<number, import("@/data/unit4Supplement").SentenceBreakdown>;
  partB4A_breakdowns: Record<number, import("@/data/unit4Supplement").SentenceBreakdown>;
  partA4B_translations: Record<number, string>;
  partB4B_translations: Record<number, string>;
  partC4B_translations: Record<number, string>;
  partD4B_translations: Record<number, string>;
  partA4C_translations: Record<number, string>;
  partB4C_translations: Record<number, string>;
  partC4C_translations: Record<number, string>;
  grammar4C: typeof grammar4C;
  tense4C: typeof tense4C;
  vocab4B: VocabItem[];
};

export type Unit4Curriculum = {
  unit: {
    unit: string;
    unitTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lessons: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
  };
  supplement: Unit4Supplement;
  source: "local";
};

const UNIT4_SUPPLEMENT: Unit4Supplement = {
  partA4A_translations,
  partB4A_translations,
  partC4A_translations,
  partA4A_breakdowns,
  partB4A_breakdowns,
  partA4B_translations,
  partB4B_translations,
  partC4B_translations,
  partD4B_translations,
  partA4C_translations,
  partB4C_translations,
  partC4C_translations,
  grammar4C,
  tense4C,
  vocab4B,
};

export const LOCAL_CURRICULUM_UNIT4: Unit4Curriculum = {
  unit: localUnit4 as unknown as Unit4Curriculum["unit"],
  supplement: UNIT4_SUPPLEMENT,
  source: "local",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const UNIT4 = localUnit4 as any;

/** Section records from the Unit 4 textbook JSON. */
export const SECTION_4A = UNIT4.sections[0];
export const SECTION_4B = UNIT4.sections[1];
export const SECTION_4C = UNIT4.sections[2];

export const UNIT4_TITLE: string = UNIT4.unitTitle;

/** Look up a Unit 4 lesson/section record such as "4D" or "4E". */
export function getUnit4Lesson(code: string) {
  const all = [...(UNIT4.lessons ?? []), ...(UNIT4.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

/** Look up a Unit 4 section record by its lesson label, e.g. "4A". */
export function getUnit4Section(code: string) {
  return (
    (UNIT4.sections ?? []).find((s: any) =>
      String(s?.lesson ?? "").toUpperCase().startsWith(code.toUpperCase()),
    ) ?? null
  );
}
