import unit7 from "@/data/grade11/textbook/unit7.json";
import unit8 from "@/data/grade11/textbook/unit8.json";
import unit9 from "@/data/grade11/textbook/unit9.json";
import unit10 from "@/data/grade11/textbook/unit10.json";
import unit11 from "@/data/grade11/textbook/unit11.json";
import unit12 from "@/data/grade11/textbook/unit12.json";
import keys7 from "@/data/grade11/textbook/unit7-answer.json";
import keys8 from "@/data/grade11/textbook/unit8-answer.json";
import keys9 from "@/data/grade11/textbook/unit9-answer.json";
import keys10 from "@/data/grade11/textbook/unit10-answer.json";
import keys11 from "@/data/grade11/textbook/unit11-answer.json";
import keys12 from "@/data/grade11/textbook/unit12-answer.json";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import type { G11Unit } from "@/data/grade11/part1";

export type UpperUnitNumber = 7 | 8 | 9 | 10 | 11 | 12;
export type UpperSource = {
  page: number;
  top: number;
  bottom: number;
  url: string;
  originalUrl: string;
};
export type UpperItem = {
  id: string;
  prompt: string;
  promptMy?: string;
  multiline?: boolean;
  choices?: string[];
  multiple?: boolean;
  wordTarget?: [number, number] | null;
};
export type UpperGroup = {
  id: string;
  instruction: string;
  instructionMy: string;
  pages: number[];
  items: UpperItem[];
  multiline?: boolean;
  structure?: boolean;
  table?: boolean;
  audio?: boolean;
  sourceRequired?: boolean;
};
export type UpperUnit = {
  number: UpperUnitNumber;
  title: string;
  mmTitle: string;
  sourceFiles: string[];
  skills: Record<G11SkillKind, { sources: UpperSource[]; groups: UpperGroup[] }>;
};
export type UpperAnswer = {
  answer: string;
  answerMy: string | null;
  origin: string;
  sourcePages: number[];
};
export const UPPER_UNITS = {
  7: unit7,
  8: unit8,
  9: unit9,
  10: unit10,
  11: unit11,
  12: unit12,
} as Record<UpperUnitNumber, UpperUnit>;
export const UPPER_KEYS = {
  7: keys7.items,
  8: keys8.items,
  9: keys9.items,
  10: keys10.items,
  11: keys11.items,
  12: keys12.items,
} as Record<UpperUnitNumber, Record<string, UpperAnswer>>;
export function isUpperUnit(unit: number): unit is UpperUnitNumber {
  return Number.isInteger(unit) && unit >= 7 && unit <= 12;
}
export const UPPER_PAGES: Record<string, G11Unit> = Object.fromEntries(
  Object.values(UPPER_UNITS).map((unit) => [
    `unit-${unit.number}`,
    {
      id: `unit-${unit.number}`,
      kind: "unit",
      no: `Unit ${unit.number}`,
      title: unit.title,
      mmTitle: unit.mmTitle,
      ready: true,
      sections: [],
    },
  ]),
);
