// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 5 sections 5A / 5B / 5C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts`, `unit3Supplement.ts` and
// `unit4Supplement.ts`. Units 1, 2, 3 and 4 data are never touched by this
// module.

import type { TrainCar } from "@/lib/sentenceStructure";

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

/* ----------------------------- 5A Reading ------------------------------ */

export const partA5A_translations: Record<number, string> = {
  1: "သယ်ယူပို့ဆောင်ရေး နည်းလမ်းများအနက် ယနေ့ ကျယ်ကျယ်ပြန့်ပြန့် အသုံးပြုနေသော တစ်ခုမှာ __________ ဖြစ်သည်။",
  2: "ပထမဆုံး ရေနွေးငွေ့စက်ခေါင်းကို __________ သယ်ယူရန် အသုံးပြုခဲ့သည်။",
  3: "__________ သည် ၁၈၃၇ ခုနှစ်တွင်သာ ပထမဆုံး လျှပ်စစ်စက်ခေါင်းကို တည်ဆောက်ခဲ့သည်။",
  4: "လူများသည် ဒီဇယ်-လျှပ်စစ် စက်ခေါင်းများကို __________ ၌မှ စတင် အသုံးပြုခဲ့ကြသည်။",
  5: "ကောင်းကင်ရထားစနစ်သည် ကျွန်ုပ်တို့၏ အိမ်နီးချင်းနိုင်ငံ __________ တွင် ၁၉၉၉ ခုနှစ်၌ စတင် ပြေးဆွဲခဲ့သည်။",
};

export const partB5A_translations: Record<number, string> = {
  1: "အမျိုးအစားအားဖြင့် ရထား မည်မျှ တီထွင်ခဲ့သနည်း။ ၎င်းတို့မှာ ဘာတွေလဲ။",
  2: "ပထမဆုံး ရေနွေးငွေ့အင်ဂျင်ကို မည်သူက မည်သည့်အချိန်တွင် တီထွင်ခဲ့သနည်း။",
  3: "၁၈၃၇ ခုနှစ်တွင် တည်ဆောက်ခဲ့သော ပထမဆုံး လျှပ်စစ်ရထားကို မည်သည့်အရာဖြင့် မောင်းနှင်ခဲ့သနည်း။",
  4: "လျှပ်စစ်ရထား၏ အကြီးမားဆုံး အားနည်းချက်မှာ အဘယ်နည်း။",
  5: "ရေနွေးငွေ့အင်ဂျင်ရထားများသည် မည်သည့်အချိန်အထိ အရေးပါနေခဲ့သနည်း။",
};

export const partC5A_translations: Record<number, string> = {
  1: "စာကြောင်း ၃ ရှိ 'its' ဟူသော စကားလုံးသည် မည်သည့်အရာကို ရည်ညွှန်းသနည်း။",
  2: "စာကြောင်း ၁၄ ရှိ 'They' ဟူသော စကားလုံးသည် မည်သည့်အရာကို ရည်ညွှန်းသနည်း။",
  3: "မည်သည့် စက်ခေါင်း အမျိုးအစားကို ယခုအခါ အသုံးပြုခြင်း သို့မဟုတ် တီထွင်ခြင်း မပြုတော့သနည်း။ အဘယ်ကြောင့်နည်း။",
  4: "ကောင်းကင်ရထား (skytrain) ဆိုသည်မှာ အဘယ်နည်း။",
  5: "စာကြောင်း ၄၁ ရှိ 'that' ဟူသော စကားလုံးသည် မည်သည့်အရာကို ရည်ညွှန်းသနည်း။",
  6: "နိုင်ငံများစွာတွင် ကောင်းကင်ရထားများကို အဘယ်ကြောင့် အသုံးပြုကြသနည်း။",
  7: "လက်ရှိတွင် အမြန်ဆုံး ရထားများမှာ ဘာတွေလဲ။ ၎င်းတို့ မည်မျှ မြန်နှုန်းဖြင့် သွားနိုင်သနည်း။",
  8: "ကမ္ဘာပေါ်တွင် ရထားများသည် အဘယ်ကြောင့် အရေးပါသော သယ်ယူပို့ဆောင်ရေးနည်းလမ်း ဖြစ်နေဆဲနည်း။",
  9: "သင်သည် ရထားဖြင့် ခရီးသွားခြင်းကို နှစ်သက်ပါသလား။ အဘယ်ကြောင့်နည်း သို့မဟုတ် အဘယ်ကြောင့် မနှစ်သက်သနည်း။",
  10: "ဝေးလံသော မြို့တစ်မြို့သို့ လေယာဉ် သို့မဟုတ် ရထားဖြင့် သွားနိုင်လျှင် မည်သည့် သယ်ယူပို့ဆောင်ရေးနည်းလမ်းကို ရွေးချယ်မည်နည်း။ အဘယ်ကြောင့်နည်း။",
};

