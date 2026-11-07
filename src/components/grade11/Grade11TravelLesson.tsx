import { Grade11SourceLesson } from "@/components/grade11/Grade11Unit1Lesson";
import { TRAVEL_LESSONS, travelScanUrl } from "@/lib/grade11Travel";
import type { G11SkillKind } from "@/data/grade11/syllabus";
function TravelLesson({ unit, kind }: { unit: 5 | 6; kind: G11SkillKind }) {
  const data = TRAVEL_LESSONS[unit];
  return (
    <Grade11SourceLesson
      unitNumber={unit}
      kind={kind}
      sections={data.sections}
      answerKeys={data.keys}
      scanUrl={(page) => travelScanUrl(unit, page)}
    />
  );
}
export function Grade11Unit5Lesson({ kind }: { kind: G11SkillKind }) {
  return <TravelLesson unit={5} kind={kind} />;
}
export function Grade11Unit6Lesson({ kind }: { kind: G11SkillKind }) {
  return <TravelLesson unit={6} kind={kind} />;
}
