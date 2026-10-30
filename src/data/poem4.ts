/**
 * Poem 4 — "What Is Pink?" by Christina Rossetti.
 * Real textbook content (pre-reading, poem, glossary, table exercise, writing task).
 */

export const POEM4_TITLE = "What Is Pink?";
export const POEM4_AUTHOR = "Christina Rossetti";

export const POEM4_PRE_READING: { id: number; question: string; suggested_answer: string }[] = [
  {
    id: 1,
    question: "What is your favourite colour? Why do you like that colour most?",
    suggested_answer:
      "My favourite colour is blue because it reminds me of the sky and the sea, and it makes me feel calm and peaceful.",
  },
  {
    id: 2,
    question: "Is there any colour you don't like? Why or why not?",
    suggested_answer:
      "Yes, I do not really like dark grey because it looks dull and it reminds me of cloudy, rainy days.",
  },
];

/** The poem, grouped into its rhyming couplets. */
export const POEM4_STANZAS: string[][] = [
  ["What is pink? A rose is pink", "By the fountain's brink."],
  ["What is red? A poppy's red", "In its barley bed."],
  ["What is blue? The sky is blue", "Where the clouds float through."],
  ["What is white? A swan is white", "Sailing in the light."],
  ["What is yellow? Pears are yellow,", "Rich and ripe and mellow."],
  ["What is green? The grass is green,", "With small flowers between."],
  ["What is violet? Clouds are violet", "In the summer twilight."],
  ["What is orange? Why, an orange,", "Just an orange!"],
];

export const POEM4_GLOSSARY: { word: string; meaning: string }[] = [
  {
    word: "fountain",
    meaning: "a stream of water that is forced up into the air through a small hole",
  },
  { word: "brink", meaning: "the edge of something" },
  { word: "poppy", meaning: "plant with red flower" },
  { word: "swan", meaning: "large long-necked water bird" },
  {
    word: "pears",
    meaning:
      "a sweet juicy fruit with a usually green skin, firm white flesh, and roughly teardrop shape, eaten fresh or canned",
  },
  { word: "mellow", meaning: "soft, juicy, fully ripened, and sweet" },
  { word: "violet", meaning: "a deep purplish blue colour" },
  {
    word: "twilight",
    meaning: "the time of day just after sunset or before dawn, when the Sun is below the horizon",
  },
];

/** Line-by-line Burmese translation for each couplet. */
export const POEM4_STANZA_TRANSLATIONS: string[][] = [
  ["ပန်းရောင်ဆိုတာ ဘာလဲ။ နှင်းဆီပန်းက ပန်းရောင်ပါ", "ရေပန်း၏ အနားစွန်းမှာ။"],
  ["အနီရောင်ဆိုတာ ဘာလဲ။ ပိုပီပန်းက အနီရောင်ပါ", "သူ့ရဲ့ ဘာလီစပါးခင်းထဲမှာ။"],
  ["အပြာရောင်ဆိုတာ ဘာလဲ။ ကောင်းကင်က အပြာရောင်ပါ", "တိမ်တိုက်များ မျောနေသောနေရာမှာ။"],
  ["အဖြူရောင်ဆိုတာ ဘာလဲ။ ငန်းက အဖြူရောင်ပါ", "အလင်းရောင်ထဲမှာ ရွက်လွှင့်နေစဉ်။"],
  ["အဝါရောင်ဆိုတာ ဘာလဲ။ သစ်တော်သီးများက အဝါရောင်ပါ", "အရသာကြွယ်ဝပြီး မှည့်ပြီး ချိုမြိန်စွာ။"],
  ["အစိမ်းရောင်ဆိုတာ ဘာလဲ။ မြက်ခင်းက အစိမ်းရောင်ပါ", "ကြားထဲမှာ ပန်းငယ်လေးများနှင့်အတူ။"],
  ["ခရမ်းပြာရောင်ဆိုတာ ဘာလဲ။ တိမ်တိုက်များက ခရမ်းပြာရောင်ပါ", "နွေရာသီ ဆည်းဆာချိန်မှာ။"],
  ["လိမ္မော်ရောင်ဆိုတာ ဘာလဲ။ ဟုတ်တယ်၊ လိမ္မော်သီးပေါ့", "လိမ္မော်သီးပဲ ဖြစ်ပါတယ်!"],
];

