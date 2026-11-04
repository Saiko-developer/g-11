import { describe, expect, it } from "vitest";
import { scoreShadowing } from "./shadowing-score";

describe("scoreShadowing", () => {
  it("gives 100% when every word is said", () => {
    expect(scoreShadowing("English is spoken widely.", "english is spoken widely").percent).toBe(100);
  });
  it("marks unsaid words as missed", () => {
    const r = scoreShadowing("I like green tea", "I like tea");
    expect(r.marks[2].status).toBe("missed");
    expect(r.percent).toBe(75);
  });
  it("gives half credit for a near pronunciation", () => {
    const r = scoreShadowing("language", "languag");
    expect(r.marks[0].status).toBe("close");
    expect(r.percent).toBe(50);
  });
});
