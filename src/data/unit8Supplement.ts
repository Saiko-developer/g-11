// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 8 sections 8A / 8B / 8C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts`, `unit3Supplement.ts`,
// `unit4Supplement.ts`, `unit5Supplement.ts`, `unit6Supplement.ts` and
// `unit7Supplement.ts`. Units 1, 2, 3, 4, 5, 6 and 7 data are never touched
// by this module.

import type { TrainCar } from "@/lib/sentenceStructure";

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

// Curated "Sentence Structure" breakdown for a single 8A question. Every
// chunk keeps its natural phrase together (no isolated prepositions or
// linking verbs split off on their own) and carries a pure-Burmese gloss.
type SentenceBreakdown = { introMy: string; noteMy: string; cars: TrainCar[] };

/* ----------------------------- 8A Reading ------------------------------ */

export const partA8A_translations: Record<number, string> = {
  1: "တိရစ္ဆာန်နှင့် အပင် နှစ်မျိုးလုံးသည် အစားအစာ လိုအပ်သည်။",
  2: "တိရစ္ဆာန်နှင့် အပင် နှစ်မျိုးလုံးသည် မိမိတို့၏ အစားအစာကို ကိုယ်တိုင် ပြုလုပ်သည်။",
  3: "ပိတုန်းနှင့် ဘက်တီးရီးယားများ၏ စားခြင်းခံရပြီးနောက် တိရစ္ဆာန်တို့၏ ခန္ဓာကိုယ်များသည် ပြိုကျဆွေးမြေ့၍ အာဟာရဓာတ်များ ဖြစ်လာသည်။",
  4: "အစာကျန်စားသည့် တိရစ္ဆာန်များ (scavengers) သည် အခြားတိရစ္ဆာန်များက သတ်ခဲ့သော (သို့) စားခဲ့သော အရာများကို စားပြီးသည့်အခါ မည်သည့်အရာမျှ မကျန်တော့ပါ။",
  5: "လင်းယုန်များသည် အခြားတိရစ္ဆာန်များက သတ်ခဲ့သော (သို့) စားခဲ့သော အရာများကိုသာမက သေဆုံးနေသော တိရစ္ဆာန်များ၏ ဆွေးမြေ့နေသော အသားများကိုပါ စားသည်။",
  6: "အစာကျန်စားသည့် တိရစ္ဆာန်များ (scavengers) သည် တိရစ္ဆာန်တို့၏ အကြွင်းအကျန်များကို သန့်ရှင်းရေး လုပ်ဆောင်ပေးသည်။",
  7: "အာဟာရဓာတ်များသည် မဂ္နီဇီယမ်၊ ကယ်လဆီယမ်နှင့် ဂမ္ဘာအောင်တို့ဖြင့် ဖွဲ့စည်းထားသည်။",
  8: "အစာကျန်စားသည့် တိရစ္ဆာန်များ (scavengers) ချန်ထားခဲ့သော အရာများကို စားရန်အတွက် ပြိုကျစေသော သတ္တဝါများ (decomposers) သည် ပိတုန်းနှင့် အခြားအင်းဆက်များ မရောက်မီ ရောက်ရှိလာသည်။",
  9: "ပြိုကျစေသော သတ္တဝါများ (decomposers) ကို အမှိုက်သစ်စုသမားများ (garbage collectors) ဟု သိကြသည်။",
  10: "လူများသည် အစာကျန်စားသည့် တိရစ္ဆာန်များ (scavengers) နှင့် ပြိုကျစေသော သတ္တဝါများ (decomposers) ကို စားသည်။",
};

export const partB8A_translations: Record<number, string> = {
  1: "အပင်များသည် မိမိတို့၏ အစားအစာကို မည်သို့ ပြုလုပ်သနည်း။",
  2: "အပင်နှင့် တိရစ္ဆာန်တို့၏ ကွဲပြားခြားနားချက်မှာ အဘယ်နည်း။",
  3: "စာကြောင်း ၄ ရှိ 'their' ဟူသော စကားလုံးသည် အဘယ်အရာကို ရည်ညွှန်းသနည်း။",
  4: "အပင်များနှင့် မတူဘဲ တိရစ္ဆာန်များသည် ရှင်သန်နိုင်ရန် အဘယ်အရာကို ပြုလုပ်ရမည်နည်း။",
  5: "နောက်ဆုံး သန့်ရှင်းရေး မပြုလုပ်မီ သန့်ရှင်းရေးလုပ်ငန်းကို မည်သည့် တိရစ္ဆာန်များက ပြုလုပ်သနည်း။",
  6: "စာကြောင်း ၂၇ ရှိ 'These' ဟူသော စကားလုံးသည် အဘယ်အရာကို ရည်ညွှန်းသနည်း။",
  7: "အင်းဆက်များ ချန်ထားခဲ့သော အရာများကို ပြိုကျစေသော သတ္တဝါများ (decomposers) က အဘယ်သို့ ပြုလုပ်သနည်း။",
  8: "ရှဉ့်များအပြင် သစ်စေ့များ စားသော တိရစ္ဆာန် နှစ်ကောင်ကို နောက်ထပ် ဖော်ပြပါ။",
};

