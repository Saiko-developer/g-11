// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 9 sections 9A / 9B / 9C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts`, `unit3Supplement.ts`,
// `unit4Supplement.ts`, `unit5Supplement.ts`, `unit6Supplement.ts`,
// `unit7Supplement.ts` and `unit8Supplement.ts`. Units 1, 2, 3, 4, 5, 6, 7
// and 8 data are never touched by this module.

import type { TrainCar } from "@/lib/sentenceStructure";

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

// Curated "Sentence Structure" breakdown for a single 9A question. Labels are
// English grammar tags; every gloss is natural Burmese only.
type SentenceBreakdown = { introMy: string; noteMy: string; cars: TrainCar[] };

/* ----------------------------- 9A Reading ------------------------------ */

export const partA9A_translations: Record<number, string> = {
  1: "ရာသီဥတုပြောင်းလဲမှုကို အဘယ်အရာက ဖြစ်ပေါ်စေသနည်း။",
  2: "ရာသီဥတုပြောင်းလဲမှုကို တားဆီးနိုင်ပါသလား။",
  3: "ရာသီဥတုပြောင်းလဲမှုဆိုသည်မှာ အဘယ်နည်း။",
  4: "အပူချိန်မြင့်တက်လာသောအခါ အဘယ်အရာများ ဖြစ်ပေါ်သနည်း။",
  5: "ဖန်လုံအိမ်ဓာတ်ငွေ့များသည် မည်သို့ လုပ်ဆောင်သနည်း။",
  6: "သစ်ပင်များသည် အဘယ်ကြောင့် အရေးကြီးသနည်း။",
  7: "မြေကြီး၏ လက်ရှိအခြေအနေမှာ အဘယ်သို့ ရှိသနည်း။",
};

export const partB9A_translations: Record<number, string> = {
  1: "ကမ္ဘာ့အပူလျှံတက်မှု (global warming) ဆိုသည်မှာ မြေကြီး ________ ဟူသော အဓိပ္ပာယ် ဖြစ်သည်။",
  2: "သတ္တဝါများ နေထိုင်နိုင်ကြသည်မှာ ________ တို့သည် မြေကြီးကို ဖုံးအုပ်၍ အမြဲတမ်း နွေးထွေးစွာ ထားရှိခဲ့သောကြောင့် ဖြစ်သည်။",
  3: "မြေကြီး၏ လေထု၊ သမုဒ္ဒရာများနှင့် ကုန်းမြေများ၏ အပူချိန်သည် မြင့်တက်လာခဲ့သည်မှာ လေထုရှိ CO2 ပမာဏ ________ ကြောင့် ဖြစ်သည်။",
  4: "ကားများ၊ ရထားများ၊ သင်္ဘောများနှင့် လေယာဉ်များ လည်ပတ်ရန် ကျွန်ုပ်တို့ လိုအပ်သော စွမ်းအင်သည် ________ မှ ရရှိသည်။",
  5: "မြေဆီလွှာပျက်စီးမှု တိုးလာခြင်းသည် ________ ကို ဖြစ်ပေါ်စေနိုင်သည်။",
  6: "ရာသီဥတုပုံစံ၌ ပြင်းထန်သော ပြောင်းလဲမှုများကို တောင်ပစိဖိတ်သမုဒ္ဒရာရှိ ________ တို့က ဖြစ်ပေါ်စေသည်။",
  7: "ကျွန်ုပ်တို့သည် နေစွမ်းအင်၊ လေစွမ်းအင်နှင့် အပူစွမ်းအင်တို့ကို ________ ရန် အသုံးပြုသင့်သည်။",
};

export const partC9A_translations: Record<number, string> = {
  1: "စာကြောင်း ၆ ရှိ 'It' ဟူသော စကားလုံးသည် အဘယ်အရာကို ရည်ညွှန်းသနည်း။",
  2: "ရာသီဥတုပညာရှင်များ (climatologists) သည် အဘယ်အရာကို လေ့လာသနည်း။",
  3: "မြေကြီး၏ လေထုကို အုံမ (blanket) နှင့် အဘယ်ကြောင့် တင်စားသနည်း။",
  4: "ဖန်လုံအိမ်ဓာတ်ငွေ့များ၏ ပမာဏ မြင့်တက်လာသောအခါ အဘယ်အရာ ဖြစ်ပေါ်သနည်း။",
  5: "စာကြောင်း ၂၂ ရှိ 'its' ဟူသော စကားလုံးသည် အဘယ်အရာကို ရည်ညွှန်းသနည်း။",
  6: "စာကြောင်း ၃၁ ရှိ 'which' ဟူသော စကားလုံးသည် အဘယ်အရာကို ရည်ညွှန်းသနည်း။",
  7: "El Niño နှင့် La Niña တို့သည် အဘယ်အရာများ ဖြစ်သနည်း။",
  8: "မြေကြီး၏ အပူချိန်မြင့်တက်ခြင်းကို တားဆီးရန် (သို့) လုံးဝရပ်တန့်ရန် ကျွန်ုပ်တို့ အဘယ်အရာကို ပြုလုပ်သင့်သနည်း။",
  9: "ရာသီဥတုပြောင်းလဲမှုကို တားဆီးရာတွင် ကူညီရန် မိမိသည် အဘယ်အရာကို ပြုလုပ်မည်နည်း။",
};

