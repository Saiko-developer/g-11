/**
 * Unit 3 (Zero) curriculum data service.
 *
 * Mirrors `src/lib/curriculumUnit2.ts`, but for Unit 3 only. Reads exclusively
 * from `src/data/textbookUnit3.json` + `src/data/unit3Supplement.ts`.
 */
import localUnit3 from "@/data/textbookUnit3.json";
import {
  grammar3C,
  conjunction3C,
  partA3A_translations,
  partB3A_translations,
  partA3B_translations,
  partB3B_translations,
  partA3C_translations,
  partB3C_translations,
  vocab3B,
  type VocabItem,
} from "@/data/unit3Supplement";

export type Unit3Supplement = {
  partA3A_translations: Record<number, string>;
  partB3A_translations: Record<number, string>;
  partA3B_translations: Record<number, string>;
  partB3B_translations: Record<number, string>;
  partA3C_translations: Record<number, string>;
  partB3C_translations: Record<number, string>;
  grammar3C: typeof grammar3C;
  conjunction3C: typeof conjunction3C;
  vocab3B: VocabItem[];
};

export type Unit3Curriculum = {
  unit: {
    unit: string;
    unitTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lessons: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
  };
  supplement: Unit3Supplement;
  source: "local";
};

const UNIT3_SUPPLEMENT: Unit3Supplement = {
  partA3A_translations,
  partB3A_translations,
  partA3B_translations,
  partB3B_translations,
  partA3C_translations,
  partB3C_translations,
  grammar3C,
  conjunction3C,
  vocab3B,
};

export const LOCAL_CURRICULUM_UNIT3: Unit3Curriculum = {
  unit: localUnit3 as unknown as Unit3Curriculum["unit"],
  supplement: UNIT3_SUPPLEMENT,
  source: "local",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const UNIT3 = localUnit3 as any;

/** Section records from the Unit 3 textbook JSON. */
export const SECTION_3A = UNIT3.sections[0];
export const SECTION_3B = UNIT3.sections[1];
export const SECTION_3C = UNIT3.sections[2];

export const UNIT3_TITLE: string = UNIT3.unitTitle;

/** Look up a Unit 3 lesson/section record such as "3D" or "3E". */
export function getUnit3Lesson(code: string) {
  const all = [...(UNIT3.lessons ?? []), ...(UNIT3.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

/** Look up a Unit 3 section record by its lesson label, e.g. "3A". */
export function getUnit3Section(code: string) {
  return (
    (UNIT3.sections ?? []).find((s: any) =>
      String(s?.lesson ?? "").toUpperCase().startsWith(code.toUpperCase()),
    ) ?? null
  );
}