/* ------------- 5A Sentence-structure breakdowns (curated) --------------- */
// Rules for this data:
//  • Grammar tags stay in English; every translation string is pure Burmese.
//  • The real predicate verb is isolated as [Main Verb] / [Linking Verb];
//    prepositions and articles are never separate blocks — they always travel
//    inside their complete phrase.
//  • A leading prepositional phrase is a modifier, never the [Noun Subject].
//  • Translations follow Burmese SOV order, phrase by phrase.

export type SentenceBreakdown = {
  introMy: string;
  noteMy: string;
  cars: TrainCar[];
};

const SV_INTRO5 =
  "ဤဝါကျကို အပိုင်းလိုက် ခွဲကြည့်ပါ — မည်သူ/မည်သည့်အရာ (ကတ္တား) ၊ ဘာလုပ်သည်/ဘာဖြစ်သည် (ကြိယာ) ၊ ဘာကို (ကံ) ဟူ၍ ဖြစ်သည်။";
const SV_NOTE5 =
  "ပုံစံ: ကတ္တား → ကြိယာ → ကံ ။ ဝိဘတ်စကားစုနှင့် အညွှန်းစကားလုံးများကို တစ်လုံးချင်း မခွဲဘဲ စကားစုတစ်ခုလုံးအဖြစ် ဖတ်ပါ။";
const WH_INTRO5 =
  "မေးခွန်းဝါကျဖြစ်သဖြင့် မေးခွန်းစကားလုံးက ရှေ့ဆုံးတွင် ရပ်ပြီး အကူကြိယာက ကတ္တားရှေ့သို့ ရွှေ့သွားသည်။";
const WH_NOTE5 =
  "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → ကြိယာ/ကံ ။ မြန်မာလို ပြန်ဆိုသည့်အခါ ကြိယာကို နောက်ဆုံးတွင် ထားပါ။";

