import unit from "@/data/grade11/textbook/unit3.json";
import keys from "@/data/grade11/textbook/unit3-keys.json";
import type { Unit1Section } from "@/lib/grade11Unit1";

export const UNIT3_SECTIONS = unit as Unit1Section[];
export const UNIT3_KEYS = keys as Record<
  string,
  { answer: string; origin: "source-derived"; sourcePage: number }
>;

export function unit3ScanUrl(page: number) {
  return [29, 32, 35].includes(page) ? `/grade11/unit3/page-${page}.jpg` : null;
}
