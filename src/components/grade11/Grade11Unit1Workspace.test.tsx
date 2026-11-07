import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UNIT1_SECTIONS } from "@/lib/grade11Unit1";
import {
  UNIT1_READING_C_WORDS,
  UNIT1_READING_C_STRUCTURE,
} from "@/data/grade11/unit1ReadingStructure";
import { Grade11Unit1Workspace } from "./Grade11Unit1Workspace";

vi.mock("@/components/lesson/GrammarScriptView", () => ({ GrammarScriptView: () => null }));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
vi.mock("@/components/LessonAudioPlayer", () => ({ LessonAudioPlayer: () => null }));

beforeEach(() => sessionStorage.clear());
afterEach(cleanup);

describe("Grade 11 Unit 1 skill drafts", () => {
  it("restores both personal and checked answers and progress after changing skills", async () => {
    const view = render(<Grade11Unit1Workspace key="reading" kind="reading" />);
    fireEvent.change(screen.getByLabelText("Your answer: a. I have seen a dolphin."), {
      target: { value: "Yes" },
    });
    fireEvent.change(screen.getByLabelText("Your answer: 1. ______"), { target: { value: "c" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Check Answer" })[0]);
    expect(screen.getByText(/✅/)).toBeTruthy();
    expect(screen.getByText("Progress: 2 / 28 answered")).toBeTruthy();
    view.rerender(<Grade11Unit1Workspace key="vocabulary" kind="vocabulary" />);
    view.rerender(<Grade11Unit1Workspace key="reading" kind="reading" />);
    await waitFor(() =>
      expect(screen.getByLabelText("Your answer: a. I have seen a dolphin.")).toHaveValue("Yes"),
    );
    expect(screen.getByLabelText("Your answer: 1. ______")).toHaveValue("c");
    expect(screen.getByText("Progress: 2 / 28 answered")).toBeTruthy();
  });

  it("shows direct topic/B instruction translations and toggles B/C question translations", () => {
    render(<Grade11Unit1Workspace kind="reading" />);
    const blocks = UNIT1_SECTIONS.find((s) => s.code === "1A")!.blocks;
    const source = (id: string) => blocks.find((b) => b.id === id)!;
    const group = (id: string) =>
      within(screen.getByRole("heading", { name: source(id).x }).parentElement!);
    expect(group("1A-0").queryByRole("button", { name: "Translate Instructions" })).toBeNull();
    expect(group("1A-28").getByText(source("1A-28").my)).toBeVisible();
    for (const id of ["1A-18", "1A-19", "1A-20", "1A-21", "1A-22"])
      expect(screen.getByText(source(id).my)).toBeVisible();
    expect(group("1A-28").getAllByRole("button", { name: "Translate Question" })).toHaveLength(7);
    expect(group("1A-36").queryByText(source("1A-37").my)).toBeNull();
    fireEvent.click(group("1A-36").getAllByRole("button", { name: "Translate Question" })[0]);
    expect(group("1A-36").getByText(source("1A-37").my)).toBeVisible();
    expect(group("1A-36").getAllByRole("button", { name: "Sentence Structure" })).toHaveLength(10);
    fireEvent.click(group("1A-36").getAllByRole("button", { name: "Sentence Structure" })[0]);
    expect(
      screen.getByRole("table", { name: "စကားလုံးတစ်လုံးချင်း အဓိပ္ပာယ်ဖော်ပြချက်" }),
    ).toBeVisible();
  });

  it("covers every C question word in source order with Burmese-only explanations", () => {
    const blocks = UNIT1_SECTIONS.find((s) => s.code === "1A")!.blocks;
    for (const [id, words] of Object.entries(UNIT1_READING_C_WORDS)) {
      const question = blocks.find((b) => b.id === id)!;
      expect(words.map(([word]) => word)).toEqual(question.x.match(/[A-Za-z]+/g));
      for (const [, translation] of words) {
        expect(translation).toMatch(/[\u1000-\u109f]/);
        expect(translation).not.toMatch(/[A-Za-z]/);
      }
      expect(UNIT1_READING_C_STRUCTURE[id]).not.toMatch(/[A-Za-z]/);
    }
  });

  it("limits listening and speaking to their own textbook tasks", () => {
    const view = render(<Grade11Unit1Workspace key="listening" kind="listening" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(7);
    expect(screen.queryByText(/B\. Complete the following dialogue/)).toBeNull();
    view.rerender(<Grade11Unit1Workspace key="speaking" kind="speaking" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6); // five dialogue questions + own dialogue
    expect(screen.queryByText(/A\. Listen to a talk/)).toBeNull();
  });
});
