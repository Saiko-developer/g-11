/**
 * Poem 2 — "The Blind Boy" by Colley Cibber.
 * Real textbook content (pre-reading, poem stanzas, glossary, questions).
 */

export const POEM2_TITLE = "The Blind Boy";
export const POEM2_AUTHOR = "Colley Cibber";

export const POEM2_PRE_READING: { id: number; question: string; suggested_answer: string }[] = [
  {
    id: 1,
    question: "Have you ever seen or met anyone who is blind? If so, when and where?",
    suggested_answer:
      "Yes, I have. I met a blind man selling lottery tickets near the market in my town last year.",
  },
  {
    id: 2,
    question: "How do you feel when you see such blind people?",
    suggested_answer:
      "I feel sympathy for them, and I also admire them because they live their lives bravely.",
  },
  {
    id: 3,
    question:
      "What do you think blind people would like to see most in their lives if they could see?",
    suggested_answer:
      "I think they would most like to see the faces of their parents and family, the sun and the colours of nature.",
  },
];

export const POEM2_STANZAS: string[][] = [
  [
    "O say, what is that thing call'd Light,",
    "Which I must ne'er enjoy;",
    "What are the blessings of the sight?",
    "O, tell your poor blind boy.",
  ],
  [
    "You talk of wondrous things you see,",
    "You say the sun shines bright;",
    "I feel him warm, but how can he",
    "Or make it day and night?",
  ],
  [
    "My day and night myself I make,",
    "Whene'er I sleep, or play;",
    "And could I ever keep awake",
    "With me 'twere always day.",
  ],
  [
    "With heavy sighs I often hear",
    "You mourn my hapless woe;",
    "But sure with patience I can bear",
    "A loss I ne'er can know.",
  ],
  [
    "Then let not what I cannot have",
    "My cheer of mind destroy;",
    "Whilst thus I sing, I am a king,",
    "Although a poor blind boy.",
  ],
];

export const POEM2_GLOSSARY: { word: string; meaning: string }[] = [
  { word: "call'd", meaning: "called" },
  { word: "ne'er", meaning: "never" },
  { word: "whene'er", meaning: "whenever" },
  { word: "'twere", meaning: "it were (it would always be)" },
  { word: "blessings", meaning: "things that bring happiness" },
  { word: "sight", meaning: "being able to see / power of seeing" },
  { word: "sigh", meaning: "sound made showing pity or sadness" },
  { word: "mourn", meaning: "feel sorry or show sorrow" },
  { word: "hapless", meaning: "(old English) unlucky" },
  { word: "woe", meaning: "sorrow, loss, trouble" },
  { word: "patience", meaning: "ability to endure or suffer without complaining" },
  { word: "cheer", meaning: "(old English) happiness" },
  { word: "whilst", meaning: "while" },
  { word: "wondrous", meaning: "so good or admirable" },
];

export const POEM2_QUESTIONS: { id: number; question: string; answer: string }[] = [
  {
    id: 1,
    question: "What is the thing that the blind boy will never enjoy?",
    answer: "The thing that the blind boy will never enjoy is light.",
  },
  {
    id: 2,
    question: "Why can't he enjoy it?",
    answer: "He cannot enjoy it because he is blind and has no power of sight.",
  },
  {
    id: 3,
    question: "What are the wondrous things you see in the daytime?",
    answer:
      "In the daytime I can see the bright sun, the blue sky, green trees, flowers and the faces of the people around me.",
  },
  {
    id: 4,
    question: "When is it day for him?",
    answer: "It is day for him whenever he is awake and playing.",
  },
  {
    id: 5,
    question: "When is it night for him?",
    answer: "It is night for him whenever he sleeps.",
  },
  {
    id: 6,
    question: "Which lines tell us that people who can see feel sorry for him?",
    answer:
      "The lines \u201cWith heavy sighs I often hear / You mourn my hapless woe\u201d tell us that people who can see feel sorry for him.",
  },
  {
    id: 7,
    question: "Does the blind boy feel sorry for himself? Why?",
    answer:
      "No, he does not feel sorry for himself because he can bear with patience a loss that he has never known.",
  },
  {
    id: 8,
    question: "How does the blind boy regard himself in spite of his blindness?",
    answer:
      "In spite of his blindness he regards himself as a king because he keeps his cheerful mind and sings happily.",
  },
  {
    id: 9,
    question: "If there were a blind person in your class, how would you help him / her?",
    answer:
      "I would read the lessons aloud for him, guide him around the school and treat him as an equal friend.",
  },
];

