import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { Grade11Unit1OralNotes } from "./Grade11Unit1OralNotes";
import { UNIT1_GRAMMAR } from "@/lib/grade11Unit1Grammar";
import type { UnitGrammar } from "@/data/grammar/types";
vi.mock("@/components/lesson/ExerciseKit", () => ({ OwlBadge: () => null }));
class TestAudio {
  static all: TestAudio[] = [];
  paused = true;
  src = "";
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    TestAudio.all.push(this);
  }
  play = vi.fn(async () => {
    this.paused = false;
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  finish() {
    this.paused = true;
    this.onended?.();
  }
}
const originalURL = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
beforeEach(() => {
  TestAudio.all = [];
  vi.stubGlobal("Audio", TestAudio);
  URL.createObjectURL = vi.fn(() => "blob:test");
  URL.revokeObjectURL = vi.fn();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("audio")),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  URL.createObjectURL = originalURL.create;
  URL.revokeObjectURL = originalURL.revoke;
});
const currentNote = () => screen.getByRole("region", { name: "Current oral explanation note" });
async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}
it("changes notes on actual playback, not prefetch, and keeps the note during pause and buffering", async () => {
  const section = UNIT1_GRAMMAR.sections[0];
  // A short real cue pair makes playback boundaries deterministic without real provider calls.
  const segments = section.oral
    .segments!.slice(1, 3)
    .map((segment) => ({ ...segment, scriptMy: segment.scriptMy.slice(0, 100) }));
  let resolveSecond: (response: Response) => void = () => {};
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response("first audio"))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSecond = resolve;
        }),
    );
  const grammar: UnitGrammar = {
    ...UNIT1_GRAMMAR,
    sections: [{ ...section, oral: { ...section.oral, segments } }],
  };
  render(<GrammarScriptView grammar={grammar} OralNotes={Grade11Unit1OralNotes} />);
  fireEvent.click(screen.getByRole("button", { name: "Oral Explanation" }));
  await flush();
  expect(currentNote()).toHaveTextContent("I like both the novel and the movie.");
  expect(currentNote()).not.toHaveTextContent("Both Ko Zaw");
  fireEvent.click(screen.getByRole("button", { name: "Pause explanation" }));
  expect(screen.getByRole("button", { name: "Oral Explanation • Paused" })).toBeInTheDocument();
  expect(currentNote()).toHaveTextContent("I like both the novel and the movie.");
  fireEvent.click(screen.getByRole("button", { name: "Play explanation" }));
  await flush();
  await act(async () => {
    TestAudio.all[0].finish();
  });
  expect(currentNote()).toHaveTextContent("I like both the novel and the movie.");
  await act(async () => {
    resolveSecond(new Response("second audio"));
  });
  await flush();
  expect(currentNote()).toHaveTextContent("Both Ko Zaw and Soe Thu are good students.");
  expect(currentNote()).not.toHaveTextContent("I like both the novel and the movie.");
  await act(async () => {
    TestAudio.all[1].finish();
  });
  expect(currentNote()).toHaveTextContent("Both Ko Zaw and Soe Thu are good students.");
});
it("does not start the next audio after oral mode is closed", async () => {
  render(<GrammarScriptView grammar={UNIT1_GRAMMAR} OralNotes={Grade11Unit1OralNotes} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Oral Explanation" })[0]);
  await flush();
  const playing = TestAudio.all[0];
  fireEvent.click(screen.getByRole("button", { name: "Oral Explanation • Playing" }));
  expect(playing.pause).toHaveBeenCalled();
  await act(async () => {
    playing.finish();
  });
  expect(TestAudio.all).toHaveLength(1);
  expect(screen.queryByRole("region", { name: "Current oral explanation note" })).toBeNull();
});
it("keeps the current note when the following clip is already prefetched", async () => {
  const section = UNIT1_GRAMMAR.sections[0];
  const segments = section.oral
    .segments!.slice(1, 3)
    .map((segment) => ({ ...segment, scriptMy: segment.scriptMy.slice(0, 100) }));
  const grammar: UnitGrammar = {
    ...UNIT1_GRAMMAR,
    sections: [{ ...section, oral: { ...section.oral, segments } }],
  };
  render(<GrammarScriptView grammar={grammar} OralNotes={Grade11Unit1OralNotes} />);
  fireEvent.click(screen.getByRole("button", { name: "Oral Explanation" }));
  await flush();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(TestAudio.all).toHaveLength(1);
  expect(currentNote()).toHaveTextContent("I like both the novel and the movie.");
  await act(async () => {
    TestAudio.all[0].finish();
  });
  await flush();
  expect(currentNote()).toHaveTextContent("Both Ko Zaw and Soe Thu are good students.");
});
