import { describe, expect, it } from "vitest";
import { grade11SpeakingMatch } from "./grade11SpeakingScore";
import { GRADE11_SPEAKING_LINES } from "@/data/grade11/speakingPractice";

describe("Grade 11 ordered speaking text matching", () => {
  it("does not give reversed words full marks", () => {
    expect(grade11SpeakingMatch("I like apples", "apples like I").percent).toBe(33);
    expect(grade11SpeakingMatch("I like apples", "I like apples").percent).toBe(100);
  });
  it("handles punctuation, repeated words and extra words", () => {
    expect(grade11SpeakingMatch("I’m ready!", "im READY").percent).toBe(100);
    expect(grade11SpeakingMatch("go go go", "go").percent).toBe(33);
    expect(grade11SpeakingMatch("I like apples", "I really like apples").percent).toBe(75);
    expect(grade11SpeakingMatch("I like apples", "").percent).toBe(0);
  });
  it("provides source-referenced Grade 11 lines for all twelve units", () => {
    expect(Object.keys(GRADE11_SPEAKING_LINES)).toHaveLength(12);
    for (const lines of Object.values(GRADE11_SPEAKING_LINES)) {
      expect(lines.length).toBeGreaterThanOrEqual(2);
      expect(new Set(lines.map((line) => line.id)).size).toBe(lines.length);
      for (const line of lines) {
        expect(line.en).not.toMatch(/_{2,}|\.\.\.|\/|^[A-Z]:/);
        expect(line.my).toBeTruthy();
        expect(line.page).toBeGreaterThan(5);
      }
    }
  });
});
