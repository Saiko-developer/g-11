// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 4 sections 4A / 4B / 4C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts` and `unit3Supplement.ts`.
// Unit 1, 2 and 3 data are never touched by this module.

import type { TrainCar } from "@/lib/sentenceStructure";

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

/* ----------------------------- 4A Reading ------------------------------ */

export const partA4A_translations: Record<number, string> = {
  1: "စာကြောင်း ၁ တွင် 'of or from a long time ago (ရှေးကျသော)' ဟု အဓိပ္ပာယ်ရသော စကားလုံးတစ်လုံးမှာ __________ ဖြစ်သည်။",
  2: "ကျောက်ခေတ်ဦး (early Stone Age) ၏ အခြားအမည်မှာ __________ ဖြစ်သည်။",
  3: "__________ ပန်းချီသည် ရေ၊ ကြက်ဥအနှစ်နှင့် ကော်တို့ဖြင့် ရောစပ်ထားသော အရောင်ခြယ်ပစ္စည်းများမှ ပြုလုပ်ထားသော အရောင်များကို အသုံးပြုသည်။",
  4: "နံရံ၏ ခြောက်သွေ့သော အင်္ဂတေသားပေါ်တွင် ရေးဆွဲသော ပန်းချီများမှာ __________ ဖြစ်သည်။",
  5: "စာကြောင်း ၁၈ ရှိ 'do' ဟူသော စကားလုံးသည် __________ ကို ရည်ညွှန်းသည်။",
  6: "စေတီပုထိုးများအနီးရှိ အဆောက်အအုံများပေါ်တွင် __________ နိုင်သော ပန်းချီအများစုမှာ mural ပန်းချီများ ဖြစ်သည်။",
  7: "__________ သည် ဂျီသြမေတြီ ပုံသဏ္ဍာန်များကို အသုံးပြုသည်။",
  8: "စာကြောင်း ၂၉ ရှိ 'these two styles' ဟူသော စကားစုသည် __________ ကို ရည်ညွှန်းသည်။",
  9: "Graffiti အနုပညာရှင်များသည် နံရံ သို့မဟုတ် အခြားမျက်နှာပြင်များပေါ်တွင် __________ သို့မဟုတ် ရေးဆွဲကြသည်။",
  10: "ယနေ့ ကမ္ဘာတစ်ဝှမ်း အများပြည်သူ မြင်တွေ့နိုင်သော နေရာများတွင် graffiti အနုပညာကို __________ နိုင်သည်။",
};

export const partB4A_translations: Record<number, string> = {
  1: "ပထမဆုံး ပန်းချီများကို မည်သည့်နေရာတွင် တွေ့ရှိခဲ့သနည်း။",
  2: "ကျောက်ခေတ်ဦးက လူများ၏ ကိရိယာများနှင့် လက်နက်များကို မည်သည့်အရာဖြင့် ပြုလုပ်ခဲ့သနည်း။",
  3: "ပန်းချီဆရာ အများစုသည် အဘယ်အတွက် ပန်းချီ ရေးဆွဲကြသနည်း။",
  4: "စေတီပုထိုးများအနီးရှိ အဆောက်အအုံများပေါ်ရှိ mural ပန်းချီအများစုသည် အဘယ်အရာကို သရုပ်ဖော်သနည်း။",
  5: "cubism ရှိ ဂျီသြမေတြီ ပုံသဏ္ဍာန်များကို မည်သို့ ရေးဆွဲသနည်း။",
  6: "graffiti သည် မည်သည့် အနုပညာ ဖော်ပြမှု အမျိုးအစား ဖြစ်သနည်း။",
  7: "graffiti ကို မည်သည့်နေရာများတွင် မြင်တွေ့နိုင်သနည်း။",
  8: "သဘာဝတရား၏ အလှကို ဖမ်းယူထားသော ပန်းချီများ သို့မဟုတ် ပုံတူပန်းချီများကို သင်နှစ်သက်ပါသလား။ အဘယ်ကြောင့်နည်း။",
  9: "Graffiti အနုပညာရှင်များကို အများပြည်သူ မြင်တွေ့နိုင်သော နံရံများ သို့မဟုတ် မျက်နှာပြင်များပေါ်တွင် ရေးသားခွင့် သို့မဟုတ် ရေးဆွဲခွင့် ပြုသင့်ပါသလား။ အဘယ်ကြောင့်နည်း။",
};

export const partC4A_translations: Record<number, string> = {
  1: "ရေဆေးပန်းချီ — စက္ကူပေါ်တွင် ရေးဆွဲသည် — ရေနှင့် ရောစပ်ထားသော အရောင်ခြယ်ပစ္စည်းများ",
  2: "ဆီဆေးပန်းချီ — ကင်းဗတ်စ်ပေါ်တွင် ရေးဆွဲသည် — ဆီဆေးများ",
  3: "Tempera ပန်းချီ — များသောအားဖြင့် အခြောက်နံရံများပေါ်တွင် ရေးဆွဲသည် — ရေ၊ ကြက်ဥအနှစ်နှင့် ကော်တို့ဖြင့် ရောစပ်ထားသော အရောင်များ",
  4: "Mural ပန်းချီ — နံရံ၏ ခြောက်သွေ့သော အင်္ဂတေသားပေါ်တွင် ရေးဆွဲသည် — ရေဆေး",
  5: "Fresco ပန်းချီ — နံရံ၏ စိုစွတ်သော အင်္ဂတေသားပေါ်တွင် ရေးဆွဲသည် — စိုစွတ်သော အင်္ဂတေသားပေါ်သို့ လျင်မြန်စွာ သုတ်လိမ်းသော ရေဆေး",
};