export const partC8A_translations: Record<number, string> = {
  1: "တိရစ္ဆာန်များ (animals) — ဥပမာတစ်ခုစီ ပေးထားသည်- မြေခွေး။",
  2: "ငှက်များ (birds) — ဥပမာတစ်ခုစီ ပေးထားသည်- သိုက်ငှက်။",
  3: "ပြိုကျစေသော သတ္တဝါများ (decomposers) — ဥပမာတစ်ခုစီ ပေးထားသည်- ဘက်တီးရီးယား။",
  4: "အင်းဆက်များ (insects) — ဥပမာတစ်ခုစီ ပေးထားသည်- ပိတုန်း။",
  5: "အစာကျန်စားသည့် တိရစ္ဆာန်များ (scavengers) — ဥပမာတစ်ခုစီ ပေးထားသည်- လင်းယုန်။",
};

/* -------- 8A Reading — Sentence Structure breakdowns (curated) -------- */
// One breakdown per comprehension question. Tags reuse the shared English
// grammar vocabulary from TAG_INFO so the info panel renders; every Burmese
// gloss is pure Burmese, and linking verbs stay inside their natural verb
// block instead of being isolated as standalone cars.

export const partA8A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "ဒါက ကံတ္တား → မူရင်းကြိယာ → ကံ ပုံစံ ပြောကြားချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "Both animals and plants", translation: "တိရစ္ဆာန်နှင့် အပင် နှစ်မျိုးလုံးသည်", tag: "Noun Subject" },
      { word: "need", translation: "လိုအပ်သည်", tag: "Main Verb" },
      { word: "food", translation: "အစားအစာကို", tag: "Noun Object" },
    ],
  },
  2: {
    introMy: "ဒါက ကံတ္တား → မူရင်းကြိယာ → ကံ ပုံစံ ပြောကြားချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "Both animals and plants", translation: "တိရစ္ဆာန်နှင့် အပင် နှစ်မျိုးလုံးသည်", tag: "Noun Subject" },
      { word: "make", translation: "ပြုလုပ်သည်", tag: "Main Verb" },
      { word: "their own food", translation: "မိမိတို့၏ ကိုယ်ပိုင် အစားအစာကို", tag: "Noun Object" },
    ],
  },
  3: {
    introMy: "ဒါက ရှေ့တွင် ကြိယာဝိသေသနအခန်းပါတဲ့ ပြောကြားချက် ဝါကျပါ။ 'decompose and become' သည် ပေါင်းစပ်ကြိယာဖြစ်ပြီး တစ်ခုတည်း ပိုင်းခြားထားပါသည်။",
    noteMy: "ပုံစံ: ကြိယာဝိသေသနအခန်း → ကံတ္တား → မူရင်းကြိယာ → ဖြည့်စွက်စာ။",
    cars: [
      { word: "After being eaten by ants and bacteria", translation: "ပိတုန်းနှင့် ဘက်တီးရီးယားများ၏ စားခြင်းခံရပြီးနောက်", tag: "Adverb Clause" },
      { word: "the bodies of animals", translation: "တိရစ္ဆာန်တို့၏ ခန္ဓာကိုယ်များသည်", tag: "Noun Subject" },
      { word: "decompose and become", translation: "ပြိုကျဆွေးမြေ့၍ ဖြစ်လာသည်", tag: "Main Verb" },
      { word: "nutrients", translation: "အာဟာရဓာတ်များအဖြစ်", tag: "Complement" },
    ],
  },
  4: {
    introMy: "ဒါက နောက်တွင် ကြိယာဝိသေသနအခန်းပါတဲ့ ပြောကြားချက် ဝါကျပါ။ 'is left behind' သည် ခံယ်းအသံ ကြိယာဖြစ်ပါသည်။",
    noteMy: "ပုံစံ: ကံတ္တား → ခံယ်းအသံကြိယာ → ကြိယာဝိသေသနအခန်း။",
    cars: [
      { word: "Nothing", translation: "မည်သည့်အရာမျှ", tag: "Noun Subject" },
      { word: "is left behind", translation: "ကျန်ရှိခဲ့သည်", tag: "Main Verb" },
      { word: "when the scavengers have eaten what other animals have killed or eaten", translation: "အစာကျန်စားသည့် တိရစ္ဆာန်များက အခြားတိရစ္ဆာန်များ သတ်ခဲ့သော (သို့) စားခဲ့သော အရာများကို စားပြီးသည့်အခါ", tag: "Adverb Clause" },
    ],
  },
  5: {
    introMy: "ဒါက ကံတ္တား → မူရင်းကြိယာ → ကံ ပုံစံ ဝါကျပါ။ ကံသည် နာမ်ခွန်းအခန်း နှစ်ခု ပေါင်းစပ်ထားခြင်း ဖြစ်ပါသည်။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "Vultures", translation: "လင်းယုန်များသည်", tag: "Noun Subject" },
      { word: "eat", translation: "စားသည်", tag: "Main Verb" },
      { word: "what other animals have killed or eaten as well as the rotting flesh of dead animals", translation: "အခြားတိရစ္ဆာန်များက သတ်ခဲ့သော (သို့) စားခဲ့သော အရာများကိုလည်းကောင်း၊ သေဆုံးနေသော တိရစ္ဆာန်များ၏ ဆွေးမြေ့နေသော အသားများကိုလည်းကောင်း", tag: "Noun Object" },
    ],
  },
  6: {
    introMy: "ဒါက ကံတ္တား → မူရင်းကြိယာ → ကံ ပုံစံ ပြောကြားချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "The scavengers", translation: "အစာကျန်စားသည့် တိရစ္ဆာန်များသည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်သည်", tag: "Main Verb" },
      { word: "the cleaning up of the remains of animals", translation: "တိရစ္ဆာန်တို့၏ အကြွင်းအကျန်များကို သန့်ရှင်းရေးလုပ်ဆောင်ခြင်းကို", tag: "Noun Object" },
    ],
  },
  7: {
    introMy: "ဒါက ခံယ်းအသံ ပြောကြားချက် ဝါကျပါ။ 'are made up of' သည် တစ်ခုတည်း ကြိယာအဖြစ် ပိုင်းခြားထားပြီး 'are' ကို တစ်ခုတည်း မထုတ်ပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → ခံယ်းအသံကြိယာ → ကံ။",
    cars: [
      { word: "Nutrients", translation: "အာဟာရဓာတ်များသည်", tag: "Noun Subject" },
      { word: "are made up of", translation: "ဖွဲ့စည်းထားသည်", tag: "Main Verb" },
      { word: "magnesium, calcium and sulphur", translation: "မဂ္နီဇီယမ်၊ ကယ်လဆီယမ်နှင့် ဂမ္ဘာအောင်တို့ဖြင့်", tag: "Noun Object" },
    ],
  },
  8: {
    introMy: "ဒါက နောက်တွင် ရည်ရွယ်ချက်အခန်းပါတဲ့ ပြောကြားချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ဝိဘတ်စကားစု → ရည်ရွယ်ချက်အခန်း။",
    cars: [
      { word: "The decomposers", translation: "ပြိုကျစေသော သတ္တဝါများသည်", tag: "Noun Subject" },
      { word: "come", translation: "ရောက်ရှိလာသည်", tag: "Main Verb" },
      { word: "before ants and other insects", translation: "ပိတုန်းနှင့် အခြားအင်းဆက်များ မရောက်မီ", tag: "Prepositional Phrase" },
      { word: "to eat up what is left by scavengers", translation: "အစာကျန်စားသည့် တိရစ္ဆာန်များ ချန်ထားခဲ့သော အရာများကို စားရန်", tag: "Purpose Clause" },
    ],
  },
  9: {
    introMy: "ဒါက ခံယ်းအသံ ပြောကြားချက် ဝါကျပါ။ 'are known as' သည် တစ်ခုတည်း ကြိယာအဖြစ် ပိုင်းခြားထားပြီး 'are' ကို တစ်ခုတည်း မထုတ်ပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → ခံယ်းအသံကြိယာ → ဖြည့်စွက်စာ။",
    cars: [
      { word: "Decomposers", translation: "ပြိုကျစေသော သတ္တဝါများကို", tag: "Noun Subject" },
      { word: "are known as", translation: "ဟု သိကြသည်", tag: "Main Verb" },
      { word: "garbage collectors", translation: "အမှိုက်သစ်စုသမားများ", tag: "Complement" },
    ],
  },
  10: {
    introMy: "ဒါက ကံတ္တား → မူရင်းကြိယာ → ကံ ပုံစံ ပြောကြားချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "People", translation: "လူများသည်", tag: "Noun Subject" },
      { word: "eat", translation: "စားသည်", tag: "Main Verb" },
      { word: "scavengers and decomposers", translation: "အစာကျန်စားသည့် တိရစ္ဆာန်များနှင့် ပြိုကျစေသော သတ္တဝါများကို", tag: "Noun Object" },
    ],
  },
};

