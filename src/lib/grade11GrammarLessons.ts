import type { GrammarSection, UnitGrammar } from "@/data/grammar/types";
import { TRAVEL_LESSONS } from "./grade11Travel";
import { UNIT3_SECTIONS, UNIT3_KEYS } from "./grade11Unit3";
import { UNIT4_SECTIONS, UNIT4_KEYS } from "./grade11Unit4";
import type { Unit1Block } from "./grade11Unit1";

type Spec = {
  id: string;
  title: string;
  my: string;
  formula: string;
  idea: string;
  why: string;
  rules: string[];
  examples: number[];
  question: number;
  steps: string[];
  before?: number;
  after?: number;
  parts?: [string, string, string][];
};
function grammar(unit: 3 | 4 | 5, specs: Spec[]): UnitGrammar {
  const blocks = (
    unit === 3 ? UNIT3_SECTIONS : unit === 4 ? UNIT4_SECTIONS : TRAVEL_LESSONS[5].sections
  ).find((s) => s.code === `${unit}C`)!.blocks;
  const keys = unit === 3 ? UNIT3_KEYS : unit === 4 ? UNIT4_KEYS : TRAVEL_LESSONS[5].keys;
  const block = (n: number) => blocks.find((b) => b.id === `${unit}C-${n}`)!;
  const en = (b: Unit1Block) => b.x.replace(/^e\.g\.\s*/, "");
  const sections: GrammarSection[] = specs.map((spec) => {
    const answer = keys[`${unit}C-${spec.question}`];
    const question = block(spec.question);
    const completed = question.x
      .replace(/^\d+\.\s*/, "")
      .replace(/_{2,}\s*\([^)]*\)/, answer.answer.split(";")[0]);
    const examples = spec.examples.map((n) => block(n));
    return {
      id: `grade11-unit${unit}-${spec.id}`,
      titleEn: spec.title,
      titleMy: spec.my,
      text: {
        whatMy: [spec.idea],
        whyMy: [spec.why],
        goldenRulesMy: spec.rules,
        mistakes: [],
        formulas: examples.map((b, i) => ({
          labelMy: spec.my,
          formula: spec.formula,
          exampleEn: en(b),
          exampleMy: b.my,
          parts:
            i === 0 && spec.parts
              ? spec.parts.map(([chunk, role, glossMy]) => ({ chunk, role, glossMy }))
              : [{ chunk: en(b), role: "[Example]", glossMy: b.my }],
        })),
        transformation: {
          beforeEn: [spec.before ? en(block(spec.before)) : question.x],
          afterEn: spec.after
            ? en(block(spec.after))
            : unit === 5
              ? answer.answer
              : completed.includes("_")
                ? answer.answer
                : completed,
          stepsMy: spec.steps,
        },
      },
      oral: {
        scriptMy: [
          spec.idea,
          spec.why,
          ...spec.rules,
          ...examples.map((b) => b.my),
          ...spec.steps,
        ].join("\n\n"),
        note: {
          ideaMy: spec.idea,
          formula: spec.formula,
          examples: examples.map((b) => ({ en: en(b), my: b.my })),
        },
      },
      quiz: {
        promptMy: question.my,
        questionEn: question.x,
        answerEn: answer.answer,
        hintMy: spec.rules[0],
      },
    };
  });
  return {
    unit,
    topicEn:
      unit === 5
        ? "Inversion and relative clauses"
        : unit === 3
          ? "Gerund and Infinitive with to"
          : "Too … to and Enough to",
    topicMy:
      unit === 5
        ? "ဝါကျအစီအစဉ်ပြောင်းခြင်းနှင့် ဆက်စပ်ဝါကျတိုပြုခြင်း"
        : unit === 3
          ? "ကြိယာမှ နာမ်ပြုခြင်းနှင့် ရည်ရွယ်ချက်ပြ ကြိယာပုံစံ"
          : "လွန်ကဲမှုနှင့် လုံလောက်မှု ပြဝါကျများ",
    sections,
  };
}
export const UNIT3_GRAMMAR = grammar(3, [
  {
    id: "gerund",
    title: "Gerund",
    my: "ကြိယာကို နာမ်အဖြစ် သုံးခြင်း",
    formula: "[V-ing] as Subject / Object / Complement / after a Preposition",
    idea: "လုပ်ရပ်တစ်ခုကို အရာတစ်ခုလို အမည်ပေးပြောချင်ရင် ကြိယာနောက်မှာ -ing ထည့်ပြီး နာမ်အဖြစ် သုံးနိုင်ပါတယ်။",
    why: "ဝါကျရဲ့ ကတ္တား၊ ကံ၊ အဖြည့်ပုဒ်နဲ့ ဝိဘတ်နောက်မှာ လုပ်ရပ်တစ်ခုကို ဖော်ပြဖို့ သုံးပါတယ်။",
    rules: [
      "ဝိဘတ်နောက်က ကြိယာကို နာမ်အဖြစ် သုံးရင် -ing ပုံစံ လိုပါတယ်။",
      "နှစ်သက်ခြင်း၊ ပြီးဆုံးခြင်း၊ ရှောင်ကြဉ်ခြင်းတို့ကို ပြတဲ့ စာအုပ်ပါကြိယာတွေနောက်မှာ -ing ပုံစံ သုံးလေ့ရှိပါတယ်။",
      "ဒီနေရာက -ing ဟာ ဖြစ်ဆဲကာလကို ပြတဲ့ ကြိယာ မဟုတ်ဘဲ နာမ်အလုပ်ကို လုပ်ပါတယ်။",
    ],
    examples: [4, 6, 8, 10],
    question: 30,
    steps: [
      "ဝါကျထဲက ရှေ့ကြိယာပုံစံကို အရင်ကြည့်ပါ။",
      "ဒီအသုံးအနှုန်းနောက်မှာ နာမ်ပုံစံ လိုအပ်တာကြောင့် ကွင်းထဲက ကြိယာကို -ing ပြောင်းပါ။",
      "ကာလပြကြိယာနဲ့ နာမ်အဖြစ်သုံးတဲ့ ကြိယာကို မရောထွေးပါနှင့်။",
    ],
    parts: [
      ["Smoking", "[Gerund / Subject]", "ဆေးလိပ်သောက်ခြင်း"],
      ["is not good", "[Verb + Complement]", "မကောင်းပါ"],
      ["for health.", "[Prepositional phrase]", "ကျန်းမာရေးအတွက်"],
    ],
  },
  {
    id: "infinitive",
    title: "Infinitive with to",
    my: "အခြေခံကြိယာရှေ့တွင် to ထည့်သုံးခြင်း",
    formula: "to + [V1]",
    idea: "အခြေခံကြိယာရှေ့မှာ to ထည့်တဲ့ ပုံစံကို ဝါကျကတ္တားအဖြစ်၊ ကြိယာရဲ့ ကံအဖြစ်၊ နာမဝိသေသနနောက်မှာ သုံးနိုင်ပါတယ်။",
    why: "လုပ်ဆောင်မယ့်အရာနဲ့ ရည်ရွယ်ချက်ကို ရှင်းလင်းစွာ ဖော်ပြဖို့ အသုံးဝင်ပါတယ်။",
    rules: [
      "သဘောတူခြင်း၊ ဆုံးဖြတ်ခြင်း၊ ကတိပေးခြင်းတို့ကို ပြတဲ့ စာအုပ်ပါကြိယာတွေနောက်မှာ to နဲ့ အခြေခံကြိယာ လိုက်နိုင်ပါတယ်။",
      "to နောက်က ကြိယာကို အခြေခံပုံစံအတိုင်း ထားပါ။",
      "ဝါကျအစမှာ လုပ်ရပ်ကို ကတ္တားအဖြစ် သုံးနိုင်ပါတယ်။",
    ],
    examples: [14, 16, 18, 19],
    question: 31,
    steps: [
      "သဘောတူကြောင်း ပြတဲ့ ရှေ့ကြိယာကို သတိပြုပါ။",
      "ပေးထားတဲ့ ကြိယာရှေ့မှာ to ထည့်ပါ။",
      "အခြေခံကြိယာကို ကာလအလိုက် ထပ်မပြောင်းပါနှင့်။",
    ],
  },
  {
    id: "meaning",
    title: "Gerund or infinitive: meaning matters",
    my: "ပုံစံပြောင်းလျှင် အဓိပ္ပာယ်လည်း ပြောင်းနိုင်ခြင်း",
    formula: "[Verb] + [V-ing] OR [Verb] + to + [V1]",
    idea: "တချို့ကြိယာတွေနောက်မှာ ပုံစံနှစ်မျိုး သုံးလို့ရပေမယ့် တချို့မှာ အဓိပ္ပာယ် ပြောင်းသွားပါတယ်။",
    why: "တစ်ခုခုကို လုပ်ခြင်း ရပ်လိုက်တာနဲ့ တစ်ခုခုလုပ်ဖို့ အခြားလုပ်နေရာက ရပ်လိုက်တာ မတူပါဘူး။",
    rules: [
      "ဆက်လုပ်ခြင်းကို ပြတဲ့ စာအုပ်ပါ နမူနာနှစ်ခုမှာ အဓိပ္ပာယ် အဓိကအားဖြင့် တူပါတယ်။",
      "ရပ်ခြင်း၊ သတိရခြင်း၊ မေ့ခြင်းတို့မှာ နောက်ကပုံစံကို ပြောင်းလိုက်ရင် အဓိပ္ပာယ် ကွာနိုင်ပါတယ်။",
      "အင်္ဂလိပ်စကားလုံးတစ်လုံးချင်းကိုပဲ မကြည့်ဘဲ ဝါကျတစ်ခုလုံးရဲ့ အဓိပ္ပာယ်ကို စဉ်းစားပါ။",
    ],
    examples: [22, 23, 25, 26],
    question: 39,
    steps: [
      "ရည်ရွယ်ထားတဲ့ လုပ်ရပ်ကို ဖော်ပြနေသလား စဉ်းစားပါ။",
      "ရည်ရွယ်ခြင်းကို ပြတဲ့ ကြိယာနောက်မှာ to နဲ့ အခြေခံကြိယာ သုံးပါ။",
    ],
  },
]);
export const UNIT4_GRAMMAR = grammar(4, [
  {
    id: "too",
    title: "Too … to",
    my: "လုပ်ဆောင်မရလောက်အောင် လွန်ကဲခြင်း",
    formula: "[S] + [be / V] + too + [adjective / adverb] + (for + object) + to + [V1]",
    idea: "အခြေအနေတစ်ခုက လိုအပ်တာထက် လွန်ကဲလွန်းလို့ နောက်ကလုပ်ရပ်ကို မလုပ်နိုင်ကြောင်း ပြပါတယ်။",
    why: "အကြောင်းရင်းနဲ့ မလုပ်နိုင်တဲ့ အကျိုးဆက်ကို ဝါကျတစ်ကြောင်းတည်းနဲ့ ဆက်ပြောနိုင်ပါတယ်။",
    rules: [
      "too နဲ့ to ကြားမှာ နာမဝိသေသန ဒါမှမဟုတ် ကြိယာဝိသေသန ထားပါ။",
      "ဒီပုံစံမှာ မလုပ်နိုင်တဲ့ အဓိပ္ပာယ် ပါပြီးသား ဖြစ်တာကို သတိပြုပါ။",
      "လုပ်ဆောင်သူ မတူရင် for နောက်မှာ ကံပုဒ်ပုံစံ ထည့်ဖော်ပြပါ။",
    ],
    examples: [3, 4, 14],
    question: 17,
    before: 13,
    after: 14,
    steps: [
      "အလွန်ညင်သာစွာ ပြောတာက မကြားနိုင်ခြင်းရဲ့ အကြောင်းရင်း ဖြစ်ပါတယ်။",
      "နာမဝိသေသန သို့မဟုတ် ကြိယာဝိသေသနရှေ့မှာ too ထည့်ပါ။",
      "ကြားရမယ့်သူက သီးခြားဖြစ်လို့ for us ကို သုံးပြီး to နဲ့ နောက်ကြိယာ ဆက်ပါ။",
    ],
    parts: [
      ["The patient", "[Subject]", "လူနာ"],
      ["was", "[Verb]", "ဖြစ်ခဲ့သည်"],
      ["too weak", "[too + adjective]", "အားနည်းလွန်းသော"],
      ["to bear his weight.", "[to + V1]", "ကိုယ့်ကိုယ်အလေးချိန်ကို မထိန်းနိုင်လောက်အောင်"],
    ],
  },
  {
    id: "enough",
    title: "Enough to",
    my: "လုပ်ဆောင်နိုင်လောက်အောင် လုံလောက်ခြင်း",
    formula: "[S] + [be / V] + (not) + [adjective / adverb] + enough + to + [V1]",
    idea: "လုပ်ဆောင်နိုင်ဖို့ လိုအပ်တဲ့ အတိုင်းအတာ လုံလောက်သလားဆိုတာ ပြပါတယ်။",
    why: "လုံလောက်ခြင်းနဲ့ မလုံလောက်ခြင်းကို နာမဝိသေသန၊ ကြိယာဝိသေသနတို့နဲ့ တွဲဖော်ပြနိုင်ပါတယ်။",
    rules: [
      "enough ကို ပြုပြင်ဖော်ပြမယ့် နာမဝိသေသန သို့မဟုတ် ကြိယာဝိသေသနရဲ့ နောက်မှာ ထားပါ။",
      "မလုံလောက်ကြောင်း ပြလိုရင် ငြင်းဆိုပုံစံ လိုပါတယ်။",
      "to နောက်မှာ အခြေခံကြိယာ သုံးပါ။",
    ],
    examples: [7, 8, 12],
    question: 15,
    before: 11,
    after: 12,
    steps: [
      "တစ်ဆက်တည်း လေးမိုင် လမ်းလျှောက်နိုင်ဖို့ လိုတဲ့ ကျန်းမာသန်စွမ်းမှု လုံလောက်ကြောင်း ပြထားပါတယ်။",
      "နာမဝိသေသနနောက်မှာ enough ထည့်ပါ။",
      "လုပ်ဆောင်နိုင်တဲ့အရာကို to နဲ့ ဆက်ရေးပါ။",
    ],
  },
  {
    id: "conversion",
    title: "Changing between too and enough",
    my: "အဓိပ္ပာယ်မပြောင်းဘဲ ပုံစံပြောင်းခြင်း",
    formula: "too + [adjective] + to … ↔ not + [opposite adjective] + enough + to …",
    idea: "လွန်ကဲခြင်းကို မလုံလောက်ခြင်းအဖြစ် ပြောင်းရေးတဲ့အခါ ဆန့်ကျင်ဘက် နာမဝိသေသနကို ရွေးဖို့ လိုပါတယ်။",
    why: "ပုံစံကိုသာ ပြောင်းပြီး မူရင်းဝါကျရဲ့ လုပ်ဆောင်နိုင်၊ မနိုင် အဓိပ္ပာယ်ကို ထိန်းထားရပါတယ်။",
    rules: [
      "ဆူညံလွန်းခြင်းကို ငြိမ်သက်မှု မလုံလောက်ခြင်းအဖြစ် ပြောင်းနိုင်ပါတယ်။",
      "အငြင်းပုံစံကို လိုအပ်သလို ထည့်ပါ။",
      "ဝါကျကာလနဲ့ လုပ်ဆောင်သူကို မပြောင်းပါနှင့်။",
    ],
    examples: [26, 27, 34, 35],
    question: 28,
    before: 26,
    after: 27,
    steps: [
      "မူရင်းဝါကျမှာ ဆူညံလွန်းလို့ မအနားယူနိုင်ကြောင်း ပြပါတယ်။",
      "ငြိမ်သက်မှု မလုံလောက်ကြောင်း ပုံစံပြောင်းပါ။",
      "နောက်က အနားယူခြင်းနဲ့ ကာလကို ထိန်းထားပါ။",
    ],
  },
]);