/* -------- 9A Reading — Sentence Structure breakdowns (curated) -------- */
// One breakdown per 9A question (Exercise A paragraph matching, Exercise B
// gap-fill, Exercise C full-sentence answers). Tags are always English and
// reuse TAG_INFO; every gloss is 100% Burmese with no English remnants.
// Predicate verbs are never grouped together with their objects.

export const partA9A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "ဒါက မေးခွန်းစကားလုံးကိုယ်တိုင် ကတ္တားဖြစ်နေသော WH-မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "What", translation: "အဘယ်အရာက", tag: "WH-Question Word" },
      { word: "causes", translation: "ဖြစ်ပေါ်စေသနည်း", tag: "Main Verb" },
      { word: "climate change", translation: "ရာသီဥတုပြောင်းလဲမှုကို", tag: "Noun Object" },
    ],
  },
  2: {
    introMy: "ဒါက အကူကြိယာဖြင့် စတင်သော ခံရသည့်ပုံစံ (passive) မေးခွန်းပါ။",
    noteMy: "ပုံစံ: အကူကြိယာ → ကတ္တား → ကြိယာ (ခံရသည့်ပုံစံ)။",
    cars: [
      { word: "Can", translation: "နိုင်ပါသလား", tag: "Helping Verb" },
      { word: "climate change", translation: "ရာသီဥတုပြောင်းလဲမှုကို", tag: "Noun Subject" },
      { word: "be prevented", translation: "တားဆီးခြင်း ခံရ", tag: "Main Verb" },
    ],
  },
  3: {
    introMy: "ဒါက အဓိပ္ပာယ်မေးသော ဆက်စပ်ကြိယာ (be) မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → ဆက်စပ်ကြိယာ → ဖြည့်စွက်စာ။",
    cars: [
      { word: "What", translation: "အဘယ်နည်း", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "climate change", translation: "ရာသီဥတုပြောင်းလဲမှု ဆိုသည်မှာ", tag: "Complement" },
    ],
  },
  4: {
    introMy: "ဒါက အချိန်ပြ ကြိယာဝိသေသနအခန်း ပါဝင်သော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → မူရင်းကြိယာ → ကြိယာဝိသေသနအခန်း။",
    cars: [
      { word: "What", translation: "အဘယ်အရာ", tag: "WH-Question Word" },
      { word: "happens", translation: "ဖြစ်ပေါ်သနည်း", tag: "Main Verb" },
      {
        word: "when the temperature rises",
        translation: "အပူချိန် မြင့်တက်လာသောအခါ",
        tag: "Adverb Clause",
      },
    ],
  },
  5: {
    introMy: "ဒါက 'How' ဖြင့် စတင်ပြီး အကူကြိယာ 'do' သုံးထားသော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "How", translation: "မည်သို့", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "greenhouse gases", translation: "ဖန်လုံအိမ်ဓာတ်ငွေ့များသည်", tag: "Noun Subject" },
      { word: "function", translation: "လုပ်ဆောင်သနည်း", tag: "Main Verb" },
    ],
  },
  6: {
    introMy: "ဒါက အကြောင်းရင်း မေးသော ဆက်စပ်ကြိယာ မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တား → နာမဝိသေသန။",
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "trees", translation: "သစ်ပင်များသည်", tag: "Noun Subject" },
      { word: "important", translation: "အရေးကြီးသော", tag: "Adjective" },
    ],
  },
  7: {
    introMy: "ဒါက ဖြည့်စွက်စာနောက်တွင် ဝိဘတ်စကားစု လိုက်ပါသော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → ဆက်စပ်ကြိယာ → ဖြည့်စွက်စာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What", translation: "အဘယ်နည်း", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the current situation", translation: "လက်ရှိ အခြေအနေမှာ", tag: "Complement" },
      { word: "of the earth", translation: "မြေကြီး၏", tag: "Prepositional Phrase" },
    ],
  },
};