export const partB8A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: "ဒါက 'How' နှင့် စတဲ့ မေးခွန်းပါ။",
    noteMy: "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကံတ္တား → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "How", translation: "မည်သို့", tag: "WH-Question Word" },
      { word: "do", translation: "အကူကြိယာ", tag: "Helping Verb" },
      { word: "plants", translation: "အပင်များသည်", tag: "Noun Subject" },
      { word: "make", translation: "ပြုလုပ်သည်", tag: "Main Verb" },
      { word: "their food", translation: "မိမိတို့၏ အစားအစာကို", tag: "Noun Object" },
    ],
  },
  2: {
    introMy: "ဒါက 'What' + ဆက်စပ်ကြိယာ နှင့် စတဲ့ မေးခွန်းပါ။ 'between plants and animals' သည် 'difference' ကို ဖော်ပြတဲ့ ဝိဘတ်စကားစုဖြစ်ပြီး ကံတ္တားထဲမှာ ပါဝင်နေပါသည်။",
    noteMy: "ပုံစံ: မေးခွန်းစကားလုံး → ဆက်စပ်ကြိယာ → ကံတ္တား။",
    cars: [
      { word: "What", translation: "ဘာ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "the difference between plants and animals", translation: "အပင်နှင့် တိရစ္ဆာန်တို့၏ ကွာခြားချက်", tag: "Noun Subject" },
    ],
  },
  3: {
    introMy: "ဒါက 'What' နှင့် စတဲ့ မေးခွန်းပါ။ 'in line 4' သည် 'the word their' ကို ဖော်ပြတဲ့ ဝိဘတ်စကားစုပါ။",
    noteMy: "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကံတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "does", translation: "အကူကြိယာ", tag: "Helping Verb" },
      { word: "the word \"their\" in line 4", translation: "စာကြောင်း ၄ ရှိ 'their' ဟူသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  4: {
    introMy: "ဒါက ရှေ့တွင် ဝိဘတ်စကားစုပါတဲ့ 'what' မေးခွန်းပါ။",
    noteMy: "ပုံစံ: ဝိဘတ်စကားစု → မေးခွန်းစကားလုံး → အကူကြိယာ → ကံတ္တား → မူရင်းကြိယာ → ရည်ရွယ်ချက်အခန်း။",
    cars: [
      { word: "Unlike plants", translation: "အပင်များနှင့် မတူဘဲ", tag: "Prepositional Phrase" },
      { word: "what", translation: "ဘာ", tag: "WH-Question Word" },
      { word: "must", translation: "အကူကြိယာ", tag: "Helping Verb" },
      { word: "animals", translation: "တိရစ္ဆာန်များသည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်ရမည်", tag: "Main Verb" },
      { word: "to live", translation: "ရှင်သန်ရန်", tag: "Purpose Clause" },
    ],
  },
  5: {
    introMy: "'What animals' သည် ကံတ္တားအဖြစ် အသုံးပြုထားပြီး 'What' သည် တစ်ခုတည်း မေးခွန်းစကားလုံး မဟုတ်ပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → မူရင်းကြိယာ → ကံ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What animals", translation: "မည်သည့် တိရစ္ဆာန်များသည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်သည်", tag: "Main Verb" },
      { word: "the cleaning up", translation: "သန့်ရှင်းရေးလုပ်ငန်းကို", tag: "Noun Object" },
      { word: "before the final cleaning up", translation: "နောက်ဆုံး သန့်ရှင်းရေး မပြုလုပ်မီ", tag: "Prepositional Phrase" },
    ],
  },
  6: {
    introMy: "ဒါက 'What' နှင့် စတဲ့ မေးခွန်းပါ။ 'in line 27' သည် 'the word These' ကို ဖော်ပြတဲ့ ဝိဘတ်စကားစုပါ။",
    noteMy: "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကံတ္တား → မူရင်းကြိယာ။",
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "does", translation: "အကူကြိယာ", tag: "Helping Verb" },
      { word: "the word \"These\" in line 27", translation: "စာကြောင်း ၂၇ ရှိ 'These' ဟူသော စကားလုံးသည်", tag: "Noun Subject" },
      { word: "refer to", translation: "ရည်ညွှန်းသနည်း", tag: "Main Verb" },
    ],
  },
  7: {
    introMy: "ဒါက 'What' မေးခွန်းပါ။ 'to what is left behind by insects' သည် ဝိဘတ်စကားစုဖြစ်ပြီး မည်သည့်အရာကို လုပ်ဆောင်သနည်းဟု မေးပါသည်။",
    noteMy: "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကံတ္တား → မူရင်းကြိယာ → ဝိဘတ်စကားစု။",
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "do", translation: "အကူကြိယာ", tag: "Helping Verb" },
      { word: "decomposers", translation: "ပြိုကျစေသော သတ္တဝါများသည်", tag: "Noun Subject" },
      { word: "do", translation: "ပြုလုပ်သည်", tag: "Main Verb" },
      { word: "to what is left behind by insects", translation: "အင်းဆက်များ ချန်ထားခဲ့သော အရာများကို", tag: "Prepositional Phrase" },
    ],
  },
  8: {
    introMy: "ဒါက အမိန့်ပုံစံ ဝါကျပါ။ 'that eat nuts' သည် 'animals' ကို ပြန်ဖော်ပြတဲ့ ဆက်စပ်အခန်းဖြစ်ပြီး ကံထဲမှာ ပါဝင်နေပါသည်။",
    noteMy: "ပုံစံ: ဝိဘတ်စကားစု → မူရင်းကြိယာ → ကံ။",
    cars: [
      { word: "In addition to squirrels", translation: "ရှဉ့်များအပြင်", tag: "Prepositional Phrase" },
      { word: "name", translation: "အမည်ပေးပါ", tag: "Main Verb" },
      { word: "two other animals that eat nuts", translation: "သစ်စေ့များ စားသော အခြား တိရစ္ဆာန် နှစ်မျိုးကို", tag: "Noun Object" },
    ],
  },
};

