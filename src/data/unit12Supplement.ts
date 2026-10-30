// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 12 sections 12A / 12B / 12C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts`, `unit3Supplement.ts`,
// `unit4Supplement.ts`, `unit5Supplement.ts`, `unit6Supplement.ts`,
// `unit7Supplement.ts`, `unit8Supplement.ts`, `unit9Supplement.ts`,
// `unit10Supplement.ts` and `unit11Supplement.ts`. Units 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
// and 11 data are never touched by this module.

import type { TrainCar } from "@/lib/sentenceStructure";

export type SentenceBreakdown = {
  cars: TrainCar[];
  introMy: string;
  noteMy: string;
};

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

/* ----------------------------- 12A Reading ------------------------------ */

export const partA12A_translations: Record<number, string> = {
  1: "ပထမကွက်လပ်",
  2: "ဒုတိယကွက်လပ်",
  3: "တတိယကွက်လပ်",
  4: "စတုတ္ထကွက်လပ်",
  5: "ပဉ္စမကွက်လပ်",
};

export const partB12A_translations: Record<number, string> = {
  1: "ဆေးဝါးကုသမှု ဝန်ဆောင်မှုပေးသူများ",
  2: "ပညာရေး အဖွဲ့အစည်းများ",
  3: "မြို့ပြ သက်တောင့်သက်သာမှုနှင့် အဆင်ပြေချောမွေ့မှုများ",
  4: "မြို့ပြဖြစ်ထွန်းလာမှုက ဖြစ်ပေါ်စေသော မလိုလားအပ်သည့် ရလဒ်များ",
  5: "မြို့ပြ ရာဇဝတ်မှုများ",
};

export const partC12A_translations: Record<number, string> = {
  1: "ကျေးလက်ဒေသတွင် နေထိုင်သူများသည် မိမိတို့၏ ကျေးလက်နေအိမ်များကို အဘယ်အကြောင်းများကြောင့် မကြာခဏ စွန့်ခွာကြသနည်း။",
  2: "စာသားတွင် ပါရှိသော \"greener pastures\" ဟူသည့် စကားစုသည် မည်သည့်အနက်နှင့် အနီးစပ်ဆုံး တူသနည်း။",
  3: "လူသားများသည် ဘဝပိုမိုကောင်းမွန်လိုသောအခါ မည်သို့ ပြုလုပ်ကြသနည်း။",
  4: "ကျေးလက်ဒေသတွင် ခေတ်မီ တိရစ္ဆာန်မွေးမြူရေးနှင့် နို့စားခြံများ တည်ထောင်လာသောအခါ ထိုဒေသရှိ ကျေးလက်လယ်သမားများသည် မည်သို့ ဖြစ်လာသနည်း။",
  5: "ကမ္ဘာ့အချို့ဒေသများတွင် စစ်ဘေးကြောင့် ရွာသားများသည် မည်သည့်အရာကို ပြုလုပ်ရသနည်း။",
  6: "မြို့ပြဖြစ်ထွန်းလာမှုသည် မည်သို့သော မလိုလားအပ်သည့် ရလဒ်များကို ဖြစ်ပေါ်စေသနည်း။",
  7: "ကျူးကျော်ရပ်ကွက်များ တိုးပွားလာမှုနှင့်အတူ လူများသည် မည်သည့်နေရာတွင် နေထိုင်ရန် အတင်းအကျပ် ဖြစ်ရသနည်း။",
  8: "အလုပ်အကိုင် အခွင့်အလမ်းများ ပိုမိုဖန်တီးနိုင်ပါက မည်သည့်ပြဿနာကို ဖြေရှင်းနိုင်မည်နည်း။",
  9: "ရဲတပ်ဖွဲ့အင်အားကို မည်မျှအထိ တိုးချဲ့သင့်သနည်း။",
  10: "သင်သည် ရွာတစ်ရွာတွင် နေထိုင်ခဲ့လျှင် မြို့ကြီးသို့ ရွှေ့ပြောင်းမည်လား၊ အဘယ်ကြောင့်နည်း။",
  11: "သင်သည် ရွာတွင် နေထိုင်လိုသလား၊ မြို့ကြီးတွင် နေထိုင်လိုသလား၊ အဘယ်ကြောင့်နည်း။",
};

export const compCheck12A_translations: Record<number, string> = {
  1: "မြို့ပြဖြစ်ထွန်းလာမှု ဆိုသည်မှာ အဘယ်နည်း။",
  2: "မြို့ပြဖြစ်ထွန်းလာမှု၏ အကြောင်းရင်းများမှာ အဘယ်တို့နည်း။",
  3: "မြို့ပြဖြစ်ထွန်းလာမှု၏ အားသာချက်များမှာ အဘယ်တို့နည်း။",
  4: "မြို့ပြဖြစ်ထွန်းလာမှု၏ အားနည်းချက်များမှာ အဘယ်တို့နည်း။",
  5: "မြို့ပြဖြစ်ထွန်းလာမှု ပြဿနာများအတွက် ဖြေရှင်းနည်းအချို့မှာ အဘယ်တို့နည်း။",
};

