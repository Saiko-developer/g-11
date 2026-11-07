import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Grade11Unit2Workspace } from "./Grade11Unit2Workspace";
import { UNIT2_KEYS, UNIT2_SECTIONS } from "@/lib/grade11Unit2";
import { isAnswerMatch } from "@/lib/answerMatch";
import {
  UNIT2_READING_WORDS,
  UNIT2_READING_ROLES,
  UNIT2_ROLE_INFO,
} from "@/data/grade11/unit2ReadingStructure";

vi.mock("@/components/lesson/GrammarScriptView", () => ({ GrammarScriptView: () => null }));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
beforeEach(() => sessionStorage.clear());
afterEach(cleanup);

describe("Grade 11 Unit 2 workspace", () => {
  it("keeps reading drafts and progress when changing skills", async () => {
    const view = render(<Grade11Unit2Workspace key="reading" kind="reading" />);
    fireEvent.change(
      screen.getByLabelText("Your answer: 1. Have you ever bought anything online?"),
      { target: { value: "My answer" } },
    );
    fireEvent.change(screen.getAllByPlaceholderText("Advantage / Disadvantage")[0], {
      target: { value: "Advantage" },
    });
    expect(screen.getByText("Progress: 2 / 25 answered")).toBeVisible();
    view.rerender(<Grade11Unit2Workspace key="vocabulary" kind="vocabulary" />);
    expect(screen.getAllByRole("button", { name: /^Speak / })).toHaveLength(8);
    expect(screen.queryByRole("button", { name: "Sentence Structure" })).toBeNull();
    view.rerender(<Grade11Unit2Workspace key="reading" kind="reading" />);
    await waitFor(() =>
      expect(
        screen.getByLabelText("Your answer: 1. Have you ever bought anything online?"),
      ).toHaveValue("My answer"),
    );
    expect(screen.getByText("Progress: 2 / 25 answered")).toBeVisible();
  });
  it("provides seven bilingual reading suggestions without grading personal opinions", () => {
    render(<Grade11Unit2Workspace kind="reading" />);
    const b = within(
      screen.getByRole("heading", {
        name: "B. Give a full-sentence answer to each question below.",
      }).parentElement!,
    );
    expect(b.getAllByRole("button", { name: "Check Answer" })).toHaveLength(7);
    expect(b.getAllByRole("button", { name: "Reveal Answer" })).toHaveLength(7);
    expect(b.getAllByRole("button", { name: "Sentence Structure" })).toHaveLength(10);
    for (const id of ["2A-38", "2A-39", "2A-40"]) expect(UNIT2_KEYS[id]).toBeUndefined();
    fireEvent.click(b.getAllByRole("button", { name: "Reveal Answer" })[0]);
    expect(b.getByText(`🇲🇲 ${UNIT2_KEYS["2A-31"].answerMy}`)).toBeVisible();
  });
  it("shows only original listening A/B tasks and speaking C/D prompts", () => {
    const view = render(<Grade11Unit2Workspace key="listening" kind="listening" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(8);
    expect(screen.getAllByRole("img", { name: /Textbook listening picture/ })).toHaveLength(3);
    expect(screen.queryByText(/^C\. In pairs, create/)).toBeNull();
    view.rerender(<Grade11Unit2Workspace key="speaking" kind="speaking" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.queryByText(/^A\. Listen to the three/)).toBeNull();
  });
  it("accepts complete grammar rewrites and supplies Burmese meanings for every key", () => {
    expect(Object.keys(UNIT2_KEYS)).toHaveLength(57);
    for (const key of Object.values(UNIT2_KEYS)) expect(key.answerMy).toMatch(/[\u1000-\u109f]/);
    expect(
      isAnswerMatch(
        "Do you have to carry a mobile phone at all times?",
        UNIT2_KEYS["2C-86"].answer,
      ),
    ).toBe(true);
    expect(
      isAnswerMatch(
        "Did you have to go to the boat club every Sunday last year?",
        UNIT2_KEYS["2C-88"].answer,
      ),
    ).toBe(true);
    expect(
      isAnswerMatch("Does she have to have a computer at home?", UNIT2_KEYS["2C-89"].answer),
    ).toBe(true);
    expect(isAnswerMatch("Do you have to", UNIT2_KEYS["2C-86"].answer)).toBe(false);
  });
  it("covers every original reading question word with a Burmese gloss and a grammar role", () => {
    const blocks = UNIT2_SECTIONS.find((s) => s.code === "2A")!.blocks;
    for (const [id, words] of Object.entries(UNIT2_READING_WORDS)) {
      expect(words.map(([word]) => word)).toEqual(
        blocks.find((b) => b.id === id)!.x.match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g),
      );
      expect(UNIT2_READING_ROLES[id]).toHaveLength(words.length);
      for (const [, my] of words) {
        expect(my).toMatch(/[\u1000-\u109f]/);
        expect(my).not.toMatch(/[A-Za-z]/);
      }
      for (const role of UNIT2_READING_ROLES[id]) expect(UNIT2_ROLE_INFO[role]).toBeDefined();
    }
  });
});
