/**
 * Poem 1 — "Daffodils" by William Wordsworth.
 * Real textbook content (pre-reading, poem stanzas, glossary, questions).
 */

export const POEM1_TITLE = "Daffodils";
export const POEM1_AUTHOR = "William Wordsworth";

export const POEM1_PRE_READING: { id: number; question: string; suggested_answer: string }[] = [
  {
    id: 1,
    question: "Do you like flowers? If so, what flowers do you like? / If not, why?",
    suggested_answer:
      "Yes, I like flowers very much. I like roses and jasmine because they are beautiful and they smell sweet.",
  },
  {
    id: 2,
    question: "In Myanmar, what do people use flowers for?",
    suggested_answer:
      "In Myanmar, people use flowers to offer at the pagoda, to decorate their homes and to give as presents on special occasions.",
  },
];

export const POEM1_STANZAS: string[][] = [
  [
    "I wandered lonely as a cloud",
    "That floats on high o'er vales and hills,",
    "When all at once I saw a crowd,",
    "A host of golden daffodils;",
    "Beside the lake, beneath the trees,",
    "Fluttering and dancing in the breeze.",
  ],
  [
    "Continuous as the stars that shine",
    "And twinkle on the Milky Way,",
    "They stretched in never-ending line",
    "Along the margin of a bay:",
    "Ten thousand saw I at a glance,",
    "Tossing their heads in sprightly dance.",
  ],
];

export const POEM1_GLOSSARY: { word: string; meaning: string }[] = [
  { word: "all at once", meaning: "suddenly" },
  { word: "o'er", meaning: "over" },
  { word: "vales", meaning: "valleys" },
  { word: "twinkle", meaning: "shine with an unsteady light" },
  {
    word: "the Milky Way",
    meaning:
      "a broad band of light that can be seen in the night sky, caused by the light of a very large number of faint stars",
  },
  { word: "sprightly", meaning: "in a lively way" },
  { word: "host", meaning: "a very large number" },
  { word: "fluttering", meaning: "moving lightly to and fro" },
];

export const POEM1_QUESTIONS: { id: number; question: string; answer: string }[] = [
  {
    id: 1,
    question: "What did the poet compare himself to in the first stanza?",
    answer: "In the first stanza the poet compared himself to a lonely cloud.",
  },
  {
    id: 2,
    question: "What did the poet suddenly see?",
    answer: "The poet suddenly saw a crowd, a host of golden daffodils.",
  },
  {
    id: 3,
    question: "What colour were the daffodils?",
    answer: "The daffodils were golden (yellow) in colour.",
  },
  {
    id: 4,
    question: "Where were the daffodils?",
    answer: "The daffodils were beside the lake, beneath the trees, along the margin of a bay.",
  },
  {
    id: 5,
    question: "Which words suggest 'a great number of daffodils'?",
    answer:
      "The words \u201ca crowd\u201d, \u201ca host\u201d, \u201cnever-ending line\u201d and \u201cten thousand\u201d suggest a great number of daffodils.",
  },
  {
    id: 6,
    question: "What caused the fluttering and dancing movement of the daffodils?",
    answer: "The breeze caused the fluttering and dancing movement of the daffodils.",
  },
  {
    id: 7,
    question: "To describe the movements of the daffodils what words did the poet use?",
    answer:
      "To describe their movements the poet used the words \u201cfluttering\u201d, \u201cdancing\u201d and \u201ctossing their heads in sprightly dance\u201d.",
  },
  {
    id: 8,
    question:
      "Is the second stanza about the stars in the Milky Way or is it about the great number of daffodils that the poet saw? Which line in the stanza makes you think so?",
    answer:
      "The second stanza is about the great number of daffodils that the poet saw. The line \u201cTen thousand saw I at a glance\u201d makes me think so.",
  },
  {
    id: 9,
    question:
      "Think of a flower you like and compose a three-line verse about it, substituting the 4th, 5th and 6th lines of the first stanza of the poem 'Daffodils'.",
    answer:
      "A host of fragrant jasmine flowers; / Beside the fence, behind my home, / Nodding and smiling in the breeze.",
  },
];