export const partC12A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "\"For what reasons\" ဖြင့် အစပြုသော WH-မေးခွန်း။ အကူကြိယာ \"do\" ပြီးမှ ကတ္တားနှင့် မူရင်းကြိယာ လိုက်ပါသည်။",
    noteMy: "ပုံစံ: WH-စကားစု → အကူကြိယာ → ကတ္တား (ဆက်စပ်စာစုပါ) → ကြိယာဝိသေသန → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "For what reasons", translation: "အဘယ်အကြောင်းများကြောင့်", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "people living in the countryside", translation: "ကျေးလက်ဒေသတွင် နေထိုင်သူများသည်", tag: "Noun Subject" },
      { word: "often", translation: "မကြာခဏ", tag: "Adverb" },
      { word: "leave", translation: "စွန့်ခွာကြသနည်း", tag: "Main Verb" },
      { word: "their rural homes", translation: "မိမိတို့၏ ကျေးလက်နေအိမ်များကို", tag: "Noun Object" },
    ],
  },
  2: {
    introMy: "ဤဝါကျသည် ကတ္တား + be-ကြိယာ + ဖြည့်စွက်စာ ဖွဲ့စည်းမှုဖြင့် စကားစုတစ်ခု၏ အနက်ကို မေးထားသည်။",
    noteMy: "ပုံစံ: ကတ္တားစကားစု → ဆက်စပ်ကြိယာ → ဖြည့်စွက်စာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "The phrase 'greener pastures'", translation: "\"greener pastures\" ဟူသော စကားစုသည်", tag: "Noun Subject" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "similar", translation: "တူညီသည်", tag: "Complement" },
      { word: "in meaning", translation: "အနက်အားဖြင့်", tag: "Prepositional Phrase" },
    ],
  },
  3: {
    introMy: "အချိန်ပြ ဆက်စပ်ဝါကျ (Adverb Clause) ဖြင့် အစပြုပြီး နောက်တွင် WH-မေးခွန်း ပင်မဝါကျ လိုက်သည်။",
    noteMy: "ပုံစံ: အချိန်ပြဆက်စပ်ဝါကျ → WH-စကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "When human beings wish to be better", translation: "လူသားများသည် ပိုမိုကောင်းမွန်လိုသောအခါ", tag: "Adverb Clause" },
      { word: "what", translation: "မည်သည့်အရာကို", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "they", translation: "သူတို့သည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်ကြသနည်း", tag: "Main Verb" },
    ],
  },
  4: {
    introMy: "ခံရသည့်ပုံစံ (passive) အချိန်ပြဆက်စပ်ဝါကျ ရှေ့တွင် ရှိပြီး ပင်မမေးခွန်းသည် \"what happens\" ဖြစ်သည်။",
    noteMy: "ပုံစံ: အချိန်ပြဆက်စပ်ဝါကျ → WH-စကားလုံး → ကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "When modern livestock and dairy farms are established in the countryside", translation: "ကျေးလက်ဒေသတွင် ခေတ်မီ တိရစ္ဆာန်မွေးမြူရေးနှင့် နို့စားခြံများ တည်ထောင်လာသောအခါ", tag: "Adverb Clause" },
      { word: "what", translation: "မည်သည့်အရာ", tag: "WH-Question Word" },
      { word: "happens", translation: "ဖြစ်ပေါ်သနည်း", tag: "Main Verb" },
      { word: "to the rural farmers there", translation: "ထိုဒေသရှိ ကျေးလက်လယ်သမားများအပေါ်", tag: "Prepositional Phrase" },
    ],
  },
  5: {
    introMy: "အကြောင်းပြ ဝိဘတ်စကားစုဖြင့် အစပြုပြီး နောက်တွင် WH-မေးခွန်း လိုက်သည်။",
    noteMy: "ပုံစံ: အကြောင်းပြဝိဘတ်စကားစု → WH-စကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "Because of war in some parts of the world", translation: "ကမ္ဘာ့အချို့ဒေသများတွင် စစ်ဘေးကြောင့်", tag: "Prepositional Phrase" },
      { word: "what", translation: "မည်သည့်အရာကို", tag: "WH-Question Word" },
      { word: "do", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "people in villages", translation: "ရွာများတွင် နေထိုင်သူများသည်", tag: "Noun Subject" },
      { word: "have to do", translation: "ပြုလုပ်ရသနည်း", tag: "Main Verb" },
    ],
  },
  6: {
    introMy: "\"What kind of ...\" ဖြင့် အမျိုးအစားကို မေးသော WH-မေးခွန်း။",
    noteMy: "ပုံစံ: WH-စကားစု (ကံပါဝင်) → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What kind of undesirable results", translation: "မည်သို့သော မလိုလားအပ်သည့် ရလဒ်များကို", tag: "WH-Question Word" },
      { word: "does", translation: "မေးခွန်းပြု အကူကြိယာ", tag: "Helping Verb" },
      { word: "urbanization", translation: "မြို့ပြဖြစ်ထွန်းလာမှုသည်", tag: "Noun Subject" },
      { word: "bring about", translation: "ဖြစ်ပေါ်စေသနည်း", tag: "Main Verb" },
    ],
  },
  7: {
    introMy: "ဝိဘတ်စကားစုဖြင့် အစပြုပြီး ခံရသည့်ပုံစံ (passive) WH-မေးခွန်း လိုက်သည်။",
    noteMy: "ပုံစံ: ဝိဘတ်စကားစု → WH-စကားလုံး → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "With the growth of slums", translation: "ကျူးကျော်ရပ်ကွက်များ တိုးပွားလာမှုနှင့်အတူ", tag: "Prepositional Phrase" },
      { word: "where", translation: "မည်သည့်နေရာတွင်", tag: "WH-Question Word" },
      { word: "are", translation: "ခံရသည့်ပုံစံ အကူကြိယာ", tag: "Helping Verb" },
      { word: "people", translation: "လူများသည်", tag: "Noun Subject" },
      { word: "forced to live", translation: "နေထိုင်ရန် အတင်းအကျပ် ခံရသနည်း", tag: "Main Verb" },
    ],
  },
  8: {
    introMy: "အကြောင်းအခြေပြ (if) ဆက်စပ်ဝါကျ ရှေ့တွင် ရှိပြီး ပင်မမေးခွန်းသည် ခံရသည့်ပုံစံ ဖြစ်သည်။",
    noteMy: "ပုံစံ: if-ဆက်စပ်ဝါကျ → WH-စကားစု → အကူကြိယာ → မူရင်းကြိယာ။",
    cars: [
      { word: "If more job opportunities can be created", translation: "အလုပ်အကိုင် အခွင့်အလမ်းများ ပိုမိုဖန်တီးနိုင်ပါက", tag: "Adverb Clause" },
      { word: "what problem", translation: "မည်သည့်ပြဿနာကို", tag: "WH-Question Word" },
      { word: "can be", translation: "နိုင်သည် (အကူကြိယာစု)", tag: "Helping Verb" },
      { word: "solved", translation: "ဖြေရှင်းနိုင်မည်နည်း", tag: "Main Verb" },
    ],
  },
  9: {
    introMy: "\"To what extent\" သည် အတိုင်းအတာကို မေးသော ဝိဘတ်စကားစု ဖြစ်သည်။ ပင်မဝါကျသည် ခံရသည့်ပုံစံ။",
    noteMy: "ပုံစံ: အတိုင်းအတာပြ WH-စကားစု → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "To what extent", translation: "မည်မျှအထိ", tag: "WH-Question Word" },
      { word: "should", translation: "သင့်သည် (အကူကြိယာ)", tag: "Helping Verb" },
      { word: "the police force", translation: "ရဲတပ်ဖွဲ့အင်အားကို", tag: "Noun Subject" },
      { word: "be expanded", translation: "တိုးချဲ့သနည်း", tag: "Main Verb" },
    ],
  },
  10: {
    introMy: "အခြေအနေမှန်းဆချက် (second conditional) မေးခွန်း — if-ဝါကျတွင် past ပုံစံ၊ ပင်မဝါကျတွင် \"would\"။",
    noteMy: "ပုံစံ: if-ဆက်စပ်ဝါကျ → အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "If you were living in a village", translation: "သင်သည် ရွာတစ်ရွာတွင် နေထိုင်ခဲ့လျှင်", tag: "Adverb Clause" },
      { word: "would", translation: "မည်လား (အကူကြိယာ)", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "move", translation: "ရွှေ့ပြောင်းမည်", tag: "Main Verb" },
      { word: "to a big city", translation: "မြို့ကြီးသို့", tag: "Prepositional Phrase" },
    ],
  },
  11: {
    introMy: "ရွေးချယ်စရာ နှစ်ခုကို တွဲပေးထားသော Yes/No မေးခွန်း ဖြစ်သည်။",
    noteMy: "ပုံစံ: အကူကြိယာ → ကတ္တား → မူရင်းကြိယာ → ဝိဘတ်စကားစု (ရွေးချယ်စရာနှစ်ခု)။",
    cars: [
      { word: "Would", translation: "လိုပါသလား (အကူကြိယာ)", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "like to live", translation: "နေထိုင်လိုသနည်း", tag: "Main Verb" },
      { word: "in a village or a big city", translation: "ရွာတွင်လား၊ မြို့ကြီးတွင်လား", tag: "Prepositional Phrase" },
    ],
  },
};

