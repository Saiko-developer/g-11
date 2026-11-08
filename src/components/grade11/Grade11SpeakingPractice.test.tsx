import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Grade11SpeakingPractice } from "./Grade11SpeakingPractice";
import { Grade11TextLesson } from "./Grade11TextLesson";
import { GRADE11_SPEAKING_LINES } from "@/data/grade11/speakingPractice";

const recorder = vi.hoisted(() => ({
  callbacks: null as null | { onFinal: (text: string) => void; onSilence: () => void },
  start: vi.fn(),
  stop: vi.fn(),
}));
vi.mock("@/hooks/use-voice", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useSpeechRecognition: (callbacks: typeof recorder.callbacks) => {
    recorder.callbacks = callbacks;
    return { supported: true, listening: true, start: recorder.start, stop: recorder.stop };
  },
}));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
const synth = { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [{ lang: "en-US" }] };
beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      text: string;
      constructor(text: string) {
        this.text = text;
      }
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const enterPractice = () => {
  fireEvent.click(screen.getByRole("button", { name: "🎯 လိုက်ဆို" }));
  fireEvent.click(screen.getByRole("button", { name: "📖 စာအုပ်စကားရပ်" }));
};

describe("Grade 11 speaking source practice", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "offers source-based practice for Unit %i",
    (unit) => {
      render(
        <Grade11SpeakingPractice unit={unit}>
          <p>Original lesson</p>
        </Grade11SpeakingPractice>,
      );
      expect(screen.getByText("Original lesson")).toBeVisible();
      enterPractice();
      expect(screen.getByRole("region", { name: "Grade 11 shadowing practice" })).toBeVisible();
      expect(screen.queryByText("Original lesson")).toBeNull();
      expect(screen.getByText(/မူရင်းအသံဖိုင် မဟုတ်ပါ/)).toBeVisible();
      expect(screen.getByRole("button", { name: /AI စကားပြော/ })).toBeVisible();
    },
  );

  it("plays only the selected Grade 11 text through browser speech", () => {
    render(<Grade11SpeakingPractice unit={1}>Original lesson</Grade11SpeakingPractice>);
    enterPractice();
    fireEvent.click(screen.getByRole("button", { name: "0.75x" }));
    fireEvent.click(screen.getByRole("button", { name: "စက်အသံ နားထောင်မည်" }));
    expect(synth.speak).toHaveBeenCalledWith(
      expect.objectContaining({ text: GRADE11_SPEAKING_LINES[1][0].en, lang: "en-US", rate: 0.75 }),
    );
    fireEvent.click(screen.getByRole("button", { name: "📖 သင်ခန်းစာ" }));
    expect(synth.cancel).toHaveBeenCalled();
  });

  it("persists drafts and completed results across tabs and refresh-like remounts", () => {
    const view = render(
      <Grade11SpeakingPractice unit={3}>Original lesson</Grade11SpeakingPractice>,
    );
    enterPractice();
    const text = GRADE11_SPEAKING_LINES[3][0].en;
    fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: "စာသားကိုက်ညီမှု စစ်မည်" }));
    expect(screen.getByRole("status")).toHaveTextContent("100%");
    fireEvent.click(screen.getByRole("button", { name: "📖 သင်ခန်းစာ" }));
    enterPractice();
    expect(screen.getByRole("textbox")).toHaveValue(text);
    expect(screen.getByRole("status")).toHaveTextContent("100%");
    view.unmount();
    render(<Grade11SpeakingPractice unit={3}>Original lesson</Grade11SpeakingPractice>);
    enterPractice();
    expect(screen.getByRole("status")).toHaveTextContent("100%");
  });

  it("handles speech recognition results and saves transcripts without an AI request", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    render(<Grade11SpeakingPractice unit={3}>Original lesson</Grade11SpeakingPractice>);
    enterPractice();
    fireEvent.click(screen.getByRole("button", { name: "🎤 လိုက်ဆိုမည်" }));
    expect(recorder.start).toHaveBeenCalled();
    act(() => {
      recorder.callbacks!.onFinal("I agree with you.");
      recorder.callbacks!.onSilence();
    });
    expect(screen.getByRole("textbox")).toHaveValue("I agree with you.");
    expect(screen.getByRole("status")).toHaveTextContent("100%");
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockRestore();
  });

  it("keeps actual textbook speaking drafts when changing practice mode", () => {
    render(<Grade11TextLesson unit={8} kind="speaking" />);
    const question = "Your answer: Which character do you like more?";
    fireEvent.change(screen.getByLabelText(question), { target: { value: "I like Sue." } });
    enterPractice();
    fireEvent.click(screen.getByRole("button", { name: "📖 သင်ခန်းစာ" }));
    expect(screen.getByLabelText(question)).toHaveValue("I like Sue.");
  });

  it("survives malformed saved practice data", () => {
    sessionStorage.setItem("grade11:speaking:1:shadow:v1", "broken");
    render(<Grade11SpeakingPractice unit={1}>Original lesson</Grade11SpeakingPractice>);
    enterPractice();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});