export const partA5A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: SV_INTRO5,
    noteMy: SV_NOTE5,
    cars: [
      {
        word: "Among the different means of transport",
        translation: "မတူညီသော သယ်ယူပို့ဆောင်ရေး နည်းလမ်းများအနက်",
        tag: "Prepositional Phrase",
      },
      { word: "one that is widely used today", translation: "ယနေ့ ကျယ်ကျယ်ပြန့်ပြန့် အသုံးပြုနေသော တစ်ခုမှာ", tag: "Noun Subject" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "________", translation: "__________", tag: "Complement" },
    ],
  },
  2: {
    introMy: SV_INTRO5,
    noteMy: SV_NOTE5,
    cars: [
      { word: "The first steam locomotive", translation: "ပထမဆုံး ရေနွေးငွေ့စက်ခေါင်းကို", tag: "Noun Subject" },
      { word: "was used", translation: "အသုံးပြုခဲ့သည်", tag: "Main Verb" },
      { word: "to carry ________", translation: "__________ သယ်ယူရန်အတွက်", tag: "Infinitive Phrase" },
    ],
  },
  3: {
    introMy: SV_INTRO5,
    noteMy: SV_NOTE5,
    cars: [
      { word: "________", translation: "__________ သည်", tag: "Noun Subject" },
      { word: "built", translation: "တည်ဆောက်ခဲ့သည်", tag: "Main Verb" },
      { word: "the first electric locomotive", translation: "ပထမဆုံး လျှပ်စစ်စက်ခေါင်းကို", tag: "Noun Object" },
      { word: "only in 1837", translation: "၁၈၃၇ ခုနှစ်တွင်မှသာ", tag: "Prepositional Phrase" },
    ],
  },
  4: {
    introMy: SV_INTRO5,
    noteMy: SV_NOTE5,
    cars: [
      { word: "People", translation: "လူများသည်", tag: "Noun Subject" },
      { word: "started using", translation: "စတင် အသုံးပြုခဲ့ကြသည်", tag: "Main Verb" },
      { word: "diesel-electric locomotives", translation: "ဒီဇယ်-လျှပ်စစ် စက်ခေါင်းများကို", tag: "Noun Object" },
      { word: "only in ________", translation: "__________ ၌မှသာ", tag: "Prepositional Phrase" },
    ],
  },
  5: {
    introMy: SV_INTRO5,
    noteMy: SV_NOTE5,
    cars: [
      { word: "The skytrain system", translation: "ကောင်းကင်ရထားစနစ်သည်", tag: "Noun Subject" },
      {
        word: "in ________, our neighbouring country",
        translation: "ကျွန်ုပ်တို့၏ အိမ်နီးချင်းနိုင်ငံ __________ တွင်",
        tag: "Prepositional Phrase",
      },
      { word: "in 1999", translation: "၁၉၉၉ ခုနှစ်၌", tag: "Prepositional Phrase" },
      { word: "started operating", translation: "စတင် ပြေးဆွဲခဲ့သည်", tag: "Main Verb" },
    ],
  },
};

export const partB5A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "How many types of train", translation: "ရထား အမျိုးအစား မည်မျှကို", tag: "Question Phrase" },
      { word: "in general", translation: "ယေဘုယျအားဖြင့်", tag: "Adverb Phrase" },
      { word: "have been invented", translation: "တီထွင်ခဲ့သနည်း", tag: "Main Verb" },
    ],
  },
  2: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "Who", translation: "မည်သူသည်", tag: "Question Word" },
      { word: "developed", translation: "တီထွင်ခဲ့သနည်း", tag: "Main Verb" },
      { word: "the first steam engine", translation: "ပထမဆုံး ရေနွေးငွေ့အင်ဂျင်ကို", tag: "Noun Object" },
      { word: "and when", translation: "ထို့ပြင် မည်သည့်အချိန်တွင်နည်း", tag: "Question Word" },
    ],
  },
  3: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "မည်သည့်အရာဖြင့်", tag: "Question Word" },
      { word: "was", translation: "ဖြစ်သနည်း", tag: "Auxiliary Verb" },
      {
        word: "the first electric train built in 1837",
        translation: "၁၈၃၇ ခုနှစ်တွင် တည်ဆောက်ခဲ့သော ပထမဆုံး လျှပ်စစ်ရထားကို",
        tag: "Noun Subject",
      },
      { word: "powered by", translation: "မောင်းနှင်ခဲ့သနည်း", tag: "Main Verb" },
    ],
  },
  4: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "အဘယ်အရာနည်း", tag: "Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "the greatest disadvantage of an electric train",
        translation: "လျှပ်စစ်ရထားတစ်စင်း၏ အကြီးမားဆုံး အားနည်းချက်မှာ",
        tag: "Noun Subject",
      },
    ],
  },
  5: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "Until when", translation: "မည်သည့်အချိန်အထိ", tag: "Question Phrase" },
      { word: "did", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "steam engine trains", translation: "ရေနွေးငွေ့အင်ဂျင်ရထားများသည်", tag: "Noun Subject" },
      { word: "remain important", translation: "အရေးပါနေခဲ့သနည်း", tag: "Main Verb" },
    ],
  },
};

