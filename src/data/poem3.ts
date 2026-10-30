/**
 * Poem 3 — "Song" by Christina Rossetti.
 * Real textbook content (pre-reading, poem stanzas, glossary, questions).
 */

export const POEM3_TITLE = "Song";
export const POEM3_AUTHOR = "Christina Rossetti";

export const POEM3_PRE_READING: { id: number; question: string; suggested_answer: string }[] = [
  {
    id: 1,
    question: "What comes into your mind when you see the title of the poem, 'Song'?",
    suggested_answer:
      "When I see the title 'Song', I think of music, melodies, singing, and the emotions that songs can express.",
  },
  {
    id: 2,
    question: "Do you like songs? If so, why? If not, why?",
    suggested_answer:
      "Yes, I like songs because they make me feel relaxed and happy. They also help me express my feelings.",
  },
  {
    id: 3,
    question: "Name the kinds of songs you know.",
    suggested_answer:
      "I know many kinds of songs such as pop songs, rock songs, classical songs, folk songs, lullabies, and patriotic songs.",
  },
];

export const POEM3_STANZAS: string[][] = [
  [
    "When I am dead, my dearest,",
    "Sing no sad songs for me;",
    "Plant thou no roses at my head,",
    "Nor shady cypress tree:",
    "Be the green grass above me",
    "With showers and dewdrops wet;",
    "And if thou wilt, remember,",
    "And if thou wilt, forget.",
  ],
  [
    "I shall not see the shadows,",
    "I shall not feel the rain;",
    "I shall not hear the nightingale",
    "Sing on, as if in pain:",
    "And dreaming through the twilight",
    "That doth not rise nor set,",
    "Haply I may remember,",
    "And haply may forget.",
  ],
];

export const POEM3_GLOSSARY: { word: string; meaning: string }[] = [
  { word: "cypress", meaning: "a tall and narrow evergreen tree" },
  { word: "nightingale", meaning: "a small brown European bird that sings beautiful songs" },
  { word: "twilight", meaning: "the time of day just after sunset or before dawn, when the Sun is below the horizon" },
];

export const POEM3_QUESTIONS: { id: number; question: string; answer: string }[] = [
  {
    id: 1,
    question: "Copy out the rhyming words in the poem.",
    answer:
      "The rhyming words are: me/tree, me/forget, wet/forget, rain/pain, set/forget.",
  },
  {
    id: 2,
    question: "Copy out the 'old' English words used by the poet.",
    answer:
      "The old English words used are: thou, wilt, doth, haply.",
  },
  {
    id: 3,
    question: "What does each 'old' English word mean?",
    answer:
      "Thou = you (subject), wilt = will (want to), doth = does, haply = perhaps/maybe.",
  },
  {
    id: 4,
    question: "To whom do you think Christina Rossetti says all these things?",
    answer:
      "She is speaking to her loved one or dearest person, telling them what she wants after she dies.",
  },
  {
    id: 5,
    question: "What are the things she does not want people to do when she is dead and gone?",
    answer:
      "She does not want them to sing sad songs for her, plant roses at her head, or plant a shady cypress tree.",
  },
  {
    id: 6,
    question: "Why do you think she tells people not to do these things?",
    answer:
      "She tells people not to do these things because she will not be able to see or feel anything after death, so there is no point in mourning for her.",
  },
  {
    id: 7,
    question: "Why does she think that the nightingale sings?",
    answer:
      "She thinks the nightingale sings as if it is in pain because its song sounds sad and mournful.",
  },
];

/** Line-by-line Burmese translation for each of the 2 stanzas. */
export const POEM3_STANZA_TRANSLATIONS: string[][] = [
  [
    "ကျွန်ုပ်သေဆုံးသွားပြီးနောက်၊ ကျွန်ုပ်ရဲ့အချစ်ရဆုံးသူများတို့ရေ၊",
    "ကျွန်ုပ်အတွက် ဝမ်းနည်းသော သီချင်းများ မသီကြပါနဲ့။",
    "ကျွန်ုပ်ရဲ့ ခေါင်းနားမှာ နှင်းဆီပန်းများ မစိုက်ကြပါနဲ့၊",
    "သို့မဟုတ် အရိပ်မည်းသော ဆစ်ပရက်ပင်လေးကိုလည်း မစိုက်ကြပါနဲ့။",
    "ကျွန်ုပ်ရဲ့ အပေါ်မှာ မြက်ခင်းစိမ်းလန်းစွာ ရှိပါစေ၊",
    "မိုးရေစက်နှင့် နှင့်တက်ရောက်သော အချို့သော ရေစက်များဖြင့်၊",
    "ထို့နောက် အကယ်၍ သင်သည် လိုချင်ပါက၊ မှတ်မိပါစေ၊",
    "အကယ်၍ သင်သည် လိုချင်ပါက၊ မေ့ပျောက်ပါစေ။",
  ],
  [
    "ကျွန်ုပ်သည် အရိပ်များကို မြင်ရမည်မဟုတ်ပါ၊",
    "ကျွန်ုပ်သည် မိုးရေကို မခံစားရမည်မဟုတ်ပါ။",
    "ကျွန်ုပ်သည် ညီးညီးသီချင်းကို နားမကြားရမည်မဟုတ်ပါ",
    "နာကျင်စွာ သီဆိုနေသကဲ့သို့ သီချင်းဆိုနေသော၊",
    "ထို့နောက် ဆည်းဆာချိန်တွင် အိပ်မက်မက်နေခြင်းဖြင့်",
    "မထွက်သွားသော နှင့် မဝင်သွားသော၊",
    "ဖြစ်နိုင်ချေရှိသော ကျွန်ုပ်သည် မှတ်မိနိုင်သည်၊",
    "နှင့် ဖြစ်နိုင်ချေရှိသော မေ့ပျောက်နိုင်သည်။",
  ],
];