/* ------------- 4A Sentence-structure breakdowns (curated) --------------- */
// Rules for this data:
//  • Grammar tags stay in English; every translation string is pure Burmese.
//  • The real predicate verb is isolated as [Main Verb]; prepositions are
//    never a verb — they travel with their whole phrase.
//  • Translations follow Burmese SOV order, phrase by phrase.

export type SentenceBreakdown = {
  introMy: string;
  noteMy: string;
  cars: TrainCar[];
};

const SV_INTRO4 =
  "ဤဝါကျကို အပိုင်းလိုက် ခွဲကြည့်ပါ — မည်သူ/မည်သည့်အရာ (ကတ္တား) ၊ ဘာလုပ်သည်/ဘာဖြစ်သည် (ကြိယာ) ၊ ဘာကို (ကံ) ဟူ၍ ဖြစ်သည်။";
const SV_NOTE4 =
  "ပုံစံ: ကတ္တား → ကြိယာ → ကံ ။ ဝိဘတ်စကားစုများကို တစ်လုံးချင်း မဖတ်ဘဲ စကားစုတစ်ခုလုံးအဖြစ် ဖတ်ပါ။";
const WH_INTRO4 =
  "မေးခွန်းဝါကျဖြစ်သဖြင့် မေးခွန်းစကားလုံးက ရှေ့ဆုံးတွင် ရပ်ပြီး အကူကြိယာက ကတ္တားရှေ့သို့ ရွှေ့သွားသည်။";
const WH_NOTE4 =
  "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → ကြိယာ/ကံ ။ မြန်မာလို ပြန်ဆိုသည့်အခါ ကြိယာကို နောက်ဆုံးတွင် ထားပါ။";

export const partA4A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "One word", translation: "စကားလုံးတစ်လုံးသည်", tag: "Noun Subject" },
      { word: "in line 1", translation: "စာကြောင်းရေ ၁ တွင် ပါရှိသော", tag: "Prepositional Phrase" },
      {
        word: "which means 'of or from a long time ago'",
        translation: "ရှေးကျသော ခေတ်ကာလမှ ဟု အဓိပ္ပာယ်ရသည့်",
        tag: "Relative Clause",
      },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "______", translation: "__________", tag: "Complement" },
    ],
  },
  2: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "Another name", translation: "နောက်ထပ် အမည်တစ်ခုသည်", tag: "Noun Subject" },
      { word: "for the early Stone Age", translation: "ကျောက်ခေတ်ဦးအတွက်", tag: "Prepositional Phrase" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "______", translation: "__________", tag: "Complement" },
    ],
  },
  3: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "______ painting", translation: "__________ ပန်းချီသည်", tag: "Noun Subject" },
      { word: "uses", translation: "အသုံးပြုသည်", tag: "Main Verb" },
      { word: "colours", translation: "အရောင်များကို", tag: "Noun Object" },
      {
        word: "made from pigments with water, egg yolk and glue",
        translation: "ရေ၊ ကြက်ဥအနှစ်နှင့် ကော်တို့ဖြင့် ရောစပ်ထားသော အရောင်ခြယ်ပစ္စည်းများမှ ပြုလုပ်ထားသော",
        tag: "Adjective Phrase",
      },
    ],
  },
  4: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "Paintings", translation: "ပန်းချီများသည်", tag: "Noun Subject" },
      {
        word: "on the dry plaster of walls",
        translation: "နံရံများ၏ ခြောက်သွေ့သော အင်္ဂတေသားပေါ်တွင် ရေးဆွဲထားသော",
        tag: "Prepositional Phrase",
      },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "______", translation: "__________", tag: "Complement" },
    ],
  },
  5: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "The word 'do'", translation: "ကိုးကားထားသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "in line 18", translation: "စာကြောင်းရေ ၁၈ တွင် ပါရှိသော", tag: "Prepositional Phrase" },
      { word: "refers to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
      { word: "______", translation: "__________ ကို", tag: "Noun Object" },
    ],
  },
  6: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "Most paintings", translation: "ပန်းချီအများစုသည်", tag: "Noun Subject" },
      {
        word: "that can be ______ on the structures around pagodas",
        translation: "စေတီပုထိုးများ ပတ်ဝန်းကျင်ရှိ အဆောက်အအုံများပေါ်တွင် __________ နိုင်သော",
        tag: "Relative Clause",
      },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "murals", translation: "နံရံဆေးရေး ပန်းချီများ", tag: "Complement" },
    ],
  },
  7: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "______", translation: "__________ သည်", tag: "Noun Subject" },
      { word: "uses", translation: "အသုံးပြုသည်", tag: "Main Verb" },
      {
        word: "geometric forms and shapes",
        translation: "ဂျီသြမေတြီ ပုံစံများနှင့် ပုံသဏ္ဍာန်များကို",
        tag: "Noun Object",
      },
    ],
  },
  8: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "The phrase 'these two styles'", translation: "ကိုးကားထားသော စကားစုသည်", tag: "Noun Subject" },
      { word: "in line 29", translation: "စာကြောင်းရေ ၂၉ တွင် ပါရှိသော", tag: "Prepositional Phrase" },
      { word: "refers to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
      { word: "______", translation: "__________ ကို", tag: "Noun Object" },
    ],
  },
  9: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "Graffiti artists", translation: "နံရံဆေးခြယ် အနုပညာရှင်များသည်", tag: "Noun Subject" },
      { word: "______ or draw", translation: "__________ သို့မဟုတ် ရေးဆွဲကြသည်", tag: "Main Verb" },
      {
        word: "on walls or other surfaces",
        translation: "နံရံများ သို့မဟုတ် အခြားမျက်နှာပြင်များပေါ်တွင်",
        tag: "Prepositional Phrase",
      },
    ],
  },
  10: {
    introMy: SV_INTRO4,
    noteMy: SV_NOTE4,
    cars: [
      { word: "We", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "can", translation: "—", tag: "Helping Verb" },
      { word: "______", translation: "__________ နိုင်သည်", tag: "Main Verb" },
      { word: "graffiti art", translation: "နံရံဆေးခြယ် အနုပညာကို", tag: "Noun Object" },
      {
        word: "within public view",
        translation: "အများပြည်သူ မြင်တွေ့နိုင်သည့် နေရာများတွင်",
        tag: "Prepositional Phrase",
      },
      { word: "all over the world today", translation: "ယနေ့ ကမ္ဘာတစ်ဝှမ်းလုံး၌", tag: "Adverb" },
    ],
  },
};

