/**
 * Shared shape for the in-depth, beginner-focused grammar explanations.
 *
 * Pure content data. Nothing here imports app logic, and no component is
 * required to consume it — each unit file simply exports a `UnitGrammar`.
 *
 * Language rule: every `*My` field must be written in real Burmese
 * (Unicode) prose. English is allowed ONLY inside example sentences,
 * formulas and bracketed grammar labels.
 */

/** One labelled chunk of an example sentence, mapped back to the formula. */
export type GrammarChunk = {
  /** The English fragment exactly as it appears in the sentence. */
  chunk: string;
  /** The formula slot this fragment fills, e.g. "[Subject]". */
  role: string;
  /** Burmese gloss of the fragment. */
  glossMy: string;
};

export type GrammarFormula = {
  /** Burmese label — ဥပမာ "အပြုသဘော (Positive)". */
  labelMy: string;
  /** Formula string, e.g. "[Subject] + [, Appositive ,] + [Verb] + [Rest]". */
  formula: string;
  exampleEn: string;
  exampleMy: string;
  /** Every part of `exampleEn`, in order, labelled with its formula slot. */
  parts: GrammarChunk[];
};

export type GrammarMistake = {
  wrongEn: string;
  rightEn: string;
  /** Why it is wrong AND how to avoid repeating it — Burmese, detailed. */
  whyMy: string;
};

export type GrammarTransformation = {
  /** The two (or more) plain sentences before combining. */
  beforeEn: string[];
  /** The single combined sentence. */
  afterEn: string;
  /** Step-by-step Burmese walkthrough: what is deleted, moved, kept and why. */
  stepsMy: string[];
};

export type GrammarQuizItem = {
  promptMy: string;
  questionEn: string;
  /** Omit for sentence-combining questions. */
  options?: string[];
  answerEn: string;
  hintMy: string;
};

export type GrammarTextMode = {
  /** ၁။ ဘာလဲ — definition paragraphs, plus word-by-word clarification. */
  whatMy: string[];
  /** ၂။ ဘာကြောင့်သုံးလဲ — real-life context. */
  whyMy: string[];
  /** The "Before vs After" blend walkthrough. */
  transformation: GrammarTransformation;
  /** ၃။ ရွှေစည်းမျဉ်း — punctuation, word order, syntax rules. */
  goldenRulesMy: string[];
  mistakes: GrammarMistake[];
  /** ၄။ ဝါကျတည်ဆောက်ပုံ. */
  formulas: GrammarFormula[];
};

export type GrammarOralMode = {
  /** Conversational spoken Burmese script — read aloud by the tutor voice. */
  scriptMy: string;
  /** On-screen cheat sheet shown while the script is playing. */
  note: {
    ideaMy: string;
    formula: string;
    examples: { en: string; my: string }[];
  };
};

export type GrammarSection = {
  /** Stable cache id, e.g. "1c-apposition-s1". */
  id: string;
  titleEn: string;
  titleMy: string;
  text: GrammarTextMode;
  oral: GrammarOralMode;
  quiz: GrammarQuizItem;
};

export type UnitGrammar = {
  unit: number;
  /** Syllabus grammar heading for the unit. */
  topicEn: string;
  topicMy: string;
  sections: GrammarSection[];
};