export const partB9A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "ကွက်လပ်ကို ဖြည့်လိုက်လျှင် ကတ္တား → မူရင်းကြိယာ → ကံ ပုံစံ ရရှိပါသည်။",
    noteMy: "ပုံစံ: ကတ္တား → မူရင်းကြိယာ → ကံအခန်း။",
    cars: [
      { word: "Global warming", translation: "ကမ္ဘာ့အပူလျှံတက်မှုသည်", tag: "Noun Subject" },
      { word: "means", translation: "ဟူသော အဓိပ္ပာယ် ဖြစ်သည်", tag: "Main Verb" },
      {
        word: "the earth is getting warmer and warmer from year to year",
        translation: "မြေကြီးသည် နှစ်စဉ်နှစ်တိုင်း ပိုမို ပူနွေးလာနေခြင်း",
        tag: "Noun Object",
      },
    ],
  },
  2: {
    introMy: "ဒါက အကြောင်းရင်းပြ ကြိယာဝိသေသနအခန်း ပါဝင်သော ဝါကျပါ။",
    noteMy: "ပုံစံ: ကတ္တား → ကြိယာစု → အကြောင်းရင်းပြ ကြိယာဝိသေသနအခန်း။",
    cars: [
      { word: "Living things", translation: "သတ္တဝါများသည်", tag: "Noun Subject" },
      { word: "are able to live", translation: "နေထိုင်နိုင်ကြသည်", tag: "Main Verb" },
      {
        word: "because greenhouse gases blanket the earth and have kept it constantly warm",
        translation:
          "ဖန်လုံအိမ်ဓာတ်ငွေ့များက မြေကြီးကို ဖုံးအုပ်ထား၍ အမြဲတမ်း နွေးထွေးအောင် ထိန်းထားသောကြောင့်",
        tag: "Adverb Clause",
      },
    ],
  },
  3: {
    introMy: "ရှည်လျားသော ကတ္တားစုနောက်တွင် ကြိယာနှင့် အကြောင်းရင်းအခန်း လိုက်ပါသည်။",
    noteMy: "ပုံစံ: ကတ္တားစု → မူရင်းကြိယာ → အကြောင်းရင်းပြ ကြိယာဝိသေသနအခန်း။",
    cars: [
      {
        word: "The temperature of the earth's atmosphere, its oceans and landmasses",
        translation: "မြေကြီး၏ လေထု၊ သမုဒ္ဒရာများနှင့် ကုန်းမြေများ၏ အပူချိန်သည်",
        tag: "Noun Subject",
      },
      { word: "has risen", translation: "မြင့်တက်လာခဲ့သည်", tag: "Main Verb" },
      {
        word: "because CO2 levels in the atmosphere have gradually risen",
        translation: "လေထုအတွင်းရှိ ကာဗွန်ဒိုင်အောက်ဆိုဒ် ပမာဏ တဖြည်းဖြည်း မြင့်တက်လာသောကြောင့်",
        tag: "Adverb Clause",
      },
    ],
  },
  4: {
    introMy: "ကတ္တားထဲတွင် ဆက်စပ်အခန်း ပါဝင်ပြီး ကြိယာနောက်တွင် ကံ လိုက်ပါသည်။",
    noteMy: "ပုံစံ: ကတ္တားစု → မူရင်းကြိယာ → ကံ။",
    cars: [
      {
        word: "The energy we need to run cars, trains, ships and planes",
        translation:
          "ကားများ၊ ရထားများ၊ သင်္ဘောများနှင့် လေယာဉ်များ မောင်းနှင်ရန် လိုအပ်သော စွမ်းအင်သည်",
        tag: "Noun Subject",
      },
      { word: "comes from", translation: "မှ ရရှိသည်", tag: "Main Verb" },
      {
        word: "burning fossil fuels such as coal, oil, and natural gas",
        translation:
          "ကျောက်မီးသွေး၊ ရေနံနှင့် သဘာဝဓာတ်ငွေ့ကဲ့သို့ ကျောက်ဖြစ်ရုပ်ကြွင်း လောင်စာများ လောင်ကျွမ်းခြင်း",
        tag: "Noun Object",
      },
    ],
  },
  5: {
    introMy: "ဒါက ရိုးရှင်းသော ကတ္တား → ကြိယာ → ကံ ပုံစံ ဝါကျပါ။",
    noteMy: "ပုံစံ: ကတ္တားစု → ကြိယာစု → ကံ။",
    cars: [
      {
        word: "An increase in soil erosion",
        translation: "မြေဆီလွှာ တိုက်စားမှု တိုးလာခြင်းသည်",
        tag: "Noun Subject",
      },
      { word: "can lead to", translation: "ကို ဖြစ်ပေါ်စေနိုင်သည်", tag: "Main Verb" },
      {
        word: "loss of vegetation",
        translation: "သစ်ပင်ပေါက်ရောက်မှု ဆုံးရှုံးခြင်း",
        tag: "Noun Object",
      },
    ],
  },
  6: {
    introMy: "ဒါက ခံရသည့်ပုံစံ (passive) ဝါကျဖြစ်ပြီး နောက်ဆုံးတွင် နေရာပြ ဝိဘတ်စကားစု ပါသည်။",
    noteMy: "ပုံစံ: ကတ္တားစု → ကြိယာ (ခံရသည့်ပုံစံ) → လုပ်ဆောင်သူ → ဝိဘတ်စကားစု။",
    cars: [
      {
        word: "Severe changes in the climatic pattern",
        translation: "ရာသီဥတု ပုံစံ၏ ပြင်းထန်သော ပြောင်းလဲမှုများသည်",
        tag: "Noun Subject",
      },
      { word: "are caused by", translation: "ကြောင့် ဖြစ်ပေါ်ရသည်", tag: "Main Verb" },
      {
        word: "El Niño and La Niña",
        translation: "အယ်လ်နီညိုနှင့် လာနီညာ ရေစီးကြောင်းများ",
        tag: "Noun Object",
      },
      {
        word: "in the South Pacific Ocean",
        translation: "တောင်ပစိဖိတ် သမုဒ္ဒရာအတွင်းရှိ",
        tag: "Prepositional Phrase",
      },
    ],
  },
  7: {
    introMy: "ဒါက ရည်ရွယ်ချက်အခန်း ပါဝင်သော အကြံပြုချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကတ္တား → ကြိယာစု → ကံ → ရည်ရွယ်ချက်အခန်း။",
    cars: [
      { word: "We", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "should use", translation: "သုံးစွဲသင့်သည်", tag: "Main Verb" },
      {
        word: "solar power, wind power and thermal power",
        translation: "နေရောင်ခြည် စွမ်းအင်၊ လေ စွမ်းအင်နှင့် အပူ စွမ်းအင်ကို",
        tag: "Noun Object",
      },
      {
        word: "to prevent the temperature of the earth from rising higher",
        translation: "မြေကြီး၏ အပူချိန် ပိုမို မြင့်တက်ခြင်းမှ တားဆီးရန်အတွက်",
        tag: "Purpose Clause",
      },
    ],
  },
};