export const partB4A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "Where", translation: "မည်သည့်နေရာတွင်", tag: "WH-Question Word" },
      { word: "were", translation: "—", tag: "Helping Verb" },
      { word: "the first paintings", translation: "ပထမဆုံး ပန်းချီများကို", tag: "Noun Subject" },
      { word: "found", translation: "တွေ့ရှိခဲ့သနည်း", tag: "Main Verb" },
    ],
  },
  2: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "What", translation: "မည်သည့်အရာဖြင့်", tag: "WH-Question Word" },
      { word: "were", translation: "—", tag: "Helping Verb" },
      {
        word: "the tools and weapons of people in the early Stone Age",
        translation: "ကျောက်ခေတ်ဦးက လူတို့၏ ကိရိယာများနှင့် လက်နက်များကို",
        tag: "Noun Subject",
      },
      { word: "made of", translation: "ပြုလုပ်ခဲ့သနည်း", tag: "Main Verb" },
    ],
  },
  3: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "What", translation: "အဘယ်အတွက်", tag: "WH-Question Word" },
      { word: "do", translation: "—", tag: "Helping Verb" },
      { word: "most painters", translation: "ပန်းချီဆရာ အများစုသည်", tag: "Noun Subject" },
      { word: "paint for", translation: "ပန်းချီ ရေးဆွဲကြသနည်း", tag: "Main Verb" },
    ],
  },
  4: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "do", translation: "—", tag: "Helping Verb" },
      {
        word: "most mural paintings",
        translation: "နံရံဆေးရေး ပန်းချီအများစုသည်",
        tag: "Noun Subject",
      },
      {
        word: "on the structures around pagodas",
        translation: "စေတီပုထိုးများ ပတ်ဝန်းကျင်ရှိ အဆောက်အအုံများပေါ်တွင်",
        tag: "Prepositional Phrase",
      },
      { word: "depict", translation: "သရုပ်ဖော်သနည်း", tag: "Main Verb" },
    ],
  },
  5: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "How", translation: "မည်သို့", tag: "WH-Question Word" },
      { word: "are", translation: "—", tag: "Helping Verb" },
      {
        word: "geometric forms and shapes",
        translation: "ဂျီသြမေတြီ ပုံစံများနှင့် ပုံသဏ္ဍာန်များကို",
        tag: "Noun Subject",
      },
      { word: "in cubism", translation: "ကုဗဝါဒ ပန်းချီတွင်", tag: "Prepositional Phrase" },
      { word: "painted", translation: "ရေးဆွဲသနည်း", tag: "Main Verb" },
    ],
  },
  6: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      {
        word: "What kind of artistic expression",
        translation: "မည်သည့် အနုပညာ ဖော်ပြမှု အမျိုးအစား",
        tag: "WH-Question Word",
      },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "graffiti", translation: "နံရံဆေးခြယ် အနုပညာသည်", tag: "Noun Subject" },
    ],
  },
  7: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "Where", translation: "မည်သည့်နေရာများတွင်", tag: "WH-Question Word" },
      { word: "can", translation: "—", tag: "Helping Verb" },
      { word: "graffiti", translation: "နံရံဆေးခြယ် အနုပညာကို", tag: "Noun Subject" },
      { word: "be seen", translation: "မြင်တွေ့နိုင်သနည်း", tag: "Main Verb" },
    ],
  },
  8: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "Do", translation: "—", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "like", translation: "နှစ်သက်ပါသလား", tag: "Main Verb" },
      { word: "paintings", translation: "ပန်းချီများကို", tag: "Noun Object" },
      {
        word: "that capture the beauty of nature",
        translation: "သဘာဝတရား၏ အလှကို ဖမ်းယူထားသော",
        tag: "Relative Clause",
      },
      { word: "or portraits", translation: "သို့မဟုတ် ပုံတူပန်းချီများကို", tag: "Noun Object" },
      { word: "Why", translation: "အဘယ်ကြောင့်နည်း", tag: "WH-Question Word" },
    ],
  },
  9: {
    introMy: WH_INTRO4,
    noteMy: WH_NOTE4,
    cars: [
      { word: "Should", translation: "—", tag: "Helping Verb" },
      { word: "graffiti artists", translation: "နံရံဆေးခြယ် အနုပညာရှင်များအား", tag: "Noun Subject" },
      { word: "be allowed", translation: "ခွင့်ပြုသင့်ပါသလား", tag: "Main Verb" },
      { word: "to write or draw", translation: "ရေးသားရန် သို့မဟုတ် ရေးဆွဲရန်", tag: "Purpose Clause" },
      {
        word: "on walls or surfaces within public view",
        translation: "အများပြည်သူ မြင်တွေ့နိုင်သော နံရံများ သို့မဟုတ် မျက်နှာပြင်များပေါ်တွင်",
        tag: "Prepositional Phrase",
      },
      {
        word: "Why or why not",
        translation: "အဘယ်ကြောင့်နည်း၊ သို့မဟုတ် အဘယ်ကြောင့် မဟုတ်သနည်း",
        tag: "WH-Question Word",
      },
    ],
  },
};

