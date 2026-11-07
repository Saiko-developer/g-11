import unit from "@/data/grade11/textbook/unit2.json";
import keys from "@/data/grade11/textbook/unit2-keys.json";
import type { Unit1Section } from "@/lib/grade11Unit1";
export const UNIT2_SECTIONS = unit as Unit1Section[];
export const UNIT2_KEYS = keys as Record<
  string,
  { answer: string; answerMy: string; origin: "source-derived"; sourcePage: number }
>;
export function unit2ScanUrl(page: number) {
  return [25].includes(page) ? `/grade11/unit2/page-${page}.jpg` : null;
}
