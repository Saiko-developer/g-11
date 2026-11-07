import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

  it("limits listening and speaking to their own textbook tasks", () => {
    const view = render(<Grade11Unit1Workspace key="listening" kind="listening" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(7);
    expect(screen.queryByText(/B\. Complete the following dialogue/)).toBeNull();
    view.rerender(<Grade11Unit1Workspace key="speaking" kind="speaking" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6); // five dialogue questions + own dialogue
    expect(screen.queryByText(/A\. Listen to a talk/)).toBeNull();
  });
});
