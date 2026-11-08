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

vi.mock("@/components/AuthGate", () => ({ useAuth: () => ({ session: null, ready: true }) }));
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
    fireEvent.change(
      within(document.querySelector('[data-exercise="2A-16"]') as HTMLElement).getAllByRole(
        "combobox",
      )[0],
      {
        target: { value: "Advantage" },
      },
    );
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
  it("checks reading B semantically while retaining sentence structures", () => {
    render(<Grade11Unit2Workspace kind="reading" />);
    const b = within(document.querySelector('[data-exercise="2A-30"]') as HTMLElement);
    expect(b.queryByRole("button", { name: "Check Answer" })).toBeNull();
    expect(b.queryByRole("button", { name: "Reveal Answer" })).toBeNull();
    expect(b.getAllByRole("button", { name: /check with AI/i })).toHaveLength(1);
    expect(b.getAllByRole("button", { name: "Sentence Structure" })).toHaveLength(10);
    for (const id of ["2A-38", "2A-39", "2A-40"]) expect(UNIT2_KEYS[id]).toBeUndefined();
  });
  it("shows only original listening A/B tasks and speaking C/D prompts", () => {
    const view = render(<Grade11Unit2Workspace key="listening" kind="listening" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(5);
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
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