/* ---------------------------- 8B Vocabulary ---------------------------- */

export const partB8B_translations: Record<number, string> = {
  1: "အတန်းပြီးနောက် ဆောင်းပါး မရေးပြီးသေးသဖြင့် နီနီသည် ________ ရန် လိုအပ်ခဲ့သည်။",
  2: "အလွန် အနားယူဖွယ်ကောင်းသည်ဟု ဆိုကြသောကြောင့် ကျွန်ုပ်သည် ဥယျာဉ်စိုက်ပျိုးခြင်းကို ________ နေသည်။",
  3: "ဆူဆန် (Susan) သည် လုံးဝ မမှန်ကန်သော ဇာတ်လမ်းများကို မကြာခဏ ________ လေ့ရှိသည်။",
  4: "အလုပ်နှင့်ပတ်သက်၍ ဆက်လက် ________ နေပါက မိမိ၏ အလုပ်ကို ဆုံးရှုံးနိုင်သည်။",
  5: "မိဘနှစ်ပါးစလုံးသည် အခြားမြို့တွင် အလုပ်လုပ်နေသောကြောင့် သူဇာကို ၎င်း၏ အဒေါ်က ________ ပေးခဲ့သည်။",
  6: "လူအများစုမှာ လယ်သမားအဖြစ် အသက်မွေးဝမ်းကျောင်းပြုကြသော ရွာကျေးလက်တစ်ခုတွင် ကျွန်ုပ် ________ ခဲ့သည်။",
  7: "မနက်ဖြန် နံနက် ၅ နာရီတွင် ထွက်ခွာမည်ဖြစ်သောကြောင့် ယနေ့ည ________ လေနှင့်။",
  8: "လကုန်မီ မိမိ၏ ငွေအားလုံးကို ________ လေနှင့်။",
  9: "ကိုကိုသည် ပြိုင်ပွဲတွင် ကိုဘိုဘို၏ နောက်မှ ________ ခဲ့သည်။",
  10: "ကျွန်ုပ်တို့သည် မတော်တဆ လေဆိပ်တွင် မိမိတို့၏ ခရီးသည်အထုပ်ကို ________ ခဲ့သည်။",
};