export const compCheck12A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "\"What is ...?\" ပုံစံ အနက်မေးခွန်း — WH-စကားလုံး + be-ကြိယာ + ကတ္တား။",
    noteMy: "ပုံစံ: WH-စကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တား။",
    cars: [
      { word: "What", translation: "အဘယ်နည်း", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "urbanization", translation: "မြို့ပြဖြစ်ထွန်းလာမှု ဆိုသည်မှာ", tag: "Noun Subject" },
    ],
  },
  2: {
    introMy: "အများကိန်း ကတ္တားနှင့် \"are\" ကို တွဲသုံးသော WH-မေးခွန်း။",
    noteMy: "ပုံစံ: WH-စကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တားစကားစု။",
    cars: [
      { word: "What", translation: "အဘယ်တို့နည်း", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the causes of urbanization", translation: "မြို့ပြဖြစ်ထွန်းလာမှု၏ အကြောင်းရင်းများမှာ", tag: "Noun Subject" },
    ],
  },
  3: {
    introMy: "ကတ္တားစကားစုအတွင်း \"of urbanization\" သည် ပိုင်ဆိုင်မှုပြ ဝိဘတ်စကားစု ဖြစ်သည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တား → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What", translation: "အဘယ်တို့နည်း", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the advantages", translation: "အားသာချက်များမှာ", tag: "Noun Subject" },
      { word: "of urbanization", translation: "မြို့ပြဖြစ်ထွန်းလာမှု၏", tag: "Prepositional Phrase" },
    ],
  },
  4: {
    introMy: "အထက်ပါမေးခွန်းနှင့် တူသော ပုံစံ ဖြစ်ပြီး ကတ္တားသာ ကွာသည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တား → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What", translation: "အဘယ်တို့နည်း", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the disadvantages", translation: "အားနည်းချက်များမှာ", tag: "Noun Subject" },
      { word: "of urbanization", translation: "မြို့ပြဖြစ်ထွန်းလာမှု၏", tag: "Prepositional Phrase" },
    ],
  },
  5: {
    introMy: "ကတ္တားစကားစုတွင် \"some solutions\" နှင့် ဝိဘတ်စကားစု နှစ်ခု ဆက်တွဲ ပါဝင်သည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → ဆက်စပ်ကြိယာ → ကတ္တား → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What", translation: "အဘယ်တို့နည်း", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "some solutions", translation: "ဖြေရှင်းနည်းအချို့မှာ", tag: "Noun Subject" },
      { word: "to those problems of urbanization", translation: "မြို့ပြဖြစ်ထွန်းလာမှု ပြဿနာများအတွက်", tag: "Prepositional Phrase" },
    ],
  },
};

