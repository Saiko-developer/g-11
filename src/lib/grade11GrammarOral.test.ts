import { expect, it } from "vitest";
import { GRADE11_ORAL_GRAMMAR } from "./grade11GrammarOral";
import { EXTENDED_GRADE11_PLANS } from "./grade11GrammarOralUpper";
import sourceText from "@/data/grade11/aiSourceText.json";
it.each(Array.from({ length: 11 }, (_, index) => index + 2))(
  "grounds every Unit %i oral topic and keeps all notes in narration",
  (unit) => {
    const grammar = GRADE11_ORAL_GRAMMAR[unit];
    expect(grammar.unit).toBe(unit);
    expect(grammar.sections.length).toBeGreaterThan(0);
    for (const section of grammar.sections) {
      const segments = section.oral.segments!;
      expect(segments.length).toBeGreaterThan(3);
      expect(segments.map((segment) => segment.scriptMy).join("\n\n")).toBe(section.oral.scriptMy);
      const examples = segments.filter((segment) => segment.sentenceEn);
      expect(examples.length).toBeGreaterThan(0);
      for (const segment of segments) {
        expect(segment.scriptMy).toContain(segment.noteMy);
        if (segment.sentenceEn) {
          expect(segment.scriptMy).toContain(segment.sentenceEn);
          expect(segment.scriptMy).toContain(segment.sentenceMy!);
          expect(
            section.text.formulas.some((example) => example.exampleEn === segment.sentenceEn),
          ).toBe(true);
        }
      }
    }
  },
);
it("uses only existing supplied OCR pages as upper-unit source references", () => {
  const pages = sourceText.pages as Record<string, { text: string }>;
  for (const [unit, plans] of Object.entries(EXTENDED_GRADE11_PLANS)) {
    for (const plan of plans)
      for (const example of plan.examples) {
        if (Number(unit) === 6) expect(example.source).toMatch(/^6C-/);
        else
          expect(pages[example.source.replace("textbook-pdf-", "")]?.text.length).toBeGreaterThan(
            20,
          );
      }
  }
});
it("keeps the approved Unit 1 out of the new lesson registry", () =>
  expect(GRADE11_ORAL_GRAMMAR[1]).toBeUndefined());