export const vocab8B: VocabItem[] = [
  {
    word: "bring up",
    pronunciation: "/brɪŋ ʌp/ — ဘရင် အက်ပ်",
    meaningMy: "ကလေးကို ရင့်ကျက်သည်အထိ ကြည့်ရှုစောင့်ရှောက်၍ မွေးမြူသည် (look after a child until maturity)",
    exampleEn: "Thuzar was brought up by her aunt as both her parents were working in another town.",
  },
  {
    word: "grow up",
    pronunciation: "/ɡrəʊ ʌp/ — ဂရိုး အက်ပ်",
    meaningMy: "ရုပ်ရည်၊ စိတ်နှစ်ခုစလုံး အရွယ်ရောက် ရင့်ကျက်လာသည် (develop into an adult)",
    exampleEn: "I grew up in a small village where most people earn their living as farmers.",
  },
  {
    word: "stay up",
    pronunciation: "/steɪ ʌp/ — စတေး အက်ပ်",
    meaningMy: "ပုံမှန်အချိန်ထက် နောက်ကျကျ အိပ်သည် (go to bed later than usual)",
    exampleEn: "Tomorrow, we'll leave at 5 a.m., so don't stay up late tonight.",
  },
  {
    word: "take up",
    pronunciation: "/teɪk ʌp/ — တေးက် အက်ပ်",
    meaningMy: "ဝါသနာအဖြစ် စတင်လုပ်ကိုင်သည် (begin doing something as a hobby)",
    exampleEn: "I'm taking up gardening as it is said to be very relaxing.",
  },
  {
    word: "use up",
    pronunciation: "/juːz ʌp/ — ယူဇ် အက်ပ်",
    meaningMy: "ကုန်သွားသည်အထိ အသုံးပြုသည် (use something until none is left)",
    exampleEn: "Don't use up all your money before the end of the month.",
  },
  {
    word: "make up",
    pronunciation: "/meɪk ʌp/ — မေးက် အက်ပ်",
    meaningMy: "မှားယွင်းသော ဇာတ်လမ်းများကို ကြံဆတီထွင်သည် (invent false stories)",
    exampleEn: "Susan often makes up stories which are not true at all.",
  },
  {
    word: "fall behind",
    pronunciation: "/fɔːl bɪˈhaɪnd/ — ဖောလ် ဘီဟိုင်း",
    meaningMy: "အခြားသူများနှင့် အမြန်နှုန်းညီမျှစွာ မလိုက်နိုင်သည် (fail to keep pace with others)",
    exampleEn: "You could lose your job if you keep falling behind with your work.",
  },
  {
    word: "lag behind",
    pronunciation: "/læɡ bɪˈhaɪnd/ — လက်ဂ် ဘီဟိုင်း",
    meaningMy: "နောက်ကျသည် (be late)",
    exampleEn: "Ko Ko lagged behind Bo Bo in the race.",
  },
  {
    word: "leave behind",
    pronunciation: "/liːv bɪˈhaɪnd/ — လီဗ် ဘီဟိုင်း",
    meaningMy: "မိမိပိုင်ဆိုင်သော အရာတစ်ခုကို ချန်ထားခဲ့သည် (leave something, especially something you possess)",
    exampleEn: "We accidentally left behind our luggage at the airport.",
  },
  {
    word: "stay behind",
    pronunciation: "/steɪ bɪˈhaɪnd/ — စတေး ဘီဟိုင်း",
    meaningMy: "အခြားသူများ ထွက်ခွာသွားစဉ် မိမိရှိရာတွင် ဆက်နေသည် (remain where one is while others leave)",
    exampleEn: "Ni Ni had to stay behind after class, as she hasn't finished writing her essay.",
  },
];

