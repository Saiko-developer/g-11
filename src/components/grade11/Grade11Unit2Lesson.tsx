import { Grade11SourceLesson } from "@/components/grade11/Grade11Unit1Lesson";
import { UNIT2_KEYS, UNIT2_SECTIONS, unit2ScanUrl } from "@/lib/grade11Unit2";
import type { G11SkillKind } from "@/data/grade11/syllabus";
export function Grade11Unit2Lesson({ kind }: { kind: G11SkillKind }) {
  return (
    <Grade11SourceLesson
      kind={kind}
      unitNumber={2}
      sections={UNIT2_SECTIONS}
      answerKeys={UNIT2_KEYS}
      scanUrl={unit2ScanUrl}
    />
  );
}