/* ---------------------------- 4B Vocabulary ---------------------------- */


export const partA4B_translations: Record<number, string> = {
  1: "ဤပန်းချီသည် ပျော်ရွှင်မှု ခံစားချက်တစ်ခုကို __________ သည်။ / အဆိုပါ ပန်းချီသည် Cinderella ကို ပန်းရောင် ၀တ်စုံဖြင့် __________ သည်။",
  2: "လက်သမားဆရာများသည် လွှ၊ တူနှင့် စို့ စသည့် __________ အမျိုးမျိုး လိုအပ်ကြသည်။ / __________ များကို တိုက်ခိုက်ရန် သို့မဟုတ် တိုက်ခိုက်ခံရသည့်အခါ မိမိကိုယ်ကို ကာကွယ်ရန် အသုံးပြုကြသည်။",
  3: "__________ ကို ဆေးသုတ်၊ မှင်နှင့် ပလတ်စတစ်တို့အား အရောင်ပေးရန် အသုံးပြုသည်။ / သူမသည် အသုပ်အတွက် ခရမ်းချဉ်သီးနှင့် အဝါရောင် ငရုတ်ပွတို့ကို __________ အတွက် အသုံးပြုခဲ့သည်။",
  4: "ကျွန်ုပ်၏ ကားရှေ့မီးသည် ထူထဲသော မြူခိုးကို __________ နိုင်ခြင်း မရှိခဲ့ပါ။ / နှင်းဆီနှင့် တူလစ် စသည့် ပန်းများ၏ ပွင့်ချပ်များသည် __________ ကြသည်။",
  5: "ကျွန်ုပ်တို့သည် ဂူပန်းချီများ ရှိ၊ မရှိ ကြည့်ရှုရန် ပင်းတယဂူသို့ သွားရောက်ခဲ့ကြသည်။ / သူမသည် ယဉ်ကျေးမှု တက္ကသိုလ်တွင် ပန်းပုပညာ၏ __________ ကို လေ့လာခဲ့သည်။",
};

export const partB4B_translations: Record<number, string> = {
  1: "bi- + cycle → bicycle (စက်ဘီး — နှစ်ဘီးယာဉ်)",
  2: "co- + founder → co-founder (တွဲဖက် တည်ထောင်သူ)",
  3: "dis- + advantage → disadvantage (အားနည်းချက် — အဆင်မပြေမှု)",
  4: "fore- + head → forehead (နဖူး)",
  5: "non- + profit → non-profit (အကျိုးအမြတ် မယူသော)",
  6: "over- + weight → overweight (ကိုယ်အလေးချိန် ပိုနေခြင်း)",
  7: "pre- + test → pre-test (ကြိုတင် စစ်ဆေးမှု)",
  8: "semi- + circle → semicircle (တစ်ဝက် စက်ဝိုင်း)",
  9: "co- + teach → co-teach (အတူတကွ သင်ကြားသည်)",
  10: "de- + compose → decompose (ဆွေးမြေ့သည် — ပြိုကွဲသည်)",
  11: "dis- + appear → disappear (ပျောက်ကွယ်သည်)",
  12: "mal- + practise → malpractise (မသမာမှု ကျင့်သုံးသည်)",
  13: "mis- + pronounce → mispronounce (အသံထွက် မှားသည်)",
  14: "over- + eat → overeat (အလွန်အကျွံ စားသည်)",
  15: "re- + arrange → rearrange (ပြန်လည် စီစဉ်သည်)",
  16: "pre- + pack → prepack (ကြိုတင် ထုပ်ပိုးသည်)",
};

