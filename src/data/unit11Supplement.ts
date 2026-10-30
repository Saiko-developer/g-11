// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 11 sections 11A / 11B / 11C, keyed by exercise number — mirroring
// `unit9Supplement.ts` and the earlier unit supplements. No other unit's data
// is touched by this module.

import type { TrainCar } from "@/lib/sentenceStructure";

// Curated "Sentence Structure" breakdown for a single 11A question. Labels are
// English grammar tags; every gloss is natural Burmese only.
type SentenceBreakdown = { introMy: string; noteMy: string; cars: TrainCar[] };

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

export type GrammarNote = {
  whatMy: string;
  whenMy: string;
  whyMy: string;
  examples: { en: string; phrase: string }[];
};

export type UnitSupplement = {
  partAReadingTranslations: Record<number, string>;
  partBReadingTranslations: Record<number, string>;
  partCReadingTranslations: Record<number, string>;
  vocab: VocabItem[];
  partCGrammarTranslations: Record<number, string>;
  partBGrammarTranslations: Record<number, string>;
  grammar: GrammarNote;
};

/* ----------------------------- 11A Reading ----------------------------- */

export const partA11A_translations: Record<number, string> = {
  1: "မြန်မာနိုင်ငံ၏ မယှဉ်နိုင်သော အလှအပပစ္စည်း",
  2: "သနပ်ခါး အသုံးပြုပုံ",
  3: "သနပ်ခါးဆိုသည်မှာ အဘယ်နည်း",
  4: "သနပ်ခါး၏ ပုံစံအမျိုးမျိုး",
  5: "သနပ်ခါး၏ အနာဂတ်",
};

export const partB11A_translations: Record<number, string> = {
  1: "ပြောင်းလဲခြင်း၊ ကြီးထွားလာခြင်း၊ အောင်မြင်မှု",
  2: "အလွန်ရှားပါးသော၊ အလွန်ထူးခြားသော၊ အလွန်အဖိုးတန်သော",
  3: "ဖုံးအုပ်သည်၊ ထားသည်၊ ပြန့်နှံ့သည်",
  4: "တန်ဖိုးထားသော၊ ဂုဏ်ပြုသော၊ လေးစားသော",
  5: "ရှုပ်ထွေးသော၊ ဝမ်းသာသော၊ လန့်သွားသော",
};

export const partC11A_translations: Record<number, string> = {
  1: "ယနေ့ခေတ်တွင် အလှအပပစ္စည်းများ ရွေးချယ်နိုင်စွမ်း အရင်ကထက် ပိုများလာရခြင်း အကြောင်းရင်း အဘယ်နည်း။",
  2: "အခြားနိုင်ငံများနှင့် မြန်မာနိုင်ငံတွင် သနပ်ခါးကို အဓိက မည်သို့ အသုံးပြုကြသနည်း။",
  3: "အလှအပကို ဂရုစိုက်သော မိန်းကလေးပျိုများ မည်သည့်ရည်ရွယ်ချက်ဖြင့် သနပ်ခါးကို မျက်နှာတွင် လိမ်းကျံကြသနည်း။",
  4: "ယောက်ျားလေးများ၏ မျက်နှာပေါ်တွင်က်မည်မျှရောက်မှ ဝက်ခြံများ ပေါ်ပေါက်လာသနည်း။",
  5: "နေလင်းက ကပ်နေရင်းတွင် မောပန်းရင်းလုပ်ရသူများကို နေလောင်ခြင်းမှ အဘယ်အရာက ကာကွယ်ပေးသနည်း။",
  6: "ဆေးကျွေးကျွမ်းကျင်သူများအတွက် သနပ်ခါးပင်၏ အမြစ်များ အဘယ်ကြောင့် အဖိုးတန်သနည်း။",
  7: "သနပ်ခါးကို မည်သည့်ပုံစံများဖြင့် ရနိုင်သနည်း။",
  8: "မြန်မာမိန်းကလေးများစွာက အဘယ်ကြောင့် သနပ်ခါးကို ဆက်လက် မှီခိုနေကြဆဲနည်း။",
  9: "မိမိသည် သနပ်ခါး လိမ်းကျံခြင်းကို နှစ်သက်ပါသလား။ အဘယ်ကြောင့် နှစ်သက်/ှစ်သက်သနည်း။",
  10: "အနာဂတ်တွင် သနပ်ခါးကို အလှကပ်အဖြစ် အသုံးပြုခြင်းက ပိုလူကြိုက်များလာမည်ဟု ထင်ပါသလား၊ သို့မဟုတ် လျော့နည်းလာမည်ဟု ထင်ပါသလား။ အဘယ်ကြောင့်နည်း။",
};

/* ---- 11A Reading — Sentence Structure breakdowns (curated) ---- */
// One breakdown per 11A Exercise C question (full-sentence answers). Tags are
// always English and reuse TAG_INFO; every gloss is 100% Burmese.

