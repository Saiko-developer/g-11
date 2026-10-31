import { describe, expect, it } from "vitest";
import { mmDate, normalizeState, remainingGenerations } from "./grammarGenLimit";

describe("grammar generation limit", () => {
  it("allows 2 generations per exercise per day", () => {
    expect(remainingGenerations(0)).toBe(2);
    expect(remainingGenerations(2)).toBe(0);
  });
  it("resets at Myanmar midnight", () => {
    expect(mmDate(new Date("2026-10-31T17:29:00Z"))).toBe("2026-10-31");
    expect(mmDate(new Date("2026-10-31T17:30:00Z"))).toBe("2026-11-01");
    expect(normalizeState({ date: "2026-10-31", count: 2, items: [] }, "2026-11-01").count).toBe(0);
  });
});