export const partC9A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "ဒါက အကူကြိယာ 'does' သုံးထားပြီး ဝိဘတ်သည် ကြိယာနောက်တွင် ကျန်ရစ်သော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "does", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      {
        word: "\"It\" in line 6",
        translation: "စာကြောင်း ၆ ရှိ ‘It’ ဟူသော စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  2: {
    introMy: "ဒါက အကူကြိယာ 'do' သုံးထားသော ရိုးရှင်းသည့် WH-မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "climatologists", translation: "ရာသီဥတုပညာရှင်များသည်", tag: "Noun Subject" },
      { word: "study", translation: "လေ့လာသနည်း", tag: "Main Verb" },
    ],
  },
  3: {
    introMy: "ဒါက ခံရသည့်ပုံစံ (passive) WH-မေးခွန်းပါ။ 'is' က အကူကြိယာ၊ 'compared' က မူရင်းကြိယာ ဖြစ်သည်။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "is", translation: "ခံရသည့်ပုံစံ အကူကြိယာ", tag: "Helping Verb" },
      { word: "the earth's atmosphere", translation: "မြေကြီး၏ လေထုကို", tag: "Noun Subject" },
      { word: "compared", translation: "တင်စားထားသနည်း", tag: "Main Verb" },
      { word: "to a blanket", translation: "အုံမ တစ်ထည်နှင့်", tag: "Prepositional Phrase" },
    ],
  },
  4: {
    introMy: "ဒါက အချိန်ပြ ကြိယာဝိသေသနအခန်း ပါဝင်သော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → မူရင်းကြိယာ → ကြိယာဝိသေသနအခန်း။",
    cars: [
      { word: "What", translation: "အဘယ်အရာ", tag: "WH-Question Word" },
      { word: "happens", translation: "ဖြစ်ပေါ်သနည်း", tag: "Main Verb" },
      {
        word: "when the level of greenhouse gases rises",
        translation: "ဖန်လုံအိမ်ဓာတ်ငွေ့များ၏ ပမာဏ မြင့်တက်လာသောအခါ",
        tag: "Adverb Clause",
      },
    ],
  },
  5: {
    introMy: "ဒါက စကားလုံးတစ်လုံး၏ ရည်ညွှန်းချက်ကို မေးသော အကူကြိယာ မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "does", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      {
        word: "\"its\" in line 22",
        translation: "စာကြောင်း ၂၂ ရှိ ‘its’ ဟူသော စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  6: {
    introMy: "ဒါက ဆက်စပ်နာမ်စား တစ်လုံး၏ ရည်ညွှန်းချက်ကို မေးသော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "does", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      {
        word: "\"which\" in line 31",
        translation: "စာကြောင်း ၃၁ ရှိ ‘which’ ဟူသော စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  7: {
    introMy: "ဒါက ဆက်စပ်ကြိယာ (are) ဖြင့် အဓိပ္ပာယ်ကို မေးသော မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → ဆက်စပ်ကြိယာ → ဖြည့်စွက်စာ။",
    cars: [
      { word: "What", translation: "အဘယ်အရာများ", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "the El Niño and La Niña",
        translation: "အယ်လ်နီညိုနှင့် လာနီညာ ဆိုသည်များမှာ",
        tag: "Complement",
      },
    ],
  },
  8: {
    introMy: "ဒါက ရည်ရွယ်ချက်အခန်း ပါဝင်သော အကြံဉာဏ်တောင်းခံသည့် မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ရည်ရွယ်ချက်အခန်း။",
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "should", translation: "သင့်သနည်း", tag: "Helping Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်", tag: "Main Verb" },
      {
        word: "to prevent the rise in the earth's temperature or to stop it completely",
        translation:
          "မြေကြီး၏ အပူချိန် မြင့်တက်ခြင်းကို တားဆီးရန် သို့မဟုတ် လုံးဝ ရပ်တန့်စေရန်အတွက်",
        tag: "Purpose Clause",
      },
    ],
  },
  9: {
    introMy: "ဒါက အနာဂတ်ကာလ အကူကြိယာ 'will' သုံးထားသော ကိုယ်ရေးကိုယ်တာ မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ရည်ရွယ်ချက်အခန်း။",
    cars: [
      { word: "What", translation: "အဘယ်အရာကို", tag: "WH-Question Word" },
      { word: "will", translation: "မည်နည်း", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်", tag: "Main Verb" },
      {
        word: "to help prevent climate change",
        translation: "ရာသီဥတုပြောင်းလဲမှုကို တားဆီးရာတွင် ကူညီရန်အတွက်",
        tag: "Purpose Clause",
      },
    ],
  },
};


/* ---------------------------- 9B Vocabulary ---------------------------- */