/** Line-by-line Burmese translation for each of the 2 stanzas. */
export const POEM1_STANZA_TRANSLATIONS: string[][] = [
  [
    "ကျွန်ုပ်သည် တိမ်တစ်စတစ်ခုကဲ့သို့ တစ်ကိုယ်တည်း လျှောက်လည်ခဲ့သည်၊",
    "တောင်ကြားများနှင့် တောင်ကုန်းများအထက်တွင် မြင့်မြင့်မျောနေသော တိမ်လိုပေါ့၊",
    "ရုတ်တရက် ကျွန်ုပ် အုပ်စုလိုက်ကြီးတစ်ခုကို မြင်လိုက်ရသည်၊",
    "ရွှေရောင်တောက်ပသော ဒက်ဖိုဒီးလ်ပန်းအုပ်ကြီးတစ်ခုပါ၊",
    "ရေကန်ဘေးမှာ၊ သစ်ပင်များအောက်မှာ၊",
    "လေညှင်းထဲတွင် တဖျပ်ဖျပ်လှုပ်ရှားကာ ကခုန်နေကြသည်။",
  ],
  [
    "တောက်ပလင်းလက်နေသော ကြယ်များကဲ့သို့ အဆက်မပြတ်၊",
    "နဂါးငွေ့တန်းပေါ်တွင် မှိတ်တုတ်မှိတ်တုတ် လက်နေကြသလိုပေါ့၊",
    "သူတို့သည် အဆုံးမရှိသော အတန်းလိုက်ကြီးအဖြစ် ဆန့်ငင်ရပ်တည်နေကြသည်၊",
    "ပင်လယ်ကွေ့တစ်ခုရဲ့ ကမ်းစပ်တစ်လျှောက်မှာပေါ့၊",
    "တစ်ချက်ကြည့်လိုက်တာနဲ့ ကျွန်ုပ် တစ်သောင်းလောက်ကို မြင်လိုက်ရသည်၊",
    "သူတို့ရဲ့ ဦးခေါင်းများကို လှုပ်ရှားကာ ရွှင်လန်းစွာ ကခုန်နေကြသည်။",
  ],
];

/** Burmese translations of the pre-reading questions, keyed by question id. */
export const POEM1_PRE_READING_TRANSLATIONS: Record<number, string> = {
  1: "မင်း ပန်းတွေကို ကြိုက်သလား။ ကြိုက်ရင် ဘယ်ပန်းတွေကို ကြိုက်လဲ။ မကြိုက်ဘူးဆိုရင် ဘာကြောင့်လဲ။",
  2: "မြန်မာနိုင်ငံမှာ လူတွေက ပန်းတွေကို ဘာအတွက် အသုံးပြုကြသလဲ။",
};

/** Grammatical formula breakdowns of the pre-reading questions. */
export const POEM1_PRE_READING_STRUCTURES: Record<number, string> = {
  1: "[Auxiliary Verb: Do] + [Subject: you] + [Main Verb: like] + [Object: flowers]? + [Conditional Clause: If so,] + [Wh-Determiner: what flowers] + [Auxiliary: do] + [Subject: you] + [Verb: like]?",
  2: "[Prepositional Phrase: In Myanmar,] + [Wh-Pronoun: what] + [Auxiliary Verb: do] + [Subject: people] + [Main Verb: use] + [Object: flowers] + [Preposition: for]?",
};