export const partC11A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "'there are' (ရှိသည်) ပုံစံသုံးထားသော WH-မေးခွန်း။ 'there' သည် ပုံပမ်းကတ္တား (dummy subject) ဖြစ်ပြီး 'more choices' က အဓိကကတ္တား ဖြစ်သည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → be-ကြိယာ → ပုံပမ်းကတ္တား → အဓိကကတ္တား → ဝိဘတ်စကားစု။",
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "are", translation: "ရှိကြသနည်း", tag: "Linking Verb" },
      { word: "there", translation: "ရှိသည်ဟု ညွှန်ပြ (ပုံပမ်းကတ္တား)", tag: "Noun Subject" },
      { word: "more choices", translation: "ပိုမိုများပြားသော ရွေးချယ်စရာများ", tag: "Noun Subject" },
      { word: "of beauty products", translation: "အလှအပပစ္စည်းများ၏", tag: "Prepositional Phrase" },
      { word: "today", translation: "ယနေ့တွင်", tag: "Adverb" },
      { word: "than in the past", translation: "အတိတ်ကာလထက်", tag: "Prepositional Phrase" },
    ],
  },
  2: {
    introMy: "ဒါက ခံရသည့်ပုံစံ (passive) WH-မေးခွန်းပါ။ 'is' က အကူကြိယာ၊ 'used' က မူရင်းကြိယာ ဖြစ်သည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → အကူကြိယာ → ကတ္တား → ကြိယာဝိသေသန → မူရင်းကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "How", translation: "မည်သို့", tag: "WH-Question Word" },
      { word: "is", translation: "အသုံးပြုခံရသနည်း", tag: "Helping Verb" },
      { word: "thanakha", translation: "သနပ်ခါးကို", tag: "Noun Subject" },
      { word: "mainly", translation: "အဓိကအားဖြင့်", tag: "Adverb" },
      { word: "used", translation: "အသုံးပြုခံသည်", tag: "Main Verb" },
      { word: "in other countries and in Myanmar", translation: "အခြားနိုင်ငံများနှင့် မြန်မာနိုင်ငံတွင်", tag: "Prepositional Phrase" },
    ],
  },
  3: {
    introMy: "'For what purpose' ဖြင့် စတင်သော ရည်ရွယ်ချက် မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-စကားစု → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ကံ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "For what purpose", translation: "မည်သည့်ရည်ရွယ်ချက်ဖြင့်", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "beauty conscious ladies", translation: "အလှအပ ဂရုစိုက်သော မိန်းကလေးများသည်", tag: "Noun Subject" },
      { word: "apply", translation: "လိမ်းကျံကြသနည်း", tag: "Main Verb" },
      { word: "thanakha", translation: "သနပ်ခါးကို", tag: "Noun Object" },
      { word: "to their faces", translation: "မိမိတို့၏ မျက်နှာပေါ်တွင်", tag: "Prepositional Phrase" },
    ],
  },
  4: {
    introMy: "'At what age' ဖြင့် စတင်သော အရွယ်/အချိန် မေးခွန်းပါ။",
    noteMy: "ပုံစံ: WH-စကားစု → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "At what age", translation: "အဘယ်အရွယ်တွင်", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "pimples", translation: "ဝက်ခြံများသည်", tag: "Noun Subject" },
      { word: "appear", translation: "ပေါ်ပေါက်ကြသနည်း", tag: "Main Verb" },
      { word: "on the faces", translation: "မျက်နှာပေါ်တွင်", tag: "Prepositional Phrase" },
      { word: "of boys", translation: "ယောက်ျားလေးများ၏", tag: "Prepositional Phrase" },
    ],
  },
  5: {
    introMy: "'What' ဖြင့် စတင်ပြီး 'who' ဆက်စပ်အခန်း (relative clause) ပါဝင်သော မေးခွန်း။",
    noteMy: "ပုံစံ: WH-စကားလုံး → မူရင်းကြိယာ → ကံ → ဆက်စပ်အခန်း → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What", translation: "အဘယ်အရာက", tag: "WH-Question Word" },
      { word: "protects", translation: "ကာကွယ်ပေးသနည်း", tag: "Main Verb" },
      { word: "people", translation: "လူများကို", tag: "Noun Object" },
      { word: "who have to toil in the sun", translation: "နေပူထဲတွင် ပင်ပန်းစွာ လုပ်ဆောင်ရသူများကို", tag: "Relative Clause" },
      { word: "from sunburn", translation: "နေလောင်ခြင်းမှ", tag: "Prepositional Phrase" },
    ],
  },
  6: {
    introMy: "be-ကြိယာ 'are' + နာမဝိသေသန 'valuable' ဖြင့် ဖွဲ့စည်းထားသော SVC ပုံစံ မေးခွန်း။",
    noteMy: "ပုံစံ: WH-စကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တား → ဖြည့်စွက်စာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်ကြသနည်း", tag: "Linking Verb" },
      { word: "the roots of thanakha trees", translation: "သနပ်ခါးပင်များ၏ အမြစ်များသည်", tag: "Noun Subject" },
      { word: "valuable", translation: "အဖိုးတန်သနည်း", tag: "Complement" },
      { word: "to the medical man", translation: "ဆေးကျွေးကျွမ်းကျင်သူအတွက်", tag: "Prepositional Phrase" },
    ],
  },
  7: {
    introMy: "'In what forms' ဖြင့် စတင်သော မေးခွန်း။ 'available' သည် ဖြည့်စွက်စာ (Complement) ဖြစ်သည်။",
    noteMy: "ပုံစံ: WH-စကားစု → ဆက်စပ်ကြိယာ → ကတ္တား → ဖြည့်စွက်စာ။",
    cars: [
      { word: "In what forms", translation: "မည်သည့် ပုံစံများဖြင့်", tag: "WH-Question Word" },
      { word: "is", translation: "ရရှိနိုင်သနည်း", tag: "Linking Verb" },
      { word: "thanakha", translation: "သနပ်ခါးသည်", tag: "Noun Subject" },
      { word: "available", translation: "ရနိုင်သနည်း", tag: "Complement" },
    ],
  },
  8: {
    introMy: "'rely on' (မှီခိုသည်) သုံးထားသော WH-မေးခွန်း။ 'on thanakha' သည် ဝိဘတ်စကားစု ဖြစ်သည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → အကူကြိယာ → ကတ္တား → ကြိယာဝိသေသန → မူရင်းကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "many Myanmar ladies", translation: "မြန်မာ မိန်းကလေးများစွာသည်", tag: "Noun Subject" },
      { word: "still", translation: "ဆက်လက်", tag: "Adverb" },
      { word: "rely", translation: "မှီခိုကြသနည်း", tag: "Main Verb" },
      { word: "on thanakha", translation: "သနပ်ခါးကို", tag: "Prepositional Phrase" },
    ],
  },
  9: {
    introMy: "အကူကြိယာ 'Do' ဖြင့် စတင်သော Yes/No မေးခွန်း၊ နောက်ဆက်တွဲ 'Why or why not?' ဖြင့် အကြောင်းပြန် မေးသည်။",
    noteMy: "ပုံစံ: အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ကံ (to-infinitive စကားစု)။",
    cars: [
      { word: "Do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "like", translation: "နှစ်သက်ပါသလား", tag: "Main Verb" },
      { word: "to apply thanakha to your face", translation: "သနပ်ခါးကို မျက်နှာတွင် လိမ်းကျံရန်ကို", tag: "Noun Object" },
      { word: "Why or why not?", translation: "အဘယ်ကြောင့်နည်း (သို့) အဘယ်ကြောင့် မနည်းနည်း", tag: "WH-Question Word" },
    ],
  },
  10: {
    introMy: "'Do you think ...?' ပုံစံ Yes/No မေးခွန်း၊ နောက်တွင် 'Why?' လိုက်သည်။ 'think' ၏ ကံသည် ဝါကျတစ်ခုလုံး ဖြစ်သည်။",
    noteMy: "ပုံစံ: အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ကံ (ဝါကျ)။",
    cars: [
      { word: "Do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "think", translation: "ထင်ပါသလား", tag: "Main Verb" },
      { word: "the use of thanakha as a cosmetic will be more popular or less popular in the future", translation: "အနာဂတ်တွင် သနပ်ခါးကို အလှကပ်အဖြစ် အသုံးပြုခြင်းသည် ပိုလူကြိုက်များလာမည် (သို့) လျော့နည်းလာမည်", tag: "Noun Object" },
      { word: "Why?", translation: "အဘယ်ကြောင့်နည်း", tag: "WH-Question Word" },
    ],
  },
};

/* ---------------------------- 11B Vocabulary --------------------------- */

export const vocab11B: VocabItem[] = [
  {
    word: "booming",
    pronunciation: "/ˈbuːmɪŋ/ — ဘူးမင်း",
    meaningMy: "စည်ကားမြန်ဆန်နေသော / ကြီးထွားတိုးပွားလာနေသော",
    exampleEn: "With the booming of the beauty industry, there are more choices for beauty products.",
  },
  {
    word: "unique",
    pronunciation: "/juːˈniːk/ — ယူနစ်(ခ်)",
    meaningMy: "ထူးခြားသော / တစ်မူထူးသော",
    exampleEn: "Thanakha is a unique beauty product of Myanmar.",
  },
  {
    word: "inseparable",
    pronunciation: "/ɪnˈseprəbl/ — အင်ဆက်ပါရဘယ်",
    meaningMy: "ခွဲမရသော / ခွဲခြား၍မရသော",
    exampleEn: "It is inseparable from the daily life of most women in Myanmar.",
  },
  {
    word: "medicinal",
    pronunciation: "/məˈdɪsɪnl/ — မဒစ်ဆင်နယ်",
    meaningMy: "ဆေးဝါးနှင့် ဆိုင်သော / ရောဂါကုသရန် အသုံးပြုသော",
    exampleEn: "In other countries, it is used mostly for medicinal purposes.",
  },
  {
    word: "cosmetic",
    pronunciation: "/kɒzˈmetɪk/ — ကော့စ်မက်တစ်(ခ်)",
    meaningMy: "အလှကပ် / အလှအပဆိုင်ရာ ပစ္စည်း",
    exampleEn: "Only in Myanmar is it used mainly as a cosmetic.",
  },
  {
    word: "smear",
    pronunciation: "/smɪə/ — စမီးယား",
    meaningMy: "လိမ်းကျံသည် / သုတ်လိမ်းသည်",
    exampleEn: "To Myanmar children, it means just a paste their mothers smear on their faces and bodies after a bath.",
  },
  {
    word: "pimples and acne",
    pronunciation: "/ˈpɪmplz ənd ˈækni/ — ပင်ပယ်ဇ် အန် အက်နီ",
    meaningMy: "ဝက်ခြံများနှင့် မျက်နှာအဖုများ",
    exampleEn: "A thin layer of thanakha somewhat covers pimples and acne on their faces.",
  },
  {
    word: "sun block",
    pronunciation: "/sʌn blɒk/ — ဆန် ဘလော့(ခ်)",
    meaningMy: "နေလောင်မှုကို ကာကွယ်သော ပစ္စည်း",
    exampleEn: "A thick layer of thanakha definitely serves as a sun block.",
  },
  {
    word: "cherished",
    pronunciation: "/ˈtʃerɪʃt/ — ချဲရစ်ရှ်ထ်",
    meaningMy: "တန်ဖိုးထားသော / ချစ်မြတ်နိုးသော",
    exampleEn: "A sizable piece of thanakha serves as a cherished gift for his beloved.",
  },
  {
    word: "bewildered",
    pronunciation: "/bɪˈwɪldəd/ — ဘီဝီးလ်ဒဒ်",
    meaningMy: "ရှုပ်ထွေးသော / အံ့သြမောသော",
    exampleEn: "She is likely to be bewildered to see most local women with yellowish patches on their faces.",
  },
  {
    word: "kyauk pyin",
    pronunciation: "/tʃaʊʔ pjɪ̀ɴ/ — ကျောက်ပျဉ်",
    meaningMy: "သနပ်ခါး သွေးဖိကရန် အသုံးပြုသော ကျောက်ပြားပြား",
    exampleEn: "The paste is obtained by grinding the bark with a bit of water on a kyauk pyin.",
  },
  {
    word: "cultural heritage",
    pronunciation: "/ˈkʌltʃərəl ˈherɪtɪdʒ/ — ကယ်လ်ချာရယ် ဟဲရစ်တေ့ဂျ်",
    meaningMy: "ယဉ်ကျေးမှု အမွနှစ်",
    exampleEn: "This will surely help the world to recognize thanakha as a Myanmar cultural heritage.",
  },
];

/* ------------------------------ 11C Grammar ---------------------------- */

export const partA11C_translations: Record<number, string> = {
  1: "ကျွန်ုပ်တို့ ပြီးခဲ့သည့်နှစ် တိုကျိုတွင် တွေ့ဖူးသော မိန်းကလေးက ကျွန်ုပ်ထံ ပို့စ်ကတ် တစ်စောင် ပေးပို့သည်။ (whom)",
  2: "ဒေါ်နီလာသည် ကျွန်ုပ် Grade 3 တွင် အင်္ဂလိပ်စာ သင်ပေးခဲ့သော ဆရာမ ဖြစ်သည်။",
  3: "သူမသည် ကျွန်ုပ်တန်း၌ လက်ရေးအလှဆုံး ဖြစ်သော ကျောင်းသူ ဖြစ်သည်။",
  4: "သူမသည် အာရုံစူးစိုက်မှု၏ ဗဟိုဖြစ်လိုသော လူများထဲမှ တစ်ဦး ဖြစ်သည်။",
  5: "ဒေါ်နုသည် မိမိ၏ တာဝန်များကို အလေးထားလုပ်ဆောင်သူ ဖြစ်သည်။",
  6: "ရဲတပ်ဖွဲ့က မနေ့ညက အကြီးအကဲများ ဖမ်းဆီးခံရသော ကုမ္ပဏီကို စုံစမ်းစစ်ဆေးနေသည်။",
  7: "ကျွန်ုပ် ပန်းစည်းများ ပို့ပေးခဲ့သောမီးကို သင် သိပါသလား။",
  8: "ထိုကျောင်းကို ရောဂါကြောင့် ပညာရေး ချောင့်ချိုက်ခဲ့ရသော ကလေးများအတွက် အထူးထူးတည်ထောင်ထားသည်။",
  9: "ရထားပေါ်တွင် ကျွန်ုပ်တို့ တွေ့ခဲ့သော ပုဂ္ဂိုလ်က အလွန်အကူညီပေးပါသည်။",
  10: "မေးမြန်းရန် ရှက်သူသည် သင်ယူရန် ရှက်သင့်သည်။",
};

export const partB11C_translations: Record<number, string> = {
  1: "ကျွန်ုပ်၏ အိမ်ရှေ့တွင် မော်တော်ကား ပျက်စီးသွားသော မိန်းကလေးကို ကျွန်ုပ် ကူညီခဲ့သည်။",
  2: "ကျွန်ုပ်၏ ညီမမင်္ဂလာဆောင်သို့ လာသော ဝေးလံသော ဆွေမျိုးများကို ကျွန်ုပ် ခပ်ခွာခွာ လိုက်လံ သိမြင်မိခဲ့သည်။",
  3: "ကျွန်ုပ်တို့ကျောင်းသို့ လတ်တလော ပြောင်းရွေ့လာသော ညီညီသည် ဘောလုံး ကစားရာတွင် အလွန်ကျွမ်းကျင်သည်။",
  4: "လမ်းထဲတွင် ကစားနေသော ကလေးများသည် ကျွန်ုပ်တို့ကျောင်းမှ မဟုတ်ပါ။",
  5: "ကျွန်ုပ်တို့နှင့် အိမ်နီးနားချင်း နေထိုင်သော လူများက အလွန်ရင်းနှီးကြသည်။",
  6: "သကြီးရွယ်အိုများရုံသည် မိမိတို့ကို ပြုစုစောင့်ရှောက်စရာ မည်သူမျှ မရှိသော အသက်ကြီးရွယ်အိုများအတွက် ဖြစ်သည်။",
  7: "သူ၏အယ်လ်ဘမ်များကို ကျွန်ုပ် အမြဲဝယ်ယူနေကျ နာမည်ကြီး အဆိုတော်ကို မိတ်ဆွေ၏ မွေးနေ့ပွဲတွင် တွေ့ခဲ့သည်။",
  8: "တစ်နှစ်လုံး ကြိုးစားလေ့ကျင့်ခဲ့သော ဆိုင်ကယ်စီးသူက ပြိုင်ပွဲကို နိုင်ခဲ့သည်။",
  9: "ဧည့်သည်များက ရင်းနှီးပြီး အကူညီပေးတတ်သော အရောင်းဝန်ထမ်းများကို ကြှစ်သက်ကြသည်။",
  10: "လူတိုင်း ယုံကြည်ခဲ့သော အေးအေးကို ကျွန်ုပ်တို့ အဖွဲ့ခေါင်းဆောင်အဖြစ် ရွေးချယ်ခဲ့သည်။",
};

export const grammar11C: GrammarNote = {
  whatMy:
    "Relative Pronouns (ဆက်စပ်နာမ်စားများ) ဖြစ်သော who, whom နှင့် whose ကို လူများနှင့် ဆက်စပ်၍ အသုံးပြုသည်။ who ကို ဝါကျ၏ subject (ကတ္တား) အဖြစ် လူများကို ရည်ညွှန်းရာတွင် အသုံးပြုပြီး whom ကို object (ကံ) ဖြစ်သော လူများအတွက် အသုံးပြုသည်။ whose ကို လူများနှင့် တိရစ္ဆာန်များ၏ ပိုင်ဆိုင်မှုကို ဖော်ပြရာတွင် အသုံးပြုသည်။",
  whenMy:
    "who သည် ကြိယာ၏ subject ဖြစ်သောအခါ (e.g. Daw Nilar is my teacher, who taught me English ...)၊ whom သည် ကြိယာ၏ object ဖြစ်သောအခါ သို့မဟုတ် preposition ၏ object ဖြစ်သောအခါ (e.g. The girl, whom we met in Tokyo ... / the person to whom I sent flowers)၊ whose သည် ပိုင်ဆိုင်မှုကို ပြသောအခါ (e.g. She is the student whose handwriting is the best ...) အသုံးပြုသည်။",
  whyMy:
    "Relative pronoun များဖြင့် ဝါကျနှစ်ချောင်းကို ပေါင်းစပ်ရေးသားခြင်းက စာပေပိုမို ချက်ချင်းကျစေသည်။ ဥပမာ — 'I helped the girl. Her car had broken down.' ဆိုသော ဝါကျနှစ်ချောင်းကို 'I helped the girl whose car had broken down.' ဟု whose ဖြင့် ပေါင်းနိုင်သည်။ ရိုးရိုး ပြောဆိုရေးသားမှုတွင် object ဖြစ်၍လည်း who ကို whom အစား အသုံးပြုနိုင်သော်လည်း စာပေပုံစံ (formal writing) တွင် whom ကို သုံးသင့်သည်။",
  examples: [
    { en: "Daw Nilar is my teacher, who taught me English when I was in Grade 3.", phrase: "who taught" },
    { en: "Do you know the woman, whom I sent those flowers to?", phrase: "whom I sent" },
    { en: "She is the student, whose handwriting is the best in my class.", phrase: "whose handwriting" },
  ],
};

/* ------------------------- Aggregated supplement ----------------------- */

export const unit11Supplement: UnitSupplement = {
  partAReadingTranslations: partA11A_translations,
  partBReadingTranslations: partB11A_translations,
  partCReadingTranslations: partC11A_translations,
  vocab: vocab11B,
  partCGrammarTranslations: partA11C_translations,
  partBGrammarTranslations: partB11C_translations,
  grammar: grammar11C,
};

/* -------------------- 11D Listening and Speaking ----------------------- */
// Real data taken from the Unit 11 audio track ("Unit 11 – Thanakha") and the
// Grade-9 textbook page for 11D. Transcript lines are the spoken dialogue
// between Mary (an Australian visitor) and Sandar.

export type DialogueLine = { speaker: string; en: string; my: string };

export const listening11D_intro = {
  en: "Mary is a visitor from Australia. This is her very first visit to Myanmar. Her new friend Sandar is showing her around Baho Market in Shwebo.",
  my: "မေရီသည် အော်စတြေးလျားမှ လာလည်သူ ဖြစ်သည်။ ဒါက သူမ၏ မြန်မာနိုင်ငံ ပထမဆုံး အလည်အပတ် ဖြစ်သည်။ သူမ၏ သူငယ်ချင်းအသစ် စန္ဒာက ရွှေဘိုမြို့ ဗဟိုဇေးကို လိုက်ပြနေသည်။",
};

export const listening11D_transcript: DialogueLine[] = [
  {
    speaker: "Mary",
    en: "Sandar, may I ask a question about Myanmar customs and practices?",
    my: "စန္ဒာရေ၊ မြန်မာ့ ထုံးတမ်းစဉ်လာနှင့် အလေ့အထများအကြောင်း မေးခွန်းတစ်ခု မေးလို့ရမလား။",
  },
  {
    speaker: "Sandar",
    en: "Of course you can. Please do.",
    my: "ဟုတ်ကဲ့၊ မေးလို့ရပါတယ်။ မေးပါ။",
  },
  {
    speaker: "Mary",
    en: "I am not being impolite, but I am very curious.",
    my: "ရိုင်းစိုင်းလိုတာ မဟုတ်ပါဘူး၊ ဒါပေမဲ့ အရမ်း သိချင်စိတ် ရှိနေတယ်။",
  },
  {
    speaker: "Sandar",
    en: "Please, feel free to ask.",
    my: "အားမနာဘဲ လွတ်လွတ်လပ်လပ် မေးပါ။",
  },
  {
    speaker: "Mary",
    en: "Why do Myanmar people paint their faces yellow?",
    my: "မြန်မာလူမျိုးများက အဘယ်ကြောင့် မျက်နှာကို အဝါရောင် ဆေးသုတ်ကြသနည်း။",
  },
  { speaker: "Sandar", en: "What do you mean?", my: "ဘာကို ဆိုလိုတာလဲ။" },
  {
    speaker: "Mary",
    en: "Everywhere I go, I see children, men, women of all ages with yellow paint on their cheeks and foreheads. Who are they trying to hide from?",
    my: "ကျွန်မ သွားသမျှ နေရာတိုင်းမှာ ကလေးများ၊ အမျိုးသားများ၊ အသက်အရွယ်မျိုးစုံ အမျိုးသမီးများက ပါးနှင့် နဖူးပေါ်တွင် အဝါရောင် ဆေးရေးထားတာ တွေ့တယ်။ သူတို့ ဘယ်သူ့ဆီက ဖွက်ချင်နေတာလဲ။",
  },
  {
    speaker: "Sandar",
    en: "Mary, no. They are not trying to hide from anyone or anything.",
    my: "မေရီရေ၊ မဟုတ်ဘူး။ သူတို့က မည်သူ့ဆီကမှ၊ မည်သည့်အရာဆီကမှ ဖွက်နေတာ မဟုတ်ဘူး။",
  },
  {
    speaker: "Mary",
    en: "Do they wear it for religious reasons? Is the paint sacred? Does it come in other colours? Is the paint imported from China?",
    my: "ဘာသာရေး အကြောင်းအရင်းကြောင့် လိမ်းတာလား။ ဒီဆေးက မြတ်နိုးဖွယ် သန့်ရှင်းသောအရာလား။ အခြားအရောင်များလည်း ရှိသလား။ ဒီဆေးကို တရုတ်ပြည်မှ တင်သွင်းတာလား။",
  },
  {
    speaker: "Sandar",
    en: "Oh, Mary, you have many questions. First of all, it is not paint. It is thanakha.",
    my: "အိုး မေရီ၊ မေးခွန်းတွေ အများကြီးပဲ။ ဦးစွာပထမ — ဒါက ဆေးသုတ် မဟုတ်ဘူး။ ဒါက သနပ်ခါးပါ။",
  },
  { speaker: "Mary", en: "Thanakha?", my: "သနပ်ခါး ဟုတ်လား။" },
  {
    speaker: "Sandar",
    en: "Would you like to know more?",
    my: "ပိုသိချင်ပါသလား။",
  },
  { speaker: "Mary", en: "Thanks, I'd love to.", my: "ကျေးဇူးပါ၊ သိချင်ပါတယ်။" },
  {
    speaker: "Sandar",
    en: "Thanakha is a tree. The bark is ground on a flat, circular stone with water to get a paste. It is used as a beauty treatment and sometimes medicine.",
    my: "သနပ်ခါးက အပင်တစ်မျိုးပါ။ အခွံကို ပြားပြားလုံးဝိုင်း ကျောက်ပျဉ်ပေါ်တွင် ရေအနည်းငယ်ဖြင့် သွေးပြီး အနှစ်(အခေါင်း) ရယူသည်။ အလှအပ ပြုပြင်မှုအဖြစ် အသုံးပြုပြီး တစ်ခါတစ်ရံ ဆေးဝါးအဖြစ်လည်း အသုံးပြုသည်။",
  },
  {
    speaker: "Mary",
    en: "This is very interesting. Do you know that I am a beauty and cosmetics specialist?",
    my: "ဒါ အရမ်း စိတ်ဝင်စားဖွယ်ပါ။ ကျွန်မက အလှအပနှင့် အလှကပ်ပစ္စည်း ကျွမ်းကျင်သူ ဖြစ်တာ သိလား။",
  },
  {
    speaker: "Sandar",
    en: "My mother, who is an expert on traditional medicine, taught me that thanakha helps protect the skin from the sun. Myanmar people who work in the sun smear thanakha on their faces.",
    my: "ကျွန်မ အမေက ရိုးရာဆေးဝါး ကျွမ်းကျင်သူ ဖြစ်ပြီး၊ သနပ်ခါးက အသားအရေကို နေမှ ကာကွယ်ပေးသည်ဟု သင်ပေးခဲ့တယ်။ နေပူထဲ အလုပ်လုပ်ရသော မြန်မာလူမျိုးများက မျက်နှာတွင် သနပ်ခါး လိမ်းကျံကြတယ်။",
  },
  {
    speaker: "Sandar",
    en: "I have also seen young women who do not work outside in the sun with thin, creamy thanakha spread on their faces.",
    my: "နေပူထဲ အပြင်တွင် အလုပ်မလုပ်ရသော အမျိုးသမီးငယ်များပါ မျက်နှာတွင် ပေါ့ပေါ့ပါးပါး သနပ်ခါး လိမ်းထားတာ တွေ့ဖူးတယ်။",
  },
  {
    speaker: "Mary",
    en: "What do you think about women of our age putting thanakha on their faces?",
    my: "ကျွန်မတို့အရွယ် အမျိုးသမီးများ မျက်နှာတွင် သနပ်ခါး လိမ်းခြင်းအကြောင့် ဘယ်လို ထင်ပါသလဲ။",
  },
  {
    speaker: "Sandar",
    en: "I think it is a good practice. They are taking care of their skin.",
    my: "ကောင်းသော အလေ့အထလို့ ထင်တယ်။ သူတို့က မိမိတို့ အသားအရေကို ထိန်းသိမ်းနေကြတယ်။",
  },
  {
    speaker: "Mary",
    en: "Why do parents put it on the faces of their children?",
    my: "မိဘများက အဘယ်ကြောင့် သားသမီးများ မျက်နှာတွင် လိမ်းပေးကြသနည်း။",
  },
  {
    speaker: "Sandar",
    en: "Thanakha helps protect the children's faces from the sun. It is also soothing to the skin and smells nice. Parents who have children also do this to show their love.",
    my: "သနပ်ခါးက ကလေးများ၏ မျက်နှာကို နေမှ ကာကွယ်ပေးတယ်။ အသားအရေကို အေးချမ်းစေပြီး အနံ့လည်း ကောင်းတယ်။ ကလေးရှိသော မိဘများက မေတ္တာကို ပြသရန်လည်း ဒီလို လုပ်ကြတယ်။",
  },
  { speaker: "Mary", en: "Is thanakha expensive?", my: "သနပ်ခါးက အဖိုးတန်သလား (ဈေးကြီးသလား)။" },
  {
    speaker: "Sandar",
    en: "The price depends on which product is used. It can be bought as pieces of wood or ready-made in the form of creams, lotions, cakes, or powders.",
    my: "ဈေးနှုန်းက မည်သည့်ပစ္စည်းကို အသုံးပြုသည်ပေါ် မှတည်တယ်။ သစ်သားအတုံးအစ အဖြစ် ဝယ်နိုင်တယ်၊ ဒါမှမဟုတ် ကရင်မ်၊ လိုးရှင်း၊ အလုံးအခဲ သို့မဟုတ် အမှုန့် အဖြစ် အသင့်ပြင်ထား(ready-made) ဝယ်နိုင်တယ်။",
  },
];

export const partA11D_translations: Record<number, string> = {
  1: "မေရီက စန္ဒာကို __ အကြောင်း မေးမြန်းခဲ့သည်။",
  2: "မေရီက မြန်မာလူမျိုးများသည် မျက်နှာကို အဝါရောင် __ ဟု ထင်ခဲ့သည်။",
  3: "မေရီက သူမ သွားသည့်နေရာတိုင်းတွင် မြန်မာလူမျိုးများ၏ ပါးနှင့် နဖူးပေါ်၌ __ ရှိသည်ကို တွေ့ခဲ့ရသည်ဟု ပြောသည်။",
  4: "စန္ဒာက သနပ်ခါးကို __ အဖြစ် အသုံးပြုပြီး တစ်ခါတစ်ရံ ဆေးဝါးအဖြစ်လည်း အသုံးပြုကြောင်း မေရီကို ရှင်းပြခဲ့သည်။",
  5: "စန္ဒာ၏ အမေသည် __ ကျွမ်းကျင်သူ ဖြစ်သည်။",
  6: "သနပ်ခါးက __ မျက်နှာများကို နေရောင်မှ ကာကွယ်ပေးကြောင်း စန္ဒာက မေရီကို ပြောခဲ့သည်။",
  7: "သနပ်ခါးကို သစ်သားအတုံးများအဖြစ် သို့မဟုတ် ခရင်မ်၊ လိုးရှင်း၊ အခဲနှင့် အမှုန့်ပုံစံများဖြင့် __ ဝယ်ယူနိုင်ကြောင်း စန္ဒာက ပြောခဲ့သည်။",
};

export const partB11D_translations: Record<number, string> = {
  1: "'Would you care to come along?' — 'အတူလိုက်ချင်ပါသလား' ဟု ဖိတ်ကြားသော အဆိုပြုချက်။",
  2: "'Yes, I would' — အဆိုပြုချက်ကို လက်ခံသည်။ ('would you ...?' ကို 'I would' ဖြင့် တိုအောင် ပြန်ဖြေသည်။)",
  3: "'Why don't you buy ...?' — 'ဝယ်လိုက်ပါလား' ဟု အကြံပြုသည်။",
  4: "'That sounds great, but ...' — အကြံပြုချက်ကို နှစ်သက်သော်လည်း သဘောမတူ/ပယ်သည်ကို ယဉ်ကျေးစွာ ဖော်ပြသည်။",
  5: "'That's a good idea, but I've never used it.' — အကြံပြုချက်ကို ကောင်းသည်ဟု လက်ခံသည်။",
};

// Model answer for Part C (souvenir shopping with Susan).
export const partC11D_modelDialogue: DialogueLine[] = [
  {
    speaker: "Susan",
    en: "I'd like to buy souvenirs for my friends back home. Would you help me choose?",
    my: "အိမ်ပြန်ရင် သူငယ်ချင်းများအတွက် အမှတ်တရ လက်မှတ်များ ဝယ်ချင်တယ်။ ရွေးပေးမလား။",
  },
  {
    speaker: "You",
    en: "Of course. Why don't you buy some thanakha cakes and a kyauk pyin? They are unique to Myanmar.",
    my: "ဟုတ်ကဲ့။ သနပ်ခါးအခဲများနှင့် ကျောက်ပျဉ်တစ်ချပ် ဝယ်လိုက်ပါလား။ မြန်မာနိုင်ငံမှသာ ရှိသော ထူးခြားပစ္စည်းများပါ။",
  },
  {
    speaker: "Susan",
    en: "That's a great idea! Where can I buy them?",
    my: "ဒါ အလွန်ကောင်းသော အကြံပါ။ ဘယ်မှာ ဝယ်နိုင်မလဲ။",
  },
  {
    speaker: "You",
    en: "Shall we go to Bogyoke Market? They also sell lacquerware, longyi and handmade bags there.",
    my: "ဗိုလ်ချုပ်ဇေးကို သွားကြမလား။ အဲဒီမှာ ယွန်းထည်၊ လုံချည်နှင့် လက်လုပ် အိတ်များပါ ရောင်းတယ်။",
  },
  {
    speaker: "Susan",
    en: "That sounds good. Would you like to come with me tomorrow morning?",
    my: "ဒါ ကောင်းပါတယ်။ မနက်ဖန် နံနက်ပိုင်း ကျွန်မနှင့် အတူလိုက်ချင်ပါသလား။",
  },
  {
    speaker: "You",
    en: "Thanks! I'd love to. Let's meet at nine o'clock.",
    my: "ကျေးဇူးပါ၊ လိုက်ချင်ပါတယ်။ ကိုးနာရီမှာ တွေ့ကြရအောင်။",
  },
];
