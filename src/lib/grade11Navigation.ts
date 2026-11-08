import { getG11Unit } from "@/data/grade11/part1";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import { TRAVEL_PAGES } from "@/lib/grade11Travel";
import { UPPER_PAGES } from "@/lib/grade11Upper";

export const GRADE11_SKILLS: { kind: G11SkillKind; label: string }[] = [
  { kind: "reading", label: "Reading" },
  { kind: "vocabulary", label: "Vocabulary" },
  { kind: "grammar", label: "Grammar" },
  { kind: "listening", label: "Listening" },
  { kind: "speaking", label: "Speaking" },
  { kind: "writing", label: "Writing" },
];

/** Route adapter for both transcription-backed and scan-backed Grade 11 lessons. */
export function getGrade11Lesson(unit: string, skill: string) {
  if (!/^(?:[1-9]|1[0-2])$/.test(unit)) return null;
  const selected = GRADE11_SKILLS.find((item) => item.kind === skill);
  if (!selected) return null;
  const id = `unit-${unit}`;
  const source = getG11Unit(id) ?? TRAVEL_PAGES[id] ?? UPPER_PAGES[id];
  return source
    ? { unit: Number(unit), skill: selected.kind, title: source.title, mmTitle: source.mmTitle }
    : null;
}
