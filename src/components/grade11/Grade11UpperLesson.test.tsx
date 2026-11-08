import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Grade11UpperLesson } from "./Grade11UpperLesson";
import { Grade11TextLesson, hasGrade11Text } from "./Grade11TextLesson";
import { UPPER_UNITS, type UpperUnitNumber } from "@/lib/grade11Upper";
import type { G11SkillKind } from "@/data/grade11/syllabus";

beforeEach(() => {
  sessionStorage.clear();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const numbers: UpperUnitNumber[] = [7, 8, 9, 10, 11, 12];
const skills: G11SkillKind[] = [
  "reading",
  "vocabulary",
  "grammar",
  "listening",
  "speaking",
  "writing",
];

describe("Grade 11 Units 7–12 workspaces", () => {
  it.each(numbers)("renders all six skills for Unit %i with the requested controls", (unit) => {
    expect(hasGrade11Text(unit)).toBe(true);
    for (const kind of skills) {
      const view = render(<Grade11TextLesson unit={unit} kind={kind} />);
      expect(screen.getByRole("complementary", { name: "Original textbook" })).toBeVisible();
      expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
      expect(
        screen.queryByText("သင်ခန်းစာမှ ဆက်စပ်ဖြေဆိုထားသောအဖြေ — တရားဝင်အဖြေလွှာ မဟုတ်ပါ။"),
      ).toBeNull();
      if (kind === "grammar")
        expect(screen.getByRole("region", { name: "Grammar video explanation" })).toBeVisible();
      if (kind === "listening") {
        expect(screen.getAllByText(/🎧/)).toHaveLength(1);
        expect(screen.queryByRole("button", { name: "Check Answer" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Reveal Answer" })).toBeNull();
      }
      if (kind === "speaking" || kind === "listening") {
        expect(
          screen.getByRole("region", { name: `Grade 11 Unit ${unit} original audio` }),
        ).toBeVisible();
        expect(screen.getByLabelText(`Unit ${unit} listening track`)).toHaveAttribute(
          "src",
          `/grade11/audio/unit${unit}.mp3`,
        );
      }
      if (kind === "reading") {
        const pre = screen.getByRole("heading", { name: "Pre-reading" }).parentElement!;
        expect(within(pre).queryByRole("button", { name: "Translate Instructions" })).toBeNull();
      }
      view.unmount();
    }
  });

  it("restores drafts after skill changes and remounts without crossing units", () => {
    const view = render(<Grade11UpperLesson unit={7} kind="grammar" />);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "The roof should be replaced." },
    });
    expect(screen.getByText("Progress: 1 / 22 answered")).toBeVisible();
    view.rerender(<Grade11UpperLesson unit={7} kind="speaking" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("");
    view.rerender(<Grade11UpperLesson unit={8} kind="grammar" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("");
    view.rerender(<Grade11UpperLesson unit={7} kind="grammar" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("The roof should be replaced.");
    view.unmount();
    render(<Grade11UpperLesson unit={7} kind="grammar" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("The roof should be replaced.");
  });

  it("supports Check, Reveal and Hide for closed source-derived responses", () => {
    render(<Grade11UpperLesson unit={7} kind="vocabulary" />);
    const field = screen.getByLabelText("Your answer: 1. organ");
    fireEvent.change(field, { target: { value: "a" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Check Answer" })[0]);
    expect(screen.getByRole("status")).toHaveTextContent("✅");
    fireEvent.click(screen.getAllByRole("button", { name: "Reveal Answer" })[0]);
    expect(field).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Hide Answer" }));
    expect(field).not.toBeDisabled();
  });

  it("shows clean English sentence cards and Burmese explanations", () => {
    render(<Grade11UpperLesson unit={8} kind="reading" />);
    fireEvent.click(screen.getAllByRole("button", { name: "Sentence Structure" })[0]);
    const cards = screen.getByLabelText("Sentence structure words");
    expect(cards.textContent).not.toMatch(/[\u1000-\u109f]/);
    fireEvent.click(within(cards).getAllByRole("button")[0]);
    expect(screen.getByRole("dialog").querySelector('[lang="my"]')!.textContent).not.toMatch(
      /[a-z]/i,
    );
  });

  it("keeps multi-part story choices and tri-state listening responses independent", () => {
    const view = render(<Grade11UpperLesson unit={8} kind="reading" />);
    const group = screen.getByRole("region", { name: /B\. Tick the part/ });
    const options = within(group).getAllByRole("checkbox");
    fireEvent.click(options[0]);
    fireEvent.click(options[2]);
    expect(options[0]).toBeChecked();
    expect(options[2]).toBeChecked();
    view.rerender(<Grade11UpperLesson unit={12} kind="listening" />);
    const field = screen.getByLabelText(
      `Your answer: ${UPPER_UNITS[12].skills.listening.groups[1].items[0].prompt}`,
    );
    expect(within(field).getByRole("option", { name: "NOT MENTIONED" })).toBeTruthy();
    fireEvent.change(field, { target: { value: "NOT MENTIONED" } });
    expect(screen.getByText("Progress: 1 / 12 answered")).toBeVisible();
  });

  it.each([
    { unit: 8 as const, target: "About 100" },
    { unit: 11 as const, target: "About 200" },
    { unit: 12 as const, target: "200–250" },
  ])("counts composition words for Unit $unit", ({ unit, target }) => {
    render(<Grade11UpperLesson unit={unit} kind="writing" />);
    const item = UPPER_UNITS[unit].skills.writing.groups.at(-1)!.items[0];
    fireEvent.change(screen.getByLabelText(`Your answer: ${item.prompt}`), {
      target: { value: "One two three" },
    });
    expect(screen.getByText(`Words: 3 · ${target}`)).toBeVisible();
  });

  it("survives malformed or unavailable browser storage", () => {
    sessionStorage.setItem("grade11:unit7:reading:drafts:v1", "malformed");
    const view = render(<Grade11UpperLesson unit={7} kind="reading" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("");
    view.unmount();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<Grade11UpperLesson unit={7} kind="writing" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "My draft" } });
    expect(screen.getByRole("textbox")).toHaveValue("My draft");
  });
});