export const partC5A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "မည်သည့်အရာကို", tag: "Question Word" },
      { word: "does", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "the word 'its' in line 3", translation: "စာကြောင်းရေ ၃ ရှိ 'its' ဟူသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  2: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "မည်သည့်အရာကို", tag: "Question Word" },
      { word: "does", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "the word 'They' in line 14", translation: "စာကြောင်းရေ ၁၄ ရှိ 'They' ဟူသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  3: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What type of locomotive", translation: "မည်သည့် စက်ခေါင်းအမျိုးအစားကို", tag: "Question Phrase" },
      { word: "is not used or developed", translation: "အသုံးမပြု သို့မဟုတ် တီထွင်ခြင်း မပြုတော့သနည်း", tag: "Main Verb" },
      { word: "anymore", translation: "ယခုအခါ", tag: "Adverb" },
      { word: "Why", translation: "အဘယ်ကြောင့်နည်း", tag: "Question Word" },
    ],
  },
  4: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "အဘယ်အရာနည်း", tag: "Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "a skytrain", translation: "ကောင်းကင်ရထားဆိုသည်မှာ", tag: "Noun Subject" },
    ],
  },
  5: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "မည်သည့်အရာကို", tag: "Question Word" },
      { word: "does", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "the word 'that' in line 41", translation: "စာကြောင်းရေ ၄၁ ရှိ 'that' ဟူသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  6: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "Question Word" },
      { word: "are", translation: "သနည်း", tag: "Auxiliary Verb" },
      { word: "skytrains", translation: "ကောင်းကင်ရထားများကို", tag: "Noun Subject" },
      { word: "used", translation: "အသုံးပြုကြသနည်း", tag: "Main Verb" },
      { word: "in many countries", translation: "နိုင်ငံများစွာတွင်", tag: "Prepositional Phrase" },
    ],
  },
  7: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "What", translation: "အဘယ်အရာများနည်း", tag: "Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the fastest trains at present", translation: "လက်ရှိအချိန်တွင် အမြန်ဆုံး ရထားများမှာ", tag: "Noun Subject" },
      { word: "How fast can they travel", translation: "၎င်းတို့သည် မည်မျှ မြန်နှုန်းဖြင့် သွားနိုင်သနည်း", tag: "Question Clause" },
    ],
  },
  8: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "Question Word" },
      { word: "are", translation: "ဖြစ်နေဆဲနည်း", tag: "Linking Verb" },
      { word: "trains", translation: "ရထားများသည်", tag: "Noun Subject" },
      { word: "still an important means of transport", translation: "အရေးပါသော သယ်ယူပို့ဆောင်ရေးနည်းလမ်း", tag: "Complement" },
      { word: "in the world", translation: "ကမ္ဘာပေါ်တွင်", tag: "Prepositional Phrase" },
    ],
  },
  9: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      { word: "Do", translation: "သလား", tag: "Auxiliary Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "like", translation: "နှစ်သက်ပါသလား", tag: "Main Verb" },
      { word: "travelling by train", translation: "ရထားဖြင့် ခရီးသွားခြင်းကို", tag: "Noun Object" },
      { word: "Why or why not", translation: "အဘယ်ကြောင့်နည်း သို့မဟုတ် အဘယ်ကြောင့် မဟုတ်သနည်း", tag: "Question Phrase" },
    ],
  },
  10: {
    introMy: WH_INTRO5,
    noteMy: WH_NOTE5,
    cars: [
      {
        word: "If you could travel to a distant town by plane or train",
        translation: "ဝေးလံသော မြို့တစ်မြို့သို့ လေယာဉ် သို့မဟုတ် ရထားဖြင့် သွားနိုင်ပါက",
        tag: "Conditional Clause",
      },
      { word: "which form of transport", translation: "မည်သည့် သယ်ယူပို့ဆောင်ရေးပုံစံကို", tag: "Noun Object" },
      { word: "will you choose", translation: "သင် ရွေးချယ်မည်နည်း", tag: "Main Verb" },
      { word: "Why", translation: "အဘယ်ကြောင့်နည်း", tag: "Question Word" },
    ],
  },
};

