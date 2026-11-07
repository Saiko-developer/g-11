import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { splitUnit1 } from "@/lib/grade11Unit1";
import { UNIT2_KEYS, UNIT2_SECTIONS, unit2ScanUrl } from "@/lib/grade11Unit2";
import { UNIT3_KEYS, UNIT3_SECTIONS } from "@/lib/grade11Unit3";
import { UNIT4_KEYS, UNIT4_SECTIONS, unit4ScanUrl } from "@/lib/grade11Unit4";
import answers3 from "@/data/grade11/textbook/unit3-answer.json";
import answers4 from "@/data/grade11/textbook/unit4-answer.json";
import source4 from "@/data/grade11/textbook/unit4-source.json";

const get = (sections: typeof UNIT2_SECTIONS, code: string) =>
  sections.find((s) => s.code === code)!;

describe("Grade 11 source lessons and bilingual answers", () => {
  it("repairs Unit 2 missing picture tasks and keeps only the actual 30 grammar questions", () => {
    const grammar = splitUnit1(get(UNIT2_SECTIONS, "2C"));
    expect(grammar.exercises.map((ex) => ex.blocks.filter((b) => b.t === "q").length)).toEqual([
      10, 5, 15,
    ]);
    expect(grammar.lesson.some((b) => b.x.includes("The Present Simple Tense is used"))).toBe(true);
    const all = UNIT2_SECTIONS.flatMap((s) => s.blocks);
    expect(all.filter((b) => b.response === "audio")).toHaveLength(8);
    expect(all.some((b) => b.id === "2D-pictures" && b.scanPage === 25)).toBe(true);
    expect(existsSync(`public${unit2ScanUrl(25)}`)).toBe(true);
    expect(Object.keys(UNIT2_KEYS)).toHaveLength(57);
    expect(all.some((b) => "ma" in b || b.x.startsWith("A Review of EiiZi Mart"))).toBe(false);
    expect(get(UNIT2_SECTIONS, "2E").blocks.filter((b) => b.t === "para")).toHaveLength(4);
  });

  it("loads Unit 3 English/Myanmar answers into the existing Grade 10 Check/Reveal controls", () => {
    expect(Object.keys(UNIT3_KEYS)).toHaveLength(41);
    expect(UNIT3_KEYS["3C-30"].answer).toBe("thinking");
    expect(UNIT3_KEYS["3C-30"].answerMy).toBe("စဉ်းစားခြင်း");
    expect(UNIT3_KEYS["3A-37"].answer).toContain("all of our knowledge");
    expect(UNIT3_KEYS["3A-37"].answerMy).toContain("အသိပညာ");
    expect(UNIT3_KEYS["3A-37"].kind).toBe("suggested");
    expect(answers3.official_answer_key).toBe(false);
    for (const k of Object.values(UNIT3_KEYS)) expect(k.answerMy).toBeTruthy();
    const ids = answers3.sections.flatMap((s) => s.items.map((i) => i.blockId));
    for (const b of UNIT3_SECTIONS.flatMap((s) => s.blocks).filter((b) => b.t === "q"))
      expect(ids).toContain(b.id);
  });

  it("includes Unit 4's final writing page from the second PDF", () => {
    expect(source4.source_files[1].local_pdf_pages).toEqual([1]);
    expect(source4.textbook_pages).toContain(44);
    const writing = get(UNIT4_SECTIONS, "4E");
    expect(
      writing.blocks.some(
        (b) => b.sourcePage === 49 && b.x.includes("Causes and effects of obesity"),
      ),
    ).toBe(true);
    expect(
      writing.blocks.some(
        (b) => b.sourcePage === 49 && b.x.startsWith("Obesity is generally caused"),
      ),
    ).toBe(true);
    expect(
      writing.blocks.some((b) => b.x.startsWith("Online game addiction is a serious problem")),
    ).toBe(true);
    expect(splitUnit1(writing).exercises[0].blocks.filter((b) => b.t === "q")).toHaveLength(4);
  });

  it("retains original Unit 4 vocabulary and grammar task counts and leaves audio unkeyed", () => {
    expect(
      splitUnit1(get(UNIT4_SECTIONS, "4B")).exercises.map(
        (ex) => ex.blocks.filter((b) => b.t === "q").length,
      ),
    ).toEqual([7, 7, 10]);
    expect(
      splitUnit1(get(UNIT4_SECTIONS, "4C")).exercises.map(
        (ex) => ex.blocks.filter((b) => b.t === "q").length,
      ),
    ).toEqual([10, 5, 5]);
    const audio = UNIT4_SECTIONS.flatMap((s) => s.blocks).filter((b) => b.response === "audio");
    expect(audio).toHaveLength(8);
    for (const b of audio) expect(UNIT4_KEYS[b.id]).toBeUndefined();
    expect(Object.keys(UNIT4_KEYS)).toHaveLength(53);
    expect(answers4.official_answer_key).toBe(false);
    for (const k of Object.values(UNIT4_KEYS)) expect(k.answerMy).toBeTruthy();
  });

  it("keeps all source text translated, uniquely identified and backed by bundled scans", () => {
    for (const [sections, scan] of [
      [UNIT2_SECTIONS, unit2ScanUrl],
      [UNIT4_SECTIONS, unit4ScanUrl],
    ] as const) {
      const all = sections.flatMap((s) => s.blocks);
      expect(new Set(all.map((b) => b.id)).size).toBe(all.length);
      for (const b of all) {
        expect(b.my || b.t === "scan").toBeTruthy();
        expect("ma" in b || "a" in b).toBe(false);
        if (b.scanPage) expect(existsSync(`public${scan(b.scanPage)}`)).toBe(true);
      }
    }
  });
});
