/**
 * Unit 2 (Literature) curriculum data service.
 *
 * Mirrors `src/lib/curriculum.ts` exactly, but for Unit 2 only. Completely
 * separate from the Unit 1 service so Unit 1 stays untouched.
 */
import localUnit2 from "@/data/textbookUnit2.json";
import {
  grammar2C,
  tense2C,
  partA2A_translations,
  partB2A_translations,
  partC2A_translations,
  partA2B_translations,
  partB2B_translations,
  partA2C_translations,
  partB2C_translations,
  partC2C_translations,
  vocab2B,
  type VocabItem,
} from "@/data/unit2Supplement";

export type Unit2Supplement = {
  partA2A_translations: Record<number, string>;
  partB2A_translations: Record<number, string>;
  partC2A_translations: Record<number, string>;
  partA2B_translations: Record<number, string>;
  partB2B_translations: Record<number, string>;
  partA2C_translations: Record<number, string>;
  partB2C_translations: Record<number, string>;
  partC2C_translations: Record<number, string>;
  grammar2C: typeof grammar2C;
  tense2C: typeof tense2C;
  vocab2B: VocabItem[];
};

export type Unit2Curriculum = {
  unit: {
    unit: string;
    unitTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lessons: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
  };
  supplement: Unit2Supplement;
  source: "local";
};

const UNIT2_SUPPLEMENT: Unit2Supplement = {
  partA2A_translations,
  partB2A_translations,
  partC2A_translations,
  partA2B_translations,
  partB2B_translations,
  partA2C_translations,
  partB2C_translations,
  partC2C_translations,
  grammar2C,
  tense2C,
  vocab2B,
};

export const LOCAL_CURRICULUM_UNIT2: Unit2Curriculum = {
  unit: localUnit2 as unknown as Unit2Curriculum["unit"],
  supplement: UNIT2_SUPPLEMENT,
  source: "local",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const UNIT2 = localUnit2 as any;

/** Section records from the Unit 2 textbook JSON. */
export const SECTION_2A = UNIT2.sections[0];
export const SECTION_2B = UNIT2.sections[1];
export const SECTION_2C = UNIT2.sections[2];

export const UNIT2_TITLE: string = UNIT2.unitTitle;

/** Look up a Unit 2 lesson/section record such as "2D" or "2E". */
export function getUnit2Lesson(code: string) {
  const all = [...(UNIT2.lessons ?? []), ...(UNIT2.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}