export const vocab9B: VocabItem[] = [
  {
    word: "burning fossil fuels",
    pronunciation: "/ˈbɜːnɪŋ ˈfɒsl ˈfjuːəlz/ — ဘားနင်း ဖောဆယ် ဖျူးအယ်လ်",
    meaningMy: "ကျောက်ဖြစ်ရုပ်ကြွင်း လောင်စာများ (မီးသွေး၊ ရေနံ၊ သဘာဝဓာတ်ငွေ့) ကို လောင်ကျွမ်းခြင်း",
    exampleEn: "We have been burning fossil fuels such as coal, oil, and natural gas to produce energy.",
  },
  {
    word: "loss of property and life",
    pronunciation: "/lɒs əv ˈprɒpəti ənd laɪf/ — လော့စ် အော့ဖ် ပရောပတီ အန် လိုင်ဖ်",
    meaningMy: "ဥစ္စာနှင့် အသက်ဆုံးရှုံးမှု",
    exampleEn: "Rising sea levels flood many coastal regions, leading to loss of property and life.",
  },
  {
    word: "soil erosion",
    pronunciation: "/sɔɪl ɪˈrəʊʒn/ — ဆွိုင်ယ်လ် အီရိုးဇှန်",
    meaningMy: "မြေဆီလွှာပျက်စီးခြင်း",
    exampleEn: "With fewer and fewer trees, there is increasing soil erosion.",
  },
  {
    word: "cutting down trees",
    pronunciation: "/ˈkʌtɪŋ daʊn triːz/ — ကတ်တင်း ဒေါင်း ထရီးဇ်",
    meaningMy: "သစ်ပင်များကို ခုတ်လမ်းသတ်ခြင်း",
    exampleEn: "In addition, we cut down many trees, forgetting that trees keep the level of carbon dioxide at a safe level.",
  },
  {
    word: "loss of vegetation",
    pronunciation: "/lɒs əv ˌvedʒəˈteɪʃn/ — လော့စ် အော့ဖ် ဗက်ဇီတေးရှင်",
    meaningMy: "သစ်ပင်ပန်းပင်များ ဆုံးရှုံးခြင်း",
    exampleEn: "Increasing soil erosion, in turn, leads to loss of vegetation.",
  },
  {
    word: "emission of carbon dioxide",
    pronunciation: "/ɪˈmɪʃn əv ˈkɑːbən daɪˈɒksaɪd/ — အီမစ်ရှင် အော့ဖ် ကာဗွန် ဒိုင်အောက်ဆိုက်",
    meaningMy: "ကာဗွန်ဒိုင်အောက်ဆိုက် ထုတ်လွှင့်မှု",
    exampleEn: "Many governments are taking measures to reduce emission of carbon dioxide.",
  },
  {
    word: "stop using fossil fuels",
    pronunciation: "/stɒp ˈjuːzɪŋ ˈfɒsl ˈfjuːəlz/ — စတော့ပ် ယူဇင်း ဖောဆယ် ဖျူးအယ်လ်",
    meaningMy: "ကျောက်ဖြစ်ရုပ်ကြွင်း လောင်စာများ အသုံးပြုခြင်း ရပ်တန့်ခြင်း",
    exampleEn: "As responsible citizens, we ourselves should stop using fossil fuels.",
  },
  {
    word: "occurrence of El Niño and La Niña",
    pronunciation: "/əˈkʌrəns əv el ˈniːnjəʊ ənd lɑː ˈniːnjə/ — အာကာရန်စ် အော့ဖ် အဲလ်နီညို အန် လာနီညာ",
    meaningMy: "El Niño နှင့် La Niña ဖြစ်ပေါ်ခြင်း",
    exampleEn: "The occurrence of El Niño and La Niña brings about severe changes in the climatic pattern.",
  },
  {
    word: "floods",
    pronunciation: "/flʌdz/ — ဖလတ်ဇ်",
    meaningMy: "ရေကြီးခြင်း / ရေလွှမ်းမိုးခြင်း",
    exampleEn: "Rising sea levels cause floods in many coastal regions.",
  },
  {
    word: "weather patterns change severely",
    pronunciation: "/ˈweðə ˈpætnz tʃeɪndʒ ˈsevəli/ — ဝေဒါ ပဲတန်းဇ် ချိန်းဂျ် ဆေးဗာလီ",
    meaningMy: "ရာသီဥတုပုံစံများ ပြင်းထန်စွာ ပြောင်းလဲခြင်း",
    exampleEn: "El Niño and La Niña make weather patterns change severely.",
  },
  {
    word: "glaciers and sea ice melt",
    pronunciation: "/ˈɡlæsiəz ənd siː aɪs melt/ — ဂလေးဆီးယားဇ် အန် ဆီး အိုင်းစ် မဲလ်ထ်",
    meaningMy: "ရေခဲမြောင်းများနှင့် ပင်လယ်ရေခဲများ အရည်ပျက်ခြင်း",
    exampleEn: "The rise in temperature causes more and more glaciers and sea ice to melt.",
  },
  {
    word: "storms",
    pronunciation: "/stɔːmz/ — စတောမ်ဇ်",
    meaningMy: "မုန်တိုင်းများ",
    exampleEn: "El Niño and La Niña change the track and intensity of storms.",
  },
  {
    word: "planting more trees",
    pronunciation: "/ˈplɑːntɪŋ mɔː triːz/ — ပလာန်တင်း မော ထရီးဇ်",
    meaningMy: "သစ်ပင်များ ပိုမို စိုက်ပျိုးခြင်း",
    exampleEn: "We should plant more trees and do our utmost to keep our planet earth green and clean.",
  },
  {
    word: "reducing emission of carbon dioxide",
    pronunciation: "/rɪˈdjuːsɪŋ ɪˈmɪʃn əv ˈkɑːbən daɪˈɒksaɪd/ — ရီဒျူဆင်း အီမစ်ရှင် အော့ဖ် ကာဗွန် ဒိုင်အောက်ဆိုက်",
    meaningMy: "ကာဗွန်ဒိုင်အောက်ဆိုက် ထုတ်လွှင့်မှု လျှော့ချခြင်း",
    exampleEn: "Many governments are taking all possible measures to reduce emission of carbon dioxide.",
  },
  {
    word: "utilizing solar power, wind power, etc.",
    pronunciation: "/ˈjuːtəlaɪzɪŋ ˈsəʊlə ˈpaʊə wɪnd ˈpaʊə/ — ယူတီလိုင်းဇင်း ဆိုလာ ပါဝါ ဝင်းဒ် ပါဝါ",
    meaningMy: "နေစွမ်းအင်၊ လေစွမ်းအင် စသည်တို့ကို အသုံးချခြင်း",
    exampleEn: "Governments are devising feasible ways to utilize solar power, wind power, and thermal power instead of burning fossil fuels.",
  },
];