/* ---------------------------- 12B Vocabulary ---------------------------- */

export const vocab12B: VocabItem[] = [
  {
    word: "urbanization",
    pronunciation: "/ˌɜːbənaɪˈzeɪʃn/ — အဘာနိုင်ဇေးရှန်",
    meaningMy: "မြို့ပြပြောင်းလဲမှု၊ မြို့ပြဖြစ်လာမှု ဖြစ်စဉ်",
    exampleEn: "Urbanization is the process by which more and more people leave the countryside to live in cities.",
  },
  {
    word: "infrastructure",
    pronunciation: "/ˈɪnfrəstrʌktʃə(r)/ — အင်ဖရစထရက်ချာ",
    meaningMy: "အခြေခံအဆောက်အအုံ",
    exampleEn: "Urbanization brings about an infrastructure more advanced than the one in the countryside.",
  },
  {
    word: "sanitation",
    pronunciation: "/ˌsænɪˈteɪʃn/ — ဆန်နီတေးရှန်",
    meaningMy: "တိုက်ခန်းသန့်ရှင်းရေး၊ ကျန်းမာရေးသန့်ရှင်းမှု",
    exampleEn: "In slums, sanitation is inadequate.",
  },
  {
    word: "congestion",
    pronunciation: "/kənˈdʒestʃən/ — ကန်ဂျက်ရှန်",
    meaningMy: "ပိတ်ဆို့ခြင်း၊ ရုန်းတိပ်ခြင်း",
    exampleEn: "Traffic congestion is one of the problems of urbanization.",
  },
  {
    word: "slum",
    pronunciation: "/slʌm/ — စလမ်",
    meaningMy: "ဆူးပုန်းရွာ၊ ဆင်းရဲသားရပ်ကွက်",
    exampleEn: "One of the undesirable results of urbanization is the growth of slums.",
  },
  {
    word: "shanty",
    pronunciation: "/ˈʃænti/ — ရှန်တီ",
    meaningMy: "တုတ်ခိုင်အိမ်ငယ်၊ ဆောက်လုပ်အိမ်",
    exampleEn: "In slums, people live in shanties and hovels.",
  },
  {
    word: "hovel",
    pronunciation: "/ˈhɒvl/ — ဟောဗယ်",
    meaningMy: "ပျက်စီးနေသော အိမ်ငယ်၊ ဆင်းရဲသော နေအိမ်",
    exampleEn: "In slums, people live in shanties and hovels.",
  },
  {
    word: "influx",
    pronunciation: "/ˈɪnflʌks/ — အင်ဖလက်စ်",
    meaningMy: "ဝင်ရောက်လာမှု၊ စီးဆင်းမှု",
    exampleEn: "Means to control the influx of people from the countryside may need to be adopted.",
  },
  {
    word: "livelihood",
    pronunciation: "/ˈlaɪvlihʊd/ — လိုင်ဗ်လီဟုဒ်",
    meaningMy: "အသက်မွေးဝမ်းကျွေးမှု၊ အသက်မွေးလမ်း",
    exampleEn: "They move to towns or cities to find new forms of livelihood.",
  },
  {
    word: "prostitution",
    pronunciation: "/ˌprɒstɪˈtjuːʃn/ — ပရော်စတီတူးရှန်",
    meaningMy: "ပြည့်တံဆောင်မှု သို့မဟုတ် လိင်လုပ်ငန်း",
    exampleEn: "Urban crime includes mugging, stealing, drug abusing, prostitution and murder.",
  },
];

/** 12B Exercise A — compound noun matching (Column A word → Burmese meaning). */
export const partA12B_translations: Record<number, string> = {
  1: "air pollution — လေထု ညစ်ညမ်းမှု",
  2: "beauty salon — အလှပြင်ဆိုင်",
  3: "dairy farms — နွားနို့ခြံများ",
  4: "drainage system — ရေဆင်းရေလမ်း စနစ်",
  5: "drug abusing — မူးယစ်ဆေးဝါး အလွဲအသုံးပြုမှု",
  6: "housing plan — အိမ်ရာ စီမံကိန်း",
  7: "recreation centre — အပန်းဖြေ စင်တာ",
  8: "root cause — အရင်းခံ အကြောင်းရင်း",
  9: "rural folks — ကျေးလက်နေ လူများ",
  10: "service provider — ဝန်ဆောင်မှု ပေးသူ",
  11: "traffic congestion — ယာဉ်ကြော ပိတ်ဆို့မှု",
  12: "unemployment problem — အလုပ်လက်မဲ့ ပြဿနာ",
};

