import { UNIT1_SECTIONS } from "./grade11Unit1";
import { UNIT2_SECTIONS } from "./grade11Unit2";
import { UNIT3_SECTIONS } from "./grade11Unit3";
import { UNIT4_SECTIONS } from "./grade11Unit4";
import { TRAVEL_LESSONS } from "./grade11Travel";
import { UPPER_UNITS, isUpperUnit } from "./grade11Upper";
import { getGrade11Captions } from "./grade11Captions";
import sourceText from "@/data/grade11/aiSourceText.json";
import type { G11SkillKind } from "@/data/grade11/syllabus";

const letter: Record<G11SkillKind, string> = {
  reading: "A",
  vocabulary: "B",
  grammar: "C",
  listening: "D",
  speaking: "D",
  writing: "E",
};
export type Grade11AIQuestion = { id: string; question: string; instructions: string };
/** Source text only: never includes hidden answer keys or other students' work. */
export function grade11LessonContext(unit: number, kind: G11SkillKind) {
  const questions: Grade11AIQuestion[] = [];
  let text = "";
  if (isUpperUnit(unit)) {
    const content = UPPER_UNITS[unit].skills[kind];
    for (const group of content.groups)
      for (const item of group.items)
        questions.push({ id: item.id, question: item.prompt, instructions: group.instruction });
    const pages = sourceText.pages as Record<string, { text: string }>;
    text = content.sources
      .map((s) => `Textbook page ${s.page - 5}:\n${pages[s.page]?.text ?? ""}`)
      .join("\n\n");
  } else {
    const sections =
      unit === 1
        ? UNIT1_SECTIONS
        : unit === 2
          ? UNIT2_SECTIONS
          : unit === 3
            ? UNIT3_SECTIONS
            : unit === 4
              ? UNIT4_SECTIONS
              : TRAVEL_LESSONS[unit as 5 | 6]?.sections;
    const blocks = sections?.find((s) => s.code === `${unit}${letter[kind]}`)?.blocks ?? [];
    let instructions = "";
    const speakingStart = ({ 1: 12, 2: 10, 3: 11, 4: 11, 5: 14, 6: 11 } as Record<number, number>)[
      unit
    ];
    const selected = blocks.filter(
      (b) =>
        !["listening", "speaking"].includes(kind) ||
        (kind === "speaking"
          ? Number(b.id.split("-")[1]) >= speakingStart
          : Number(b.id.split("-")[1]) < speakingStart),
    );
    for (const block of selected) {
      if (block.t === "ins") {
        instructions = block.x;
        if (kind === "writing")
          questions.push({ id: block.id, question: block.x, instructions: block.x });
      }
      if (block.t === "q") questions.push({ id: block.id, question: block.x, instructions });
    }
    if (kind === "writing" && questions.length === 0) {
      const task = selected.find((block) => /^Write\b/i.test(block.x));
      if (task) questions.push({ id: task.id, question: task.x, instructions: task.x });
    }
    text = selected.map((b) => `[${b.id}] ${b.x}`).join("\n");
  }
  if (kind === "listening" || kind === "speaking")
    text +=
      "\nSupplied recording transcript:\n" +
      getGrade11Captions(unit)
        .map((c) => c.en)
        .join("\n");
  const context = `Grade 11 English · Unit ${unit} · ${kind}\nTextbook questions:\n${questions.map((q) => `[${q.id}] ${q.instructions}\n${q.question}`).join("\n")}\nOriginal textbook reference (OCR may contain recognition errors; never invent missing information):\n${text}`;
  return { context, questions };
}