/** Line-by-line Burmese translation for each of the 5 stanzas. */
export const POEM2_STANZA_TRANSLATIONS: string[][] = [
  [
    "အို ပြောပြစမ်းပါ၊ အလင်းရောင်လို့ခေါ်တဲ့ အရာက ဘာလဲ၊",
    "ကျွန်ုပ် ဘယ်သောအခါမှ မခံစားရမယ့် အရာ၊",
    "အမြင်အာရုံရဲ့ ကောင်းချီးမင်္ဂလာတွေက ဘာတွေလဲ။",
    "အို၊ သင်တို့ရဲ့ သနားစရာ မျက်မမြင်ကောင်လေးကို ပြောပြပေးပါ။",
  ],
  [
    "သင်တို့က မြင်တွေ့ရတဲ့ အံ့ဩဖွယ်အရာတွေအကြောင်း ပြောကြတယ်၊",
    "သင်ဆိုရီ နေမင်းကြီး တောက်ပစွာလင်းလက်တယ်လို့ ပြောကြတယ်၊",
    "သူ့ရဲ့အပူရှိန်ကို ကျွန်ုပ်ခံစားရတယ်၊ ဒါပေမယ့် သူက ဘယ်လိုလုပ်ပြီး",
    "နေ့နဲ့ညကို ဖန်တီးပေးနိုင်တာလဲ။",
  ],
  [
    "ကျွန်ုပ်ရဲ့ နေ့နဲ့ညကို ကျွန်ုပ်ကိုယ်တိုင်ပဲ ဖန်တီးတယ်၊",
    "ကျွန်ုပ် အိပ်စက်တဲ့အခါ ဒါမှမဟုတ် ဆော့ကစားတဲ့အခါတိုင်းပေါ့၊",
    "ပြီးတော့ ကျွန်ုပ်သာ အမြဲတမ်း နိုးနေနိုင်မယ်ဆိုရင်",
    "ကျွန်ုပ်အတွက်တော့ အမြဲတမ်း နေ့ပဲ ဖြစ်နေမှာပါ။",
  ],
  [
    "သင်တို့က ကျွန်ုပ်ရဲ့ ကံဆိုးမိုးမှောင်ကျတဲ့ ဆင်းရဲဒုက္ခအတွက် ဝမ်းနည်းပူဆွေးနေကြတာကို",
    "ပြင်းပြင်းထန်ထန် သက်ပြင်းချသံတွေနဲ့အတူ ကျွန်ုပ် မကြာခဏ ကြားရတယ်၊",
    "ဒါပေမယ့် ကျွန်ုပ် ဘယ်တော့မှ မသိနိုင်တဲ့ ဆုံးရှုံးမှုတစ်ခုကို",
    "စိတ်ရှည်သည်းခံမှုနဲ့အတူ ကျွန်ုပ် အသေအချာ ခံနိုင်ရည်ရှိပါတယ်။",
  ],
  [
    "ဒါကြောင့် ကျွန်ုပ် မပိုင်ဆိုင်နိုင်တဲ့အရာက",
    "ကျွန်ုပ်ရဲ့ စိတ်ချမ်းမြေ့မှုကို ဖျက်ဆီးမပစ်ပါစေနဲ့၊",
    "အခုလို သီချင်းဆိုနေတဲ့အချိန်မှာ ကျွန်ုပ်ဟာ ဘုရင်တစ်ပါးပါပဲ၊",
    "သနားစရာ မျက်မမြင်ကောင်လေးတစ်ယောက် ဖြစ်နေပေမယ့်လည်းပေါ့။",
  ],
];

/** Burmese translations of the pre-reading questions, keyed by question id. */
export const POEM2_PRE_READING_TRANSLATIONS: Record<number, string> = {
  1: "မင်း မျက်မမြင်တစ်ဦးဦးကို မြင်ဖူး သို့မဟုတ် ဆုံဖူးပါသလား။ ရှိခဲ့ရင် ဘယ်တုန်းကနဲ့ ဘယ်နေရာမှာလဲ။",
  2: "အဲဒီလို မျက်မမြင်လူတွေကို မြင်ရတဲ့အခါ မင်း ဘယ်လိုခံစားရလဲ။",
  3: "အကယ်၍ သူတို့သာ မြင်နိုင်ခဲ့မယ်ဆိုရင် မျက်မမြင်လူတွေဟာ သူတို့ဘဝမှာ ဘာကို အမြင်ချင်ဆုံးဖြစ်မယ်လို့ မင်းထင်သလဲ။",
};

