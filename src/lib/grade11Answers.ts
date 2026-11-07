export type SourceAnswer = {
  answer: string;
  answerMy?: string;
  origin: "source-derived";
  sourcePage: number;
  kind?: "closed" | "suggested";
};
type AnswerFile = {
  sections: {
    items: {
      blockId: string;
      status: string;
      answer: string | null;
      answerMy: string | null;
      sourcePages: number[];
      kind: string;
    }[];
  }[];
};
/** Keep null personal/audio responses out of Check/Reveal, as in Grade 10. */
export function grade11AnswerKeys(file: AnswerFile): Record<string, SourceAnswer> {
  return Object.fromEntries(
    file.sections.flatMap((s) =>
      s.items
        .filter((item) => item.status === "source-derived" && item.answer)
        .map((item) => [
          item.blockId,
          {
            answer: item.answer!,
            answerMy: item.answerMy ?? undefined,
            origin: "source-derived" as const,
            sourcePage: item.sourcePages[0],
            kind: item.kind === "suggested" ? ("suggested" as const) : ("closed" as const),
          },
        ]),
    ),
  );
}
