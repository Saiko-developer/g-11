import { Grade11SourceWorkspace } from "@/components/grade11/Grade11SourceWorkspace";
import { UNIT4_KEYS, UNIT4_SECTIONS, unit4ScanUrl } from "@/lib/grade11Unit4";
import type { G11SkillKind } from "@/data/grade11/syllabus";
export function Grade11Unit4Lesson({ kind }: { kind: G11SkillKind }) {
  return (
    <Grade11SourceWorkspace
      kind={kind}
      unitNumber={4}
      sections={UNIT4_SECTIONS}
      answerKeys={UNIT4_KEYS}
      scanUrl={unit4ScanUrl}
    />
  );
}