/* ---------------------------- 5B Vocabulary ---------------------------- */

export const partA5B_translations: Record<number, string> = {
  1: "မြို့ပြဒေသများတွင် နေထိုင်သူများအတွက် ကောင်းကင်ရထားသည် အဆင်ပြေဆုံး သယ်ယူပို့ဆောင်ရေးပုံစံ ဖြစ်သည်။",
  2: "ကျောင်းသားများ၏ __________ တိုးတက်မှုကို ဆရာများက ဝမ်းသာစွာ သတိပြုမိကြသည်။",
  3: "အိမ်မဝယ်မီ ယင်း၏ နောင်ဖြစ်လာနိုင်သော __________ ကုန်ကျစရိတ်ကို ထည့်သွင်း စဉ်းစားသင့်သည်။",
  4: "သုတေသီသည် အသစ်တွေ့ရှိသော ငှက်များကို ၎င်းတို့၏ မျိုးစိတ်အလိုက် __________ ရန် ရှိသည်။",
  5: "မြို့ပြင်၌ နေထိုင်သူ ပိုများလာသည်နှင့်အမျှ မြို့လယ်ခေါင်တွင် အလုပ်လုပ်သော __________ ပိုများလာသည်။",
  6: "ကျွန်ုပ်တို့သည် စောစော ထွက်ခဲ့သော်လည်း လမ်းပိတ်ဆို့မှု __________ ကြောင့် အစည်းအဝေးကို နောက်ကျခဲ့သည်။",
  7: "ရထားများ မတီထွင်မီက နိုင်ငံအများစုတွင် မြင်းလှည်းများသည် __________ သယ်ယူပို့ဆောင်ရေးပုံစံ ဖြစ်ခဲ့သည်။",
  8: "ပလတ်စတစ်အိတ်များသည် __________ မဟုတ်ပါ — အများအပြား သုံးခြင်းက ပတ်ဝန်းကျင်ကို ထိခိုက်စေနိုင်သောကြောင့် ဖြစ်သည်။",
  9: "ဥရောပတွင် လူပိုများလာသည် ၎င်း၏ အချိန်ဇယား၏ __________ ကြောင့် Euro Train ဖြင့် ခရီးသွားကြသည်။",
};

