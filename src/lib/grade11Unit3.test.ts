import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAnswerMatch } from "@/lib/answerMatch";
import { splitUnit1 } from "@/lib/grade11Unit1";
import { UNIT3_KEYS, UNIT3_SECTIONS, unit3ScanUrl } from "@/lib/grade11Unit3";

const section = (code: string) => UNIT3_SECTIONS.find((s) => s.code === code)!;

describe("Grade 11 Unit 3 source fidelity", () => {
  it("restores all ten bracketed verbs and checks their gerund/infinitive answers", () => {
    const { lesson, exercises } = splitUnit1(section("3C"));
    expect(lesson.some((b) => b.x.includes("She stopped to drink coffee"))).toBe(true);
    expect(exercises).toHaveLength(1);
    const questions = exercises[0].blocks.filter((b) => b.t === "q");
    expect(questions).toHaveLength(10);
    const verbs = [
      "think",
      "meet",
      "write",
      "buy",
      "wait",
      "attend",
      "help",
      "open",
      "speak",
      "go",
    ];
    const answers = [
      "thinking",
      "to meet",
      "writing",
      "to buy",
      "waiting",
      "to attend",
      "to help",
      "opening",
      "to speak",
      "to go",
    ];
    questions.forEach((b, i) => {
      expect(b.x).toContain(`(${verbs[i]})`);
      expect(isAnswerMatch(answers[i], UNIT3_KEYS[b.id].answer)).toBe(true);
    });
    expect(isAnswerMatch("to think", UNIT3_KEYS[questions[0].id].answer)).toBe(false);
  });

  it("keeps pre-reading, comprehension and audio questions interactive without guessed keys", () => {
    const reading = splitUnit1(section("3A"));
    expect(reading.exercises.map((ex) => ex.blocks.filter((b) => b.t === "q").length)).toEqual([
      4, 6, 6, 10,
    ]);
    const all = UNIT3_SECTIONS.flatMap((s) => s.blocks);
    const audio = all.filter((b) => b.response === "audio");
    expect(audio).toHaveLength(10);
    expect(audio[0].x).toBe("1. Soe Thu has got a very good memory.");
    expect(audio[6].x).toContain("usually sang the song while they were playing");
    for (const b of all.filter((b) => b.response)) expect(UNIT3_KEYS[b.id]).toBeUndefined();
    expect(Object.keys(UNIT3_KEYS)).toHaveLength(31);
    for (const [id, key] of Object.entries(UNIT3_KEYS)) {
      expect(all.some((b) => b.id === id && b.t === "q")).toBe(true);
      expect(key.origin).toBe("source-derived");
    }
  });

  it("restores the memory diagram, chemical formula and printed writing model", () => {
    const reading = section("3A").blocks;
    expect(reading.some((b) => b.x.includes("H₂O"))).toBe(true);
    expect(reading.some((b) => b.scanPage === 29 && b.my.includes("ကာလတိုမှတ်ဉာဏ်"))).toBe(true);
    expect(reading.some((b) => b.emphasis?.includes("memorable"))).toBe(true);
    const writing = section("3E").blocks;
    expect(writing.find((b) => b.t === "para")?.x).toContain(
      "One Sunday afternoon, I went to a bookshop to buy some books.",
    );
    expect(writing.find((b) => b.t === "para")?.x).toContain("Your skirt was torn at the back.");
    expect(writing.some((b) => b.x.startsWith("On a Sunday afternoon at a quiet bookshop"))).toBe(
      false,
    );
    expect(writing.filter((b) => b.x.startsWith("•"))).toHaveLength(5);
  });

  it("bundles damaged source scans and keeps all translated content traceable to PDF pages", () => {
    const all = UNIT3_SECTIONS.flatMap((s) => s.blocks);
    expect(new Set(all.map((b) => b.id)).size).toBe(all.length);
    for (const b of all) {
      expect(b.sourcePage).toBeGreaterThanOrEqual(28);
      expect(b.sourcePage).toBeLessThanOrEqual(36);
      expect(b.my || b.t === "scan").toBeTruthy();
      expect("ma" in b || "a" in b).toBe(false);
      if (b.scanPage) expect(existsSync(`public${unit3ScanUrl(b.scanPage)}`)).toBe(true);
    }
    for (const id of ["3B-18", "3B-19", "3B-20"]) {
      expect(UNIT3_KEYS[id]).toBeUndefined();
      expect(all.find((b) => b.id === id)?.x).toMatch(/^\d\.$/);
    }
    expect(unit3ScanUrl(13)).toBeNull();
  });
});
