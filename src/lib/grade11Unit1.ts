import unit from "@/data/grade11/textbook/unit1.json";
import keys from "@/data/grade11/textbook/unit1-keys.json";

export type Unit1Block = {
  id: string;
  t: "sub" | "h" | "para" | "ins" | "q" | "line" | "scan";
  x: string;
  my: string;
  area: "lesson" | "exercise";
  sourcePage: number;
  scanPage?: number;
  emphasis?: string[];
  response?: "personal" | "audio";
};

export type Unit1Section = { code: string; title: string; blocks: Unit1Block[] };
export type Unit1Exercise = { instruction: Unit1Block; blocks: Unit1Block[] };

export const UNIT1_SECTIONS = unit as Unit1Section[];
export const UNIT1_KEYS = keys as Record<string, { answer: string; origin: "source-derived" }>;

/** Explicit source areas keep grammar explanations out of the question list. */
export function splitUnit1(section: Unit1Section) {
  const lesson: Unit1Block[] = [];
  const exercises: Unit1Exercise[] = [];
  for (const block of section.blocks) {
    if (block.area === "lesson") lesson.push(block);
    else if (block.t === "ins") exercises.push({ instruction: block, blocks: [] });
    else exercises.at(-1)?.blocks.push(block);
  }
  return { lesson, exercises };
}

export function unit1ScanUrl(page: number) {
  return page === 13 || page === 15 ? `/grade11/unit1/page-${page}.jpg` : null;
}