/** 12B Exercise B — gap-fill sentences. */
export const partB12B_translations: Record<number, string> = {
  1: "မပျော်ရွှင်မှုသည်၊ သူ၏ဖျားနာမှု ဖြစ်ရခြင်း __________  ဖြစ်သည်။",
  2: "ကျေးလက်ဒေသများမှ မြောက်မြားစွာသော၊ __________ ကို စက်မှုဇုန်များအဖြစ် ပြောင်းလဲခဲ့သည်။",
  3: "ဤဒေသသည်၊ __________ မတပ်ဆင်မီက အလွန်ရွှံ့ဗွက်ထူထပ်ခဲ့သည်။",
  4: "__________ ကို ဖြေရှင်းရန်အတွက်၊ ငါတို့သည် အလုပ်အကိုင် အခွင့်အလမ်းသစ်များ ပိုမိုဖန်တီးရမည်။",
  5: "ဒီတစ်ပတ်ပိတ်ရက်မှာ ငါဟာ ကျေးလက်ရွာတစ်ရွာမှာ နေထိုင်တဲ့ ငါ့ရဲ့၊ __________ ဆီကို သွားရောက်လည်ပတ်ပါမယ်။",
  6: "မင်း ဆံပင်ညှပ်ဖို့၊ __________ ဆီကို ပုံမှန်သွားလေ့ရှိသလား။",
  7: "မြေညီထပ်မှာ၊ __________ တစ်ခုရှိတယ်။ မင်း အဲဒီမှာ စားပွဲတင်တင်းနစ် ကစားနိုင်တယ်။",
  8: "__________ ၏ အကြောင်းရင်းများထဲတွင် မော်တော်ကား အိတ်ဇောငွေ့များသည် အဆိုးဆုံး ဖြစ်သည်။",
  9: "ဗိသုကာပညာရှင်များသည် လက်ရှိတွင် ငါတို့မြို့အတွက် သစ်လွင်သော __________ ကို ရေးဆွဲနေကြသည်။",
  10: "ဤဒေသရှိ ရာဇဝတ်မှု အများစုသည် __________ နှင့် ဆက်စပ်နေသည်။",
  11: "__________ ကြီးမားသော မြို့ကြီးများတွင် ဖြေရှင်း၍မရနိုင်သော ပြဿနာတစ်ခု ဖြစ်ပုံရသည်။",
};

/** 12B Exercise C — 'as' vs 'like' as prepositions. */
export const partC12B_translations: Record<number, string> = {
  1: "ကျွန်ုပ်သည် အစည်းအရေးကို လေ့လာသူ အဖြစ် တက်ရောက်နေသည်။ (အခန်းကဏ္ဍ → as)",
  2: "ကလေးသည် အဖေထက် အမေနှင့် ပိုတူသည်။ (အသွင်အပြင် နှိုင်းယှဉ် → like)",
  3: "လန်ဒန်တွင် နယူးယော့ခ်နည်းတူ ယာဉ်ကြော အလွန်များသည်။ (တူညီသော အခြေအနေ → as)",
  4: "ရထား နောက်ကျနေသည်။ လေလိုမျှ အပြေးလိုက်ရမည်။ (နှိုင်းယှဉ်ခြင်း → like)",
  5: "ကျွန်ုပ်သည် သင့်မိတ်ဆွေ ဖြစ်ပြီး၊ မိတ်ဆွေ အဖြစ် ပြန်စဉ်းစားပါဟု အကြံပေးသည်။ (အခန်းကဏ္ဍ → as)",
  6: "ကျွန်ုပ်သည် တိုက်လေယာဉ် မောင်းသူ အဖြစ် လေတပ်တွင် ဝင်လိုသည်။ (အလုပ် → as)",
  7: "အဖေသည် ဤနာရီကို မွေးနေ့လက်ဆောင် အဖြစ် ပေးခဲ့သည်။ (အခန်းကဏ္ဍ → as)",
  8: "စိတ်မကောင်းပါ၊ ကျွန်ုပ်တို့ စီစဉ်ခဲ့သည့်အတိုင်း မနက်ဖန် မတွေ့နိုင်ပါ။ (အတိုင်း → as)",
  9: "သူသည် ၁၈ နှစ် ဖြစ်သော်လည်း တစ်ခါတစ်ရံ ကလေးလို ပြုမူသည်။ (အပြုအမူ → like)",
  10: "သူမသည် မိသားစုအများစုနည်းတူ ထူးခြားသော စာရေးဆရာ ဖြစ်သည်။ (တူညီမှု → as)",
};

/* ----------------------------- 12C Grammar ------------------------------ */

