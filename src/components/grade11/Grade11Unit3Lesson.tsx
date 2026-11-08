import { Grade11SourceWorkspace } from "@/components/grade11/Grade11SourceWorkspace";
import { UNIT3_KEYS, UNIT3_SECTIONS, unit3ScanUrl } from "@/lib/grade11Unit3";
import type { G11SkillKind } from "@/data/grade11/syllabus";

export function Grade11Unit3Lesson({ kind }: { kind: G11SkillKind }) {
  return (
    <Grade11SourceWorkspace
      kind={kind}
      unitNumber={3}
      sections={UNIT3_SECTIONS}
      answerKeys={UNIT3_KEYS}
      scanUrl={unit3ScanUrl}
    />
  );
}
