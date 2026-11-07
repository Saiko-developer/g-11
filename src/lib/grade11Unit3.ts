import unit from "@/data/grade11/textbook/unit3.json";
import answers from "@/data/grade11/textbook/unit3-answer.json";
import { grade11AnswerKeys } from "@/lib/grade11Answers";
import type { Unit1Section } from "@/lib/grade11Unit1";

export const UNIT3_SECTIONS = unit as Unit1Section[];
export const UNIT3_KEYS = grade11AnswerKeys(answers);

export function unit3ScanUrl(page: number) {
  return [29, 32, 35].includes(page) ? `/grade11/unit3/page-${page}.jpg` : null;
}
