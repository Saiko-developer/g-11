// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 6 sections 6A / 6B / 6C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts`, `unit3Supplement.ts`,
// `unit4Supplement.ts` and `unit5Supplement.ts`. Units 1, 2, 3, 4 and 5 data
// are never touched by this module.

import type { TrainCar } from "@/lib/sentenceStructure";

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};


/* ----------------------------- 6A Reading ------------------------------ */

export const partA6A_translations: Record<number, string> = {
  1: "ဘန်က သူ့ရဲ့ဖခင်ဆီကနေ ဘာကို ဘာကြောင့် တောင်းဆိုခဲ့တာလဲ။",

  2: "ဘင်သည် ဝေးလံသော နိုင်ငံတွင် မည်ကဲ့သို့သော ဘဝဖြင့် နေထိုင်ခဲ့သနည်း။",
  3: "ဝက်ကျောင်းသားအဖြစ် အလုပ်လုပ်စဉ် ဘင်သည် ဘာကို စားရသနည်း။",
  4: "စာကြောင်း ၂၄ ရှိ 'he did' ဟူသော စကားစု၏ အဓိပ္ပာယ်မှာ အဘယ်နည်း။",
  5: "ဒန်သည် မိမိ၏ ညီသည် အဘယ်အရာကို ခံရထိုက်သည်ဟု ထင်ခဲ့သနည်း။",
};

export const partB6A_translations: Record<number, string> = {
  1: "ခေါင်းစဉ်ရှိ 'prodigal' ဟူသော စကားလုံးသည် ________ နှင့် အဓိပ္ပာယ် ဆက်စပ်သည် — (a) အချိန်ကို အလော်လည်လော်လည် ဖြုန်းတီးခြင်း၊ (b) အနာဂတ်ကို မစဉ်းစားဘဲ ငွေကို အမြောက်အမြား သုံးစွဲခြင်း၊ (c) အလွန်ကောင်းသော စွမ်းရည် ရှိခြင်း။",
  2: "ဒန်နှင့် ဘင်တို့ ကွဲပြားခြားနားချက်များက အဘယ်နည်း။",
  3: "စာကြောင်း ၈ ရှိ 'make it' ဟူသော စကားစု၏ အဓိပ္ပာယ်မှာ အဘယ်နည်းဟု ထင်သနည်း။",
  4: "စာကြောင်း ၁၂ ရှိ 'his' သည် မည်သူ့ကို ရည်ညွှန်းသနည်း။",
  5: "ဝေးလံသော နိုင်ငံတွင် ငွေကုန်ခမ်းသောအခါ ဘင်သည် အဘယ်အရာကို ပြုလုပ်ခဲ့သနည်း။",
  6: "အိမ်ပြန်သွားပါက ဖခင်သည် မိမိအား အဘယ်အရာ ပြုလုပ်လိမ့်မည်ဟု ဘင်က ထင်ခဲ့သနည်း။",
  7: "သားကို အကွာအဝေးမှ မြင်သောအခါ ဘင်၏ ဖခင်သည် အဘယ်အရာကို ပြုလုပ်ခဲ့သနည်း။",
  8: "ဘင် အိမ်ရောက်လာသောအခါ ဖခင်သည် အစေခစ်များအား အဘယ်အရာ ပြုလုပ်ရန် ညွှန်ကြားခဲ့သနည်း။",
  9: "သင်သည် ဒန်ဖြစ်နေလျှင် ညီဖြစ်သူ ဘင် အိမ်ပြန်ရောက်လာသောအခါ မည်ကဲ့သို့ ခံစားမည်နည်း။",
  10: "သင်သည် ဒန်နှင့် ဘင်တို့၏ ဖခင်ဖြစ်နေလျှင် ဘင် ပြန်ရောက်လာသောအခါ မည်ကဲ့သို့ ပြုလုပ်မည်နည်း။ အဘယ်ကြောင့်နည်း။",
};
/* ---------------------------- 6B Vocabulary ---------------------------- */

