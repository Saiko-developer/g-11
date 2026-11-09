import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Grade11GrammarExplanation, Grade11OralPlayer } from "./Grade11GrammarExplanation";
import { GRADE11_ORAL_GRAMMAR } from "@/lib/grade11GrammarOral";
import type { GrammarOralSegment } from "@/data/grammar/types";
vi.mock("./Grade11RequireSignIn", () => ({
  Grade11RequireSignIn: ({ children }: { children: React.ReactNode }) => children,
}));
class TestAudio {
  static all: TestAudio[] = [];
  paused = true;
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
const createURL = URL.createObjectURL;
const revokeURL = URL.revokeObjectURL;
beforeEach(() => {
  TestAudio.all = [];
  vi.stubGlobal("Audio", TestAudio);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("audio")),
  );
  URL.createObjectURL = vi.fn(() => "blob:test");
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  URL.createObjectURL = createURL;
  URL.revokeObjectURL = revokeURL;
});
const cues: GrammarOralSegment[] = [
  {
    titleMy: "နမူနာတစ်",
    scriptMy: "The sun is shining. နေရောင်တောက်ပနေသည်။",
    sentenceEn: "The sun is shining.",
    sentenceMy: "နေရောင်တောက်ပနေသည်။",
    noteMy: "ယခု ဖြစ်နေသည်။",
  },
  {
    titleMy: "နမူနာနှစ်",
    scriptMy: "She can speak four languages. သူမက ဘာသာစကားလေးမျိုး ပြောတတ်သည်။",
    sentenceEn: "She can speak four languages.",
    sentenceMy: "သူမက ဘာသာစကားလေးမျိုး ပြောတတ်သည်။",
    noteMy: "လက်ရှိလုပ်နိုင်စွမ်းပါ။",
  },
];
const note = () => screen.getByRole("region", { name: "Current oral explanation note" });
async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}
it.each(Array.from({ length: 11 }, (_, index) => index + 2))(
  "shows text and oral controls for every Unit %i topic",
  (unit) => {
    render(<Grade11GrammarExplanation unit={unit} />);
    expect(screen.getAllByRole("button", { name: "Oral Explanation" })).toHaveLength(
      GRADE11_ORAL_GRAMMAR[unit].sections.length,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Text Explanation" })[0]);
    expect(screen.getByText(/Quick Card/)).toBeVisible();
    expect(fetch).not.toHaveBeenCalled();
  },
);
it("synchronizes notes to playback and preserves them while paused or buffering", async () => {
  let resolveSecond: (response: Response) => void = () => {};
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response("one"))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSecond = resolve;
        }),
    );
  render(<Grade11OralPlayer segments={cues} formula="example" />);
  await flush();
  expect(note()).toHaveTextContent(cues[0].sentenceEn!);
  expect(note()).not.toHaveTextContent(cues[1].sentenceEn!);
  fireEvent.click(screen.getByRole("button", { name: "Pause explanation" }));
  expect(TestAudio.all[0].paused).toBe(true);
  expect(note()).toHaveTextContent(cues[0].sentenceEn!);
  fireEvent.click(screen.getByRole("button", { name: "Play explanation" }));
  await flush();
  await act(async () => {
    TestAudio.all[0].finish();
  });
  expect(note()).toHaveTextContent(cues[0].sentenceEn!);
  await act(async () => {
    resolveSecond(new Response("two"));
  });
  await flush();
  expect(note()).toHaveTextContent(cues[1].sentenceEn!);
  await act(async () => {
    TestAudio.all[1].finish();
  });
  expect(note()).toHaveTextContent(cues[1].sentenceEn!);
  expect(screen.getByText("အစမှ ပြန်နားထောင်")).toBeVisible();
});
it("keeps prefetched notes hidden and aborts requests on close", async () => {
  const view = render(<Grade11OralPlayer segments={cues} formula="example" />);
  await flush();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(note()).toHaveTextContent(cues[0].sentenceEn!);
  const signals = vi.mocked(fetch).mock.calls.map(([, init]) => init!.signal!);
  view.unmount();
  expect(TestAudio.all[0].pause).toHaveBeenCalled();
  expect(TestAudio.all[0].onended).toBeNull();
  // A completed prefetch has no active request; the playing clip is stopped and its URL released.
  expect(URL.revokeObjectURL).toHaveBeenCalled();
  expect(signals.every(Boolean)).toBe(true);
});
it("prevents two topics from speaking together", async () => {
  render(<Grade11GrammarExplanation unit={2} />);
  const buttons = screen.getAllByRole("button", { name: "Oral Explanation" });
  fireEvent.click(buttons[0]);
  await flush();
  const first = TestAudio.all[0];
  fireEvent.click(buttons[1]);
  await flush();
  expect(first.pause).toHaveBeenCalled();
  expect(screen.getAllByRole("region", { name: "Current oral explanation note" })).toHaveLength(1);
});
it("shows a recoverable error without advancing to a failed audio clip", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response("unavailable", { status: 503 }));
  render(<Grade11OralPlayer segments={cues} formula="example" />);
  await flush();
  expect(screen.getByRole("alert")).toBeVisible();
  expect(TestAudio.all).toHaveLength(0);
  expect(note()).toHaveTextContent(cues[0].sentenceEn!);
  fireEvent.click(screen.getByRole("button", { name: "Play explanation" }));
  await flush();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(TestAudio.all).toHaveLength(1);
});
it("cancels an in-flight prefetch when the oral lesson closes", async () => {
  let pendingSignal: AbortSignal | undefined;
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response("one"))
    .mockImplementationOnce(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          pendingSignal = init!.signal as AbortSignal;
          pendingSignal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
  const view = render(<Grade11OralPlayer segments={cues} formula="example" />);
  await flush();
  expect(pendingSignal?.aborted).toBe(false);
  await act(async () => {
    view.unmount();
  });
  expect(pendingSignal?.aborted).toBe(true);
  expect(TestAudio.all).toHaveLength(1);
});
it("leaves a timed-out request recoverable rather than loading forever", async () => {
  vi.useFakeTimers();
  vi.mocked(fetch).mockImplementation(
    (_url, init) =>
      new Promise((_resolve, reject) => {
        init!.signal!.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      }),
  );
  render(<Grade11OralPlayer segments={cues} formula="example" />);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(30001);
  });
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("button", { name: "Play explanation" })).toBeEnabled();
});