/** Burmese translations of the comprehension questions, keyed by question id. */
export const POEM1_QUESTION_TRANSLATIONS: Record<number, string> = {
  1: "ပထမကဗျာပိုဒ်မှာ ကဗျာဆရာက သူ့ကိုယ်သူ ဘာနဲ့ နှိုင်းယှဉ်ထားသလဲ။",
  2: "ကဗျာဆရာက ရုတ်တရက် ဘာကို မြင်လိုက်ရသလဲ။",
  3: "ဒက်ဖိုဒီးလ်ပန်းတွေက ဘယ်အရောင်ရှိသလဲ။",
  4: "ဒက်ဖိုဒီးလ်ပန်းတွေက ဘယ်နေရာမှာ ရှိနေသလဲ။",
  5: "ဘယ်စကားလုံးတွေက 'ဒက်ဖိုဒီးလ်ပန်း အများအပြား' ကို ဖော်ညွှန်းနေသလဲ။",
  6: "ဒက်ဖိုဒီးလ်ပန်းတွေရဲ့ တဖျပ်ဖျပ်လှုပ်ရှားပြီး ကခုန်နေတဲ့ လှုပ်ရှားမှုကို ဘာက ဖြစ်စေတာလဲ။",
  7: "ဒက်ဖိုဒီးလ်ပန်းတွေရဲ့ လှုပ်ရှားမှုတွေကို ဖော်ပြဖို့ ကဗျာဆရာက ဘယ်စကားလုံးတွေကို သုံးထားသလဲ။",
  8: "ဒုတိယကဗျာပိုဒ်ဟာ နဂါးငွေ့တန်းက ကြယ်တွေအကြောင်းလား၊ ဒါမှမဟုတ် ကဗျာဆရာမြင်ခဲ့တဲ့ ဒက်ဖိုဒီးလ်ပန်း အများအပြားအကြောင်းလား။ ကဗျာပိုဒ်ထဲက ဘယ်စာကြောင်းက အဲဒီလို ထင်စေသလဲ။",
  9: "မင်းကြိုက်တဲ့ ပန်းတစ်မျိုးကို စဉ်းစားပြီး 'Daffodils' ကဗျာရဲ့ ပထမကဗျာပိုဒ် စတုတ္ထ၊ ပဉ္စမနှင့် ဆဋ္ဌမ စာကြောင်းများနေရာတွင် အစားထိုးကာ သုံးကြောင်းကဗျာ ရေးဖွဲ့ပါ။",
};

/** Grammatical formula breakdowns of the comprehension questions. */
export const POEM1_QUESTION_STRUCTURES: Record<number, string> = {
  1: "[Wh-Pronoun: What] + [Auxiliary Verb: did] + [Subject: the poet] + [Main Verb: compare] + [Reflexive Object: himself] + [Preposition: to] + [Prepositional Phrase: in the first stanza]?",
  2: "[Wh-Pronoun: What] + [Auxiliary Verb: did] + [Subject: the poet] + [Adverb: suddenly] + [Main Verb: see]?",
  3: "[Wh-Determiner + Noun: What colour] + [Verb 'to be': were] + [Subject: the daffodils]?",
  4: "[Wh-Adverb: Where] + [Verb 'to be': were] + [Subject: the daffodils]?",
  5: "[Wh-Determiner + Subject Noun: Which words] + [Main Verb: suggest] + [Object Noun Phrase: 'a great number of daffodils']?",
  6: "[Wh-Pronoun (Subject): What] + [Main Verb: caused] + [Object Noun Phrase: the fluttering and dancing movement of the daffodils]?",
  7: "[Infinitive Purpose Phrase: To describe the movements of the daffodils] + [Wh-Determiner: what words] + [Auxiliary Verb: did] + [Subject: the poet] + [Main Verb: use]?",
  8: "[Verb 'to be': Is] + [Subject: the second stanza] + [Prepositional Phrase 1: about the stars in the Milky Way] + [Coordinator: or] + [Alternative Clause: is it about the great number of daffodils that the poet saw]? + [Wh-Determiner: Which line] + [Main Verb: makes] + [Object: you] + [Bare Infinitive: think so]?",
  9: "[Imperative Verb: Think] + [Prepositional Object: of a flower you like] + [Coordinator: and] + [Imperative Verb: compose] + [Object: a three-line verse about it] + [Participial Phrase: substituting the 4th, 5th and 6th lines of the first stanza]?",
};
