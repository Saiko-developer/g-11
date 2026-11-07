import type { GrammarSection, UnitGrammar } from "@/data/grammar/types";
import { UNIT2_KEYS, UNIT2_SECTIONS } from "./grade11Unit2";

const blocks = UNIT2_SECTIONS.find((s) => s.code === "2C")!.blocks;
const block = (n: number) => blocks.find((b) => b.id === `2C-${n}`)!;
function section(
  id: string,
  titleEn: string,
  titleMy: string,
  rules: number[],
  examples: number[],
  question: number,
): GrammarSection {
  const answer = UNIT2_KEYS[`2C-${question}`];
  return {
    id: `grade11-unit2-${id}`,
    titleEn,
    titleMy,
    text: {
      whatMy: rules.slice(0, 1).map((n) => block(n).my),
      whyMy: rules.slice(1, 2).map((n) => block(n).my),
      goldenRulesMy: rules.map((n) => block(n).my),
      formulas: examples.map((n) => ({
        labelMy: titleMy,
        formula: titleEn,
        exampleEn: block(n).x.replace(/^e\.g\. /, ""),
        exampleMy: block(n).my,
        parts: [{ chunk: block(n).x.replace(/^e\.g\. /, ""), role: titleEn, glossMy: block(n).my }],
      })),
      transformation: {
        beforeEn: [block(question).x],
        afterEn: answer.answer,
        stepsMy: [answer.answerMy!],
      },
      mistakes: [],
    },
    oral: {
      scriptMy: [...rules, ...examples].map((n) => block(n).my).join("\n\n"),
      note: {
        ideaMy: block(rules[0]).my,
        formula: titleEn,
        examples: examples.map((n) => ({ en: block(n).x, my: block(n).my })),
      },
    },
    quiz: {
      promptMy: block(question).my,
      questionEn: block(question).x,
      answerEn: answer.answer,
      hintMy: block(rules[0]).my,
    },
  };
}
export const UNIT2_GRAMMAR: UnitGrammar = {
  unit: 2,
  topicEn: "Present tenses; Must and Have to",
  topicMy: "ပစ္စုပ္ပန်ကာလများနှင့် မဖြစ်မနေ လုပ်ဆောင်ရခြင်း",
  sections: [
    section(
      "present-simple",
      "Present Simple",
      "ရိုးရိုးပစ္စုပ္ပန်ကာလ",
      [1, 5, 9, 13],
      [2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15],
      68,
    ),
    section(
      "present-continuous",
      "Present Continuous",
      "ပစ္စုပ္ပန်ဖြစ်ဆဲကာလ",
      [17, 21, 25],
      [18, 19, 20, 22, 23, 24, 26, 27],
      69,
    ),
    section(
      "present-perfect",
      "Present Perfect Simple",
      "ပစ္စုပ္ပန်ပြီးစီးကာလ",
      [29, 33, 37, 62, 64],
      [30, 31, 32, 34, 35, 36, 38, 39, 40, 63],
      71,
    ),
    section(
      "present-perfect-continuous",
      "Present Perfect Continuous",
      "ပစ္စုပ္ပန်ပြီးစီးဖြစ်ဆဲကာလ",
      [42, 45, 61, 62, 66],
      [43, 44, 46, 47, 65],
      70,
    ),
    section(
      "must-have-to",
      "Must and Have to",
      "မဖြစ်မနေ လုပ်ဆောင်ရခြင်း",
      [49, 50, 51, 52],
      [53, 54, 55, 56, 57, 58, 59, 60],
      85,
    ),
  ],
};