export const partA6B_translations: Record<number, string> = {
  1: "သုံးနာရီ ခရီးသွားပြီးနောက် ကျွန်ုပ်တို့၏ ကားတွင် လောင်စာ ________ ကုန်သွားသည်။",
  2: "ထိုလူသည် အမြန်နှုန်းဖြင့် မောင်းနေစဉ် ခွေးတစ်ကောင်ကို ________ သွားသည်။",
  3: "အက်ဆေးကို အသေးစိတ် ဖတ်ရန် အချိန်မရှိသဖြင့် ကျွန်ုပ်သည် ၎င်းကို ________ မိချေ။",
  4: "ထိုကားသည် မည်သည့်အမျိုးအစား လောင်စာဖြင့် ________ သနည်း။",
  5: "မနေ့ညတွင် ကျွန်ုပ်သည် ငယ်စဉ်က မိတ်ဆွေတစ်ယောက်နှင့် ဂီတပွဲ၌ ________ မိသည်။",
  6: "စာရင်းစက်ကို အသုံးမပြုနိုင်တော့ပါ။ ဘက်ထရီ ________ ပြီးသည်ဟု ထင်သည်။",
  7: "ကြောင်ကို ________ နေစဉ် ကျောက်ဆောင်တစ်ခုပေါ်တွင် ခြေဖြင်းလိုက်မိ၍ ကျခဲ့သည်။",
};
export const partB6B_translations: Record<number, string> = {
  1: "သီတာသည် အလုပ်ပြီးပါက ကျွန်ုပ်တို့နှင့်အတူ လိုက်ပါမည်ဟု ________ သည်။",
  2: "သူသည် မိမိ ဆုံးရှုံးသွားသော ကားအကြောင်းကို ရဲတပ်ဖွဲ့သို့ ________ သည်။",
  3: "နီလာသည် ပါတီသို့ လာနိုင်မည် မဟုတ်ကြောင်း ကျွန်ုပ်တို့အား ________ သည်။",
  4: "ထိုနေ့ နေ့လယ်ပိုင်းတွင် ပြတိုက်သို့ သွားကြမည်ဟု သူတို့သည် ကျွန်ုပ်တို့အား ________ သည်။",
  5: "ကျွန်ုပ်သည် သင် ________ သည့်အချက်နှင့် အချို့အတိုင်းအတာအထိ သဘောတူသည်။",
  6: "ဆရာမက ကျောင်းသားများအား အတန်းတွင် စကားပြောဆိုခြင်း ရပ်တန့်ရန် ________ သည်။",
  7: "ယောက်ျားလေးများထက် မိန်းကလေးများသည် မိမိတို့ အသွင်အပြင်ကို စိုးရိမ်နေချိန် ပို၍ ရှည်လျားသည်ဟု လူများ ________ ကြသည်။",
  8: "လိုအပ်သည်တစ်စုံတစ်ခု ရှိလျှင် ကျွန်ုပ်အား ________ ရန် တွန့်တိုမနေပါနှင့်။",
  9: "ကျွန်ုပ်သည် ကလေးငယ်အား ကြားရသမျှ ဆံပင် ကြွေတက်စေသော ဇာတ်လမ်းတစ်ခု ________ ပေးခဲ့သည်။",
  10: "မိမိ စင်စစ် ထင်မြင်သည့်အတိုင်း ________ ရန် အချိန်တန်ပြီဟု ထင်သည်။",
  11: "ကျွန်ုပ်သည် ________ ရန်သာ ခေတ္တရပ်၍ လာခဲ့ခြင်း ဖြစ်သည်။",
  12: "သူသည် နှုတ်ဆက်စကား ________ ဘဲ ထွက်ခွာသွားခဲ့သည်။",
  13: "သူသည် သူတို့အား အမှန်တရားကို သတိထား၍ ________ ရန် လိုအပ်သည်။",
  14: "မိမိအတွက် ပြုလုပ်ပေးခဲ့သမျှအတွက် 'ကျေးဇူးတင်ပါသည်' ဟု ________ လိုသည်။",
  15: "ရထားသည် မည်သည့်အချိန်ထွက်သည်ကို ကျွန်ုပ်အား ________ နိုင်ပါသလား။",
};
export const vocab6B: VocabItem[] = [
  {
    word: "run after",
    pronunciation: "/rʌn ˈɑːftə(r)/ — ရန် အာဖတာ",
    meaningMy: "လိုက်သည် — နောက်မှ လိုက်လံသည်",
    exampleEn: "The mother of three children had to run after them all day.",
  },
  {
    word: "run down",
    pronunciation: "/rʌn daʊn/ — ရန် ဒေါင်း",
    meaningMy: "အားကုန်သွားသည် — ရပ်သွားသည် (ဘက်ထရီ စသည်)",
    exampleEn: "The battery in my clock has run down.",
  },
  {
    word: "run into someone",
    pronunciation: "/rʌn ˈɪntuː ˈsʌmwʌn/ — ရန် အင်တူ ဆမ်ဝမ်",
    meaningMy: "ရုတ်တရက် တွေ့မိသည် — မမျှော်လင့်ဘဲ တစ်ယောက်ယောက်နှင့် တွေ့ဆုံသည်",
    exampleEn: "I ran into my English teacher at the shopping mall yesterday.",
  },
  {
    word: "run on",
    pronunciation: "/rʌn ɒn/ — ရန် အွန်",
    meaningMy: "…ဖြင့် မောင်းနှင်သည် — လောင်စာ စသည်ဖြင့် လည်ပတ်သည်",
    exampleEn: "Electric cars run on electricity, not gas.",
  },
  {
    word: "run out of",
    pronunciation: "/rʌn aʊt əv/ — ရန် အောက် အောဗ်",
    meaningMy: "ကုန်သွားသည် — အသုံးပြုပြီး လုံးဝ ကျန်မရှိတော့ပါ",
    exampleEn: "We ran out of ice cream at the party, so we had to go and buy some more.",
  },
  {
    word: "run over",
    pronunciation: "/rʌn ˈəʊvə(r)/ — ရန် အိုဗာ",
    meaningMy: "ကားဖြင့် ခြေမှုန်းမိသည် — ကား၊ ရထား၊ ကုန်းတွင်းကား စသည်ဖြင့် တိုက်မိသည်",
    exampleEn: "She was upset because she ran over a cat while driving home from work.",
  },
  {
    word: "run through",
    pronunciation: "/rʌn θruː/ — ရန် သရူး",
    meaningMy: "အမြန် လုပ်ဆောင်သည် — လျင်မြန်စွာ တစ်ဖြတ် လုပ်သည်",
    exampleEn: "Let me run through the schedule for the tour.",
  },
];
/* ------------------------------ 6C Grammar ----------------------------- */