/** 12C Exercise A — joining sentences with 'that / which'. */
export const partA12C_translations: Record<number, string> = {
  1: "ဤအဆောက်အအုံ၊ __________ မုန်တိုင်းကြောင့် ပျက်စီးသွားခဲ့သော၊ ယခုအခါ ပြန်လည်တည်ဆောက်ပြီးစီးပြီ ဖြစ်သည်။",
  2: "သူငယ်ချင်းတစ်ယောက်က ငါတို့ကို အကြံပြုထားတဲ့၊ __________ အိပ်ဆဲလင့်ဟိုတယ် (Excellent Hotel) မှာ ငါတို့ တည်းခိုခဲ့ကြတယ်။",
  3: "နာရီဝက်တစ်ကြိမ်စီ ထွက်ခွာသော၊ __________ ဤဘတ်စ်ကားများသည် လေဆိပ်သို့ သွားကြသည်။",
  4: "ကိုတူးက သူအလွန်သဘောကျနေတဲ့၊ __________ သူခန့်အပ်ခံရတဲ့ အလုပ်အသစ်အကြောင်း ငါ့ကိုပြောပြခဲ့တယ်။",
  5: "ငါတို့ရွာကနေ ဆယ်မိုင်ပဲဝေးတဲ့၊ __________ ပဲခူးမြို့ကို ဆွေမျိုးတွေဆီ လည်ပတ်ဖို့ ငါတို့ခဏခဏ သွားလေ့ရှိကြတယ်။",
  6: "ရေကူးကန်သို့ ဦးတည်သွားသော၊ __________ ဤလှေကားများသည် အတော်လေး ချော်လဲလွယ်သည်။",
  7: "အမေက ဒီဆွယ်တာကို ငါ့ကိုပေးခဲ့တာ၊ __________ အမေကိုယ်တိုင် ရက်လုပ်ခဲ့တာ ဖြစ်သည်။",
  8: "အဝတ်လျှော်စက်၊ __________ ငါဂရုတစိုက် အသုံးပြုခဲ့သော၊ အခုထက်ထိ ကောင်းမွန်စွာ အလုပ်လုပ်နေဆဲ ဖြစ်သည်။",
};

/** 12C Exercise B — building sentences with relative clauses. */
export const partB12C_translations: Record<number, string> = {
  1: " ကမ္ဘာဂြိုဟ်/ တစ်ခုတည်းသော ကမ္ဘာ/ သက်ရှိများကို ထိန်းသိမ်းနိုင်သော",
  2: "တီထွင်မှု/ ခေတ်သစ်ကမ္ဘာကို ပြောင်းလဲပေးခဲ့သော/ကွန်ပျူတာ/ ",
  3: "လုပ်ရပ်/ရေကူးခြင်း/ ကျွန်ုပ် နှစ်သက်စွာ လုပ်သော",
  4: "အစီအစဉ်/ကျွန်ုပ် တီဗီတွင် ကြည့်ရ နှစ်သက်သော/  Master Chef အစီအစဉ်/",
  5: " လုပ်ရပ်/ စိတ်ဖိစီးမှုကို လျော့ချပေးသော /ပန်းခြံစိုက်ပျိုးခြင်း/ ",
};

/** 12C Exercise C — 'as ... as'. */
export const partC12C_translations: Record<number, string> = {
  1: "တောင်ပေါ်ကို တက်ခြင်းသည် ခက်ခဲသည်။ တောင်ပေါ်မှ ဆင်းခြင်းသည်လည်း ခက်ခဲသည်။",
  2: "ဒီနေ့လည်း ပူနွေးသည်။မနေ့ကလဲ ပူနွေးသည်။",
  3: "ဒီနေ့ စျေးဝယ်စင်တာတွင် လူစည်ကားသည်။ မနေ့ကလဲ လူစည်ကားသည်။",
  4: "မနေ့တွင် သူတို့သည် ကောင်းစွာ ကစားခဲ့သည်။သူတို့အမြဲကောင်းကောင်း ကစားကြသည်။",
  5: "အမေ အမြဲ အလုပ်များသည်။အဖေလည်း အမြဲ အလုပ်များသည်။",
};

/** 12C Exercise D — 'not as ... as'. */
export const partD12C_translations: Record<number, string> = {
  1: "ရိုဗော့များသည် လူလုပ်သားများထက် ပို၍ တိကျစွာ အလုပ်လုပ်နိုင်ကြသည်။",
  2: "လျှပ်စစ်မီးသည် ဖယောင်းတိုင်မီးထက် ပို၍လင်းသည်",
  3: "ကိုကိုသည် စာလေ့လာချိန်ထက် ကစားချိန်ကို  ပို၍သုံးသည်။",
  4: "နျူကလီးယား စွမ်းအင်သည် ကျောက်မီးသွေးထက်  ပို၍သန့်ရှင်းသည်။",
  5: "ကျေးလက်ဒေသ လေထုအရည်အသွေးသည်  မြို့ပြဒေသထက် ပို၍ ကောင်းသည်။",
};