export const partB5B_translations: Record<number, string> = {
  6: "အဘိဓာန်များသည် တတ်နိုင်သမျှ __________ ဖြစ်သင့်သည်။",
  7: "ကျွန်ုပ်တို့၏ ထုတ်ကုန်များကို __________ စက္ကူအိတ်များဖြင့် ထုပ်ပိုးထားသည်။",
  8: "ဤဟိုတယ်၏ အဆောက်အဦး အသုံးအဆောင်များသည် __________ ဖြစ်သည်။ ကျွန်ုပ် အသုံးပြုရန် အခက်အခဲ မရှိပါ။",
  9: "ဤကားကို လျှပ်စစ်အင်ဂျင် အသုံးပြုခြင်းဖြင့် __________ ဖြစ်စေရန် ဒီဇိုင်းဆွဲထားသည်။",
  10: "ကလေးများ ပျော်ရွှင်ကျန်းမာစေရန် ကျောင်းများသည် တတ်နိုင်သမျှ __________ ဖြစ်ရမည်။",
};
export const vocab5B: VocabItem[] = [
  {
    word: "categorize",
    pronunciation: "/ˈkætəɡəraɪz/ — ကက်တဂရိုင်ဇ်",
    meaningMy: "အမျိုးအစားခွဲခြားသည် — အမျိုးအစားအလိုက် အုပ်စုဖွဲ့ ခွဲခြမ်းသည်",
    exampleEn: "Trains can be categorized into three: surface trains, underground trains and skytrains.",
  },
  {
    word: "commuter",
    pronunciation: "/kəˈmjuːtə(r)/ — ကောမျူးတာ",
    meaningMy: "ခရီးပေါက်ပြန်သူ — မြို့တွင်းသို့ တစ်နေ့ကို အလုပ်သွားရန် ဝေးလံသော နေရာမှ လာရောက်သူ",
    exampleEn: "Underground trains are cheaper and quicker for commuters.",
  },
  {
    word: "convenient",
    pronunciation: "/kənˈviːniənt/ — ခန်ဗီးနီယင့်",
    meaningMy: "အဆင်ပြေသော — လွယ်ကူစွာ သွားရောက်ရနိုင်သော",
    exampleEn: "Underground trains are more convenient for commuters.",
  },
  {
    word: "congestion",
    pronunciation: "/kənˈdʒestʃən/ — ခန်ဂျက်စချန်",
    meaningMy: "ယာဉ်ကြောပိတ်ဆို့မှု — စည်ကားပြီး ယာဉ်များ ပြည့်နေသည့် အခြေအနေ",
    exampleEn: "The skytrain is an alternative for people to avoid being stuck in congestion.",
  },
  {
    word: "eco-friendly",
    pronunciation: "/ˈiːkəʊ frendli/ — အီကို ဖရန်လီ",
    meaningMy: "ပတ်ဝန်းကျင်နှင့် သဟဇာတဖြစ်သော — သဘာဝပတ်ဝန်းကျင်ကို မထိခိုက်စေသော",
    exampleEn: "Trains are very eco-friendly.",
  },
  {
    word: "flexibility",
    pronunciation: "/ˌfleksəˈbɪləti/ — ဖလက်စဘီလတီ",
    meaningMy: "ပြောင်းလွယ်ပြင်လွယ်မှု — အခြေအနေသစ်များနှင့် လိုက်လျောညီထွေ ပြောင်းလဲနိုင်မှု",
    exampleEn: "Diesel trains offered greater flexibility and performance than steam trains.",
  },
  {
    word: "ideal",
    pronunciation: "/aɪˈdiːəl/ — အိုင်ဒီယယ်",
    meaningMy: "အကောင်းဆုံး၊ အသင့်တော်ဆုံး — ပြီးပြည့်စုံသော",
    exampleEn: "Electric trains are ideal for commuter rail service with frequent stops.",
  },
  {
    word: "maintenance",
    pronunciation: "/ˈmeɪntənəns/ — မိန်းတနန်စ်",
    meaningMy: "ပြုပြင်ထိန်းသိမ်းမှု — ပုံမှန် ပြုပြင်ခြင်းဖြင့် အရာဝတ္ထုကို ကောင်းမွန်စွာ ထားရှိခြင်း",
    exampleEn: "Diesel trains offered substantially lower operating and maintenance costs.",
  },
  {
    word: "retain",
    pronunciation: "/rɪˈteɪn/ — ရီတိန်း",
    meaningMy: "ထိန်းသိမ်းသည် — တစ်ခုခုကို ဆက်လက် ကိုင်ထားသည်",
    exampleEn: "Steam engine trains retained their importance in transportation until about 1896.",
  },
  {
    word: "significant",
    pronunciation: "/sɪɡˈnɪfɪkənt/ — ဆစ်နစ်ဖီကန့်",
    meaningMy: "အရေးပါသော — သက်ရောက်မှု ရှိလောက်အောင် အရေးကြီးသော",
    exampleEn: "The invention of the train is a significant milestone in human history.",
  },
];
/* ------------------------------ 5C Grammar ----------------------------- */

