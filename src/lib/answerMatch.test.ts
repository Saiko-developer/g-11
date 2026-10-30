import { describe, expect, it } from "vitest";
import { isAnswerMatch } from "./answerMatch";

const ans = "U Tun Tun, our English teacher, is a very strict person.";

describe("isAnswerMatch", () => {
  it("accepts extra spaces in a right sentence", () => {
    expect(isAnswerMatch("  U Tun  Tun ,  our English   teacher, is a very strict person . ", ans)).toBe(true);
  });
  it("accepts missing space after a comma", () => {
    expect(isAnswerMatch("U Tun Tun,our English teacher,is a very strict person", ans)).toBe(true);
  });
  it("still rejects a wrong sentence", () => {
    expect(isAnswerMatch("U Tun Tun our English teacher was a very strict person", ans)).toBe(false);
  });
  it("accepts either option of 'that / which'", () => {
    const a = "The building, that / which was destroyed in the storm, has now been rebuilt.";
    expect(isAnswerMatch("The building, which was destroyed in the storm, has now been rebuilt.", a)).toBe(true);
  });
  it("ignores teacher notes in brackets", () => {
    expect(isAnswerMatch("freezes", 'freezes (a general truth; "will freeze" is also acceptable)')).toBe(true);
  });
});
