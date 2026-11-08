import unit1 from "./textbook/unit1.json";
import unit2 from "./textbook/unit2.json";
import unit3 from "./textbook/unit3.json";
import unit4 from "./textbook/unit4.json";
import unit5 from "./textbook/unit5.json";
import unit6 from "./textbook/unit6.json";

export type Grade11SpeakingLine = { id: string; en: string; my: string; page: number };
const spokenVariant = (text: string) =>
  text.replace(/\b(he|him)\s*\/\s*(she|her)\b/gi, "$1").replace(/\buse\/visit\b/g, "use");
type SourceSection = { blocks: { id: string; x: string; my: string; sourcePage: number }[] };
const fromBlocks = (sections: SourceSection[], ids: string[]): Grade11SpeakingLine[] =>
  ids.map((id) => {
    const block = sections.flatMap((section) => section.blocks).find((b) => b.id === id)!;
    return {
      id,
      en: spokenVariant(
        block.x.replace(/^\([a-z]\)\s*|^\d+\.\s*|^•\s*/i, "").replace(/^[A-Za-z\s\u00a0]+:\s*/, ""),
      ),
      my: block.my.replace(/^\([a-z]\)\s*|^[AB]:\s*/i, ""),
      page: block.sourcePage,
    };
  });
const lines = (unit: number, page: number, items: [string, string][]): Grade11SpeakingLine[] =>
  items.map(([en, my], index) => ({
    id: `${unit}:source:${index + 1}`,
    en: spokenVariant(en),
    my,
    page,
  }));

