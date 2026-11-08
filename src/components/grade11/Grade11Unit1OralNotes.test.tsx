import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { UNIT1_GRAMMAR } from "@/lib/grade11Unit1Grammar";
import { Grade11Unit1OralNotes } from "./Grade11Unit1OralNotes";
vi.mock("@/components/lesson/ExerciseKit", () => ({ OwlBadge: () => null }));
beforeEach(() =>
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})),
  ),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it.each([0, 1, 2])(
  "shows source-linked teaching notes for oral topic %i without changing narration",
  (index) => {
    render(<GrammarScriptView grammar={UNIT1_GRAMMAR} OralNotes={Grade11Unit1OralNotes} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Oral Explanation" })[index]);
    expect(screen.getByText("📝 အသံနဲ့အတူ လိုက်ကြည့်ရန်")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Textbook example" })).toBeInTheDocument();
    expect(screen.getByText(UNIT1_GRAMMAR.sections[index].quiz.answerEn)).toBeInTheDocument();
    expect(Boolean(screen.queryByLabelText("Event order"))).toBe(index !== 0);
    expect(document.querySelectorAll("mark").length).toBeGreaterThan(0);
    const requestBody = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    // Existing oral narration still uses the same TTS endpoint and its opening text.
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe("/api/tts");
    expect(UNIT1_GRAMMAR.sections[index].oral.scriptMy).toContain(requestBody.text.slice(0, 40));
  },
);
it("keeps the existing notes when a caller does not opt into the Unit 1 view", () => {
  render(<GrammarScriptView grammar={UNIT1_GRAMMAR} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Oral Explanation" })[0]);
  expect(screen.getByText("📝 မှတ်စု အကျဉ်းချုပ် (Short notes)")).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Worked textbook exercise" })).toBeNull();
});
