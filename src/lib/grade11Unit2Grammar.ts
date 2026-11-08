import type { GrammarSection, UnitGrammar } from "@/data/grammar/types";
import { UNIT2_KEYS, UNIT2_SECTIONS } from "./grade11Unit2";

const PLANS: Record<string, { formula: string; why: string; steps: string[]; rules: string[] }> = {
  "present-simple": {
    formula: "[Subject] + [V1 / V-s]",
    why: "နေ့စဉ်အလေ့အထ၊ အမြဲမှန်တဲ့အချက်နဲ့ အချိန်ဇယားတွေကို ပြောဖို့ သုံးပါတယ်။",
    steps: [
      "တစ်နေ့ကို ဘယ်နှကြိမ်ဆိုတဲ့ အလေ့အထမေးခွန်း ဖြစ်ပါတယ်။",
      "မေးခွန်းဖြစ်လို့ ကူညီကြိယာကို ကတ္တားရှေ့မှာ ထားပြီး အဓိကကြိယာကို အခြေခံပုံစံ သုံးပါ။",
    ],
    rules: [
      "ကတ္တား အနည်းကိန်း တတိယပုဂ္ဂိုလ်ဆိုရင် အတည်ပြုဝါကျရဲ့ ကြိယာနောက်မှာ -s သို့မဟုတ် -es ထည့်ပါ။",
      "မေးခွန်းနဲ့ အငြင်းဝါကျမှာ ကူညီကြိယာ သုံးပြီး အဓိကကြိယာကို အခြေခံပုံစံ ထားပါ။",
    ],
  },
  "present-continuous": {
    formula: "[Subject] + am / is / are + [V-ing]",
    why: "အခု လုပ်နေဆဲအရာ၊ ယာယီအခြေအနေနဲ့ စီစဉ်ပြီးသား အနာဂတ်အကြောင်း ပြောဖို့ သုံးပါတယ်။",
    steps: [
      "အခုလောလောဆယ်ဆိုတဲ့ အချိန်ပြစကားကို သတိပြုပါ။",
      "မေးခွန်းမှာ သင့်တော်တဲ့ ကူညီကြိယာကို ရှေ့တင်ပြီး အဓိကကြိယာကို -ing ပြောင်းပါ။",
    ],
    rules: [
      "ကတ္တားနဲ့ ကိုက်ညီတဲ့ ပစ္စုပ္ပန်ကူညီကြိယာ လိုပါတယ်။",
      "ဖြစ်ဆဲလုပ်ဆောင်မှုကို -ing ပုံစံနဲ့ ပြပါ။",
      "အနှောင့်အယှက်ဖြစ်စေတဲ့ ထပ်တလဲလဲအပြုအမူကို ပြောတဲ့ အသုံးကိုလည်း စာအုပ်မှာ တွေ့နိုင်ပါတယ်။",
    ],
  },
  "present-perfect": {
    formula: "[Subject] + have / has + [V3]",
    why: "အတိတ်က ဖြစ်ခဲ့ပေမယ့် အခုနဲ့ ဆက်စပ်နေတဲ့ ရလဒ်နဲ့ အတွေ့အကြုံတွေကို ဖော်ပြဖို့ သုံးပါတယ်။",
    steps: [
      "အခုအချိန်အထိ ရရှိပြီးတဲ့ အတွေ့အကြုံအရေအတွက်ကို ပြထားပါတယ်။",
      "ကတ္တားနဲ့ ကိုက်ညီတဲ့ ကူညီကြိယာရွေးပြီး အဓိကကြိယာကို တတိယပုံစံ သုံးပါ။",
    ],
    rules: [
      "ပြီးစီးမှု၊ အခုအထိ အတွေ့အကြုံနဲ့ အခုထိ ဆက်စပ်တဲ့ အချိန်ကာလကို သတိပြုပါ။",
      "ကြိယာရဲ့ တတိယပုံစံကို သုံးပါ။",
      "အချိန်အစကို ပြသလား၊ ကြာချိန်ကို ပြသလား ခွဲခြားပါ။",
    ],
  },
  "present-perfect-continuous": {
    formula: "[Subject] + have / has + been + [V-ing]",
    why: "အတိတ်ကစပြီး ဆက်လုပ်လာတဲ့ လုပ်ဆောင်မှုရဲ့ ကြာချိန်နဲ့ အခုမြင်ရတဲ့ အကျိုးဆက်ကို အလေးပေးဖို့ သုံးပါတယ်။",
    steps: [
      "တစ်နေ့လုံး လုပ်နေခဲ့တာကြောင့် အခု ပင်ပန်းနေတဲ့ အကျိုးဆက် ရှိပါတယ်။",
      "ကူညီကြိယာနှစ်ဆင့်နဲ့ -ing ကြိယာကို အစီအစဉ်မှန်အောင် ဆက်ပါ။",
    ],
    rules: [
      "ပြီးသွားတဲ့ အရေအတွက်ထက် လုပ်ဆောင်လာတဲ့ ကြာချိန်ကို အလေးပေးပါတယ်။",
      "ကူညီကြိယာနောက်မှာ been ကို မမေ့ပါနှင့်။",
      "လက်ရှိမြင်ရတဲ့ အကျိုးဆက်နဲ့ ရှေ့က လုပ်ဆောင်မှုကို ဆက်စဉ်းစားပါ။",
    ],
  },
  "must-have-to": {
    formula: "[Subject] + must / have to + [V1]",
    why: "ကိုယ့်ရဲ့ ခိုင်မာတဲ့လိုအပ်ချက်နဲ့ အပြင်ဘက်စည်းကမ်းကြောင့် မဖြစ်မနေ လုပ်ရတာကို ခွဲပြောဖို့ သုံးပါတယ်။",
    steps: [
      "အောင်မြင်ဖို့ ကြိုးစားရမယ်ဆိုတဲ့ ခိုင်မာတဲ့ လိုအပ်ချက်ကို စဉ်းစားပါ။",
      "နောက်ကကြိယာကို အခြေခံပုံစံအတိုင်း ထားပါ။",
    ],
    rules: [
      "မလုပ်ရဘူးဆိုတဲ့ တားမြစ်မှုနဲ့ မလုပ်လည်းရတယ်ဆိုတဲ့ မလိုအပ်မှု မတူပါဘူး။",
      "အတိတ်က မဖြစ်မနေ လုပ်ခဲ့ရတာကို ပြောရင် အတိတ်ပုံစံ လိုပါတယ်။",
      "ကာလနဲ့ ကတ္တားအလိုက် ပြောင်းရတဲ့ ပုံစံတွေကို သတိပြုပါ။",
    ],
  },
};