export const partA6C_translations: Record<number, string> = {
  1: "သူမသည် 'ကျွန်မ၏ အလုပ်ဖြင့် နေရာအများအပြားသို့ ခရီးသွားလေ့ရှိသည်' ဟု ပြောခဲ့သည်။",
  2: "မိခင်က 'ဤနေရာတွင် လူမသိမျိုး မမြင်ပါ' ဟု ပြောခဲ့သည်။",
  3: "နီနီက 'သူတို့သည် နေ့လယ်စာ စားပြီးသွားပြီ' ဟု ပြောခဲ့သည်။",
  4: "သူဇာက 'မနက်ဖြန် နေပြည်တော်သို့ ထွက်ခွာမည်' ဟု ပြောခဲ့သည်။",
  5: "သုသုက 'ကျွန်မသည် မိကျောင်းတစ်ကောင်ကို မြစ်တွင် ၁၀ နှစ်အလင်က မြင်ခဲ့ဖူးသည်' ဟု ပြောခဲ့သည်။",
  6: "သုတက 'ကျွန်တော် မီးအိမ်ကို လတ်တလော ပိတ်လိုက်ပြီ' ဟု ပြောခဲ့သည်။",
  7: "နီလာက 'အမေ၊ ကျွန်မ အိမ်စာ လုပ်ပြီးသွားပြီ' ဟု ပြောခဲ့သည်။",
  8: "ဇော်ဇော်က 'ကျွန်တော့် မိတ်ဆွေများနှင့် ကျွန်တော်သည် ယခု တနင်္ဂနွေနေ့တွင် ရေကူးကစားကြမည်' ဟု ပြောခဲ့သည်။",
  9: "ကျွန်ုပ်တို့၏ ဆရာမက 'ကျွန်မသည် သင်တို့အား ပညာသင်ကြားရေးတွင် အာရုံစိုက်စေလိုသည်' ဟု ပြောခဲ့သည်။",
  10: "ကျွန်ုပ်၏ ဦးလေးက 'နင် ပို၍ ကြိုးစားလျှင် ပိုကောင်းသော အမှတ်များ ရလိမ့်မည်' ဟု ပြောခဲ့သည်။",
};
export const partB6C_translations: Record<number, string> = {
  1: "မာလာသည် သူဇာ စင်ကာပူသို့ သွားဖူးခဲ့သလားဟု မေးခဲ့သည်။",
  2: "ကျွန်ုပ်၏ အင်္ဂလိပ်စာ ဆရာမသည် ကျွန်ုပ် အင်္ဂလိပ်စကားကို ကျွမ်းကျင်စွာ ပြောချင်သလားဟု မေးခဲ့သည်။",
  3: "ကျွန်ုပ်၏ အစ်မက ဒီနေ့ မိမိတွင် မည်သည့်အစီအစဉ် ရှိသည်ကို မေးခဲ့သည်။",
  4: "ကျွန်ုပ်၏ အဖေသည် ကျွန်ုပ် ပို၍ ကြိုးစားလုပ်ကိုင်ရန် စိတ်အားထက်သန်သလားဟု မေးခဲ့သည်။",
  5: "ဆရာမသည် မြင့်ဇူးအား တစ်ကြိမ်ထပ်၍ မည်ကြောင့် နောက်ကျသည်ကို မေးခဲ့သည်။",
  6: "သင်းသင်းသည် အွန်းမာအား မန်တလေသို့ သွားသော နောက်ဆုံး ကုန်းတွင်းကားသည် မည်သည့်အချိန်ထွက်သည်ကို မေးခဲ့သည်။",
  7: "ဆရာမသည် ကိုတိုးအား မိမိ၏ အကြိုက်ဆုံး ဘာသာရပ်မှာ အဘယ်နည်းဟု မေးခဲ့သည်။",
  8: "အေးအေးသည် ထိုနေ့ ကျွန်ုပ် စိတ်မကောင်းဖြစ်နေရခြင်း အကြောင်းရင်းကို မေးခဲ့သည်။",
  9: "ကျွန်ုပ်၏ အဒေါ်သည် ကျွန်ုပ် အမှိုက်ကို မည်မျှအကြိမ် ထုတ်ပစ်သည်ကို မေးခဲ့သည်။",
  10: "ကျွန်ုပ်၏ အိမ်နီးချင်းသည် မိမိ၏ ခွေးကို မြင်ခဲ့သလားဟု မေးခဲ့သည်။",
};
export const partC6C_translations: Record<number, string> = {
  1: "ကျွန်ုပ်၏ ဦးလေးသည် အွန်လိုင်းဂိမ်းများ ကစားရင်း အချိန်ဖြုန်းခြင်း မပြုလေနှင့်ဟု သတိပေးခဲ့သည်။",
  2: "သူ၏ အမိသည် ဤအချိန်သည် နောက်ဆုံးအခွင့်အရေး ဖြစ်သဖြင့် ပို၍ ကြိုးစားရန် ပြောခဲ့သည်။",
  3: "ထိုလူက လမ်းမသိသူအား လမ်းမတလျှောက် ဆင်းသွားပြီး ဘယ်ဘက်သို့ ကွေ့ရန် ပြောခဲ့သည်။",
  4: "မိခင်သည် ကျွန်ုပ်အား နေ့တိုင်း အိပ်ယာခင်းကို စီရန် ပြောခဲ့သည်။",
  5: "မိမိ၏ ကင်မရာကို တစ်ရက်စာ ငှားပေးရန် မိမိ၏ အစ်ကိုက ချိုချိုအား ပြောခဲ့သည်။",
  6: "ဆရာဝန်က မိမိ၏ လူနာအား ကျန်းမာရေးနှင့် မညီသော အစားအစားများ စားခြင်း ရှောင်ကြဉ်ပါဟု ပြောခဲ့သည်။",
  7: "မိခင်သည် မြန်မြန်သွားလေနှင့် မဟုတ်လျှင် ကျောင်းနောက်ကျလိမ့်မည်ဟု ကျွန်ုပ်အား ပြောခဲ့သည်။",
  8: "ကျွန်ုပ်တို့၏ ဆရာမသည် ကျွန်ုပ်တို့အား ယင်းဖော်ပြချက်အပေါ် မိမိတို့၏ အမြင်ကို ပေးရန် တောင်းဆိုခဲ့သည်။",
  9: "ကျွန်ုပ်တို့၏ အဒေါ်က လတ်လတ်ဆတ်ဆတ် စတော်ဘယ်ရီသီးများကို စားကြပါဟု ပြောခဲ့သည်။",
  10: "နီလာသည် ကြည်ဖြူအား မိမိ၏ ဆုံးဖြတ်ချက်ကို ပြန်လည်သုံးသပ်ရန် ရက်အနည်းငယ် ပေးပါရန် တောင်းဆိုခဲ့သည်။",
};
export const grammar6C = {
  whatMy:
    "သွယ်ဝိုက်ပြောဆိုခြင်း (Reported Speech) သည် တစ်ယောက်ယောက်က ပြောခဲ့သည့် အချက်အလက်ကို အခြားသူတစ်ယောက်က ပြန်ဖော်ပြခြင်း ဖြစ်သည်။ တိုက်ရိုက်ပြောဆိုချက် (Direct Speech) ကဲ့သို့ quotation marks များ မသုံးပါ။ ဖော်ပြသည့် ကြိယာ (reporting verb) သည် အတိတ်ဖြစ်လျှင် သွယ်ဝိုက်ပြောဆိုသည့် အပိုဒ်ရှိ ကြိယာသည် များသောအားဖြင့် အတိတ်ပုံစံသို့ ပြောင်းလဲသည်။",
  whenMy:
    "ဖော်ပြချက် (statement) များကို 'that' ဖြင့် စတင်သည်။ Yes / No မေးခွန်းများကို ဖော်ပြရာတွင် 'ask' ကြိယာနှင့် 'if / whether' ကို အသုံးပြုပြီး Wh- မေးခွန်းများတွင် မေးခွန်းစကားလုံးကို ထားရှိသည်။ ညွှန်ကြားချက်နှင့် တောင်းဆိုချက်များတွင် 'tell / ask' ကြိယာ ချက်ချင်းနောက်တွင် နာမ် သို့မဟုတ် နာမစုတ် လိုက်ပြီး to-infinitive / not to-infinitive ဖြင့် ဖော်ပြသည်။ ထို့အပြင် here→there, this→that, these→those, now→then, today→that day, tonight→that night, yesterday→the day before / the previous day, ago→before, tomorrow→the next day / the following day, next month / year→the following month / year စသည့် နေရာနှင့် အချိန်ပြ စကားလုံးများကိုလည်း ပြောင်းလဲရသည်။",
  whyMy:
    "အထွေထွေ မှန်ကန်ချက် (general truth) တစ်ခုကို ဖော်ပြသည့် စာကြောင်းဖြစ်လျှင်မူ ပစ္စုပ္ပန်တင်းစ်ကို ထားရှိပါသည် (e.g. She said that the Earth is round.)။ မေးခွန်းများကို ဖော်ပြသည့်အခါ မေးခွန်းပုံစံကို ဖော်ပြချက်ပုံစံသို့ ပြောင်းရန် လိုအပ်သည်။",
  examples: [
    { en: "She said that she was watching TV.", phrase: "said that she was watching" },
    { en: "She asked me if I watched TV.", phrase: "asked me if I watched" },
    { en: "The guard told us not to enter that area.", phrase: "told us not to enter" },
  ],
};

