import unit5 from "@/data/grade11/textbook/unit5.json";
import unit6 from "@/data/grade11/textbook/unit6.json";
import answers5 from "@/data/grade11/textbook/unit5-answer.json";
import answers6 from "@/data/grade11/textbook/unit6-answer.json";
import { grade11AnswerKeys } from "@/lib/grade11Answers";
import type { Unit1Section } from "@/lib/grade11Unit1";
import type { G11Unit } from "@/data/grade11/part1";

export const TRAVEL_LESSONS = {
  5: { sections: unit5 as Unit1Section[], keys: grade11AnswerKeys(answers5) },
  6: { sections: unit6 as Unit1Section[], keys: grade11AnswerKeys(answers6) },
};
export const TRAVEL_PAGES: Record<string, G11Unit> = {
  "unit-5": {
    id: "unit-5",
    kind: "unit",
    no: "Unit 5",
    title: "Travel in Southeast Asia I",
    mmTitle: "အရှေ့တောင်အာရှခရီးသွားခြင်း (၁)",
    ready: true,
    sections: [],
  },
  "unit-6": {
    id: "unit-6",
    kind: "unit",
    no: "Unit 6",
    title: "Travel in Southeast Asia II",
    mmTitle: "အရှေ့တောင်အာရှခရီးသွားခြင်း (၂)",
    ready: true,
    sections: [],
  },
};
export function travelScanUrl(unit: 5 | 6, page: number) {
  return unit === 5 && page === 51 ? `/grade11/unit5/page-${page}.jpg` : null;
}
