import unit4 from "@/data/grade11/textbook/unit4.json";
import unit5 from "@/data/grade11/textbook/unit5.json";
import { expect, it } from "vitest";
import { GRADE11_ORAL_GRAMMAR } from "./grade11GrammarOral";
import { EXTENDED_GRADE11_PLANS } from "./grade11GrammarOralUpper";
import { GRADE11_TEACHING_VOICE, GRADE11_TEXTBOOK_WALKTHROUGHS } from "./grade11GrammarTeaching";
import sourceText from "@/data/grade11/aiSourceText.json";
it.each(Array.from({ length: 11 }, (_, index) => index + 2))(
  "grounds every Unit %i oral topic with independent teaching and short notes",
  (unit) => {
    const grammar = GRADE11_ORAL_GRAMMAR[unit];
    expect(grammar.unit).toBe(unit);
    expect(grammar.sections.length).toBeGreaterThan(0);
    for (const section of grammar.sections) {
      const segments = section.oral.segments!;
      expect(segments.length).toBeGreaterThan(2);
      expect(segments.map((segment) => segment.scriptMy).join("\n\n")).toBe(section.oral.scriptMy);
      const examples = segments.filter((segment) => segment.sentenceEn);
      expect(examples.length).toBeGreaterThan(0);
      const topic = section.id.replace(/^grade11-unit\d+-/, "");
      expect(segments[0].scriptMy).toBe(GRADE11_TEACHING_VOICE[topic].openingMy);
      for (const segment of segments) {
        expect(segment.noteMy.length).toBeLessThan(200);
        expect(segment.scriptMy.length).toBeGreaterThan(segment.noteMy.length);
        expect(segment.scriptMy).not.toContain("နောက်က စာအုပ်နမူနာတွေမှာ ဒီအချက်ကို တွဲကြည့်ပါ။");
        if (segment.sentenceEn) {
          expect(segment.scriptMy).toContain(segment.sentenceEn);
          expect(segment.scriptMy).toContain(segment.sentenceMy!);
          expect(
            section.text.formulas.some((example) =>
              example.exampleEn.includes(segment.sentenceEn!),
            ) || GRADE11_TEXTBOOK_WALKTHROUGHS[topic]?.en === segment.sentenceEn,
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

it("teaches the Grandpa example through a specific question and reason rather than reading its note", () => {
  const section = GRADE11_ORAL_GRAMMAR[2].sections.find((item) =>
    item.id.endsWith("present-simple"),
  )!;
  const example = section.oral.segments!.find((segment) =>
    segment.sentenceEn?.includes("Grandpa"),
  )!;
  expect(example.scriptMy).toContain("အခုလမ်းလျှောက်နေတာလား၊ ညနေတိုင်းလုပ်လေ့ရှိတာလား");
  expect(example.scriptMy).toContain("Grandpa က အနည်းကိန်းဖြစ်လို့ go ကို goes ပြောင်းထားပါတယ်");
  expect(example.noteMy).toContain("usually → အလေ့အထ");
  expect(example.scriptMy).not.toContain(example.noteMy);
});
it("shows a real original sentence before each authored transformation result", () => {
  for (const grammar of Object.values(GRADE11_ORAL_GRAMMAR))
    for (const section of grammar.sections) {
      const topic = section.id.replace(/^grade11-unit\d+-/, "");
      const walkthrough = GRADE11_TEXTBOOK_WALKTHROUGHS[topic];
      if (!walkthrough) continue;
      const segments = section.oral.segments!;
      const before = segments.findIndex((segment) => segment.sentenceEn === walkthrough.en);
      expect(before).toBeGreaterThan(0);
      expect(segments[before + 1].titleMy).toContain("ပြောင်းပြီး");
      expect(
        section.text.formulas.some((example) =>
          example.exampleEn.includes(segments[before + 1].sentenceEn!),
        ),
      ).toBe(true);
    }
});

it("traces every original walkthrough back to the supplied textbook", () => {
  const pages = sourceText.pages as Record<string, { text: string }>;
  const lowerBlocks = [...unit4, ...unit5].flatMap((section) => section.blocks);
  for (const walkthrough of Object.values(GRADE11_TEXTBOOK_WALKTHROUGHS)) {
    const original = walkthrough.source.startsWith("textbook-pdf-")
      ? pages[walkthrough.source.replace("textbook-pdf-", "")].text
      : lowerBlocks.find((block) => block.id === walkthrough.source)!.x;
    const words = (text: string) =>
      text
        .toLowerCase()
        .replace(/[’']/g, "")
        .match(/[a-z]+/g) ?? [];
    const originalWords = new Set(words(original));
    const quotationWords = words(walkthrough.en);
    // OCR has known letter errors; the quotation must still match the real source vocabulary.
    expect(
      quotationWords.filter((word) => originalWords.has(word)).length / quotationWords.length,
    ).toBeGreaterThanOrEqual(0.8);
  }
});