export const grammar12C = {
  whatMy:
    "Unit 12C တွင် အဓိက သင်ခန်းစာ နှစ်ခု ရှိသည် — (၁) အရာဝတ္ထုများကို ရည်ညွှန်းသည့် relative pronouns 'that' နှင့် 'which'၊ (၂) နှိုင်းယှဉ်ခြင်းအတွက် 'as ... as' နှင့် 'not as ... as'။",
  whenMy:
    "အရာဝတ္ထု (things) များအကြောင်း ပြောသောအခါ relative clause တွင် 'that' သို့မဟုတ် 'which' ကို အသုံးပြုသည် (e.g. I do not like stories that / which have sad endings.)။ နှိုင်းယှဉ်သည့် အရာနှစ်ခု တူညီသောအခါ 'as + adjective / adverb + as' ကို အသုံးပြုပြီး (e.g. That cow is as big as a small elephant.)၊ တူညီမှု မရှိသောအခါ 'not as + adjective / adverb + as' ကို အသုံးပြုသည် (e.g. Thuta cannot run as fast as Thura.)။",
  whyMy:
    "Relative pronouns 'that / which' သည် ဝါကျနှစ်ခုကို ဝါကျတစ်ခုအဖြစ် ချိတ်ဆက်ပေးပြီး နာမ်ကို ပိုမို ရှင်းလင်းစွာ ဖော်ပြသည်။ 'as ... as' နှင့် 'not as ... as' သည် တူညီမှု သို့မဟုတ် ကွာခြားမှုကို တိတိကျကျ ဖော်ပြရန် အသုံးဝင်သည်။",
  examples: [
    { en: "I do not like stories that / which have sad endings.", phrase: "that / which" },
    { en: "Nandar works for a company that / which makes shoes.", phrase: "that / which" },
    { en: "That cow is as big as a small elephant.", phrase: "as ... as" },
    { en: "Ko Ko can play the piano as well as Mee Mee.", phrase: "as ... as" },
    { en: "Thuta cannot run as fast as Thura.", phrase: "not as ... as" },
    { en: "It was not as cold last year as it is this year.", phrase: "not as ... as" },
  ],
};

/* --------------------- 12D Listening and Speaking ----------------------- */

/** 12D Exercise A — urban / rural comparison table (per blank number). */
export const partA12D_translations: Record<number, string> = {
  1: "မြို့ပြဒေသရှိ ဘဝသည် လျင်မြန်ပြီး ရှုပ်ထွေးသည် (fast)။",
  2: "ကျေးလက်ဒေသရှိ ဘဝသည် ရိုးရှင်းပြီး အေးချမ်းသည် (relaxed)။",
  3: "မြို့ပြဒေသရှိ အခြေချမှုတွင် မြို့ကြီးများနှင့် မြို့ငယ်များ ပါဝင်သည်။",
  4: "ကျေးလက်ဒေသရှိ အခြေချမှုတွင် ရွာများနှင့် အိမ်အုပ်စုများ ပါဝင်သည်။",
  5: "မြို့ပြဒေသရှိ ပတ်ဝန်းကျင်သည် သဘာဝနှင့် ကွဲကွာနေသည်။",
  6: "ကျေးလက်ဒေသရှိ ပတ်ဝန်းကျင်သည် သဘာဝနှင့် တိုက်ရိုက် ထိစပ်နေသည်။",
  7: "မြို့ပြလူများသည် စိုက်ပျိုးရေးမဟုတ်သော အလုပ်များတွင် ပါဝင်သည်။",
  8: "ကျေးလက်လူများ၏ အဓိက အလုပ်သည် လယ်ယာစိုက်ပျိုးရေး (farming) ဖြစ်သည်။",
  9: "မြို့ပြဒေသများသည် လူသိပ်သည်းစွာ နေထိုင်သည်။",
  10: "ကျေးလက်ဒေသများသည် လူနည်းပါးစွာ နေထိုင်သည်။",
  11: "မြို့ပြလူများသည် အလုပ်ကို မကြာခဏ ပြောင်းလဲသည်။",
  12: "ကျေးလက်လူများသည် အလုပ်ကို ပုံမှန်အားဖြင့် (usually) မပြောင်းလဲပါ။",
};

/** 12D Exercise B — doctor's appointment dialogue slots. */
export const partB12D_translations: Record<number, string> = {
  1: "ဆရာဝန်နှင့် ချိန်းဆိုချက် ယူလိုပါသည်။",
  2: "ကျွန်ုပ် ကျန်းမာရေး သိပ်မကောင်းပါ။",
  3: "ရပါသည် (မနက်ခင်း လာနိုင်ပါသည်)။",
  4: "ဟုတ်ကဲ့၊ ၁၀ နာရီ အဆင်ပြေပါသည်။",
  5: "နေအောင် (ကျွန်ုပ်၏ နာမည်)။",
  6: "ကျေးဇူးတင်ပါသည်။",
};

/** 12E — argumentative essay structure, in Burmese. */
export const writing12E_structureMy: Record<number, string> = {
  1: "အဖွင့် — ဖတ်သူ၏ အာရုံစိုက်မှုကို ဆွဲယူသော အဖွင့်စာနှင့် နောက်ခံ အချက်အလက်",
  2: "အဓိကအပိုင်း — မိမိ ထောက်ခံသော အဓိက အကြောင်းပြချက်များ",
  3: "ဆန့်ကျင်ဘက် အကြောင်းပြချက် — အခြားအမြင်ကို တင်ပြပြီး ပြန်လည် ရှင်းလင်းချေပခြင်း",
  4: "အနိဂုံ — အနှစ်ချုပ် နိဂုံးချုပ် သုံးသပ်ချက်",
};

/** 12D listening track — real transcript of "Unit 12 – Urbanization". */
export type Dialogue12Line = { speaker: string; en: string; my: string };