/* ------------------------------ 8C Grammar ----------------------------- */

export const partA8C_translations: Record<number, string> = {
  1: "မီးဘေးလွတ်လမ်း (fire exit) ကို အချိန်တိုင်း လွတ်လပ်စွာ ထားရမည်။",
  2: "လူများသည် ပိရမစ်များကို လွန်ခဲ့သော နှစ်ပေါင်း ၅,၀၀၀ နီးပါး တည်ဆောက်ခဲ့ကြသည်။",
  3: "သူတို့သည် အိမ်တစ်လုံးလုံးကို အပြာရောင် ဆေးခြယ်ခဲ့ကြသည်။",
  4: "သူတို့သည် ဝန်ထမ်းများအား ဘေးကင်းရေး စည်းမျဉ်းများကို လိုက်နာရန် တောင်းဆိုခဲ့ကြသည်။",
  5: "သူတို့သည် ရုံးခန်းကို ညတိုင်း ဖုန်စုပ်စက်ဖြင့် ဖုန်စုပ်၍ ဖုန်လှင်ပါသည်။",
  6: "လူများသည် ကမ္ဘာတစ်ဝန်းလုံးတွင် အင်္ဂလိပ်စကား ပြောဆိုကြသည်။",
  7: "သူတို့သည် ဤတံခါးကို ပုံမှန်အားဖြင့် ည ၁၀ နာရီတွင် သော့ပိတ်ကြသည်။",
  8: "မိမိ မရှိစဉ် တစ်ယောက်ယောက်က မိမိ၏ ကွန်ပျူတာကို အသုံးပြုခဲ့သည်။",
  9: "ဤဒေသရှိ လက်စားသမားများ (pickpockets) အန္တရာယ်အကြောင်း သူက ကျွန်ုပ်တို့အား သတိပေးခဲ့သည်။",
  10: "မိမိသည် အမှိုက်ကို တရားမဝင် စွန့်ပစ်ပါက ဒဏ်ကြေး ရိုက်ခံရမည်။",
  11: "သူတို့က စာအုပ်ကို မည်သည့်နေရာတွင် ရှာတွေ့ခဲ့သနည်း။",
  12: "သူတို့သည် ဤဟိုတယ်ကို နောက်နှစ်တွင် ပြုပြင်မွမ်းမံမည်။",
  13: "သူတို့သည် ဘူတာရုံအနီးတွင် အားကစားကွင်းအသစ်တစ်ခု တည်ဆောက်နေကြသည်။",
  14: "တစ်ယောက်ယောက်က နန်ဒါအား လျှို့ဝှက်ဆန်းကြယ်သော ပေးစာတစ်စောင် ပို့ခဲ့သည်။",
  15: "လူများသည် ဤဒေသတွင် UFO များကို မြင်ဖူးကြသည်။",
};

