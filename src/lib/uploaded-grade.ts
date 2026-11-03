import { z } from "zod";
export const uploadedGradeSchema = z.object({
  score: z.number(), totalMarks: z.number(),
  sections: z.array(z.object({ id: z.string(), title: z.string(), score: z.number(), marks: z.number(), feedback: z.string() })),
  items: z.array(z.object({ section: z.string(), number: z.string(), question: z.string(), studentAnswer: z.string(), correctAnswer: z.string(), marks: z.number(), awarded: z.number(), status: z.enum(["correct", "partial", "wrong"]), explanation: z.string() })),
  mistakes: z.array(z.object({ question: z.string(), studentAnswer: z.string(), correctAnswer: z.string(), explanation: z.string() })),
  writingFeedback: z.string(),
  writing: z.array(z.object({ section: z.string(), title: z.string(), chosenTopic: z.string(), studentText: z.string(), rubric: z.array(z.object({ criterion: z.string(), awarded: z.number(), marks: z.number(), comment: z.string() })), score: z.number(), marks: z.number(), aiCritique: z.array(z.string()) })).optional(), overallFeedback: z.string(), unreadable: z.string(),
});
export function normalizeUploadedGrade(input: z.infer<typeof uploadedGradeSchema>, totalMarks: number) {
  if (!input.items.length) throw new Error("AI could not identify the questions; please review the paper manually.");
  const sum = input.items.reduce((n, item) => n + Math.max(0, item.marks), 0);
  if (Math.abs(sum - totalMarks) > 0.01) throw new Error("AI question marks do not match the exam total. Please check the marking guide.");
  const items = input.items.map((item) => {
    const awarded = Math.round(Math.max(0, Math.min(item.marks, item.awarded)) * 100) / 100;
    return { ...item, awarded, status: awarded === item.marks ? "correct" as const : awarded > 0 ? "partial" as const : "wrong" as const };
  });
  const sections = input.sections.map((section) => {
    const members = items.filter((item) => item.section === section.id);
    return { ...section, score: members.reduce((n, item) => n + item.awarded, 0), marks: members.reduce((n, item) => n + item.marks, 0) };
  });
  return { ...input, items, sections, score: Math.round(items.reduce((n, item) => n + item.awarded, 0) * 100) / 100, totalMarks, mistakes: items.filter((item) => item.status !== "correct").map(({ question, studentAnswer, correctAnswer, explanation }) => ({ question, studentAnswer, correctAnswer, explanation })) };
}