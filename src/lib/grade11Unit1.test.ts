import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAnswerMatch } from "@/lib/answerMatch";
import { splitUnit1, UNIT1_KEYS, UNIT1_SECTIONS, unit1ScanUrl } from "@/lib/grade11Unit1";

describe("Grade 11 Unit 1 source fidelity", () => {
  it("uses the PDF's shuffled Column B instead of the older Word-file order", () => {
    const vocab = UNIT1_SECTIONS.find((s) => s.code === "1B")!;
    const matching = splitUnit1(vocab).exercises[0];
    expect(matching.blocks.filter((b) => /^[a-j]\./.test(b.x)).map((b) => b.x)).toEqual([
      "a. concerned",
      "b. necessary",
      "c. involved",
      "d. aware",
      "e. married",
      "f. hurt",
      "g. recommended",
      "h. ill",
      "i. different",
      "j. serious",
    ]);
    const questions = matching.blocks.filter((b) => b.t === "q");
    ["b", "a", "g", "f", "i", "d", "e", "c", "j", "h"].forEach((letter, i) => {
      expect(isAnswerMatch(letter, UNIT1_KEYS[questions[i].id].answer)).toBe(true);
    });
    expect(isAnswerMatch("a", UNIT1_KEYS[questions[0].id].answer)).toBe(false);
  });

  it("keeps grammar rules/examples separate from the four original ten-item exercises", () => {
    const grammar = UNIT1_SECTIONS.find((s) => s.code === "1C")!;
    const { lesson, exercises } = splitUnit1(grammar);
    expect(exercises.map((ex) => ex.blocks.filter((b) => b.t === "q").length)).toEqual([
      10, 10, 10, 10,
    ]);
    expect(lesson.some((b) => b.x.includes("as a preposition"))).toBe(true);
    expect(lesson.some((b) => b.x.includes("My father neither drinks nor smokes"))).toBe(true);
    expect(
      exercises
        .flatMap((ex) => ex.blocks.filter((b) => b.t === "q"))
        .some((b) => b.x.includes("as a preposition")),
    ).toBe(false);
  });

  it("restores the missing writing notes without publishing added model sentences", () => {
    const writing = UNIT1_SECTIONS.find((s) => s.code === "1E")!;
    const words = writing.blocks.map((b) => b.x);
    for (const source of [
      "Food",
      "Behaviour",
      "Threat",
      "Conservation",
      "a range of vegetation, grass, fruit",
      "to carry out a breeding programme",
    ])
      expect(words).toContain(source);
    const all = UNIT1_SECTIONS.flatMap((s) => s.blocks);
    expect(all.some((b) => b.x.includes("The Myanmar star tortoise is a distinctive animal"))).toBe(
      false,
    );
    expect(all.some((b) => b.x.includes("I went with my classmates and our teacher"))).toBe(false);
    expect(all.some((b) => "ma" in b || "maMy" in b)).toBe(false);
  });

  it("keeps personal and audio answers ungraded and gives damaged text a bundled source scan", () => {
    const all = UNIT1_SECTIONS.flatMap((s) => s.blocks);
    expect(all.filter((b) => b.response === "audio")).toHaveLength(7);
    for (const block of all.filter((b) => b.response)) expect(UNIT1_KEYS[block.id]).toBeUndefined();
    expect(Object.keys(UNIT1_KEYS)).toHaveLength(47);
    for (const block of all.filter((b) => b.scanPage)) {
      const url = unit1ScanUrl(block.scanPage!);
      expect(url).toBeTruthy();
      expect(existsSync(`public${url}`)).toBe(true);
      expect(block.x).not.toContain("[illegible]");
    }
    expect(unit1ScanUrl(1)).toBeNull();
  });
});
