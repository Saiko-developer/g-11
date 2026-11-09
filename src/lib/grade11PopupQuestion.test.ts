import { expect, it } from "vitest";
import { grade11LessonContext } from "./grade11LessonContext";
import { grade11PopupQuestion } from "./grade11PopupQuestion";
it.each([
  "Please explain exercise no.3 in Burmese",
  "မေးခွန်း နံပါတ် ၃ ကို မြန်မာလို ရှင်းပြပါ",
  "နံပါတ်သုံးကို ရှင်းပြပါ",
])("resolves the reported Unit 3 Grammar request: %s", (spoken) => {
  expect(grade11PopupQuestion(grade11LessonContext(3, "grammar").context, spoken)).toContain(
    "I finished ___________ (write) the assignment just before the deadline.",
  );
});
it("does not guess when more than one exercise has Question 3", () => {
  const context = grade11LessonContext(1, "grammar").context;
  expect(grade11PopupQuestion(context, "exercise no.3")).toBeNull();
  const reference = grade11PopupQuestion(context, "Exercise A question 3");
  expect(reference).toContain("Exercise A");
  expect(reference).toContain("They are tired after shopping.");
});
it("does not resolve missing numbers or a different explicit exercise", () => {
  const context = grade11LessonContext(3, "grammar").context;
  expect(grade11PopupQuestion(context, "Explain the grammar")).toBeNull();
  expect(grade11PopupQuestion(context, "Explain exercise no.99")).toBeNull();
  expect(grade11PopupQuestion(context, "Exercise B question 3")).toBeNull();
});
