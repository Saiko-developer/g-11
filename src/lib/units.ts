/**
 * Curriculum metadata (units, per-unit skills, grammar lessons) read from the
 * local data files in `src/data`. No lesson content comes from the database.
 * The backend integration remains available for student accounts / progress.
 */
import { SYLLABUS, type SyllabusUnit } from "@/data/syllabus";
import { grammar1C } from "@/data/unit1Supplement";
import { getUnitAudio } from "@/lib/localData";

export type SkillKind =
  | "listening"
  | "reading"
  | "speaking"
  | "writing"
  | "vocabulary"
  | "grammar";

export type UnitSkill = {
  kind: SkillKind;
  label: string;
  detail: string;
};

export type UnitRecord = {
  id: string;
  number: number;
  code: string;
  title: string;
  titleMy: string | null;
  audioUrl: string | null;
  skills: UnitSkill[];
};

export type GrammarLesson = {
  id: string;
  unitId: string;
  title: string;
  titleMy: string | null;
  topic: string;
  ruleMy: string | null;
  examples: { en: string; my?: string }[];
};

const LOCAL_UNITS: UnitRecord[] = (
  SYLLABUS.filter((n) => n.type === "unit") as SyllabusUnit[]
).map((u) => ({
  id: `unit-${u.number}`,
  number: u.number,
  code: `Unit ${u.number}`,
  title: u.title,
  titleMy: null,
  audioUrl: getUnitAudio(u.number),
  skills: u.skills.map((s) => ({ kind: s.kind, label: s.label, detail: s.detail })),
}));

export async function fetchUnits(): Promise<UnitRecord[]> {
  return LOCAL_UNITS;
}

/** Grammar focus for each unit, taken from the syllabus data (plus the Unit 1 supplement). */
export async function fetchGrammarLessons(unitId: string): Promise<GrammarLesson[]> {
  const record = LOCAL_UNITS.find((u) => u.id === unitId);
  if (!record) return [];

  const grammar = record.skills.find((s) => s.kind === "grammar");
  if (!grammar) return [];

  const isUnit1 = record.number === 1;

  return [
    {
      id: `${unitId}-grammar`,
      unitId,
      title: grammar.detail,
      titleMy: null,
      topic: grammar.detail,
      ruleMy: isUnit1 ? grammar1C.whatMy : null,
      examples: isUnit1 ? grammar1C.examples.map((e) => ({ en: e.en })) : [],
    },
  ];
}

export type ProgressRow = {
  unitId: string;
  grammarLessonId: string | null;
  score: number;
  total: number;
  completedAt: string;
};

/* Student progress — stored in this browser (no sign-in). */
const PROGRESS_KEY = "saya-owl-progress";

function readProgress(): ProgressRow[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as ProgressRow[]) : [];
  } catch {
    return [];
  }
}

export async function fetchProgress(): Promise<ProgressRow[]> {
  return readProgress();
}

export async function saveProgress(input: {
  unitId: string;
  grammarLessonId?: string | null;
  score: number;
  total: number;
}) {
  const rows = [
    { unitId: input.unitId, grammarLessonId: input.grammarLessonId ?? null, score: input.score, total: input.total, completedAt: new Date().toISOString() },
    ...readProgress(),
  ].slice(0, 500);
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(rows));
}

/** Units where the student has finished at least one practice set. */
export function completedUnitIds(rows: ProgressRow[]): string[] {
  return [...new Set(rows.filter((r) => r.total > 0).map((r) => r.unitId))];
}
