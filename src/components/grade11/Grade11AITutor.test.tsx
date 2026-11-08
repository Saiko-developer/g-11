import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { Grade11AITutor } from "./Grade11AITutor";
const mocks = vi.hoisted(() => ({ send: vi.fn(), stop: vi.fn() }));
vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: [],
    sendMessage: mocks.send,
    status: "ready",
    stop: mocks.stop,
    clearError: vi.fn(),
  }),
}));
vi.mock("@/components/AuthGate", () => ({
  useAuth: () => ({ session: { access_token: "test" }, ready: true }),
}));
vi.mock("@/components/TutorQuotaBar", () => ({ TutorQuotaBar: () => null, tutorFetch: vi.fn() }));
vi.mock("@/hooks/use-whisper", () => ({
  useWhisperRecognition: () => ({ supported: false, stop: vi.fn(), listening: false }),
}));
vi.mock("@/hooks/use-voice", () => ({
  useSpeechSynthesis: () => ({ speak: vi.fn(), stop: vi.fn(), speaking: false }),
}));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
describe("AI tools use Grade 10 transport and Grade 11 lesson context", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "supports all six sections of Unit %i without another login",
    (unit) => {
      for (const kind of [
        "reading",
        "vocabulary",
        "grammar",
        "listening",
        "speaking",
        "writing",
      ] as const) {
        const view = render(<Grade11AITutor unit={unit} kind={kind} />);
        expect(screen.queryByRole("button", { name: "Sign in with Google" })).toBeNull();
        fireEvent.change(screen.getByLabelText("ဒီသင်ခန်းစာအကြောင်း မေးပါ"), {
          target: { value: "Exercise A ကို ရှင်းပြပါ။" },
        });
        fireEvent.click(screen.getByRole("button", { name: "မေးမည်" }));
        const request = mocks.send.mock.calls.at(-1)!;
        expect(request[1].body.grade).toBe(11);
        expect(request[1].body.unit).toBe(unit);
        expect(request[1].body.skill).toBe(kind);
        expect(request[1].body.lessonContext).toContain(
          `Grade 11 English · Unit ${unit} · ${kind}`,
        );
        view.unmount();
      }
    },
  );
});