export const partA5C_translations: Record<number, string> = {
  1: "ကလေးဘဝက သူမသည် ဟင်းသီးဟင်းရွက်များကို မကြိုက်ခဲ့ပါ။",
  2: "သူမ စာမေးပွဲ ကျသွားသည်ကို ကျွန်ုပ်တို့ မယုံနိုင်ပါ။ သူမသည် တစ်ခါက ကြိုးစား အလုပ်လုပ်ခဲ့သည်။",
  3: "စုစုသည် သင်္ချာကို မကြိုက်ခဲ့ပါ။ သူမသည် သင်္ချာတွင် အလွန် ညံ့ဖျင်းခဲ့သည်။",
  4: "သင်သည် ကျေးလက်တွင် နေထိုင်စဉ် နွေရာသီ၌ ဘာတွေ ပြုလုပ်လေ့ရှိခဲ့သနည်း။",
  5: "ဇော်ဇော်သည် မုန်လာဥနီကို မစားလေ့ရှိခဲ့သော်လည်း ယခုအခါ စားသည်။",
  6: "သင်သည် ကျောင်းတက်စဉ် တင်းနစ် ကစားလေ့ရှိခဲ့သလား။",
  7: "မြင့်ဇူးသည် ချောကလက် ကြိုက်လေ့ရှိခဲ့သော်လည်း ယခုအခါ မကြိုက်တော့ပါ။",
  8: "ငယ်စဉ်က ကျွန်ုပ်တို့သည် တိုက်ခန်းတွင် နေထိုင်လေ့ရှိခဲ့သည်။",
  9: "ကျွန်ုပ်၏ အဒေါ်သည် စပိန်ဘာသာ ပြောလေ့ရှိခဲ့သော်လည်း အားလုံး မေ့သွားခဲ့ပြီ။",
  10: "ငယ်စဉ်က နွေရာသီတိုင်း ကမ်းခြေသို့ သွားလေ့ရှိခဲ့ကြသလား။",
};

export const partB5C_translations: Record<number, string> = {
  1: "ကျွန်ုပ် မဆာပါ။ နေ့လယ်စာ စားပြီးသွားပြီ။",
  2: "ညီညီသည် ပဲခူးသို့ မသွားချင်ပါ။ ထိုနေရာကို နှစ်ကြိမ် သွားဖူးပြီးသားမို့ ဖြစ်သည်။",
  3: "စိုးစိုးသည် ဂျပန်စကားကို နှစ်နှစ် သင်ယူနေပြီ ဖြစ်သော်လည်း ကျွမ်းကျင်အောင် မတတ်မြောက်သေးပါ။",
  4: "ကလေးများ မည်မျှကြာကြာ အိပ်ပျော်နေပြီနည်း။",
  5: "ဤအချိန်အထိ ဒါဒါထံမှ မည်သည့်သတင်းစကားမျှ ကျွန်ုပ်တို့ မရရှိရသေးပါ။",
  6: "ကျွန်ုပ်တို့သည် ဤကားဂိုဒေါင်ကို ကိုယ်တိုင် ဆောက်လုပ်နေပြီး နှစ်ရက်အတွင်း ပြီးစီးရန် မျှော်လင့်နေသည်။",
  7: "မြန်မြန်လုပ်ပါ! သင့် ကျောင်းကားကား ရောက်လာပြီ။",
  8: "တစ်စုံတစ်ယောက်သည် ကျွန်ုပ်၏ ထီးကို မှားယွင်း ယူသွားသည်ဟု ထင်မိသည်။",
  9: "ကိုလေးသည် သူ၏ အခန်းကို ဆေးသုတ်နေပြီး ပြီးစီးသောအခါ လှပလိမ့်မည်။",
  10: "ကျွန်ုပ် အကြိုက်ဆုံး သရုပ်ဆောင်သည် ယခုအချိန်အထိ အကယ်ဒမီဆုကို မရသေးပါ။",
};