export const partC4B_translations: Record<number, string> = {
  1: "bi- + annual → biannual (တစ်နှစ်လျှင် နှစ်ကြိမ် ဖြစ်သော)",
  2: "dis- + honest → dishonest (မရိုးမသာ)",
  3: "il- + literate → illiterate (စာမတတ်သော)",
  4: "im- + possible → impossible (မဖြစ်နိုင်သော)",
  5: "in- + appropriate → inappropriate (မသင့်လျော်သော)",
  6: "ir- + regular → irregular (မမှန်သော)",
  7: "over- + confident → overconfident (အလွန်အကျွံ ယုံကြည်တတ်သော)",
  8: "un- + usual → unusual (ပုံမှန် မဟုတ်သော — ထူးဆန်းသော)",
};

export const partD4B_translations: Record<number, string> = {
  1: "တစ်ချိန်က နိုင်ငံများစွာတွင် ကျေးလက်နေပြည်သူ အများစုသည် __________ ဖြစ်ကြသည်။ (literate)",
  2: "လက်ရှိတွင် သူမသည် __________ အဖွဲ့အစည်းတစ်ခုတွင် အလုပ်လုပ်နေသည်။ (profit)",
  3: "ကျွန်ုပ်၏ နာမည်ကို လူများက အမြဲ __________ ကြသည်။ အသံထွက်ရန် အတော် ခက်ခဲသည်။ (pronounce)",
  4: "ပါတီ ၀တ်စုံသည် တရားဝင် အခါသမယများအတွက် __________ ဖြစ်သည်။ (appropriate)",
  5: "ဆန္ဒရှိသော နှလုံးသားအတွက် မည်သည့်အရာမျှ __________ မဟုတ်ပါ။ (possible)",
  6: "မြို့တွင်း နေထိုင်ခြင်း၏ __________ တစ်ခုမှာ ကလေးများ ကစားရန် လုံခြုံသော နေရာများ မရှိခြင်း ဖြစ်သည်။ (advantage)",
  7: "ထွန်းသူသည် စောစော အိပ်ရာဝင်ခြင်းသည် __________ ဖြစ်သည်။ သူသည် များသောအားဖြင့် သန်းခေါင်ယံအထိ နိုးနေလေ့ရှိသည်။ (usual)",
  8: "သဒ္ဒါကျသော ဝါကျများ ဖြစ်စေရန် ပေးထားသော စကားလုံးများကို __________ ပါ။ (arrange)",
  9: "ဆရာဝန်၏ အဆိုအရ ကျွန်ုပ်သည် ၄ ကီလိုဂရမ် __________ နေသည်။ (weight)",
  10: "ကိုယ်တိုင်ကတော့ သူ့ကို ယုံကြည်သော်လည်း လူအများက သူသည် __________ ဟု ထင်မြင်ကြသည်။ (honest)",
};