/* ------------------------------ 9C Grammar ----------------------------- */

export const partA9C_translations: Record<number, string> = {
  1: "မိခင်သည် သွားပြင်းပြင်းနာသည်။ သူမသည် ________ လိမ့်မည်။",
  2: "ဖခင်သည် ကွန်ဖရန်စ်တက်ရန် ပဲရစ်မြို့သို့ သွားခဲ့သည်။ ပြန်ရောက်လာလျှင် ကျွန်ုပ်အား ________ ဟု ထင်သည်။",
  3: "ညိုညိုသည် ဤနွေရာသီတွင် အားလပ်ရက်ရှည် ရမည်ဖြစ်သဖြင့် သူမသည် ________ လိမ့်မည်။",
  4: "ကျော်လွင်သည် အောက်တိုဘာလ ၂၇ ရက်တွင် အသက် ၁၅ နှစ် ပြည့်မည်ဖြစ်သဖြင့် ထိုနေ့တွင် သူသည် ________ လိမ့်မည်။",
  5: "အမြန်လိုက်ပါပါ။ မဟုတ်လျှင် ကျွန်ုပ်တို့သည် ________ လိမ့်မည်။",
  6: "သူသည် အလွန် ကြိုးစားသည်။ နောက်ဆုံးစာမေးပွဲတွင် သူသည် ________ ဟု ထင်သည်။",
  7: "ဤနေရာတွင် အေးသည်။ ကျွန်ုပ် ________ လိမ့်မည်။",
  8: "အချိန်ရလျှင် အိမ်ပြန်လမ်းတွင် ကျွန်ုပ် ________ လိမ့်မည်။",
  9: "မိနစ်အနည်းငယ် စောင့်ပါ။ ကျွန်ုပ် ________ လိမ့်မည်။",
  10: "ခဏ ဤနေရာတွင် ရပ်နားကြပါစို့။ ကျွန်ုပ်တို့သည် ချိုင့်ဝှမ်းပေါ်မှ ________ လိမ့်မည်။",
};

export const partB9C_translations: Record<number, string> = {
  1: "အပူချိန်သည် သုညအောက်သို့ ကျဆင်းပါက ရေသည် (freeze) လိမ့်မည်။",
  2: "သင်သည် စကော့တလန်နိုင်ငံသို့ သွားလည်ပါက အက်ဒင်ဘရာ (Edinburgh) ရဲတိုက်ကို (see) လိမ့်မည်။",
  3: "ညနေခင်း ကောင်းစွာ မအိပ်လျှင် နောက်နံနက်တွင် မိမိသည် ခံစားရမှု (not, feel) ကောင်းမွန်လိမ့်မည် မဟုတ်ပါ။",
  4: "သူမက သူ့ထံမှ ထိုငွေကို တောင်းခဲ့လျှင် သူသည် သူ့အား (lend) လိမ့်မည်။",
  5: "မြေပြင်ပေါ်တွင် ငှက်ပျောသီးအခွံ (not be) မရှိလျှင် မိမိ မလဲမိနိုင်ပါ။",
  6: "အလုံအလောက် စောစော ရောက်ရှိပါက မိမိ လိုချင်သော ထိုင်ခုံများကို ရွေးချယ်နိုင်သည့် အခွင့်အရေး (have) လိမ့်မည်။",
  7: "များများ စားလျှင် ကိုယ်အလေးချိန် (gain) လိမ့်မည်။",
  8: "လူတိုင်း (work) လျှင် ကျွန်ုပ်တို့၏ အလုပ်ကို အချိန်မှီ ပြီးမြောက်အောင် လုပ်နိုင်မည် ဖြစ်သည်။",
  9: "ဆိုင်၏ အရောင်း (increase) မှလွဲ၍ (မတိုးလျှင်) ကျွန်ုပ်တို့ ဆိုင်ကို ပိတ်ရမည် ဖြစ်သည်။",
  10: "သူ့မိဘများက သူ့အား (not, support) လျှင် သူသည် တစ်ဝက်တစ်ပိုင်း အလုပ်တစ်ခု ရှာရမည် ဖြစ်လိမ့်မည်။",
};