export const UNIT5_GRAMMAR = grammar(5, [
  {
    id: "inversion",
    title: "Inversion",
    my: "ကြိယာကို ကတ္တားရှေ့ထားခြင်း",
    formula: "[Place / Direction] + [Intransitive verb] + [Subject]",
    idea: "နေရာနဲ့ ဦးတည်ရာကို ရှေ့တင်ပြီး အကြောင်းအရာအသစ်ကို မိတ်ဆက်ရာမှာ ကြိယာကို ကတ္တားရှေ့ထားနိုင်ပါတယ်။",
    why: "ဖော်ပြချက်ကို ပိုထင်ရှားစေဖို့ စာပေနဲ့ သရုပ်ဖော်ရေးသားမှုတွေမှာ သုံးပါတယ်။",
    rules: [
      "နေရာ သို့မဟုတ် ဦးတည်ရာပြ စကားစုကို ဝါကျရှေ့မှာ ထားပါ။",
      "ကံမလိုတဲ့ ကြိယာကို ကတ္တားရှေ့ရွှေ့ပြီး မူလကာလနဲ့ အနည်းအများကို ထိန်းပါ။",
      "မေးခွန်းပြောင်းတာ မဟုတ်လို့ အကူကြိယာအသစ် မထည့်ပါနှင့်။",
    ],
    examples: [5, 6, 7],
    question: 10,
    steps: ["လှည့်ထွက်လာတဲ့ နေရာကို ရှေ့တင်ပါ။", "မူလကြိယာနဲ့ ကတ္တားကို အစီအစဉ်ပြောင်းပါ။"],
  },
  {
    id: "participle",
    title: "Relative clauses and participle phrases",
    my: "ဆက်စပ်ဝါကျကို ကြိယာစကားစုအဖြစ် တိုပြုခြင်း",
    formula: "[Noun] + [V-ing / V3 phrase]",
    idea: "ဆက်စပ်ဝါကျထဲမှာ ဆက်စပ်နာမ်စားက ကတ္တားဖြစ်နေရင် ကြိယာစကားစုအဖြစ် တိုပြုနိုင်ပါတယ်။",
    why: "အဓိပ္ပာယ်ကို မပြောင်းဘဲ နာမ်ရဲ့ အချက်အလက်ကို ကျစ်လျစ်စွာ ဖော်ပြနိုင်ပါတယ်။",
    rules: [
      "ကိုယ်တိုင်လုပ်ဆောင်နေတဲ့ အဓိပ္ပာယ်ဆိုရင် ကြိယာကို အိုင်အင်ဂျီပုံစံ ပြောင်းပါ။",
      "ပြုလုပ်ခံရတဲ့ အဓိပ္ပာယ်ဆိုရင် ကြိယာတတိယပုံစံ သုံးပါ။",
      "နာမ်နဲ့ နောက်ကစကားစုရဲ့ အဓိပ္ပာယ်ဆက်စပ်မှုကို ပြန်စစ်ပါ။",
    ],
    examples: [23, 25],
    question: 29,
    steps: [
      "ဆက်စပ်နာမ်စားရဲ့ လုပ်ဆောင်ချက်ကို ရှာပါ။",
      "အပြုခံအဓိပ္ပာယ်ဖြစ်လို့ ဆက်စပ်နာမ်စားနဲ့ အကူကြိယာကို ဖြုတ်ပြီး ကြိယာတတိယပုံစံကို ထိန်းပါ။",
    ],
  },
  {
    id: "object-relative",
    title: "Omitting an object relative pronoun",
    my: "ကံအဖြစ်သုံးသော ဆက်စပ်နာမ်စားကို ချန်လှပ်ခြင်း",
    formula: "[Noun] + [Subject] + [Verb]",
    idea: "ဆက်စပ်နာမ်စားက ကံဖြစ်နေရင် အဲဒီနာမ်စားကိုပဲ ချန်လှပ်နိုင်ပါတယ်။",
    why: "နောက်မှာ ကတ္တားနဲ့ ကြိယာ ရှိနေပြီးဖြစ်လို့ ကြိယာပုံစံကို ထပ်မပြောင်းရပါ။",
    rules: [
      "ဆက်စပ်နာမ်စားနောက်မှာ သီးခြားကတ္တား ရှိမရှိ ကြည့်ပါ။",
      "ကံအဖြစ်သုံးနေရင် နာမ်စားကိုပဲ ဖြုတ်ပြီး ကျန်ဝါကျကို ထိန်းပါ။",
      "ကတ္တားအဖြစ်သုံးတဲ့ နာမ်စားနဲ့ မရောထွေးပါနှင့်။",
    ],
    examples: [27],
    question: 42,
    steps: [
      "ဆက်စပ်ဝါကျရဲ့ ကတ္တားနဲ့ ကံကို ခွဲကြည့်ပါ။",
      "ကံနာမ်စားဖြစ်ရင် နာမ်စားတစ်ခုပဲ ဖြုတ်ပါ။",
    ],
  },
]);
