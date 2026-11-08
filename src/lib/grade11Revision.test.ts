import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import review from "@/data/grade11/textbook/review1.json";
import reviewAnswers from "@/data/grade11/textbook/review1-answer.json";
import poem from "@/data/grade11/textbook/poem1.json";
import poemAnswers from "@/data/grade11/textbook/poem1-answer.json";
import { grade11AnswerKeys } from "@/lib/grade11Answers";

describe("Grade 11 original Review 1 and Bridges", () => {
  it("retains the two ten-item review exercises and uses the teacher-provided B4", () => {
    expect(review.groups.map((g) => g.items.length)).toEqual([10, 10]);
    const keys = grade11AnswerKeys(reviewAnswers);
    expect(Object.keys(keys)).toHaveLength(20);
    expect(keys["review1-A-1"].answer).toBe("deadly serious");
    expect(keys["review1-B-4"].answer).toContain("After the gymnasts had rehearsed");
    expect(review.groups[1].items[3].question).toContain("The gymnasts rehearsed");
    expect(existsSync("public/grade11/review1/page-37.jpg")).toBe(true);
    expect(reviewAnswers.official_answer_key).toBe(false);
  });
  it("uses the 15 printed Bridges lines and the exact glossary and word box", () => {
    expect(poem.title).toBe("Bridges");
    expect(poem.author).toBe("James S. Tippett");
    const lines = poem.stanzas.flat();
    expect(lines).toHaveLength(15);
    expect(lines[0].english).toBe("I like a bridge —");
    expect(lines[14].english).toBe("Just any kind of bridge at all.");
    expect(lines.every((line) => line.myanmar)).toBe(true);
    expect(poem.glossary.map((g) => g.word)).toEqual([
      "freight train",
      "hewn-stone bridge",
      "rugged",
    ]);
    expect(poem.groups[4].wordBox).toEqual(["bird", "car", "flower", "friend", "fruit", "song"]);
    const keys = grade11AnswerKeys(poemAnswers);
    expect(Object.keys(keys)).toHaveLength(6);
    const bridgeLines = lines.flatMap((line, i) =>
      /\bbridge\b/.test(line.english) ? [i + 1] : [],
    );
    expect(bridgeLines).toEqual([1, 2, 3, 5, 7, 9, 11, 12, 14, 15]);
    expect(keys["poem1-A-2"].answer).toContain(bridgeLines.join(", ").replace(", 15", " and 15"));
  });
  it("does not invent personal descriptions or a new six-line poem", () => {
    let count = 0;
    for (const section of poemAnswers.sections) {
      for (const item of section.items) {
        if (item.status === "personal-response") {
          count++;
          expect(item.answer).toBeNull();
          expect(item.answerMy).toBeNull();
        }
      }
    }
    expect(count).toBe(8);
    expect(poem.groups[4].items[0].question.split("\n")).toHaveLength(2);
  });
});