export const grammar5C = {
  whatMy:
    "\"Used to\" ကို အတိတ်က ပုံမှန် ပြုလုပ်လေ့ရှိသော အလေ့အထများနှင့် အတိတ်က ရှိခဲ့ပြီး ယခု မရှိတော့သော အခြေအနေများကို ဖော်ပြရန် အသုံးပြုပါသည်။ အနှုတ်ပုံစံတွင် 'didn't use to' ဖြင့်လည်းကောင်း၊ မေးခွန်းပုံစံတွင် 'Did ... use to ...?' ဖြင့်လည်းကောင်း ဖွဲ့ပါသည်။",
  whenMy:
    "အတိတ်က လုပ်လေ့ရှိသော်လည်း ယခုအခါ မလုပ်တော့သော အလေ့အထများ၊ သို့မဟုတ် အတိတ်က မှန်ခဲ့သော်လည်း ယခု မမှန်တော့သော အခြေအနေများကို ဖော်ပြသည့်အခါ အသုံးပြုပါသည်။ များသောအားဖြင့် 'when I was a child', 'when we lived in the countryside' ကဲ့သို့ အတိတ်ကာလကို ဖော်ပြသော အချိန်စာကြောင်းများနှင့် တွဲဖက်၍ သုံးပါသည်။",
  whyMy:
    "သာမန် အတိတ်ကာလနှင့် ကွာခြားချက်မှာ 'used to' သည် အလေ့အထ ဆက်တိုက် ဖြစ်ပျက်ခဲ့မှုကို အလေးပေးပြီး ထိုအလေ့အထ သို့မဟုတ် အခြေအနေသည် ယခုအခါ ပြောင်းလဲသွားပြီဖြစ်ကြောင်း သွယ်ဝိုက် ဖော်ပြပေးပါသည်။",
  examples: [
    { en: "She didn't use to like vegetables when she was a child.", phrase: "didn't use to like" },
    { en: "Did you use to play tennis when you were at school?", phrase: "Did you use to play" },
    { en: "Zaw Zaw didn't use to eat carrots, but now he does.", phrase: "didn't use to eat" },
  ],
};

export const tense5C = {
  whatMy:
    "Present Perfect (ပြီးခဲ့သော ဆက်လက်ကာလ) ကို have/has + ကြိယာ၏ ပြီးပြည့်စုံပုံ (past participle) ဖြင့် ဖွဲ့သည်။ Present Perfect Continuous (ပြီးခဲ့သော ဆက်လက်ဖြစ်ပျက်နေသော ကာလ) ကို have/has been + ကြိယာ + -ing ဖြင့် ဖွဲ့ပါသည်။",
  whenMy:
    "Present Perfect ကို အနီးကပ် အတိတ်တွင် ပြီးဆုံးခဲ့ပြီး ယခုအချိန်နှင့် ဆက်စပ်နေသော အမှုကိစ္စများနှင့် 'already, yet, just, ever, never, so far' စသည့် ကြိယာဝိသေသနများ ပါဝင်သော အမှုကိစ္စများအတွက် သုံးပါသည်။ Present Perfect Continuous ကို အတိတ်က စတင်ပြီး ယခုတိုင် ဆက်လက် ဖြစ်ပျက်နေသော (သို့) လတ်တလော ဖြစ်ပျက်နေဆဲ အမှုကိစ္စများကို 'for, since' တို့နှင့် တွဲဖက်၍ ဖော်ပြရန် သုံးပါသည်။",
  whyMy:
    "အချိန်ကာလကို အာရုံစိုက်သည့်အခါ (for two years, since Monday) Present Perfect Continuous ကို သုံးပြီး အမှု၏ ပြီးမြောက်မှုနှင့် ရလဒ်ကို အာရုံစိုက်သည့်အခါ Present Perfect ကို သုံးပါသည်။ 'I have painted the wall' သည် အလုပ် ပြီးပြီဖြစ်ကြောင်း ဖော်ပြပြီး 'I have been painting the wall' သည် အလုပ် ဆက်လက် လုပ်နေဆဲဖြစ်ကြောင်း ဖော်ပြပါသည်။",
  examples: [
    { en: "I'm not hungry. I have had my lunch already.", phrase: "have had" },
    { en: "Soe Soe has been learning Japanese for two years, but she has not mastered it yet.", phrase: "has been learning" },
    { en: "Ko Lay has been painting his room, and it will look beautiful when he has finished.", phrase: "has been painting" },
  ],
};