/* ------------- 6A Sentence-structure breakdowns (curated) --------------- */
// Rules for this data:
//  • Grammar tags are English only; every translation string is pure Burmese.
//  • Auxiliary verbs, WH-words, subjects and main verbs are separate cars —
//    a subject is never merged with its verb.
//  • Single articles / single prepositions are never their own car; they
//    travel inside the complete phrase they belong to.
//  • Translations follow Burmese SOV order, phrase by phrase.

export type SentenceBreakdown = {
  introMy: string;
  noteMy: string;
  cars: TrainCar[];
};

const WH_INTRO6 =
  "မေးခွန်းဝါကျဖြစ်သဖြင့် မေးခွန်းစကားလုံးက ရှေ့ဆုံးတွင် ရပ်ပြီး အကူကြိယာက ကတ္တားရှေ့သို့ ရွှေ့သွားသည်။";
const WH_NOTE6 =
  "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → ကြိယာ → ကံ/ဝိဘတ်စကားစု ။ မြန်မာလို ပြန်ဆိုသည့်အခါ ကြိယာကို နောက်ဆုံးတွင် ထားပါ။";
const SV_INTRO6 =
  "ဤဝါကျကို အပိုင်းလိုက် ခွဲကြည့်ပါ — မည်သူ (ကတ္တား) ၊ ဘာလုပ်သည် (ကြိယာ) ၊ ဘာကို (ကံ) ဟူ၍ ဖြစ်သည်။";
