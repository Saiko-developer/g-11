import { UNIT1_READING_ROLE_INFO } from "./unit1ReadingStructure";
import { UNIT2_SECTIONS } from "@/lib/grade11Unit2";

/** Word glosses for the original Reading B questions; no added model sentences. */
const WORDS: Record<string, [string, string]> = {
  what: ["အဘယ်အရာ", "wh"],
  is: ["ဖြစ်သနည်း", "link"],
  online: ["အွန်လိုင်းမှ", "adjective"],
  shopping: ["ဈေးဝယ်ခြင်း", "noun"],
  how: ["မည်သို့", "wh"],
  can: ["နိုင်သနည်း", "modal"],
  we: ["ကျွန်ုပ်တို့သည်", "subject"],
  buy: ["ဝယ်ယူ", "main"],
  and: ["နှင့်", "conjunction"],
  sell: ["ရောင်းချ", "main"],
  things: ["ပစ္စည်းများကို", "object"],
  over: ["မှတစ်ဆင့်", "preposition"],
  the: ["ထို", "article"],
  internet: ["အင်တာနက်", "noun"],
  where: ["မည်သည့်နေရာတွင်", "wh"],
  customers: ["ဈေးဝယ်သူများသည်", "subject"],
  see: ["ကြည့်ရှု", "main"],
  products: ["ကုန်ပစ္စည်းများကို", "object"],
  in: ["တွင်", "preposition"],
  why: ["အဘယ်ကြောင့်", "wh"],
  do: ["သနည်း", "help"],
  sellers: ["ရောင်းချသူများသည်", "subject"],
  give: ["ပေး", "main"],
  discounts: ["လျှော့ဈေးများကို", "object"],
  to: ["အား", "preposition"],
  their: ["၎င်းတို့၏", "possessive"],
  "touch-feel-try": ["ထိတွေ့ခံစားစမ်းသပ်ခြင်း", "modifier"],
  process: ["လုပ်ငန်းစဉ်", "noun"],
  happens: ["ဖြစ်ပျက်သည်", "main"],
  when: ["သောအခါ", "conjunction"],
  cybercrimes: ["ဆိုက်ဘာရာဇဝတ်မှုများ", "subject"],
  occur: ["ဖြစ်ပွား", "main"],
  have: ["ရရှိ", "main"],
  fun: ["ပျော်ရွှင်မှုကို", "object"],
  by: ["ခြင်းဖြင့်", "preposition"],
  going: ["သွားခြင်း", "main"],
  mode: ["နည်းလမ်း", "noun"],
  you: ["သင်သည်", "subject"],
  like: ["နှစ်သက်", "main"],
  use: ["အသုံးပြု", "main"],
  want: ["လိုချင်", "main"],
  traditional: ["သမားရိုးကျ", "adjective"],
  or: ["သို့မဟုတ်", "conjunction"],
  electronic: ["အီလက်ထရွန်နစ်", "adjective"],
  among: ["အနက်", "preposition"],
  disadvantages: ["ဆိုးကျိုးများ", "noun"],
  of: ["၏", "preposition"],
  mentioned: ["ဖော်ပြထားသော", "adjective"],
  passage: ["စာပိုဒ်", "noun"],
  which: ["မည်သည့်အရာ", "wh"],
  think: ["ထင်မြင်", "main"],
  most: ["အများဆုံး", "adverb"],
  serious: ["ဆိုးရွားသော", "adjective"],
  will: ["လိမ့်မည်", "modal"],
  completely: ["လုံးဝ", "adverb"],
  replace: ["အစားထိုး", "main"],
  future: ["အနာဂတ်", "noun"],
};
const questions = UNIT2_SECTIONS.find((s) => s.code === "2A")!.blocks.filter((b) =>
  /^2A-(3[1-9]|40)$/.test(b.id),
);
export const UNIT2_READING_WORDS = Object.fromEntries(
  questions.map((b) => [
    b.id,
    (b.x.match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g) ?? []).map(
      (word, index, words) =>
        [
          word,
          word.toLowerCase() === "to" && ["use", "buy"].includes(words[index + 1]?.toLowerCase())
            ? "ရန်"
            : WORDS[word.toLowerCase()][0],
        ] as [string, string],
    ),
  ]),
);
export const UNIT2_READING_ROLES = Object.fromEntries(
  questions.map((b) => [
    b.id,
    (b.x.match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g) ?? []).map((word, index, words) => {
      const lower = word.toLowerCase();
      if (lower === "to" && ["use", "buy"].includes(words[index + 1]?.toLowerCase()))
        return "infinitive";
      if (lower === "customers" && words[index - 1]?.toLowerCase() === "their") return "object";
      if (lower === "what" && b.id === "2A-36") return "subject";
      if (lower === "have" && b.id === "2A-37") return "main";
      if (lower === "will") return "future";
      if (["completely", "most"].includes(lower)) return "degree";
      return WORDS[lower][1];
    }),
  ]),
);

export const UNIT2_ROLE_INFO: typeof UNIT1_READING_ROLE_INFO = {
  ...UNIT1_READING_ROLE_INFO,
  future: {
    tag: "Modal Helping Verb",
    titleMy: "အနာဂတ်ပြအကူကြိယာ",
    explanationMy: "အနာဂတ်တွင် ဖြစ်လာမည့်အရာကို ပြသည်။ နောက်တွင် ကြိယာမူလပုံစံ လိုက်သည်။",
  },
  degree: {
    tag: "Adverb",
    titleMy: "အတိုင်းအတာပြကြိယာဝိသေသန",
    explanationMy: "လုပ်ဆောင်ချက် သို့မဟုတ် လက္ခဏာ၏ အတိုင်းအတာကို ဖော်ပြသည်။",
  },
};