/** Burmese translations of the pre-reading questions, keyed by question id. */
export const POEM3_PRE_READING_TRANSLATIONS: Record<number, string> = {
  1: "ကဗျာခေါင်းဉာဏ် 'သီချင်း' ကို မြင်တွေ့သောအခါ မင်းရဲ့ စိတ်ထဲမှာ ဘာတွေ ဝင်လာသလဲ။",
  2: "မင်း သီချင်းတွေကို ကြိုက်သလား။ ကြိုက်ရင် ဘာကြောင့်လဲ။ မကြိုက်ဘူးဆိုရင် ဘာကြောင့်လဲ။",
  3: "မင်းသိတဲ့ သီချင်းအမျိုးအစားတွေက ဘာတွေလဲ။ အမည်ပေးပါ။",
};

/** Grammatical formula breakdowns of the pre-reading questions. */
export const POEM3_PRE_READING_STRUCTURES: Record<number, string> = {
  1: "[Wh-Pronoun: What] + [Verb Phrase: comes into] + [Possessive Adjective: your] + [Noun: mind] + [Adverbial Clause: when you see the title of the poem, 'Song']?",
  2: "[Auxiliary Verb: Do] + [Subject: you] + [Main Verb: like] + [Object: songs]? + [Conditional Clause: If so, why?] + [Conditional Clause: If not, why?]",
  3: "[Imperative Verb: Name] + [Determiner: the] + [Noun Phrase: kinds of songs] + [Relative Clause: you know]?",
};

/** Burmese translations of the comprehension questions, keyed by question id. */
export const POEM3_QUESTION_TRANSLATIONS: Record<number, string> = {
  1: "ကဗျာထဲမှာ ကာရန်ညီသော စကားလုံးတွေကို ကူးယူရေးပါ။",
  2: "ကဗျာဆရက သုံးသော 'ရှေးဟောင်း' အင်္ဂလိပ်စကားလုံးတွေကို ကူးယူရေးပါ။",
  3: "ရှေးဟောင်း အင်္ဂလိပ်စကားလုံးတစ်လုံးချင်းစီရဲ့ အဓိပ္ပာယ်က ဘာလဲ။",
  4: "ခရစ္စတနာ ရောစကီတီက ဒီအရာတွေအားလုံးကို ဘယ်သူကို ပြောနေတယ်လို့ မင်းထင်သလဲ။",
  5: "သူမ သေဆုံးသွားပြီးနောက် လူတွေက ဘာတွေ မလုပ်စေချင်ဘူးလဲ။",
  6: "သူမ ဘာကြောင့် ဒီအရာတွေကို မလုပ်စေချင်ဘူးလို့ မင်းထင်သလဲ။",
  7: "သူမ ဘာကြောင့် ညီးညီးက နာကျင်စွာ သီဆိုနေသလို့ ထင်သလဲ။",
};

/** Grammatical formula breakdowns of the comprehension questions. */
export const POEM3_QUESTION_STRUCTURES: Record<number, string> = {
  1: "[Imperative Verb: Copy out] + [Determiner: the] + [Adjective: rhyming] + [Noun: words] + [Prepositional Phrase: in the poem]?",
  2: "[Imperative Verb: Copy out] + [Determiner: the] + [Adjective: 'old'] + [Noun Phrase: English words] + [Past Participle Phrase: used by the poet]?",
  3: "[Wh-Pronoun: What] + [Auxiliary Verb: does] + [Determiner: each] + [Adjective: 'old'] + [Noun: English word] + [Main Verb: mean]?",
  4: "[Preposition: To] + [Wh-Pronoun: whom] + [Auxiliary Verb: do] + [Subject: you] + [Main Verb: think] + [Subject: Christina Rossetti] + [Main Verb: says] + [Determiner: all] + [Demonstrative Pronoun: these] + [Noun: things]?",
  5: "[Wh-Pronoun: What] + [Verb 'to be': are] + [Determiner: the] + [Noun: things] + [Relative Clause: she does not want people to do] + [Adverbial Clause: when she is dead and gone]?",
  6: "[Wh-Adverb: Why] + [Auxiliary Verb: do] + [Subject: you] + [Main Verb: think] + [Subject: she] + [Main Verb: tells] + [Object: people] + [Negative Particle: not] + [Main Verb: do] + [Demonstrative Pronoun: these] + [Noun: things]?",
  7: "[Wh-Adverb: Why] + [Auxiliary Verb: does] + [Subject: she] + [Main Verb: think] + [Conjunction: that] + [Subject: the nightingale] + [Main Verb: sings]?",
};