/** Only original Grade 11 phrases/questions; no invented conversations or Grade 10 recordings. */
export const GRADE11_SPEAKING_LINES: Record<number, Grade11SpeakingLine[]> = {
  1: fromBlocks(unit1, ["1D-13", "1D-14", "1D-15", "1D-16", "1D-17", "1D-19", "1D-21", "1D-23"]),
  2: fromBlocks(unit2, ["2D-15", "2D-17"]),
  3: fromBlocks(unit3, ["3D-14", "3D-15", "3D-16", "3D-17", "3D-19", "3D-20", "3D-22"]),
  4: fromBlocks(unit4, ["4D-13", "4D-15", "4D-17", "4D-19", "4D-21", "4D-23", "4D-25", "4D-27"]),
  5: [
    {
      id: "5A-20:first-sentence",
      page: 52,
      en: unit5[0].blocks.find((b) => b.id === "5A-20")!.x.split(". ")[0] + ".",
      my: "ဘရူနိုင်းမြို့တော် ဘန်ဒါဆရီဘဂါဝမ်တွင် ကြည့်ရှုစရာများစွာရှိသည်။",
    },
    ...lines(5, 52, [
      [
        "The Sultan’s Palace lies a short drive from the city centre.",
        "ဆူလတန်နန်းတော်သည် မြို့လယ်မှ ကားခဏမောင်းရုံအကွာတွင် ရှိသည်။",
      ],
    ]),
  ],
  6: fromBlocks(unit6, ["6D-28", "6D-29", "6D-30", "6D-31"]),
  7: lines(7, 83, [
    [
      "What health problem did you have and when?",
      "မည်သည့်ကျန်းမာရေးပြဿနာကို မည်သည့်အချိန်တွင် ကြုံခဲ့သနည်း။",
    ],
    ["What caused the problem?", "ထိုပြဿနာကို မည်သည့်အရာက ဖြစ်စေသနည်း။"],
    ["How did you feel?", "မည်သို့ ခံစားခဲ့ရသနည်း။"],
    ["What did you do to overcome the problem?", "ထိုပြဿနာကို ကျော်လွှားရန် မည်သို့ လုပ်ခဲ့သနည်း။"],
  ]),
  8: lines(8, 97, [
    ["Which character do you like more?", "မည်သည့်ဇာတ်ကောင်ကို ပိုနှစ်သက်သနည်း။"],
    ["What kind of person is he / she?", "ထိုသူသည် မည်သို့သောသူ ဖြစ်သနည်း။"],
    [
      "What kind of relationship does each character have with Johnsy?",
      "ဇာတ်ကောင်တစ်ဦးစီသည် ဂျွန်စီနှင့် မည်သို့ ဆက်နွယ်သနည်း။",
    ],
    ["What role does he / she play in the story?", "ဇာတ်လမ်းတွင် မည်သည့်အခန်းကဏ္ဍမှ ပါဝင်သနည်း။"],
    ["Why do you like him / her better?", "ထိုသူကို အဘယ်ကြောင့် ပိုနှစ်သက်သနည်း။"],
  ]),
  9: lines(9, 106, [
    [
      "Hi Thaw Zin. What happened to you? You look stressed.",
      "ဟိုင်း သော်ဇင်။ မင်း ဘာဖြစ်တာလဲ။ စိတ်ဖိစီးနေပုံပဲ။",
    ],
    ["What should I do?", "ငါ ဘာလုပ်သင့်သလဲ။"],
    [
      "If I were you, I’d take some time off to get some refreshment.",
      "ငါသာ မင်းနေရာမှာဆို စိတ်လန်းဆန်းဖို့ အချိန်ခဏယူပြီး အနားယူမယ်။",
    ],
  ]),
  10: lines(10, 118, [
    ["How do you usually spend your leisure?", "အားလပ်ချိန်ကို မည်သို့ အသုံးပြုလေ့ရှိသနည်း။"],
    [
      "Which activities are important in your life?",
      "သင့်ဘဝတွင် မည်သည့်လုပ်ဆောင်မှုများက အရေးကြီးသနည်း။",
    ],
    [
      "Which activity do you like doing most? Why?",
      "မည်သည့်လုပ်ဆောင်မှုကို အနှစ်သက်ဆုံးဖြစ်သနည်း။ အဘယ်ကြောင့်နည်း။",
    ],
    [
      "Do you have enough time to do what you want to do? Why?",
      "လုပ်ချင်သောအရာများ လုပ်ရန် အချိန်လုံလောက်သလား။ အဘယ်ကြောင့်နည်း။",
    ],
    [
      "Do you think you make good use of your leisure?",
      "သင့်အားလပ်ချိန်ကို ကောင်းစွာအသုံးချသည်ဟု ထင်သလား။",
    ],
  ]),
  11: [
    ...lines(11, 128, [
      ["It is a well-paid job.", "၎င်းသည် လစာကောင်းသော အလုပ်ဖြစ်သည်။"],
      [
        "I need to use computer well.",
        "ကျွန်ုပ်သည် ကွန်ပျူတာကို ကောင်းစွာအသုံးပြုတတ်ရန် လိုအပ်သည်။",
      ],
    ]),
    ...lines(11, 129, [
      [
        "I must be able to communicate effectively.",
        "ကျွန်ုပ်သည် ထိရောက်စွာ ဆက်သွယ်ပြောဆိုနိုင်ရမည်။",
      ],
    ]).map((line) => ({ ...line, id: "11:source:3" })),
  ],
  12: lines(12, 140, [
    [
      "Have you ever had a terrible experience in your life?",
      "သင့်ဘဝတွင် ဆိုးရွားသောအတွေ့အကြုံ ကြုံဖူးသလား။",
    ],
    ["When and where did it happen?", "မည်သည့်အချိန်နှင့် နေရာတွင် ဖြစ်ခဲ့သနည်း။"],
    ["Who were you with at that time?", "ထိုအချိန်တွင် မည်သူနှင့် အတူရှိခဲ့သနည်း။"],
    ["Tell me more about your experience.", "သင့်အတွေ့အကြုံကို ထပ်မံပြောပြပါ။"],
    [
      "What was the hardest part of that incident and why?",
      "ထိုဖြစ်ရပ်၏ အခက်ခဲဆုံးအပိုင်းက အဘယ်နည်း။ အဘယ်ကြောင့်နည်း။",
    ],
    ["That’s a shame!", "စိတ်မကောင်းစရာပဲ။"],
    ["I’m so sorry to hear that!", "ထိုသတင်းကြားရတာ အလွန်စိတ်မကောင်းပါဘူး။"],
  ]),
};
