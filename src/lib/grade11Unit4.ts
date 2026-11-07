import unit from "@/data/grade11/textbook/unit4.json";
import answers from "@/data/grade11/textbook/unit4-answer.json";
import { grade11AnswerKeys } from "@/lib/grade11Answers";
import type { Unit1Section } from "@/lib/grade11Unit1";
export const UNIT4_SECTIONS = unit as Unit1Section[];
export const UNIT4_KEYS = grade11AnswerKeys(answers);
export function unit4ScanUrl(page: number) {
  return [42, 47].includes(page) ? `/grade11/unit4/page-${page}.jpg` : null;
}
