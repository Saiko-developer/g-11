import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { Grade11Unit1Lesson } from "./Grade11Unit1Lesson";
import { Grade11Unit2Lesson } from "./Grade11Unit2Lesson";
import { Grade11Unit3Lesson } from "./Grade11Unit3Lesson";
import { Grade11Unit4Lesson } from "./Grade11Unit4Lesson";
import { UNIT2_KEYS } from "@/lib/grade11Unit2";
import { Grade11Poem1View, Grade11Review1View } from "./Grade11Revision";
vi.mock("@/components/AuthGate", () => ({
  useAuth: () => ({ session: { access_token: "test" } }),
}));
vi.mock("@/components/RequireSignIn", () => ({
  RequireSignIn: ({ children }: { children: React.ReactNode }) => children,
  signInWithGoogle: vi.fn(),
}));
vi.mock("./Grade11RolePlay", () => ({
  Grade11RolePlay: ({ exercise }: { exercise: string }) => <p>AI task {exercise}</p>,
}));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
beforeEach(() => {
  sessionStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json({ correct: true, feedback: "အဖြေကို ကောင်းစွာ ရေးထားပါတယ်။" }),
      ),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const group = (id: string) => document.querySelector(`[data-exercise="${id}"]`) as HTMLElement;
describe("Grade 11 requested Unit 1–4 improvements", () => {
  it("puts the five trip questions in one bilingual table and switches between exercise-specific AI tasks", () => {
    render(<Grade11Unit1Lesson kind="speaking" />);
    const b = group("1D-12");
    const table = within(b).getByRole("table", { name: "Questions for the trip dialogue" });
    expect(within(table).getAllByRole("row")).toHaveLength(6);
    expect(within(b).queryByRole("button", { name: "Show Myanmar Translation" })).toBeNull();
    expect(within(table).getByText(/ခရီးစဉ်ပြီးနောက်/)).toBeVisible();
    fireEvent.click(within(group("1D-30")).getByRole("button", { name: "Practise with AI" }));
    expect(screen.getByText("AI task 1D-30")).toBeVisible();
    fireEvent.click(within(group("1D-31")).getByRole("button", { name: "Practise with AI" }));
    expect(screen.queryByText("AI task 1D-30")).toBeNull();
    expect(screen.getByText("AI task 1D-31")).toBeVisible();
  });
  it("checks all twelve Unit 2 classifications with one control and directly translates statements", () => {
    render(<Grade11Unit2Lesson kind="reading" />);
    const a = group("2A-16");
    const selects = within(a).getAllByRole("combobox");
    expect(selects).toHaveLength(12);
    expect(within(a).getAllByRole("button", { name: "Check Answer" })).toHaveLength(1);
    expect(within(a).queryByRole("button", { name: "Translate Question" })).toBeNull();
    selects.forEach((field, i) => {
      const key = UNIT2_KEYS[`2A-${18 + i}`].answer.toLowerCase();
      fireEvent.change(field, {
        target: { value: key.includes("disadvantage") ? "Disadvantage" : "Advantage" },
      });
    });
    fireEvent.click(within(a).getByRole("button", { name: "Check Answer" }));
    expect(within(a).getByText("12 / 12 correct")).toBeVisible();
    fireEvent.change(selects[0], { target: { value: "Disadvantage" } });
    expect(within(a).queryByText("12 / 12 correct")).toBeNull();
    expect(screen.getAllByText("Tips")).toHaveLength(1);
  });
  it("uses semantic AI checking for Unit 2 Reading B rather than exact personal-answer keys", async () => {
    render(<Grade11Unit2Lesson kind="reading" />);
    const b = group("2A-30");
    expect(within(b).getAllByRole("textbox")).toHaveLength(10);
    expect(within(b).queryByRole("button", { name: "Check Answer" })).toBeNull();
    fireEvent.change(within(b).getAllByRole("textbox")[0], {
      target: { value: "It means buying goods through the internet." },
    });
    fireEvent.click(within(b).getByRole("button", { name: "Check Answer with AI" }));
    await within(b).findByText("အဖြေကို ကောင်းစွာ ရေးထားပါတယ်။");
    expect(fetch).toHaveBeenCalledOnce();
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(body.studentAnswer).toContain("buying goods");
    expect(body.context.toLowerCase()).toContain("online shopping");
  });
  it("replaces the memory diagram and letter translation controls with tables and grouped extracts", () => {
    render(<Grade11Unit3Lesson kind="reading" />);
    expect(screen.getByRole("table", { name: "Memory — information flow" })).toBeVisible();
    expect(screen.queryByText("View original textbook page 24")).toBeNull();
    expect(within(group("3A-15")).getByRole("table")).toBeVisible();
    expect(within(group("3A-15")).queryByRole("button", { name: /Translate/ })).toBeNull();
    expect(within(group("3A-35")).getByText("Extract (a)")).toBeVisible();
    expect(within(group("3A-35")).getByText("Extract (b)")).toBeVisible();
    expect(
      within(group("3A-35")).queryByRole("button", { name: "Show Myanmar Translation" }),
    ).toBeNull();
  });
  it.each([Grade11Unit2Lesson, Grade11Unit3Lesson, Grade11Unit4Lesson])(
    "provides the existing text/oral grammar style for %s",
    (Lesson) => {
      render(<Lesson kind="grammar" />);
      expect(screen.getAllByRole("button", { name: "Text Explanation" }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("button", { name: "Oral Explanation" }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("button", { name: "Check Answer" }).length).toBeGreaterThan(0);
      fireEvent.click(screen.getAllByRole("button", { name: "Text Explanation" })[0]);
      expect(screen.getByText(/Quick Card/)).toBeVisible();
    },
  );
  it.each([
    [Grade11Unit2Lesson, "2D-4", "money"],
    [Grade11Unit3Lesson, "3D-0", "FALSE"],
    [Grade11Unit4Lesson, "4D-0", "satisfy"],
  ] as const)("makes audio-derived listening answers checkable for %s", (Lesson, id, answer) => {
    render(<Lesson kind="listening" />);
    const g = group(id);
    const field = within(g).queryAllByRole("combobox")[0] ?? within(g).getAllByRole("textbox")[0];
    fireEvent.change(field, { target: { value: answer } });
    fireEvent.click(within(g).getByRole("button", { name: "Check Answer" }));
    expect(within(g).getAllByText("✓ မှန်ပါတယ်။")).toHaveLength(1);
  });
  it("uses a bilingual expression table and four editable survey columns", () => {
    const view = render(<Grade11Unit3Lesson kind="speaking" />);
    expect(within(group("3D-11")).getByRole("table")).toBeVisible();
    expect(
      within(group("3D-11")).queryByRole("button", { name: "Show Myanmar Translation" }),
    ).toBeNull();
    view.unmount();
    render(<Grade11Unit4Lesson kind="speaking" />);
    const survey = group("4D-11");
    expect(within(survey).getAllByRole("textbox")).toHaveLength(32);
    expect(within(survey).getByRole("columnheader", { name: "Student 4" })).toBeVisible();
  });
  it("makes Unit 2 writing review available without losing its draft", () => {
    const view = render(<Grade11Unit2Lesson kind="writing" />);
    const free = document.getElementById("unit2-writing-response")!;
    fireEvent.change(free, { target: { value: "EiiZi Mart offers convenient online shopping." } });
    expect(screen.getByRole("button", { name: "Check Answer with AI" })).toBeEnabled();
    view.unmount();
    render(<Grade11Unit2Lesson kind="writing" />);
    expect(document.getElementById("unit2-writing-response")).toHaveValue(
      "EiiZi Mart offers convenient online shopping.",
    );
  });
  it("uses the supplied Review B4 and removes structure controls only from Poem pre-reading", () => {
    const view = render(<Grade11Review1View />);
    expect(screen.getByText(/The gymnasts rehearsed/)).toBeVisible();
    view.unmount();
    render(<Grade11Poem1View />);
    const pre = screen.getByRole("heading", { name: "Pre-reading" }).closest("section")!;
    expect(within(pre).queryByRole("button", { name: "Question Structure" })).toBeNull();
  });
});