export const vocab4B: VocabItem[] = [
  {
    word: "painting",
    pronunciation: "/ˈpeɪntɪŋ/ — ပိန်တင်း",
    meaningMy: "ပန်းချီ — အရောင်များဖြင့် ရေးဆွဲသော အနုပညာ",
    exampleEn: "Painting, the art of drawing in colours, is a very ancient skill.",
  },
  {
    word: "pigment",
    pronunciation: "/ˈpɪɡmənt/ — ပစ်မန့်",
    meaningMy: "အရောင်ခြယ်ပစ္စည်း — ဆေးသုတ်၊ မှင်နှင့် ပလတ်စတစ်တို့အား အရောင်ပေးသော ပစ္စည်း",
    exampleEn: "A pigment is used to give colour to paint, ink and plastic.",
  },
  {
    word: "water-colour painting",
    pronunciation: "/ˈwɔːtə kʌlə ˈpeɪntɪŋ/ — ဝေါတာ ကလာ ပိန်တင်း",
    meaningMy: "ရေဆေးပန်းချီ — ရေနှင့်သာ ရောစပ်ထားသော အရောင်များဖြင့် စက္ကူပေါ်တွင် ရေးဆွဲသော ပန်းချီ",
    exampleEn: "Water-colour painting is done on paper, using colours made from pigments mixed with water only.",
  },
  {
    word: "oil painting",
    pronunciation: "/ˈɔɪl peɪntɪŋ/ — အွိုင်း ပိန်တင်း",
    meaningMy: "ဆီဆေးပန်းချီ — ဆီဆေးများဖြင့် ကင်းဗတ်စ်ပေါ်တွင် ရေးဆွဲသော ပန်းချီ",
    exampleEn: "Oil painting is done on canvas, using oil colours.",
  },
  {
    word: "tempera painting",
    pronunciation: "/ˈtempərə peɪntɪŋ/ — တမ်ပရာ ပိန်တင်း",
    meaningMy: "Tempera ပန်းချီ — ရေ၊ ကြက်ဥအနှစ်နှင့် ကော်တို့ဖြင့် ရောစပ်ထားသော အရောင်များဖြင့် နံရံပေါ်တွင် ရေးဆွဲသော ပန်းချီ",
    exampleEn: "Tempera painting is done usually on dry walls.",
  },
  {
    word: "mural",
    pronunciation: "/ˈmjʊərəl/ — မျူရယ်",
    meaningMy: "နံရံဆေးရေး ပန်းချီ — နံရံ၏ ခြောက်သွေ့သော အင်္ဂတေသားပေါ်တွင် ရေဆေးဖြင့် ရေးဆွဲသော ပန်းချီ",
    exampleEn: "Paintings on the structures around pagodas are mostly murals.",
  },
  {
    word: "fresco",
    pronunciation: "/ˈfreskəʊ/ — ဖရက်စကို",
    meaningMy: "Fresco ပန်းချီ — နံရံ၏ စိုစွတ်သော အင်္ဂတေသားပေါ်တွင် ရေဆေးကို လျင်မြန်စွာ သုတ်လိမ်း၍ ရေးဆွဲသော ပန်းချီ",
    exampleEn: "Fresco painting is done by rapidly brushing water colour onto the wet plaster of a wall.",
  },
  {
    word: "portrait",
    pronunciation: "/ˈpɔːtreɪt/ — ပေါ်ထရိတ်",
    meaningMy: "ပုံတူပန်းချီ — လူတစ်ဦး၏ မျက်နှာကို ရေးဆွဲထားသော ပန်းချီ",
    exampleEn: "Some artists like to do portraits.",
  },
  {
    word: "graffiti",
    pronunciation: "/ɡrəˈfiːti/ — ဂရဖီတီ",
    meaningMy: "Graffiti — ခွင့်ပြုချက်မရဘဲ အများပြည်သူ မြင်တွေ့နိုင်သော နေရာများတွင် နံရံ သို့မဟုတ် အခြားမျက်နှာပြင်ပေါ်၌ ရေးသားခြင်း သို့မဟုတ် ရေးဆွဲခြင်း",
    exampleEn: "In Taiwan, there are graffiti zones where artists can paint on walls.",
  },
  {
    word: "abstract expressionism",
    pronunciation: "/ˈæbstrækt ɪkˈspreʃənɪzəm/ — အဲ့ဘ်စထရက် အိတ်စပရက်ရှန်နစ်ဇမ်",
    meaningMy: "Abstract expressionism — မှတ်မိနိုင်သော ရုပ်ပုံများ မပါဝင်သော ပန်းချီပုံစံ",
    exampleEn: "Abstract expressionism originated in New York in the 1940s.",
  },
  {
    word: "cubism",
    pronunciation: "/ˈkjuːbɪzəm/ — ကျူးဘစ်ဇမ်",
    meaningMy: "Cubism — ဂျီသြမေတြီ ပုံသဏ္ဍာန်များကို အသုံးပြုသော ခေတ်သစ် ပန်းချီပုံစံ",
    exampleEn: "Cubism was invented by the Spanish artist Pablo Picasso.",
  },
  {
    word: "canvas",
    pronunciation: "/ˈkænvəs/ — ကန်းဗတ်စ်",
    meaningMy: "ကင်းဗတ်စ် — ဆီဆေးပန်းချီ ရေးဆွဲသည့် ထူထဲကြမ်းတမ်းသော အဝတ်",
    exampleEn: "Oil painting is done on canvas.",
  },
  {
    word: "plaster",
    pronunciation: "/ˈplɑːstə(r)/ — ပလာစတာ",
    meaningMy: "အင်္ဂတေသား — နံရံကို လိမ်းကျံထားသော အရောအနှော",
    exampleEn: "Mural painting is done by brushing water colour onto the dry plaster of a wall.",
  },
  {
    word: "conventional",
    pronunciation: "/kənˈvenʃənl/ — ခန်ဗင်းရှင်းနယ်",
    meaningMy: "သမားရိုးကျ — ထုံးစံအတိုင်း လိုက်နာသော",
    exampleEn: "Abstract expressionism and cubism do not follow the conventional style of painting.",
  },
  {
    word: "convey",
    pronunciation: "/kənˈveɪ/ — ခန်ဗေး",
    meaningMy: "ဖော်ပြသည် — အဓိပ္ပာယ် သို့မဟုတ် ခံစားချက်ကို ပို့ဆောင်သည်",
    exampleEn: "It is not always easy to see what message the artist is trying to convey.",
  },
  {
    word: "portray",
    pronunciation: "/pɔːˈtreɪ/ — ပေါ်ထရေ",
    meaningMy: "သရုပ်ဖော်သည် — ပုံဖော် ပြသသည်",
    exampleEn: "Frescos and murals portray religious, historic or patriotic themes.",
  },
  {
    word: "overlap",
    pronunciation: "/ˌəʊvəˈlæp/ — အိုဗာလက်ပ်",
    meaningMy: "ထပ်နေသည် — တစ်စိတ်တစ်ပိုင်း တစ်ခုပေါ်တွင် တစ်ခု တင်နေသည်",
    exampleEn: "Cubism uses geometric shapes and forms that may overlap and penetrate one another.",
  },
  {
    word: "penetrate",
    pronunciation: "/ˈpenətreɪt/ — ပင်နထရိတ်",
    meaningMy: "ဖောက်ထွင်း ဝင်ရောက်သည်",
    exampleEn: "The headlights of my car could not penetrate the heavy fog.",
  },
];

