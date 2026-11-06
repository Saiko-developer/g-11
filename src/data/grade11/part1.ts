// Grade 11 English (New Syllabus) — Part 1 curriculum data.
export type G11Quiz = { q: string; options: string[]; answer: number; mm?: string };
export type G11Section = { title: string; mm: string; points: string[]; quiz?: G11Quiz[] };
export type G11Unit = {
  id: string;
  kind: "unit" | "review" | "poem";
  no: string;
  title: string;
  mmTitle: string;
  ready: boolean;
  reading?: { title: string; paragraphs: string[]; vocab: { word: string; mm: string }[]; quiz: G11Quiz[] };
  sections: G11Section[];
};

export const GRADE11_PART1: G11Unit[] = [
  {
    id: "unit-1",
    kind: "unit",
    no: "Unit 1",
    title: "The Ayeyarwady Dolphins",
    mmTitle: "ဧရာဝတီ လင်းပိုင်များ",
    ready: true,
    reading: {
      title: "The Ayeyarwady Dolphins",
      paragraphs: [
        "The Ayeyarwady dolphin lives in coastal waters and in a few large rivers of South and Southeast Asia, including the Ayeyarwady River in Myanmar. It has a rounded head, no beak and a small dorsal fin, so it looks quite different from ocean dolphins.",
        "For generations, fishermen near Mandalay have worked together with these dolphins. The dolphins drive schools of fish towards the boats, and the fishermen tap their paddles to call them. Both the dolphins and the fishermen benefit from this cooperative fishing.",
        "Today the river population is critically endangered. Electric fishing, gill nets, gold mining and river pollution have greatly reduced their numbers. After the government created a protected area along the river, local communities began to help monitor the dolphins.",
        "Protecting the Ayeyarwady dolphin is not only about saving one species. A healthy river is highly important for people, fish and wildlife alike.",
      ],
      vocab: [
        { word: "critically endangered", mm: "မျိုးသုဉ်းရန် အလွန်နီးကပ်သော" },
        { word: "cooperative", mm: "ပူးပေါင်းဆောင်ရွက်သော" },
        { word: "dorsal fin", mm: "ကျောပေါ်ရှိ ဆူးတောင်" },
        { word: "pollution", mm: "ညစ်ညမ်းမှု" },
        { word: "protected area", mm: "ကာကွယ်ထားသော နယ်မြေ" },
        { word: "monitor", mm: "စောင့်ကြည့်သည်" },
      ],
      quiz: [
        { q: "Where do Ayeyarwady dolphins live in Myanmar?", options: ["In the Thanlwin River", "In the Ayeyarwady River", "In Inle Lake"], answer: 1 },
        { q: "How do fishermen call the dolphins?", options: ["By whistling", "By tapping their paddles", "By throwing fish"], answer: 1 },
        { q: "Which is NOT a threat to the dolphins?", options: ["Electric fishing", "Gold mining", "Bird watching"], answer: 2 },
        { q: "The dolphins are described as…", options: ["critically endangered", "extinct", "common"], answer: 0 },
      ],
    },
    sections: [
      {
        title: "Vocabulary: Adverb + Adjective Collocations",
        mm: "ကြိယာဝိသေသန + နာမဝိသေသန တွဲစကား",
        points: [
          "critically endangered — အလွန် အန္တရာယ်ရှိစွာ မျိုးသုဉ်းခါနီး",
          "highly respected — အလွန် လေးစားခံရသော",
          "deeply concerned — အလွန် စိုးရိမ်သော",
          "fully aware — အပြည့်အဝ သိရှိသော",
          "bitterly disappointed — အလွန် စိတ်ပျက်သော",
        ],
        quiz: [
          { q: "The tiger is ___ endangered.", options: ["highly", "critically", "fully"], answer: 1 },
          { q: "She is a ___ respected teacher.", options: ["highly", "bitterly", "critically"], answer: 0 },
          { q: "We are ___ aware of the danger.", options: ["deeply", "fully", "highly"], answer: 1 },
        ],
      },
      {
        title: "Grammar 1: Both … and",
        mm: "နှစ်ခုလုံး ကို ပြရာတွင် Both…and ကို သုံးသည်",
        points: [
          "Both A and B + plural verb: Both the dolphins and the fishermen benefit.",
          "A နှင့် B သည် တူညီသော စကားလုံးအမျိုးအစား ဖြစ်ရမည် (noun+noun, adj+adj, verb+verb)။",
          "She is both clever and kind. / He both sings and dances.",
        ],
        quiz: [
          { q: "Both Mya and Hla ___ students.", options: ["is", "are", "am"], answer: 1 },
          { q: "The river is both wide ___ deep.", options: ["or", "but", "and"], answer: 2 },
        ],
      },
      {
        title: "Grammar 2: Before & After",
        mm: "Preposition / Adverb / Conjunction အဖြစ် သုံးပုံ",
        points: [
          "Preposition: before lunch, after the rain.",
          "Conjunction: After the government created a protected area, communities helped.",
          "Adverb: I have seen dolphins before. / They arrived soon after.",
          "after / before + V-ing: After finishing my homework, I watched TV.",
        ],
        quiz: [
          { q: "___ eating dinner, he washed the dishes.", options: ["After", "Both", "And"], answer: 0 },
          { q: "Wash your hands before ___.", options: ["eat", "eating", "ate"], answer: 1 },
          { q: "I have visited Mandalay ___. (adverb)", options: ["before", "after the rain", "and"], answer: 0 },
        ],
      },
      {
        title: "Listening & Speaking: Wildlife Conservation",
        mm: "တောရိုင်းတိရစ္ဆာန် ထိန်းသိမ်းရေး",
        points: [
          "Talk: Why should we protect endangered animals?",
          "Dialogue: Planning a birdwatching trip — 'Would you like to come birdwatching with me?' 'I'd love to!'",
          "Useful phrases: I think we should… / It's important to… / What about…?",
          "Try it: Ask Sayar Owl to role-play a birdwatching conversation with you.",
        ],
      },
      {
        title: "Writing: Essay — The Myanmar Star Tortoise",
        mm: "မြန်မာ ကြယ်လိပ် အကြောင်း စာစီစာကုံး",
        points: [
          "Introduction: What is it and where does it live? (Dry zone of central Myanmar)",
          "Body 1: Appearance — star-shaped patterns on its shell.",
          "Body 2: Threats — illegal trade and habitat loss; it was once nearly extinct in the wild.",
          "Body 3: Conservation — breeding centres and release programmes.",
          "Conclusion: Why protecting it matters. Use 'both…and' and 'before/after' in your essay!",
        ],
      },
    ],
  },
  {
    id: "unit-2", kind: "unit", no: "Unit 2", title: "Online Shopping: Pros and Cons", mmTitle: "အွန်လိုင်း စျေးဝယ်ခြင်း၏ အားသာချက်/အားနည်းချက်", ready: false,
    sections: [
      { title: "Coming topics", mm: "ပါဝင်မည့် အကြောင်းအရာ", points: ["Vocabulary: shopping expressions", "Grammar: Present Simple vs Continuous; Present Perfect Simple vs Continuous; must / have to / had to", "Listening: What you do on the net", "Writing: A Review"] },
    ],
  },
  {
    id: "unit-3", kind: "unit", no: "Unit 3", title: "Memory", mmTitle: "မှတ်ဉာဏ်", ready: false,
    sections: [
      { title: "Coming topics", mm: "ပါဝင်မည့် အကြောင်းအရာ", points: ["Vocabulary: phrasal verbs (depend on, go through, jot down, point out)", "Grammar: Gerund; to-infinitive", "Speaking: agreeing & disagreeing", "Writing: Describe a past event"] },
    ],
  },
  {
    id: "review-1", kind: "review", no: "Review 1", title: "Review 1 (Units 1–3)", mmTitle: "ပြန်လည်လေ့ကျင့်ခန်း ၁", ready: false,
    sections: [{ title: "Coming topics", mm: "ပါဝင်မည့် အကြောင်းအရာ", points: ["Both…and, Before/After, tenses, must/have to, gerund & infinitive"] }],
  },
  {
    id: "poem-1", kind: "poem", no: "Poem 1", title: "Bridges — James S. Tippett", mmTitle: "ကဗျာ ၁ — တံတားများ", ready: false,
    sections: [{ title: "Coming topics", mm: "ပါဝင်မည့် အကြောင်းအရာ", points: ["Types of bridges vocabulary", "Rhyming words", "Write a six-line verse"] }],
  },
  {
    id: "unit-4", kind: "unit", no: "Unit 4", title: "Globalization of Food", mmTitle: "အစားအစာ ကမ္ဘာ့ပြန့်နှံ့မှု", ready: false,
    sections: [{ title: "Coming topics", mm: "ပါဝင်မည့် အကြောင်းအရာ", points: ["Vocabulary: food types; linking words", "Grammar: too…to; enough to", "Speaking: healthy eating survey", "Writing: Cause & effect essay — online game addiction"] }],
  },
];

export const getG11Unit = (id: string) => GRADE11_PART1.find((u) => u.id === id);
