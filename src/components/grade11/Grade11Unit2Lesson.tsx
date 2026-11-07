import type { G11SkillKind } from "@/data/grade11/syllabus";
import { Grade11Unit2Workspace } from "./Grade11Unit2Workspace";
export function Grade11Unit2Lesson({ kind }: { kind: G11SkillKind }) {
  return <Grade11Unit2Workspace kind={kind} />;
}