export const listening12D_transcript: { en: string; my: string }[] = [
  {
    en: "Unit 12, Urbanization.",
    my: "အခန်း ၁၂ — မြို့ပြဖြစ်ထွန်းလာမှု။",
  },
  {
    en: "Life in urban areas is fast and complicated, whereas rural life is simple and relaxed.",
    my: "မြို့ပြဒေသရှိ ဘဝသည် လျင်မြန်ပြီး ရှုပ်ထွေးသည်၊ ကျေးလက်ဘဝမှာ ရိုးရှင်းပြီး အေးချမ်းသည်။",
  },
  {
    en: "The urban settlement includes cities and towns.",
    my: "မြို့ပြ အခြေချမှုတွင် မြို့ကြီးများနှင့် မြို့ငယ်များ ပါဝင်သည်။",
  },
  {
    en: "On the other hand, the rural settlement includes villages and groups of houses.",
    my: "အခြားတစ်ဖက်တွင် ကျေးလက် အခြေချမှုတွင် ရွာများနှင့် အိမ်အုပ်စုများ ပါဝင်သည်။",
  },
  {
    en: "Urban areas are separated from nature, but rural areas are in direct contact with nature.",
    my: "မြို့ပြဒေသများသည် သဘာဝနှင့် ကွဲကွာနေသည်၊ ကျေးလက်ဒေသများမှာ သဘာဝနှင့် တိုက်ရိုက် ထိစပ်နေသည်။",
  },
  {
    en: "Urban people are engaged in non-agricultural work.",
    my: "မြို့ပြလူများသည် စိုက်ပျိုးရေးမဟုတ်သော အလုပ်များတွင် ပါဝင်ကြသည်။",
  },
  {
    en: "In contrast, the primary occupation of rural people is farming.",
    my: "ဆန့်ကျင်ဘက်အနေဖြင့် ကျေးလက်လူများ၏ အဓိက အလုပ်သည် လယ်ယာစိုက်ပျိုးရေး ဖြစ်သည်။",
  },
  {
    en: "Population-wise, urban areas are densely populated. On the contrary, rural areas are sparsely populated.",
    my: "လူဦးရေအရ မြို့ပြဒေသများသည် လူသိပ်သည်းသည်။ ဆန့်ကျင်ဘက်အနေဖြင့် ကျေးလက်ဒေသများသည် လူနည်းပါးသည်။",
  },
  {
    en: "When it comes to jobs, urban people often change their jobs, looking for better opportunities.",
    my: "အလုပ်အကိုင် ကိစ္စတွင် မြို့ပြလူများသည် ပိုကောင်းသော အခွင့်အလမ်းများ ရှာရန် အလုပ်ကို မကြာခဏ ပြောင်းလဲကြသည်။",
  },
  {
    en: "However, in rural areas, people do not usually change their jobs.",
    my: "သို့သော် ကျေးလက်ဒေသများတွင် လူများသည် အလုပ်ကို ပုံမှန်အားဖြင့် မပြောင်းလဲကြပါ။",
  },
];

/** 12D Exercise C — model dialogue for making an appointment with a dentist. */
export const partC12D_modelDialogue: Dialogue12Line[] = [
  {
    speaker: "Receptionist",
    en: "Good morning, Dr. Myint's dental clinic. May I help you?",
    my: "မင်္ဂလာနံနက်ခင်းပါ၊ ဒေါက်တာမြင့် သွားဆေးခန်းပါ။ ကူညီပေးရမလား။",
  },
  {
    speaker: "Patient",
    en: "Yes, I'd like to make an appointment with the dentist.",
    my: "ဟုတ်ကဲ့၊ သွားဆရာဝန်နှင့် ချိန်းဆိုချက် ယူလိုပါတယ်။",
  },
  {
    speaker: "Receptionist",
    en: "Certainly. Could you tell me what your problem is?",
    my: "ရပါတယ်။ ဘာပြဿနာ ရှိတာလဲ ပြောပြပေးနိုင်မလား။",
  },
  {
    speaker: "Patient",
    en: "I have a bad toothache and my gum is swollen.",
    my: "သွားအရမ်း ကိုက်နေပြီး သွားဖုံးလည်း ရောင်နေပါတယ်။",
  },
  {
    speaker: "Receptionist",
    en: "I see. Dr. Myint can see you tomorrow. Can you come in the afternoon?",
    my: "အင်း၊ ဒေါက်တာမြင့်က မနက်ဖန် တွေ့နိုင်ပါတယ်။ နေ့လယ်ပိုင်း လာနိုင်မလား။",
  },
  {
    speaker: "Patient",
    en: "Certainly. What time should I come?",
    my: "ရပါတယ်။ ဘယ်အချိန် လာရမလဲ။",
  },
  {
    speaker: "Receptionist",
    en: "How about 2 o'clock?",
    my: "၂ နာရီ ဘယ်လိုလဲ။",
  },
  {
    speaker: "Patient",
    en: "Yes, 2 o'clock is fine.",
    my: "ဟုတ်ကဲ့၊ ၂ နာရီ အဆင်ပြေပါတယ်။",
  },
  {
    speaker: "Receptionist",
    en: "May I have your name?",
    my: "နာမည် ပြောပြပေးပါ။",
  },
  { speaker: "Patient", en: "Su Myat.", my: "စုမြတ် ပါ။" },
  {
    speaker: "Receptionist",
    en: "OK, 2 o'clock tomorrow afternoon.",
    my: "ဟုတ်ကဲ့၊ မနက်ဖန် နေ့လယ် ၂ နာရီ ပါ။",
  },
  { speaker: "Patient", en: "Thank you. Goodbye.", my: "ကျေးဇူးတင်ပါတယ်။ သွားတော့မယ်။" },
];
