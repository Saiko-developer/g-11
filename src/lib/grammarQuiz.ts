/**
 * Live quiz data service for the "1C Grammar — Nouns in Apposition" node.
 *
 * The JSON structure is fetched from the remote (GitHub) textbook file when
 * `VITE_TEXTBOOK_JSON_URL` is configured; otherwise — or whenever the request
 * fails, times out, or returns an unusable payload — it falls back to the
 * bundled copy of the same file so the UI never crashes.
 */
import localUnit from "@/data/textbookUnit1.json";
import { isAnswerMatch } from "@/lib/answerMatch";

/** A single exercise row. Every schema-specific field is optional on purpose:
 *  Part A rows carry `apposition_phrases`, Part B rows carry
 *  `correct_answer` / `alternative_answer`. */
export interface GrammarExercise {
  question_number?: number;
  text?: string;
  apposition_phrases?: string[];
  /** Typo variant present in some textbook records. */
  apposition_pharses?: string[];
  correct_answer?: string;
  alternative_answer?: string;
}

export interface GrammarPart {
  instructions?: string;
  exercises?: GrammarExercise[];
}

export interface GrammarSection {
  lesson?: string;
  topic?: string;
  part_A?: GrammarPart;
  part_B?: GrammarPart;
}

export interface TextbookFile {
  unit?: string;
  unitTitle?: string;
  sections?: GrammarSection[];
}

export type QuizPartId = "A" | "B";

export type GrammarQuiz = {
  lesson: string;
  topic: string;
  parts: { id: QuizPartId; instructions: string; exercises: GrammarExercise[] }[];
  source: "remote" | "local";
};

const REMOTE_URL = import.meta.env["VITE_TEXTBOOK_JSON_URL"] as string | undefined;

/** Normalise for answer comparison: unify escaped/curly quotes, punctuation and spacing. */
export function normalizeAnswer(value: string): string {
  return value
    .replace(/\\"/g, '"')
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/[.,;:!?"'()\u2014\u2013-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function expectedAnswers(ex: GrammarExercise): string[] {
  const list = [
    ...(ex.apposition_phrases ?? []),
    ...(ex.apposition_pharses ?? []),
    ex.correct_answer,
    ex.alternative_answer,
  ];
  return list.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

export function isCorrect(ex: GrammarExercise, input: string): boolean {
  return expectedAnswers(ex).some((a) => isAnswerMatch(input, a));
}

function buildQuiz(file: TextbookFile, source: GrammarQuiz["source"]): GrammarQuiz | null {
  const section = (file.sections ?? []).find(
    (s) =>
      typeof s?.lesson === "string" &&
      s.lesson.toLowerCase().includes("1c") &&
      /grammar/i.test(s.lesson),
  );
  if (!section) return null;

  const parts: GrammarQuiz["parts"] = [];
  for (const [id, part] of [
    ["A", section.part_A],
    ["B", section.part_B],
  ] as const) {
    const exercises = (part?.exercises ?? []).filter((e) => typeof e?.text === "string");
    if (exercises.length) {
      parts.push({ id, instructions: part?.instructions ?? "", exercises });
    }
  }
  if (!parts.length) return null;

  return {
    lesson: section.lesson ?? "1C Grammar",
    topic: section.topic ?? "Nouns in Apposition",
    parts,
    source,
  };
}

export const LOCAL_GRAMMAR_QUIZ =
  buildQuiz(localUnit as unknown as TextbookFile, "local") ??
  ({
    lesson: "1C Grammar",
    topic: "Nouns in Apposition",
    parts: [],
    source: "local",
  } satisfies GrammarQuiz);

export async function fetchGrammarQuiz(): Promise<GrammarQuiz> {
  if (!REMOTE_URL) return LOCAL_GRAMMAR_QUIZ;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(REMOTE_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Parse from text so malformed/escaped payloads fail here, not mid-render.
    const parsed = JSON.parse(await res.text()) as TextbookFile;
    const quiz = buildQuiz(parsed, "remote");
    if (!quiz) throw new Error("1C Grammar node not found in remote file");
    return quiz;
  } catch (error) {
    console.warn(
      `[grammar-quiz] ⚠️ Remote textbook JSON unavailable — using bundled copy. Reason: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return LOCAL_GRAMMAR_QUIZ;
  }
}