const SV_NOTE6 =
  "ပုံစံ: ကတ္တား → ကြိယာ → ကံ ။ ဝိဘတ်စကားစုကို တစ်လုံးချင်း မခွဲဘဲ စကားစုတစ်ခုလုံးအဖြစ် ဖတ်ပါ။";

export const partA6A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့တာလဲ", tag: "Auxiliary Verb" },
      { word: "Ben", translation: "ဘန်က", tag: "Noun Subject" },
      { word: "ask for", translation: "တောင်းဆို", tag: "Phrasal Verb / Main Verb" },
      { word: "from his father", translation: "သူ့ရဲ့ဖခင်ဆီကနေ", tag: "Prepositional Phrase" },
      { word: "and why", translation: "နှင့် ဘာကြောင့်", tag: "Conjunction & WH-Word" },
    ],
  },
  2: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What kind of life", translation: "မည်ကဲ့သို့သော ဘဝမျိုးကို", tag: "WH-Question Phrase" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "Ben", translation: "ဘန်က", tag: "Noun Subject" },
      { word: "lead", translation: "ဖြတ်သန်း နေထိုင်", tag: "Main Verb" },
      { word: "at a distant land", translation: "ဝေးလံသော ပြည်နယ်တစ်ခုတွင်", tag: "Prepositional Phrase" },
    ],
  },
  3: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "Ben", translation: "ဘန်က", tag: "Noun Subject" },
      { word: "have to eat", translation: "စားရ", tag: "Main Verb Phrase" },
      { word: "when working as a swineherd", translation: "ဝက်ကျောင်းသားအဖြစ် အလုပ်လုပ်နေစဉ်", tag: "Adverbial Clause" },
    ],
  },
  4: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "does", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "the phrase 'he did' in line 24", translation: "စာကြောင်း ၂၄ ရှိ 'he did' ဟူသော စကားစုက", tag: "Noun Subject" },
      { word: "mean", translation: "အဓိပ္ပာယ် ဆောင်", tag: "Main Verb" },
    ],
  },
  5: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "Dan", translation: "ဒန်က", tag: "Noun Subject" },
      { word: "think", translation: "ထင်", tag: "Main Verb" },
      { word: "that his brother deserved", translation: "သူ့ရဲ့ညီ ခံစားထိုက်သည်ဟု", tag: "Noun Clause" },
    ],
  },
};

