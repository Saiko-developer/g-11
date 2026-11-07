/**
 * Grade 11 English (New Syllabus) — Contents chart, taken from the official textbook.
 * Each skill points at the exact textbook pages (scanned page images) when available.
 */
import pages from "@/assets/grade11-pages.json";

export type G11SkillKind = "listening" | "reading" | "speaking" | "writing" | "vocabulary" | "grammar";
export type G11Skill = { kind: G11SkillKind; label: string; detail: string; pages: number[] };
export type G11Unit = { type: "unit"; number: number; title: string; skills: G11Skill[] };
export type G11Banner = { type: "banner"; id: string; review: string; reviewPages: number[]; poem: string; poemPages: number[] };
export type G11Node = G11Unit | G11Banner;

const PAGE_URLS = pages as Record<string, string>;
export const pageUrl = (n: number): string | undefined => PAGE_URLS[String(n)];

type P = { r?: number[]; v?: number[]; g?: number[]; ls?: number[]; w?: number[] };
const unit = (
  number: number,
  title: string,
  s: { listening: string; reading: string; speaking: string; writing: string; vocabulary: string; grammar: string },
  p: P = {},
): G11Unit => ({
  type: "unit",
  number,
  title,
  skills: [
    { kind: "listening", label: "Listening", detail: s.listening, pages: p.ls ?? [] },
    { kind: "reading", label: "Reading", detail: s.reading, pages: p.r ?? [] },
    { kind: "speaking", label: "Speaking", detail: s.speaking, pages: p.ls ?? [] },
    { kind: "writing", label: "Writing", detail: s.writing, pages: p.w ?? [] },
    { kind: "vocabulary", label: "Vocabulary", detail: s.vocabulary, pages: p.v ?? [] },
    { kind: "grammar", label: "Grammar", detail: s.grammar, pages: p.g ?? [] },
  ],
});
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const G11_SYLLABUS: G11Node[] = [
  unit(1, "The Ayeyarwady Dolphins", {
    listening: "Listening to a talk on ‘Wildlife Conservation’",
    reading: "Reading about the Ayeyarwady dolphins",
    speaking: "Talking about a trip",
    writing: "Writing an essay",
    vocabulary: "Adverb + adjective collocations",
    grammar: "Both … and, ‘Before’ and ‘after’",
  }, { r: range(7, 9), v: [10], g: range(11, 13), ls: [14], w: [15] }),
  unit(2, "Online Shopping: Pros and Cons", {
    listening: "Listening to what you do on the net",
    reading: "Reading about online shopping",
    speaking: "Talking about what you usually do on the net",
    writing: "Writing a review",
    vocabulary: "Expressions related to shopping",
    grammar: "Present simple, present continuous, present perfect simple & continuous, ‘must’ and ‘have to’",
  }, { r: range(16, 19), v: [20], g: range(21, 24), ls: [25], w: [26] }),
  unit(3, "Memory", {
    listening: "Listening to childhood events",
    reading: "Reading about memory",
    speaking: "Agreeing and disagreeing",
    writing: "Describing a past event",
    vocabulary: "Phrasal verbs",
    grammar: "Gerund and infinitive with ‘to’",
  }, { r: range(27, 31), v: [32], g: [33], ls: [34, 35], w: [36] }),
  { type: "banner", id: "r1", review: "Review 1", reviewPages: [37], poem: "Poem 1 — Bridges", poemPages: [38] },
  unit(4, "Globalization of Food", {
    listening: "Listening to a presenter talking about the advantages and disadvantages of fast food",
    reading: "Reading about globalization of food",
    speaking: "Talking about healthy eating habits",
    writing: "Writing a cause and effect essay",
    vocabulary: "Types of food, linking words",
    grammar: "‘Too … to’ and ‘enough to’",
  }, { r: range(39, 41), v: [42, 43], g: [44, 45], ls: [46], w: [47, 48, 49] }),
  unit(5, "Travel in Southeast Asia I", {
    listening: "Listening to the benefits of travelling abroad",
    reading: "Reading about the top tourist attractions of five ASEAN countries",
    speaking: "Talking about an interesting place",
    writing: "Writing a travelogue",
    vocabulary: "Nouns as modifiers",
    grammar: "Inversion: full verb before subject, omission of relative pronouns",
  }, { r: range(51, 56), v: [56, 57], g: range(57, 60), ls: [60, 61], w: [61, 62] }),
  unit(6, "Travel in Southeast Asia II", {
    listening: "Listening to a talk on ‘How to be responsible travellers’",
    reading: "Reading about the top tourist attractions of five ASEAN countries",
    speaking: "Presenting travel tips",
    writing: "Writing a composition",
    vocabulary: "Adjectives to describe places",
    grammar: "Without + V-ing, ‘As if’ and ‘as though’",
  }, { r: range(64, 68), v: [68, 69], g: [69, 70], ls: [70, 71], w: [71, 72] }),
  { type: "banner", id: "r2", review: "Review 2", reviewPages: [], poem: "Poem 2 — Cloud Zoo", poemPages: [] },
  unit(7, "Systems and Organs of the Human Body", {
    listening: "Listening to a dialogue about systems and organs of the human body",
    reading: "Reading about health problems",
    speaking: "Talking about health",
    writing: "Writing an essay",
    vocabulary: "Homonyms",
    grammar: "The passive voice, the impersonal passive",
  }),
  unit(8, "The Last Leaf", {
    listening: "Listening to a dialogue",
    reading: "Reading the short story ‘The Last Leaf’",
    speaking: "Talking about one's favourite character in a short story",
    writing: "Summarizing a short story",
    vocabulary: "‘Make’ and ‘do’",
    grammar: "Reported speech",
  }),
  unit(9, "Stress, and How to Beat It", {
    listening: "Listening to a talk about stress",
    reading: "Reading about stress, and how to beat it",
    speaking: "Asking for and giving advice",
    writing: "Writing a reply letter",
    vocabulary: "Words often confused",
    grammar: "The future tense: ‘will’, ‘going to’ and ‘future continuous’",
  }),
  { type: "banner", id: "r3", review: "Review 3", reviewPages: [], poem: "Poem 3 — Leisure", poemPages: [] },
  unit(10, "Sleep Deprivation", {
    listening: "Listening to a talk about sleep deprivation",
    reading: "Reading about sleep deprivation",
    speaking: "Interviewing a friend",
    writing: "Writing a paragraph",
    vocabulary: "Compound adjectives",
    grammar: "By + V-ing, present participle (V-ing)",
  }),
  unit(11, "Dreams", {
    listening: "Listening to a lecture about dreams",
    reading: "Reading about dreams",
    speaking: "Talking about a dream job",
    writing: "Writing a descriptive essay",
    vocabulary: "Reporting verbs, degree adverbs",
    grammar: "It is / It was …, ‘So’ and ‘neither’",
  }),
  unit(12, "Natural Disasters", {
    listening: "Listening to a radio review about natural disasters",
    reading: "Reading about natural disasters",
    speaking: "Interviewing someone",
    writing: "Writing a problem-solution essay",
    vocabulary: "Vocabulary related to disasters, phrasal verbs with ‘knock’, ‘put’ and ‘wash’",
    grammar: "Modal verbs: ‘can’ and ‘could’, ‘So … that’ and ‘such … that’",
  }),
  { type: "banner", id: "r4", review: "Review 4", reviewPages: [], poem: "Poem 4 — Stopping by Woods on a Snowy Evening", poemPages: [] },
];