function exampleFormula(id: string, text: string, fallback: string) {
  const question = text.includes("?");
  const negative = /\bnot\b|n't/i.test(text);
  if (id === "present-simple")
    return question
      ? "Do / Does + [Subject] + [V1] … ?"
      : negative
        ? "[Subject] + do / does + not + [V1]"
        : fallback;
  if (id === "present-continuous")
    return question
      ? "Am / Is / Are + [Subject] + [V-ing] … ?"
      : negative
        ? "[Subject] + am / is / are + not + [V-ing]"
        : fallback;
  if (id === "present-perfect")
    return question
      ? "Have / Has + [Subject] + [V3] … ?"
      : negative
        ? "[Subject] + have / has + not + [V3]"
        : fallback;
  if (id === "present-perfect-continuous")
    return question
      ? "Have / Has + [Subject] + been + [V-ing] … ?"
      : negative
        ? "[Subject] + have / has + not + been + [V-ing]"
        : fallback;
  if (id === "must-have-to" && /must not|mustn't/i.test(text)) return "[Subject] + must not + [V1]";
  if (id === "must-have-to" && negative) return "[Subject] + do / does + not + have to + [V1]";
  return fallback;
}

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
  const plan = PLANS[id];
  const completed = block(question)
    .x.replace(/^\d+\.\s*/, "")
    .replace(/_{2,}\s*\([^)]*\)/, answer.answer.split(";")[0])
    .replace(/_{2,}/, answer.answer.split(";")[0]);
  return {
    id: `grade11-unit2-${id}`,
    titleEn,
    titleMy,
    text: {
      whatMy: rules.slice(0, 1).map((n) => block(n).my),
      whyMy: [plan.why],
      goldenRulesMy: [...plan.rules, ...rules.map((n) => block(n).my)],
      formulas: examples.map((n) => ({
        labelMy: titleMy,
        formula: exampleFormula(id, block(n).x, plan.formula),
        exampleEn: block(n).x.replace(/^e\.g\. /, ""),
        exampleMy: block(n).my,
        parts: [{ chunk: block(n).x.replace(/^e\.g\. /, ""), role: titleEn, glossMy: block(n).my }],
      })),
      transformation: {
        beforeEn: [block(question).x],
        afterEn: completed,
        stepsMy: plan.steps,
      },
      mistakes: [],
    },
    oral: {
      scriptMy: [
        plan.why,
        ...plan.rules,
        ...rules.map((n) => block(n).my),
        ...examples.map((n) => block(n).my),
        ...plan.steps,
      ].join("\n\n"),
      note: {
        ideaMy: block(rules[0]).my,
        formula: plan.formula,
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
