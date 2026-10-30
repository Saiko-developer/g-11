/**
 * Exam Builder blueprint: which sections exist, their marks and time,
 * and how a custom selection turns into total marks and minutes.
 * Shared by the Exam Builder page, the mock-exam page and /api/mock-exam.
 */
export type SectionId = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX";

export type SectionSpec = {
  id: SectionId;
  label: string;
  labelMy: string;
  /** Marks when the section runs at full size. */
  marks: number;
  minutes: number;
  /** Sections I–III let the user pick 5 or 10 questions (1 mark each). */
  countable: boolean;
};

export const SECTION_SPECS: SectionSpec[] = [
  { id: "I", label: "Vocabulary Completion", labelMy: "ဝေါဟာရ ကွက်လပ်ဖြည့်", marks: 10, minutes: 10, countable: true },
  { id: "II", label: "Multiple Choice Vocabulary", labelMy: "အဖြေရွေး (MCQ)", marks: 10, minutes: 10, countable: true },
  { id: "III", label: "Sentence Transformation (Grammar)", labelMy: "ဝါကျပြောင်း Grammar", marks: 10, minutes: 15, countable: true },
  { id: "IV", label: "Poetry", labelMy: "ကဗျာ", marks: 10, minutes: 10, countable: false },
  { id: "V", label: "Reading Passage A", labelMy: "စာဖတ်ခန်း A", marks: 10, minutes: 15, countable: false },
  { id: "VI", label: "Extended Reading Passage B", labelMy: "စာဖတ်ခန်း B", marks: 15, minutes: 20, countable: false },
  { id: "VII", label: "Functional English (Dialogues)", labelMy: "စကားပြော", marks: 10, minutes: 10, countable: false },
  { id: "VIII", label: "Guided Writing (Letter)", labelMy: "ပေးစာ", marks: 10, minutes: 15, countable: false },
  { id: "IX", label: "Free Composition (Essay)", labelMy: "စာစီစာကုံး", marks: 10, minutes: 15, countable: false },
];

export const ALL_SECTION_IDS = SECTION_SPECS.map((s) => s.id);

export type ExamConfig = { units: number[]; sections: SectionId[]; count: 5 | 10 };

export function isFullExam(c: ExamConfig) {
  return c.sections.length === ALL_SECTION_IDS.length && c.count === 10;
}

export function sectionMarks(spec: SectionSpec, count: 5 | 10) {
  return spec.countable ? count : spec.marks;
}

/** Total marks and minutes for a selection. Full paper = 95 marks / 120 minutes. */
export function examTotals(c: Pick<ExamConfig, "sections" | "count">) {
  const chosen = SECTION_SPECS.filter((s) => c.sections.includes(s.id));
  if (chosen.length === ALL_SECTION_IDS.length && c.count === 10) return { marks: 95, minutes: 120 };
  const marks = chosen.reduce((t, s) => t + sectionMarks(s, c.count), 0);
  const minutes = chosen.reduce((t, s) => t + (s.countable && c.count === 5 ? Math.ceil(s.minutes / 2) : s.minutes), 0);
  return { marks, minutes };
}

/** Parse/clean a config coming from the URL or a request body. */
export function normalizeConfig(raw: { units?: unknown; sections?: unknown; count?: unknown }, fallbackUnit = 1): ExamConfig {
  const toList = (v: unknown) => (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : []);
  const units = [...new Set(toList(raw.units).map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 20))].sort((a, b) => a - b);
  const sections = ALL_SECTION_IDS.filter((id) => toList(raw.sections).map(String).includes(id));
  return {
    units: units.length ? units : [fallbackUnit],
    sections: sections.length ? sections : [...ALL_SECTION_IDS],
    count: Number(raw.count) === 5 ? 5 : 10,
  };
}

export function configKey(c: ExamConfig) {
  return `${c.units.join(",")}|${c.sections.join(",")}|${c.count}`;
}
