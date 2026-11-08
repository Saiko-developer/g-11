import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Grade11Unit3Lesson } from "./Grade11Unit3Lesson";
import { Grade11Unit4Lesson } from "./Grade11Unit4Lesson";
import { Grade11Unit5Lesson, Grade11Unit6Lesson } from "./Grade11TravelLesson";
import { UNIT3_SECTIONS } from "@/lib/grade11Unit3";
import { UNIT4_SECTIONS } from "@/lib/grade11Unit4";
import { TRAVEL_LESSONS } from "@/lib/grade11Travel";
import type { G11SkillKind } from "@/data/grade11/syllabus";

vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
beforeEach(() => sessionStorage.clear());
afterEach(cleanup);
const lessons = [Grade11Unit3Lesson, Grade11Unit4Lesson, Grade11Unit5Lesson, Grade11Unit6Lesson];
const sections = [
  UNIT3_SECTIONS,
  UNIT4_SECTIONS,
  TRAVEL_LESSONS[5].sections,
  TRAVEL_LESSONS[6].sections,
];
const skills: G11SkillKind[] = [
  "reading",
  "vocabulary",
  "grammar",
  "listening",
  "speaking",
  "writing",
];

describe("Grade 11 Units 3–6 workspaces", () => {
  it.each(lessons.map((Lesson, index) => ({ Lesson, index, unit: index + 3 })))(
    "renders all six skills for Unit $unit and retains grammar videos",
    ({ Lesson, index }) => {
      for (const kind of skills) {
        const view = render(<Lesson kind={kind} />);
        expect(
          screen.queryByText("သင်ခန်းစာမှ ဆက်စပ်ဖြေဆိုထားသောအဖြေ — တရားဝင်အဖြေလွှာ မဟုတ်ပါ။"),
        ).toBeNull();
        if (kind === "grammar")
          expect(screen.getByRole("region", { name: "Grammar video explanation" })).toBeVisible();
        if (kind === "reading") {
          const pre = sections[index][0].blocks.find((b) => b.x === "Pre-reading");
          if (pre) {
            const group = screen.getByRole("heading", { name: "Pre-reading" }).parentElement!;
            expect(
              within(group).queryByRole("button", { name: "Translate Instructions" }),
            ).toBeNull();
          }
        }
        view.unmount();
      }
    },
  );

  it.each(lessons.map((Lesson, index) => ({ Lesson, index, unit: index + 3 })))(
    "separates Listening and Speaking for Unit $unit",
    ({ Lesson, index }) => {
      const listening = sections[index]
        .find((s) => s.code.endsWith("D"))!
        .blocks.find((b) => b.t === "ins")!.x;
      const view = render(<Lesson kind="listening" />);
      expect(screen.getByRole("heading", { name: listening })).toBeVisible();
      view.unmount();
      render(<Lesson kind="speaking" />);
      expect(screen.queryByRole("heading", { name: listening })).toBeNull();
    },
  );

  it("restores drafts and progress after changing skills and remounting", () => {
    const question = UNIT3_SECTIONS[0].blocks.find((b) => b.t === "q")!.x;
    const view = render(<Grade11Unit3Lesson key="reading" kind="reading" />);
    fireEvent.change(screen.getByLabelText(`Your answer: ${question}`), {
      target: { value: "My memory" },
    });
    expect(screen.getByText(/Progress: 1 \/ /)).toBeVisible();
    view.rerender(<Grade11Unit3Lesson key="grammar" kind="grammar" />);
    view.rerender(<Grade11Unit3Lesson key="reading" kind="reading" />);
    expect(screen.getByLabelText(`Your answer: ${question}`)).toHaveValue("My memory");
    expect(screen.getByText(/Progress: 1 \/ /)).toBeVisible();
  });

  it("restores checked short-answer drafts without carrying them into another unit", () => {
    const view = render(<Grade11Unit3Lesson key="grammar" kind="grammar" />);
    const first = screen.getAllByRole("textbox")[0];
    fireEvent.change(first, { target: { value: "thinking" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Check Answer" })[0]);
    expect(screen.getByText("✅ မှန်ပါတယ်! တော်လိုက်တာ။")).toBeVisible();
    view.rerender(<Grade11Unit4Lesson key="unit4" kind="grammar" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("");
    view.rerender(<Grade11Unit3Lesson key="unit3" kind="grammar" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("thinking");
  });

  it("uses separate lunch and dinner responses while preserving printed breakfast examples", () => {
    render(<Grade11Unit4Lesson kind="reading" />);
    expect(screen.getByRole("columnheader", { name: "Breakfast" })).toBeVisible();
    expect(screen.getByLabelText("lunch: Typical Myanmar food")).toHaveValue("");
    fireEvent.change(screen.getByLabelText("dinner: Typical Myanmar food"), {
      target: { value: "Rice" },
    });
    expect(screen.getByText(/Progress: 1 \/ /)).toBeVisible();
  });

  it("keeps sentence cards English and their explanations Burmese", () => {
    render(<Grade11Unit3Lesson kind="reading" />);
    fireEvent.click(screen.getAllByRole("button", { name: "Sentence Structure" })[0]);
    const cards = screen.getByLabelText("Sentence structure words");
    expect(cards).toHaveAttribute("lang", "en");
    expect(cards.textContent).not.toMatch(/[\u1000-\u109f]/);
    fireEvent.click(within(cards).getAllByRole("button")[0]);
    expect(screen.getByRole("dialog").querySelector('[lang="my"]')!.textContent).not.toMatch(
      /[a-z]/i,
    );
  });

  it("provides four independent survey responses and the original instruction", () => {
    render(<Grade11Unit4Lesson kind="speaking" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(33);
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Yes, I do." } });
    expect(screen.getByText("Progress: 1 / 33 answered")).toBeVisible();
    expect(screen.getByRole("heading", { name: /C\. Tell the class the results/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Check Answer" })).toBeNull();
  });

  it("offers textbook country checkboxes and paragraph ordering", () => {
    const view = render(<Grade11Unit5Lesson kind="reading" />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(6);
    fireEvent.click(screen.getByRole("checkbox", { name: "Laos" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Thailand" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Vietnam" }));
    view.unmount();
    render(<Grade11Unit5Lesson kind="writing" />);
    expect(screen.getAllByRole("combobox")).toHaveLength(5);
    fireEvent.change(screen.getByLabelText("Paragraph position 1"), { target: { value: "A" } });
    expect(
      within(screen.getByLabelText("Paragraph position 2")).getByRole("option", { name: "A" }),
    ).toBeDisabled();
  });

  it("retains independent country/table drafts and counts composition words", () => {
    const view = render(<Grade11Unit6Lesson kind="reading" />);
    expect(screen.getByRole("columnheader", { name: "Tourist destination" })).toBeVisible();
    fireEvent.change(screen.getByLabelText("Country: 2. Mount Popa"), {
      target: { value: "Myanmar" },
    });
    view.unmount();
    const writing = render(<Grade11Unit6Lesson kind="writing" />);
    fireEvent.change(screen.getByLabelText("✍️ Your answer"), {
      target: { value: "One two three" },
    });
    expect(screen.getByText("Words: 3 / 200–250")).toBeVisible();
    writing.unmount();
    render(<Grade11Unit6Lesson kind="reading" />);
    expect(screen.getByLabelText("Country: 2. Mount Popa")).toHaveValue("Myanmar");
  });
});
