import { useMemo } from "react";
import { SayaOwl } from "@/components/SayaOwl";
import { grade11LessonContext } from "@/lib/grade11LessonContext";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import { Grade11RequireSignIn } from "./Grade11RequireSignIn";

type Props =
  | { unit: number; kind: G11SkillKind; lessonContext?: never }
  | { lessonContext: string; unit?: never; kind?: never };

/** Use the actual Grade 10 popup, with Grade 11 context and the existing login return path. */
export function Grade11PopupTutor({ unit, kind, lessonContext }: Props) {
  const context = useMemo(
    () => (unit && kind ? grade11LessonContext(unit, kind).context : lessonContext!),
    [unit, kind, lessonContext],
  );
  return (
    <Grade11RequireSignIn>
      <SayaOwl
        grade={11}
        lessonContext={context}
        contextLabel={unit && kind ? `Grade 11 English · Unit ${unit} · ${kind}` : lessonContext}
      />
    </Grade11RequireSignIn>
  );
}