export const grammar9C = {
  whatMy:
    "Future Tense (အနာဂတ်တင်းစ်) ကို will + V-inf (ကြိယာရိုးရိုး) ဖြင့် ဖွဲ့ပြီး (၁) ကျွန်ုပ်တို့ ထင်မြင်/ယုံကြည်သော အနာဂတ်တွင် ဖြစ်လိမ့်မည့်အရာများ (e.g. You will fail if you do not study. / He will tell you when he gets here.) နှင့် (၂) လက်ရှိအချိန်တွင် ချက်ချင်း ဆုံးဖြတ်လိုက်သည့် ဆုံးဖြတ်ချက်များ (e.g. The room is stuffy. I will turn on the fan. / I don't want to see him. So I won't come to the party tomorrow.) အား ပြောဆိုရေးသားရာတွင် အသုံးပြုသည်။ Conditional Clause သည် subordinate clause တစ်မျိုးဖြစ်ပြီး အများအားဖြင့် ချိတ်ဆက်စကားလုံး if (သို့) unless ဖြင့် စတင်သည်။",
  whenMy:
    "Conditional clause များကို ၃ မျိုး ခွဲခြားသည်- Type 1: if-clause = Simple Present, Main clause = Future Simple (e.g. If he is late, we will have to go without him. / Unless it rains, the plants will die.)။ Type 2: if-clause = Simple Past, Main clause = Future Conditional (would + V-inf) (e.g. If I were you, I would study more.)။ Type 3: if-clause = Past Perfect, Main clause = Future Perfect Conditional (would have + V3) (e.g. If you had warned me, I would not have told your father about that party.)။ unless သည် 'if ... not' နှင့် အဓိပ္ပာယ်တူသည်။",
  whyMy:
    "Type 1 ကို အနာဂတ်တွင် ဖြစ်နိုင်ခြေရှိသော အခြေအနေများအတွက် အသုံးပြုသည်။ Type 2 ကို လက်ရှိ/အနာဂတ်နှင့် ဆန့်ကျင်ဘက်ဖြစ်သော (မဖြစ်နိုင်သော/မဖြစ်ဖြစ်) အခြေအနေများအတွက် အသုံးပြုပြီး if-clause တွင် I / he / she / it နှင့်တွေ့လျှင် 'were' ကို အသုံးပြုနိုင်သည် (e.g. If I were you ...)။ Type 3 ကိုမူ အတိတ်တွင် ဖြစ်ခဲ့သည်နှင့် ဆန့်ကျင်ဘက်ဖြစ်သော အခြေအနေများအတွက် အသုံးပြုသည်။ အဓိပ္ပာယ် ယေဘုယျမှန်ကန်ချက် (general truth) ဖော်ပြသည့် ဝါကျတွင်မူ အချိန်နှစ်ခုလုံး Simple Present ကို အသုံးပြုနိုင်သည် (e.g. If the temperature falls below zero, water freezes.)။",
  examples: [
    { en: "The room is stuffy. I will turn on the fan.", phrase: "I will turn on" },
    { en: "If he is late, we will have to go without him.", phrase: "will have to go" },
    { en: "If you had warned me, I would not have told your father about that party.", phrase: "would not have told" },
  ],
};

/* --------------------- 9D Listening and Speaking ---------------------- */

/** Burmese translation of each TRUE/FALSE listening statement (Part A). */
export const listening9D_translations: Record<number, string> = {
  1: "သစ်တောများသည် တိရစ္ဆာန် သန်းပေါင်းများစွာ၏ နေအိမ်များ ဖြစ်သည်။",
  2: "သစ်တောများအတွင်း၌ ချောင်းများနှင့် မြစ်များ မရှိနိုင်ပါ။",
  3: "ကျွန်ုပ်တို့သည် သစ်တောအနီးတွင် မနေသင့်ပါ။",
  4: "သစ်တောအနီးတွင် နေထိုင်သူများသည် ဝင်ငွေ မရှိကြပါ။",
  5: "ကျွန်ုပ်တို့သည် သစ်တောများမှ သစ်လုံးနှင့် သစ်သားများ ရရှိသည်။",
  6: "ခရီးသွားများသည် သဘာဝ၏ အလှဆုံးကို ကြည့်ရှုရန် သစ်တောဒေသများသို့ လာလည်ကြသည်။",
  7: "သစ်ပင်များ ရှိပါက ရာသီဥတုပြောင်းလဲမှုကို ကျွန်ုပ်တို့ တားဆီးနိုင်သည်။",
  8: "သစ်ပင်များသည် ရာသီဥတုကို တည်ငြိမ်စေနိုင်သည်။",
  9: "သစ်ပင်များသည် ကာဗွန်ဒိုင်အောက်ဆိုဒ်ကို စုပ်ယူသည်။",
  10: "အောက်ဆီဂျင်နှင့် ကာဗွန်ဒိုင်အောက်ဆိုဒ် နှစ်မျိုးလုံးသည် ဓာတ်ငွေ့ဆိုးများ ဖြစ်သည်။",
};