export const partB6A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: SV_INTRO6,
    noteMy: SV_NOTE6,
    cars: [
      { word: "The word 'prodigal' in the title", translation: "ခေါင်းစဉ်ရှိ 'prodigal' ဟူသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "similar in meaning", translation: "အဓိပ္ပာယ် ဆင်တူ", tag: "Adjective Complement" },
      { word: "to ______", translation: "__________ နှင့်", tag: "Prepositional Phrase" },
    ],
  },
  2: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာတွေလဲ", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the differences", translation: "ကွဲပြားခြားနားချက်များသည်", tag: "Noun Subject" },
      { word: "between Dan and Ben", translation: "ဒန်နှင့် ဘန်တို့ကြားရှိ", tag: "Prepositional Phrase" },
    ],
  },
  3: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "do", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "you", translation: "သင်က", tag: "Noun Subject" },
      { word: "think", translation: "ထင်", tag: "Main Verb" },
      { word: "the phrase 'make it' in line 8 means", translation: "စာကြောင်း ၈ ရှိ 'make it' ဟူသော စကားစုက အဓိပ္ပာယ် ဆောင်သည်ဟု", tag: "Noun Clause" },
    ],
  },
  4: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "မည်သူ့ကို", tag: "WH-Question Word" },
      { word: "does", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "'his' in line 12", translation: "စာကြောင်း ၁၂ ရှိ 'his' က", tag: "Noun Subject" },
      { word: "refer to", translation: "ရည်ညွှန်း", tag: "Phrasal Verb / Main Verb" },
    ],
  },
  5: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "When Ben ran out of money in a distant land", translation: "ဝေးလံသော ပြည်နယ်တွင် ဘန်၏ ငွေ ကုန်ခမ်းသွားသောအခါ", tag: "Adverbial Clause" },
      { word: "what", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "he", translation: "သူက", tag: "Noun Subject" },
      { word: "do", translation: "လုပ်", tag: "Main Verb" },
    ],
  },
  6: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "Ben", translation: "ဘန်က", tag: "Noun Subject" },
      { word: "think", translation: "ထင်", tag: "Main Verb" },
      { word: "that his father would do to him", translation: "သူ့ဖခင်က သူ့အပေါ် ပြုလုပ်လိမ့်မည်ဟု", tag: "Noun Clause" },
      { word: "if he went back home", translation: "အကယ်၍ သူ အိမ်ပြန်သွားလျှင်", tag: "Conditional Clause" },
    ],
  },
  7: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "Ben's father", translation: "ဘန်၏ ဖခင်က", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်", tag: "Main Verb" },
      { word: "when he saw his son at a distance", translation: "သူ့သားကို အဝေးမှ မြင်လိုက်သောအခါ", tag: "Adverbial Clause" },
    ],
  },
  8: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "When Ben got home", translation: "ဘန် အိမ်ရောက်လာသောအခါ", tag: "Adverbial Clause" },
      { word: "what", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "did", translation: "ခဲ့သနည်း", tag: "Auxiliary Verb" },
      { word: "his father", translation: "သူ့ဖခင်က", tag: "Noun Subject" },
      { word: "ask his servants to do", translation: "အစေခံများအား ပြုလုပ်ရန် ခိုင်းစေ", tag: "Main Verb Phrase" },
    ],
  },
  9: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "If you were Dan", translation: "အကယ်၍ သင်သည် ဒန် ဖြစ်ခဲ့လျှင်", tag: "Conditional Clause" },
      { word: "how", translation: "မည်ကဲ့သို့", tag: "WH-Question Word" },
      { word: "would", translation: "မည်နည်း", tag: "Modal Auxiliary Verb" },
      { word: "you", translation: "သင်က", tag: "Noun Subject" },
      { word: "feel", translation: "ခံစားရ", tag: "Main Verb" },
      { word: "when your brother, Ben came home", translation: "သင့်ညီ ဘန် အိမ်ပြန်ရောက်လာသောအခါ", tag: "Adverbial Clause" },
    ],
  },
  10: {
    introMy: WH_INTRO6,
    noteMy: WH_NOTE6,
    cars: [
      { word: "If you were the father of Dan and Ben", translation: "အကယ်၍ သင်သည် ဒန်နှင့် ဘန်တို့၏ ဖခင် ဖြစ်ခဲ့လျှင်", tag: "Conditional Clause" },
      { word: "what", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "would", translation: "မည်နည်း", tag: "Modal Auxiliary Verb" },
      { word: "you", translation: "သင်က", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်", tag: "Main Verb" },
      { word: "when Ben came back", translation: "ဘန် ပြန်ရောက်လာသောအခါ", tag: "Adverbial Clause" },
      { word: "Why", translation: "အဘယ်ကြောင့်နည်း", tag: "WH-Question Word" },
    ],
  },
};