export const partB8C_translations: Record<number, string> = {
  1: "မိမိမွေးနေ့တွင် မိခင်က လှပသော အဝတ်အစားတစ်ထည် ပေးခဲ့ပြီး အဖေက ဂဏန်းတွက်စက်တစ်လုံးနှင့် ညီဖြစ်သူက လက်ပတ်နာရီတစ်လုံး ပေးခဲ့သည်။",
  2: "မီးလောင်သောအခါ ဒေါ်နီလာသည် ဧည့်ခန်းတွင် ရှိပြီး ၎င်း၏ ကလေးသည် အိပ်ခန်းတွင် ရှိသည်။",
  3: "ကျွန်ုပ်သည် ရထားဖြင့် ခရီးသွားရန် နှစ်သက်သော်လည်း မိမိ၏ မိတ်ဆွေ ဟင်းဇီမှာ လေယာဉ်ဖြင့် ခရီးသွားရန် နှစ်သက်သည်။",
  4: "တိရစ္ဆာန်အချို့သည် မြေပေါ်တွင် နေထိုင်ကြပြီး အချို့သည် ရေထဲတွင် နေထိုင်ကြ၍ အချို့သည် မြေပေါ်တွင်လည်းကောင်း၊ ရေထဲတွင်လည်းကောင်း နေထိုင်ကြသည်။",
  5: "ကျွန်ုပ်ကို ရန်ကုန်မြို့တွင် ဖွားမြင်ခဲ့ပြီး မိမိ၏ အစ်ကိုကို တောင်ကြီးမြို့တွင်လည်းကောင်း၊ အစ်မကို ထားဝယ်မြို့တွင်လည်းကောင်း ဖွားမြင်ခဲ့သည်။",
  6: "ကိုကိုမင်းသည် ဘောလုံးကစားရာတွင် ကျွမ်းကျင်ပြီး ဇော်ဇော်သည် တင်းနစ်ကစားရာတွင် ကျွမ်းကျင်၍ ကိုကိုသည် ဘတ်စကတ်ဘော ကစားရာတွင် ကျွမ်းကျင်သည်။",
  7: "အပင်အချို့သည် ရွှံ့မြေများတွင် ကောင်းမွန်စွာ ပေါက်ရောက်ပြီး အချို့သည် သဲမြေများတွင် ကောင်းမွန်စွာ ပေါက်ရောက်၍ အချို့သည် နုန်းမြေများတွင် ကောင်းမွန်စွာ ပေါက်ရောက်သည်။",
  8: "ဆူပါမာကက်များတွင် အအေးခံထားသော အစားအစာများကို ဖာရင်ဟိုက် သုညဒီဂရီတွင် ထားရမည်ဖြစ်ပြီး အသားနှင့် ငါးများကို ဖာရင်ဟိုက် ၂၈-၃၂ ဒီဂရီတွင်လည်းကောင်း၊ နို့ထွက်ပစ္စည်းများကို ဖာရင်ဟိုက် ၄၀-၅၀ ဒီဂရီတွင်လည်းကောင်း ထားရမည်ဖြစ်သည်။",
  9: "မိဘများ၏ အမှတ်တရနေ့အတွက် ကျွန်ုပ်သည် နောက်ကြောင်းကို သန့်ရှင်းရေးလုပ်နေပြီး မိမိ၏ ညီအစ်ကိုများသည် ပြတင်းပေါက်များကို သန့်ရှင်းရေးလုပ်နေ၍ မိမိ၏ ဝမ်းကွဲညီအစ်ကိုများသည် ဥယျာဉ်ကို သန့်ရှင်းရေးလုပ်နေကြသည်။",
  10: "ကျွန်ုပ်၏ ဝါသနာမှာ တံဆိပ်ခေါင်းများ စုဆောင်းခြင်း ဖြစ်ပြီး ဂျွန်၏ ဝါသနာမှာ CD များ စုဆောင်းခြင်း၊ မယ်ရီ၏ ဝါသနာမှာ ဒင်္ဂါးများ စုဆောင်းခြင်း ဖြစ်သည်။",
};