export type OpinionPhrase = { en: string; my: string };

/** Part B reference panel — phrases for expressing opinions. */
export const opinionPhrases9D: {
  personal: OpinionPhrase[];
  general: OpinionPhrase[];
} = {
  personal: [
    { en: "In my opinion ...", my: "ကျွန်ုပ်၏ အမြင်အရ ..." },
    { en: "In my experience ...", my: "ကျွန်ုပ်၏ အတွေ့အကြုံအရ ..." },
    { en: "Speaking for myself ...", my: "ကိုယ့်ဘက်က ပြောရလျှင် ..." },
    { en: "Personally, I think ...", my: "ကိုယ်တိုင်ကတော့ ထင်ပါတယ် ..." },
    { en: "I (strongly) believe that ...", my: "ကျွန်ုပ် (အခိုင်အမာ) ယုံကြည်သည်မှာ ..." },
    { en: "I really feel that ...", my: "ကျွန်ုပ် တကယ်ခံစားရသည်မှာ ..." },
    { en: "If you ask me ...", my: "ကျွန်ုပ်ကို မေးမည်ဆိုလျှင် ..." },
  ],
  general: [
    { en: "Some people say that ...", my: "အချို့သောသူများ ပြောကြသည်မှာ ..." },
    {
      en: "Many / Most people think / believe that ...",
      my: "လူအများစု ထင်မြင်/ယုံကြည်ကြသည်မှာ ...",
    },
    { en: "Everybody knows that ...", my: "လူတိုင်း သိကြသည်မှာ ..." },
    { en: "According to scientists ...", my: "သိပ္ပံပညာရှင်များ၏ အဆိုအရ ..." },
    { en: "The thing is that ...", my: "အဓိကအချက်မှာ ..." },
    { en: "The point is that ...", my: "အဆိုလိုသည်မှာ ..." },
  ],
};

export type DialogueLine = {
  speaker: "A" | "B";
  /** Sentence text; `{n}` marks blank number n. */
  text: string;
};

/** Part B dialogue: options, script with blanks, and the answer key. */
export const dialogue9D: {
  options: { letter: string; text: string }[];
  lines: DialogueLine[];
  answers: Record<number, { letter: string; text: string; my: string }>;
} = {
  options: [
    { letter: "a", text: "I agree" },
    { letter: "b", text: "in my opinion" },
    { letter: "c", text: "I know what you mean" },
    { letter: "d", text: "of course it is" },
    { letter: "e", text: "personally, I think" },
    { letter: "f", text: "the point is that" },
    { letter: "g", text: "that's what I think" },
    { letter: "h", text: "that's very true" },
  ],
  lines: [
    {
      speaker: "A",
      text: "Hey, did you hear that? A new parking site is going to be built in the park over there.",
    },
    {
      speaker: "B",
      text: "Really? But {1}, that's crazy. What we need is more trees. {2} cars should disappear. They pollute the air and they make too much noise.",
    },
    { speaker: "A", text: "{3} we can't live without cars today. Without cars, how will you get to work?" },
    { speaker: "B", text: "I can take the bus." },
    { speaker: "A", text: "Yes, {4}, but we use cars for so many purposes." },
    { speaker: "B", text: "{5}, but we can always find other alternatives." },
    {
      speaker: "A",
      text: "You have a point there, but if we didn't have cars, we would need better public transport.",
    },
    { speaker: "B", text: "Yes, {6}" },
    { speaker: "A", text: "But still, having a car is so convenient." },
    { speaker: "B", text: "{7}, I know. But we can't have everything, can we?" },
    { speaker: "A", text: "Exactly. {8} too. We can't have everything. Still, so I prefer having a car." },
  ],
  answers: {
    1: { letter: "b", text: "in my opinion", my: "ကျွန်ုပ်၏ အမြင်အရ — ကိုယ်ပိုင်ထင်မြင်ချက် ဖော်ပြခြင်း။" },
    2: { letter: "e", text: "personally, I think", my: "ကိုယ်တိုင်ကတော့ ထင်သည် — ကိုယ်ပိုင်အမြင်ကို ပိုအလေးပေးခြင်း။" },
    3: { letter: "f", text: "The point is that", my: "အဓိကအချက်မှာ — အရေးကြီးဆုံး အကြောင်းပြချက် တင်ပြခြင်း။" },
    4: { letter: "h", text: "that's very true", my: "အဲဒါ အလွန်မှန်ပါတယ် — တစ်စိတ်တစ်ပိုင်း သဘောတူခြင်း။" },
    5: { letter: "c", text: "I know what you mean", my: "ဘာဆိုလိုမှန်း နားလည်ပါတယ် — နားလည်မှု ပြသခြင်း။" },
    6: { letter: "a", text: "I agree", my: "သဘောတူပါတယ် — သဘောတူညီမှု ဖော်ပြခြင်း။" },
    7: { letter: "d", text: "Of course it is", my: "ဟုတ်တာပေါ့ — အပြည့်အဝ လက်ခံခြင်း။" },
    8: { letter: "g", text: "that's what I think", my: "ဒါက ကျွန်ုပ်ထင်မြင်ချက်ပါ — ကိုယ်ပိုင်အမြင် အတည်ပြုခြင်း။" },
  },
};