/** Burmese translations of the pre-reading questions, keyed by question id. */
export const POEM4_PRE_READING_TRANSLATIONS: Record<number, string> = {
  1: "မင်းအကြိုက်ဆုံး အရောင်က ဘာလဲ။ ဘာကြောင့် အဲဒီအရောင်ကို အကြိုက်ဆုံး ဖြစ်ရတာလဲ။",
  2: "မင်း မကြိုက်တဲ့ အရောင် ရှိသလား။ ဘာကြောင့် ကြိုက်တာလဲ၊ ဒါမှမဟုတ် ဘာကြောင့် မကြိုက်တာလဲ။",
};

/** Grammatical formula breakdowns of the pre-reading questions. */
export const POEM4_PRE_READING_STRUCTURES: Record<number, string> = {
  1: "[Wh-Pronoun: What] + [Verb 'to be': is] + [Possessive Adjective: your] + [Adjective: favourite] + [Noun: colour]? + [Wh-Adverb: Why] + [Auxiliary Verb: do] + [Subject: you] + [Main Verb: like] + [Object: that colour] + [Superlative Adverb: most]?",
  2: "[Verb 'to be': Is] + [Existential 'there': there] + [Determiner: any] + [Noun: colour] + [Relative Clause: you don't like]? + [Wh-Adverb: Why] + [Conjunction: or] + [Wh-Adverb: why] + [Negative Particle: not]?",
};

/**
 * Exercise A — table completion. Row 1 (pink) is the worked example from the
 * textbook; the remaining rows are the answers taken from the poem.
 */
export const POEM4_TABLE_COLUMNS = [
  "Colour",
  "Things in Nature",
  "Prepositional Phrases that Describe Places",
  "Prepositional Phrases that Describe Time",
  "Adjectives other than Colours",
] as const;

export const POEM4_TABLE_ROWS: {
  colour: string;
  thing: string;
  place: string;
  time: string;
  adjective: string;
  example?: boolean;
}[] = [
  {
    colour: "pink",
    thing: "a rose",
    place: "by the fountain's brink",
    time: "in the summer twilight",
    adjective: "rich",
    example: true,
  },
  { colour: "red", thing: "a poppy", place: "in its barley bed", time: "—", adjective: "ripe" },
  {
    colour: "blue",
    thing: "the sky",
    place: "where the clouds float through",
    time: "—",
    adjective: "mellow",
  },
  { colour: "white", thing: "a swan", place: "in the light", time: "—", adjective: "small" },
  { colour: "yellow", thing: "pears", place: "—", time: "—", adjective: "rich, ripe, mellow" },
  { colour: "green", thing: "the grass", place: "with small flowers between", time: "—", adjective: "small" },
  {
    colour: "violet",
    thing: "clouds",
    place: "—",
    time: "in the summer twilight",
    adjective: "—",
  },
  { colour: "orange", thing: "an orange", place: "—", time: "—", adjective: "—" },
];

export const POEM4_TABLE_INSTRUCTIONS =
  "A. Complete the table below, using the information in the poem. For each item, an example is done for you.";

export const POEM4_WRITING_TASK =
  "B. Compose a four line verse which is similar to the poem, 'What is Pink?' using colours, things in nature, time, places and adjectives of your choice.";

export const POEM4_WRITING_TASK_MY =
  "ခ။ 'What is Pink?' ကဗျာနှင့် ဆင်တူသော လေးကြောင်းကဗျာတစ်ပုဒ်ကို အရောင်များ၊ သဘာဝအရာများ၊ အချိန်၊ နေရာနှင့် နာမဝိသေသနများ ကိုယ်တိုင်ရွေးချယ်၍ ရေးသားပါ။";

export const POEM4_WRITING_SAMPLE = `What is brown? The earth is brown
After the evening rain.
What is silver? The moon is silver,
Bright above the plain.`;