export const grammar8C = {
  whatMy:
    "Passive Voice (ခံရသူအလေးပေးသော အသံ) တွင် ခံရသူ (recipient) ကို ဝါကျ၏ အကြောင်းခံအဖြစ် ထားကာ passive verb = be + V3 (past participle) ဖြင့် ဖွဲ့သည်။ Agent (ပြုလုပ်သူ) ကို 'by + agent' ဖြင့် ထည့်နိုင်သော်လည်း agent မသိရ၊ အရေးမကြီး သို့မဟုတ် အကြောင်းအရာမှ ထင်ရှားပေါ်လွင်မှု မရှိသည့်အခါ 'by + agent' ကို ချန်လှပ်နိုင်သည်။ ထို့အပြင် ဝါကျများစွာတွင် ကြိယာတစ်ခုတည်း ထပ်ခါထပ်ခါ ပါနေလျှင် ထပ်နေသော ကြိယာများကို ချန်လှပ်၍ ဝါကျကို တိုတောင်းစေနိုင်သည်။",
  whenMy:
    "Agent မပါဝင်သော passive ကို (၁) agent (အလုပ်ကို လုပ်ဆောင်သူ) မသိရ၊ အရေးမပါ သို့မဟုတ် အကြောင်းအရာမှ ထင်ရှားမှုမရှိသည့်အခါ (e.g. John Lennon, the famous singer, was shot.)၊ (၂) လုပ်ဆောင်ချက်သည် ပြုလုပ်သူထက် ပို၍ အရေးကြီးသည့်အခါ — processes, instructions, events, reports, headlines, news items နှင့် advertisements များတွင် (e.g. Ten people were killed in shootings across Chicago between Friday and Monday morning.) အသုံးပြုသည်။ ကြိယာချန်လှပ်ခြင်း (Omission of Verbs) ကိုမူ ဝါကျတစ်ခုစီတွင် ကြိယာတစ်ခုတည်း ထပ်ခါထပ်ခါ ပါဝင်သည့်အခါ အသုံးပြုသည် (e.g. Grass is eaten by grasshoppers, grasshoppers by frogs, frogs by snakes and snakes by hawks.)။",
  whyMy:
    "Passive ပြောင်းရာတွင် တင်းစ်အလိုက် 'be' ၏ ပုံစံကို ပြောင်းရပြီး (e.g. must be kept, was built, is vacuumed, is usually locked, will be fined, was found, will be refurbished, is being built, has been sent, have been seen) agent ကို မထည့်လျှင် 'by + agent' မပါရသည်။ မေးခွန်းပုံစံကို ပြောင်းသည့်အခါ မေးခွန်းပုံစံကိုပင် ထိန်းသိမ်းရသည် (e.g. Where did they find the book? → Where was the book found?)။ ကြိယာချန်လှပ်ရာတွင် ကော်မာ (,) သို့မဟုတ် စီမီကိုလန် (;) ပြီးတွင် ထပ်နေသော ကြိယာကို ချန်လှပ်ကာ နာမ် (သို့) နာမစုတ်များကို ဆက်တိုက် ရေးသားသည် (e.g. My mother gave me a beautiful dress; my father, a calculator and my brother, a watch.)။",
  examples: [
    { en: "The fire exit must be kept free all the time.", phrase: "must be kept" },
    { en: "English is spoken all over the world.", phrase: "is spoken" },
    { en: "Grass is eaten by grasshoppers, grasshoppers by frogs, frogs by snakes and snakes by hawks.", phrase: "grasshoppers by frogs" },
  ],
};