/** Grammatical formula breakdowns of the pre-reading questions. */
export const POEM2_PRE_READING_STRUCTURES: Record<number, string> = {
  1: "[Auxiliary Verb: Have] + [Subject: you] + [Adverb: ever] + [Past Participle Verbs: seen or met] + [Object: anyone] + [Relative Clause: who is blind]?",
  2: "[Wh-Adverb: How] + [Auxiliary Verb: do] + [Subject: you] + [Main Verb: feel] + [Adverbial Time Clause: when you see such blind people]?",
  3: "[Wh-Pronoun: What] + [Do you think] + [Subject: blind people] + [Verb Phrase: would like to see most...] + [Conditional Clause: if they could see]?",
};

/** Burmese translations of the comprehension questions, keyed by question id. */
export const POEM2_QUESTION_TRANSLATIONS: Record<number, string> = {
  1: "မျက်မမြင်ကောင်လေး ဘယ်တော့မှ ခံစားခွင့်ရရှိမှာမဟုတ်တဲ့ အရာက ဘာလဲ။",
  2: "သူ ဘာကြောင့် အဲဒါကို မခံစားနိုင်ရတာလဲ။",
  3: "နေ့ဘက်မှာ မင်းမြင်တွေ့ရတဲ့ အံ့ဩစရာကောင်းတဲ့ အရာတွေက ဘာတွေလဲ။",
  4: "သူ့အတွက် ဘယ်အချိန်မှာ နေ့ဖြစ်သလဲ။",
  5: "သူ့အတွက် ဘယ်အချိန်မှာ ညဖြစ်သလဲ။",
  6: "အမြင်အာရုံရှိတဲ့လူတွေက သူ့ကို သနားကြတယ်ဆိုတာ ကဗျာထဲက ဘယ်စာကြောင်းတွေက ဖော်ပြနေသလဲ။",
  7: "မျက်မမြင်ကောင်လေးက သူ့ကိုယ်သူ သနားစိတ် (အားငယ်စိတ်) ရှိသလား။ ဘာကြောင့်လဲ။",
  8: "မျက်မမြင်ဖြစ်နေလင့်ကစား မျက်မမြင်ကောင်လေးက သူ့ကိုယ်သူ ဘယ်လိုမျိုး သတ်မှတ်ထားသလဲ။",
  9: "အကယ်၍ မင်းရဲ့အတန်းထဲမှာ မျက်မမြင်တစ်ယောက်ရှိခဲ့ရင် မင်း သူ့ကို ဘယ်လိုကူညီမလဲ။",
};

/** Grammatical formula breakdowns of the comprehension questions. */
export const POEM2_QUESTION_STRUCTURES: Record<number, string> = {
  1: "[Wh-Pronoun: What] + [Verb 'to be': is] + [Subject Noun Phrase: the thing that the blind boy will never enjoy]?",
  2: "[Wh-Adverb: Why] + [Modal Verb: can't] + [Subject: he] + [Main Verb: enjoy] + [Object Pronoun: it]?",
  3: "[Wh-Pronoun: What] + [Verb 'to be': are] + [Subject Noun Phrase: the wondrous things you see in the daytime]?",
  4: "[Wh-Adverb: When] + [Verb 'to be': is] + [Dummy Subject: it] + [Noun: day] + [Prepositional Phrase: for him]?",
  5: "[Wh-Adverb: When] + [Verb 'to be': is] + [Dummy Subject: it] + [Noun: night] + [Prepositional Phrase: for him]?",
  6: "[Wh-Determiner + Subject Noun: Which lines] + [Main Verb: tell] + [Indirect Object: us] + [Noun Clause: that people who can see feel sorry for him]?",
  7: "[Auxiliary Verb: Does] + [Subject: the blind boy] + [Main Verb Phrase: feel sorry] + [Prepositional Object: for himself]? + [Wh-Word: Why]?",
  8: "[Wh-Adverb: How] + [Auxiliary Verb: does] + [Subject: the blind boy] + [Main Verb: regard] + [Reflexive Object: himself] + [Prepositional phrase of concession: in spite of his blindness]?",
  9: "[Conditional Clause: If there were a blind person in your class,] + [Wh-Adverb: how] + [Modal Verb: would] + [Subject: you] + [Main Verb: help] + [Object: him / her]?",
};
