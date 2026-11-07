import type { GrammarSection, UnitGrammar } from "@/data/grammar/types";
import { UNIT1_KEYS, UNIT1_SECTIONS } from "./grade11Unit1";

const blocks = UNIT1_SECTIONS.find((s) => s.code === "1C")!.blocks;
const block = (n: number) => blocks.find((b) => b.id === `1C-${n}`)!;

/** Adapt only the PDF's rules/examples to the existing Grade 10 explanation UI. */
function section(
  id: string,
  titleEn: string,
  titleMy: string,
  rules: number[],
  examples: number[],
  question: number,
  formula: string,
): GrammarSection {
  const answer = UNIT1_KEYS[`1C-${question}`];
  return {
    id: `grade11-unit1-${id}`,
    titleEn,
    titleMy,
    text: {
      whatMy: rules.slice(0, 1).map((n) => block(n).my),
      whyMy: rules.slice(1, 2).map((n) => block(n).my),
      goldenRulesMy: rules.slice(2).map((n) => block(n).my),
      formulas: examples.map((n) => ({
        labelMy: titleMy,
        formula,
        exampleEn: block(n).x.replace(/^e\.g\. /, ""),
        exampleMy: block(n).my,
        parts: [{ chunk: block(n).x.replace(/^e\.g\. /, ""), role: titleEn, glossMy: block(n).my }],
      })),
      transformation: {
        beforeEn: [block(question).x],
        afterEn: answer.answer,
        stepsMy: [block(question).my, answer.answerMy],
      },
      mistakes:
        id === "both-and"
          ? [
              {
                wrongEn: block(11).x.replace(/^\(Not\) /, ""),
                rightEn: block(10).x.replace(/^e\.g\. /, ""),
                whyMy: block(9).my,
              },
            ]
          : [],
    },
    oral: {
      scriptMy: [...rules, ...examples].map((n) => block(n).my).join("\n\n"),
      note: {
        ideaMy: block(rules[0]).my,
        formula,
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

export const UNIT1_GRAMMAR: UnitGrammar = {
  unit: 1,
  topicEn: "Both ... and; Before and After",
  topicMy: "နှစ်ခုစလုံးကို ဆက်စပ်ခြင်း၊ မတိုင်မီနှင့် ပြီးနောက်",
  sections: [
    section(
      "both-and",
      "Both ... and",
      "နှစ်ခုစလုံး",
      [1, 2, 7, 9],
      [3, 4, 5, 6, 8, 10],
      15,
      "both ... and",
    ),
    section("before", "Before", "မတိုင်မီ", [27, 31], [28, 29, 30, 32, 33], 65, "before + V-ing"),
    section("after", "After", "ပြီးနောက်", [35, 39], [36, 37, 38, 40, 41], 54, "after + V-ing"),
  ],
};
