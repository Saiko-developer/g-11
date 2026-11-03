export type WritingRubricItem = { criterion: string; awarded: number; marks: number; comment: string };
export type WritingEval = {
  section: string; // "VIII" | "IX"
  title: string;
  chosenTopic: string;
  studentText: string;
  rubric: WritingRubricItem[];
  score: number;
  marks: number;
  aiCritique: string[];
  teacherFeedback?: string;
};