/* ------------------------------ 4C Grammar ----------------------------- */

export const partA4C_translations: Record<number, string> = {
  1: "အိမ်နီးချင်း၏ ဥယျာဉ်တွင် အလုပ်လုပ်နေသော ထိုအမျိုးသားကို သင်သိပါသလား။",
  2: "ကလေးများသည် ဆူညံသံများစွာ ပြုလုပ်လျက် ဝင်လာကြသည်။",
  3: "ထိုစတိုးဆိုင်မှ ခိုးယူခံထားရသော ပစ္စည်းအများအပြားကို ပြန်လည်ရရှိပြီ ဖြစ်သည်။",
  4: "Mona Lisa သည် Leonardo da Vinci ရေးဆွဲခဲ့သော ပန်းချီများထဲမှ တစ်ခု ဖြစ်သည်။",
  5: "ဆွစ်ဇာလန်တွင် ပြုလုပ်သော နာရီများသည် ကမ္ဘာတစ်ဝှမ်း ကျော်ကြားသည်။",
  6: "ဂျပန်တွင် ထုတ်လုပ်သော ကားများသည် ကောင်းသော်လည်း ဈေးကြီးသည်။",
  7: "ကျွန်ုပ်တို့ ဆရာနှင့် စကားပြောနေသော ထိုကောင်မလေးသည် အလွန် ထက်မြက်သည်။",
  8: "ဥနှင့် အသားအတွက် မွေးမြူထားသော ကြက်နှင့် ဘဲ ကဲ့သို့သော ငှက်များကို ကြက်မွေးမြူရေး (poultry) ဟု ခေါ်သည်။",
  9: "အလျင်စလို ချမှတ်လိုက်သော ဆုံးဖြတ်ချက်များသည် ကောင်းခဲသည်။",
  10: "စွယ်စုံကျမ်းများမှ စုဆောင်းရရှိသော အချက်အလက်များသည် ယုံကြည်စိတ်ချရသည်။",
};

export const partB4C_translations: Record<number, string> = {
  1: "စာမေးပွဲအတွက် ကျွန်ုပ် လေ့လာနေသောကြောင့် သင့်နှင့် အပြင်ထွက်၍ မစားနိုင်ခဲ့ပါ။",
  2: "ထိုင်ဒါနှင့် နီလာတို့သည် ၎င်းတို့၏ မိဘများ အိမ်သို့ ပြန်လာသောအခါ ခြံထဲတွင် ကစားနေကြသည်။",
  3: "မနေ့ညနေက ကျွန်ုပ်တို့ ချက်ပြုတ်ခြင်း မပြုလုပ်ခဲ့ပါ။ ညစာအတွက် ကြော်ခေါက်ဆွဲ မှာခဲ့သည်။",
  4: "မနေ့ညက ကျွန်ုပ် တီဗီကြည့်နေစဉ် ကျွန်ုပ်၏ အစ်ကိုသည် ဂီတ နားထောင်နေသည်။",
  5: "ကျွန်ုပ် ဖုန်းခေါ်သည့်အခါ သင်သည် စာဖတ်နေသည်ဟု ထင်ပါသည်။",
  6: "ထိုအချိန်က မိုးသည်းထန်စွာ ရွာနေသောကြောင့် အပြင်ထွက်ရန် မဆုံးဖြတ်ခဲ့ပါ။",
  7: "ကျွန်ုပ်သည် ရမင်ကို ရှာဖွေနေသော်လည်း သူမကို မည်သည့်နေရာမှာမျှ မတွေ့ခဲ့ရပါ။",
  8: "ကျွန်ုပ် စာလေ့လာနေစဉ် မီးများ ပျက်သွားသည်။",
  9: "အခန်းထဲသို့ ဝင်လိုက်သောအခါ အခန်း လွတ်နေသည်ကို တွေ့ရသည်။",
  10: "ဘတ်စ်ကား စောင့်ဆိုင်းနေစဉ် ကလေးဘဝက သူငယ်ချင်းနှင့် တွေ့ခဲ့သည်။",
};

