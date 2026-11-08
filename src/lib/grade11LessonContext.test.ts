import { describe, it, expect } from "vitest";
import { grade11LessonContext } from "./grade11LessonContext";
import { UPPER_UNITS } from "./grade11Upper";
import source from "@/data/grade11/aiSourceText.json";
const skills = ["reading", "vocabulary", "grammar", "listening", "speaking", "writing"] as const;
describe("Grade 11 AI has real context in every unit and section", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "binds Unit %i to its textbook and audio",
    (unit) => {
      for (const kind of skills) {
        const result = grade11LessonContext(unit, kind);
        expect(result.context).toContain(`Grade 11 English · Unit ${unit} · ${kind}`);
        expect(result.context.length).toBeGreaterThan(100);
        if (kind !== "speaking") expect(result.questions.length).toBeGreaterThan(0);
        if (kind === "listening")
          expect(result.context).toContain("Supplied recording transcript:");
      }
    },
  );
  it("includes the actual Unit 6 composition task, not only the outline questions", () => {
    expect(
      grade11LessonContext(6, "writing").questions.some((q) => q.question.includes("200-250")),
    ).toBe(true);
  });
  it("has OCR references for every upper-unit textbook page", () => {
    for (const unit of Object.values(UPPER_UNITS))
      for (const section of Object.values(unit.skills))
        for (const page of section.sources)
          expect(
            (source.pages as Record<string, { text: string }>)[page.page].text.length,
          ).toBeGreaterThan(20);
  });
});
