import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { Grade11TextLesson } from "./Grade11TextLesson";
import { Grade11GrammarAnswer } from "./Grade11GrammarAnswer";
import { UPPER_UNITS } from "@/lib/grade11Upper";
import support from "@/data/grade11/grammarExerciseSupport.json";

vi.mock("@/components/AuthGate", () => ({
  useAuth: () => ({ session: { access_token: "test" } }),
}));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
beforeEach(() => {
  sessionStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        hint: "ကြိယာပုံစံကို ပြန်စစ်ပါ။",
        feedback: "ဝါကျဆက်ထားပုံ သင့်လျော်ပါတယ်။",
        correct: true,
      }),
    ),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const counts = [30, 10, 20, 29, 20, 22, 25, 15, 20, 30, 50];
describe("individual Grade 11 grammar exercises", () => {
  it.each(counts.map((count, i) => [i + 2, count]))(
    "Unit %i gives all %i questions their own controls",
    (unit, count) => {
      render(<Grade11TextLesson unit={unit} kind="grammar" />);
      const cards = [...document.querySelectorAll("[data-grammar-question]")];
      expect(cards).toHaveLength(count);
      for (const card of cards) {
        const buttons = [...card.querySelectorAll("button")];
        expect(buttons.some((b) => b.textContent === "Translate Question")).toBe(true);
        expect(buttons.find((b) => b.textContent === "Check Answer")).toBeDisabled();
        expect(buttons.find((b) => b.textContent === "Reveal Answer")).toBeEnabled();
        expect(card.querySelector("input, textarea")).toHaveValue("");
      }
      expect(screen.queryByRole("button", { name: "Reveal Answers" })).toBeNull();
      expect(screen.getByRole("region", { name: "Grammar video explanation" })).toBeVisible();
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it("checks only one answer, resets its result on editing, and reveals without losing the draft", () => {
    render(<Grade11TextLesson unit={3} kind="grammar" />);
    const cards = [...document.querySelectorAll("[data-grammar-question]")];
    const first = within(cards[0] as HTMLElement),
      second = within(cards[1] as HTMLElement);
    const field = first.getByRole("textbox");
    fireEvent.change(field, { target: { value: "thinking" } });
    fireEvent.click(first.getByRole("button", { name: "Check Answer" }));
    expect(first.getByRole("status")).toHaveTextContent("✅");
    expect(second.queryByRole("status")).toBeNull();
    fireEvent.change(field, { target: { value: "different answer" } });
    expect(first.queryByRole("status")).toBeNull();
    fireEvent.click(first.getByRole("button", { name: "Reveal Answer" }));
    expect(field).toBeDisabled();
    expect(field).toHaveValue("different answer");
    fireEvent.click(first.getByRole("button", { name: "Hide Answer" }));
    expect(field).toBeEnabled();
    expect(field).toHaveValue("different answer");
  });
  it("provides real Myanmar toggles and preserves the original underlined target", () => {
    render(<Grade11TextLesson unit={11} kind="grammar" />);
    const first = document.querySelector('[data-grammar-question="11-emphasis-1"]')!;
    expect(first.querySelector("u")).toHaveTextContent("our overall health and well-being");
    expect(first.querySelector('[lang="my"]')).toBeNull();
    fireEvent.click(
      within(first as HTMLElement).getByRole("button", { name: "Translate Question" }),
    );
    expect(first.querySelector('[lang="my"]')).toHaveTextContent(
      support.items["11-emphasis-1"].questionMy,
    );
    fireEvent.click(
      within(first as HTMLElement).getByRole("button", { name: "Hide Myanmar Translation" }),
    );
    expect(first.querySelector('[lang="my"]')).toBeNull();
  });
  it("accepts the student's own logical completion through explicit semantic review", async () => {
    render(<Grade11TextLesson unit={12} kind="grammar" />);
    const first = within(
      document.querySelector('[data-grammar-question="12-endings-1"]') as HTMLElement,
    );
    fireEvent.change(first.getByRole("textbox"), {
      target: { value: "The children are so noisy that the baby wakes up." },
    });
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(first.getByRole("button", { name: "Check Answer" }));
    await first.findByText("ဝါကျဆက်ထားပုံ သင့်လျော်ပါတယ်။");
    expect(fetch).toHaveBeenCalledOnce();
    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[0]).toBe("/api/g11-check");
    expect(JSON.parse(call[1]!.body as string).studentAnswer).toContain("the baby wakes up");
    fireEvent.change(first.getByRole("textbox"), { target: { value: "another completion" } });
    expect(first.queryByRole("status")).toBeNull();
  });
  it("has complete support for the unchanged upper-unit prompts and no orphan keys", () => {
    const ids = Object.values(UPPER_UNITS).flatMap((u) =>
      u.skills.grammar.groups.flatMap((g) => g.items.map((i) => i.id)),
    );
    expect(Object.keys(support.items).sort()).toEqual(ids.sort());
    for (const entry of Object.values(support.items)) {
      expect(entry.questionMy).toMatch(/[\u1000-\u109f]/);
      expect(entry.answer.trim().length).toBeGreaterThan(0);
    }
    expect(support.officialAnswerKey).toBe(false);
  });
  it("requests hints only on click and ignores a hint after the answer was edited", async () => {
    let resolve!: (r: Response) => void;
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise<Response>((r) => {
          resolve = r;
        }),
    );
    let draft = "wrong";
    const props = {
      question: "Original question",
      instructions: "Rewrite",
      correct: "correct",
      multiline: true,
      onChange: (v: string) => {
        draft = v;
      },
    };
    const view = render(<Grade11GrammarAnswer {...props} value={draft} />);
    fireEvent.click(screen.getByRole("button", { name: "Check Answer" }));
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /ဘာလို့မှားလဲ/ }));
    const signal = vi.mocked(fetch).mock.calls[0][1]!.signal!;
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "revised" } });
    view.rerender(<Grade11GrammarAnswer {...props} value={draft} />);
    expect(signal.aborted).toBe(true);
    resolve(Response.json({ hint: "OLD HINT" }));
    await waitFor(() => expect(screen.queryByText("OLD HINT")).toBeNull());
    expect(screen.queryByRole("status")).toBeNull();
  });
});
