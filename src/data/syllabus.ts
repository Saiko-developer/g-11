/**
 * Grade 10 English textbook syllabus overview (Units 1–12 + Review/Poem banners).
 * Presentation data only — the interactive quiz content is fetched separately.
 */

export type SkillKind =
  | "listening"
  | "reading"
  | "speaking"
  | "writing"
  | "vocabulary"
  | "grammar";

export type SyllabusSkill = {
  kind: SkillKind;
  label: string;
  detail: string;
  /** Set when this skill opens a live interactive quiz. */
  quiz?: "1c-apposition";
};

export type SyllabusUnit = {
  type: "unit";
  number: number;
  title: string;
  skills: SyllabusSkill[];
};

export type SyllabusBanner = {
  type: "banner";
  id: string;
  review: string;
  poem: string;
};

export type SyllabusNode = SyllabusUnit | SyllabusBanner;

const unit = (
  number: number,
  title: string,
  s: Record<SkillKind, string>,
  extra?: Partial<Record<SkillKind, Pick<SyllabusSkill, "quiz">>>,
): SyllabusUnit => ({
  type: "unit",
  number,
  title,
  skills: (
    ["listening", "reading", "speaking", "writing", "vocabulary", "grammar"] as SkillKind[]
  ).map((kind) => ({
    kind,
    label: kind[0].toUpperCase() + kind.slice(1),
    detail: s[kind],
    ...(extra?.[kind] ?? {}),
  })),
});

export const SYLLABUS: SyllabusNode[] = [
  unit(
    1,
    "LANGUAGE",
    {
      listening: "Talk on world languages",
      reading: "Language skill / tool / form / function",
      speaking: "Interviewing foreign language learners",
      writing: "Paragraph on Japan",
      vocabulary: "Countries and nationalities",
      grammar: "Nouns in apposition",
    },
    { grammar: { quiz: "1c-apposition" } },
  ),
  unit(2, "LITERATURE", {
    listening: "Studying literature",
    reading: "What literature is",
    speaking: "Popular play",
    writing: "Favourite author",
    vocabulary: "Defining words",
    grammar: "Adjectival phrases, present simple / continuous",
  }),
  unit(3, "ZERO", {
    listening: "Talk on women inventors",
    reading: "About zero",
    speaking: "Famous person",
    writing: "Paragraph on zero",
    vocabulary: "Words related to zero",
    grammar: "Subject & predicate, either/or, neither/nor",
  }),
  { type: "banner", id: "r1", review: "Review 1", poem: "Poem 1 — Daffodils" },
  unit(4, "PAINTING", {
    listening: "Talk on painting",
    reading: "About painting",
    speaking: "About interests",
    writing: "Paragraph on a painting",
    vocabulary: "Painting words, prefixes",
    grammar: "Participial phrases, past simple / continuous",
  }),
  unit(5, "TRAINS", {
    listening: "Choosing means of transport",
    reading: "About trains",
    speaking: "Personal views",
    writing: "Paragraph on transport",
    vocabulary: "Words from the text, '-friendly' adjectives",
    grammar: "Used to, present perfect / continuous",
  }),
  unit(6, "THE PRODIGAL SON", {
    listening: "Listening to a story",
    reading: "Reading a story",
    speaking: "Reporting what people say",
    writing: "Writing a story",
    vocabulary: "Phrasal verbs with run, say / tell",
    grammar: "Reported speech",
  }),
  { type: "banner", id: "r2", review: "Review 2", poem: "Poem 2 — The Blind Boy" },
  unit(7, "TYPICAL MYANMAR SNACKS", {
    listening: "Why people eat snacks",
    reading: "Typical Myanmar snacks",
    speaking: "Expressions of pleasure / surprise / sympathy",
    writing: "Descriptive essay",
    vocabulary: "Adjective-forming suffix",
    grammar: "Active & passive voice",
  }),
  unit(8, "FOOD CHAIN", {
    listening: "Food animals eat",
    reading: "Food chain",
    speaking: "Eating habits",
    writing: "About a food chain",
    vocabulary: "Phrasal verbs",
    grammar: "Passive voice without agents, omission of verbs",
  }),
  unit(9, "CLIMATE CHANGE", {
    listening: "Importance of forests",
    reading: "Climate change",
    speaking: "Expressing opinions",
    writing: "Expository essay",
    vocabulary: "Climate change expressions",
    grammar: "Future tense, conditional clauses",
  }),
  { type: "banner", id: "r3", review: "Review 3", poem: "Poem 3 — Song" },
  unit(10, "FOOD SAFETY", {
    listening: "Artificial additives to avoid",
    reading: "Food safety",
    speaking: "Asking for information",
    writing: "Complaint letter",
    vocabulary: "Food safety words",
    grammar: "Not only… but also, the more/less… the more/less…",
  }),
  unit(11, "THANAKA, UNIQUELY MYANMAR", {
    listening: "Listening to a dialogue",
    reading: "About Thanaka",
    speaking: "Suggestions",
    writing: "Writing an email",
    vocabulary: "Suffix collocations",
    grammar: "Relative pronouns who / whom / whose",
  }),
  unit(12, "URBANIZATION", {
    listening: "Urban vs rural areas",
    reading: "Urbanization",
    speaking: "Doctor appointment",
    writing: "Argumentative essay",
    vocabulary: "Compound nouns, as / like",
    grammar: "Relative pronouns that / which, as… as",
  }),
  { type: "banner", id: "r4", review: "Review 4", poem: "Poem 4 — What Is Pink?" },
];