export const partC4C_translations: Record<number, string> = {
  1: "မိုး စတင်ရွာသောအခါ သူတို့သည် ဘတ်စ်ကား စောင့်နေကြသည်။",
  2: "စာကြည့်တိုက်သို့ လမ်းလျှောက်သွားစဉ် သူသည် မတော်တဆမှုတစ်ခုကို တွေ့လိုက်ရသည်။",
  3: "အလုပ်သို့ ကားမောင်းနေစဉ် သူမ၏ လက်ကိုင်ဖုန်း မြည်လာသည်။",
  4: "ကျွန်ုပ် တီဗီကြည့်နေစဉ် တစ်စုံတစ်ဦးက တံခါးကို ခေါက်လိုက်သည်။",
  5: "လမ်းကို ဖြတ်ကူးနေစဉ် အဘွားအို လဲကျသွားသည်။",
  6: "ဂျပန်သို့ ခရီးသွားနေစဉ် ကျွန်ုပ်၏ အစ်ကိုသည် လှပသော မိန်းကလေးတစ်ဦးနှင့် တွေ့ဆုံခဲ့သည်။",
  7: "ဘတ်စ်ကားပေါ်မှ ဆင်းနေစဉ် တစ်စုံတစ်ဦးက ကျွန်ုပ်၏ ပိုက်ဆံအိတ်ကို ဆွဲယူသွားသည်။",
  8: "ယနေ့ နံနက် သူ နိုးထသောအခါ မိုး ရွာနေသည်။",
  9: "စက်ဘီးစီးနေစဉ် ကျွန်ုပ် လဲကျပြီး ခြေထောက် ကျိုးသွားသည်။",
  10: "မနေ့ည ကျွန်ုပ် ဖုန်းခေါ်သည့်အခါ သင်သည် ကားမောင်းနေပါသလား။",
};

export const grammar4C = {
  whatMy:
    "Participial Phrase (ကြိယာနာမဝိသေသန စကားစု) ဆိုသည်မှာ ကြိယာ၏ -ing သို့မဟုတ် -ed / -en ပုံစံဖြင့် စတင်သော စကားစု ဖြစ်ပါသည်။ ဥပမာ - reading in that room, trained by a good coach, working in the garden, written by Wordsworth စသည်တို့ ဖြစ်ပါသည်။ ၎င်းသည် နာမ်တစ်ခုကို အထူးပြု ဖော်ပြပေးသော စကားစု ဖြစ်သည်။",
  whenMy:
    "ကြိယာနာမဝိသေသန စကားစုသည် များသောအားဖြင့် ၎င်း အထူးပြုသော နာမ်၏ နောက်တွင် လာတတ်ပါသည်။ ဥပမာ - 'the man working in our garden' — ဤတွင် 'working in our garden' သည် 'the man' ကို အထူးပြု ဖော်ပြပါသည်။",
  whyMy:
    "စာဖတ်သူအနေဖြင့် မည်သည့်လူ သို့မဟုတ် မည်သည့်အရာအကြောင်း ပြောနေသည်ကို ချက်ချင်း သိရှိနားလည်စေရန် နာမ်ကို အသေးစိတ် ဖော်ပြရန် အသုံးပြုပါသည်။",
  examples: [
    { en: "That man working in our neighbour's garden is a gardener.", phrase: "working in our neighbour's garden" },
    { en: "The Mona Lisa is one of the paintings done by Leonardo da Vinci.", phrase: "done by Leonardo da Vinci" },
    { en: "Watches made in Switzerland are famous all over the world.", phrase: "made in Switzerland" },
  ],
};

export const tense4C = {
  whatMy:
    "Past Simple (အတိတ် ရိုးရိုးကာလ) ကို အတိတ်တွင် ပြီးဆုံးခဲ့သော အမှုကိစ္စ၊ တစ်ခုပြီးတစ်ခု ဖြစ်ပျက်ခဲ့သော အမှုကိစ္စများနှင့် အတိတ်က အလေ့အထများအတွက် သုံးပါသည်။ Past Continuous (အတိတ် ဆက်လက်ဖြစ်ပျက်နေသော ကာလ) ကို အတိတ်က အချိန်တစ်ခုတွင် ဖြစ်ပျက်နေဆဲ အမှုကိစ္စများအတွက် သုံးပါသည်။",
  whenMy:
    "အတိတ် ရိုးရိုးကာလကို အတိတ်က ပြီးဆုံးသွားသော လုပ်ဆောင်ချက်များ၊ နောက်ဆက်တွဲ လုပ်ဆောင်ချက်များနှင့် frequency ကြိယာဝိသေသနများဖြင့် ပြုလေ့ရှိသော အလေ့အထများအတွက် သုံးပါသည်။ ဆက်လက်ဖြစ်ပျက်နေသော ကာလကို when/while ဖြင့် စတင်သော စာကြောင်းများတွင် ရုတ်တရက် ဝင်ရောက်လာသော လုပ်ဆောင်ချက်၏ နောက်ခံတွင် ဆက်လက် ဖြစ်ပျက်နေသော လုပ်ဆောင်ချက်ကို ဖော်ပြရန် သုံးပါသည်။",
  whyMy:
    "feel, find, hear, see, smell, sound, taste စသည့် အာရုံခံ ကြိယာများကို ဆက်လက်ဖြစ်ပျက်နေသော ပုံစံဖြင့် မသုံးပါ — ထို့ကြောင့် 'I was seeing' မှား၍ 'I saw' မှန်ပါသည်။",
  examples: [
    { en: "My sister passed the matriculation examination in 2014.", phrase: "passed" },
    { en: "At seven o'clock last night I was watching TV.", phrase: "was watching" },
    { en: "When I arrived, Ko Ko was talking on the phone.", phrase: "was talking" },
  ],
};