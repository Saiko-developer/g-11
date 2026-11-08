import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { SayaOwlHome } from "./SayaOwlHome";
type ChatState = {
  messages: { role: string; parts: { type: string; text?: string }[] }[];
  status: string;
  sendMessage: ReturnType<typeof vi.fn>;
  setMessages: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
};
type ChatOptions = { onError: (error: Error) => void };
const mock = vi.hoisted(() => ({
  options: {} as ChatOptions,
  chat: {} as ChatState,
  recorder: {} as { stop: () => void },
}));
vi.mock("@ai-sdk/react", () => ({
  useChat: (options: unknown) => {
    mock.options = options as ChatOptions;
    return mock.chat;
  },
}));
vi.mock("ai", () => ({ DefaultChatTransport: class {} }));
vi.mock("./RequireSignIn", () => ({
  RequireSignIn: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("./AuthGate", () => ({ useAuth: () => ({ session: {} }) }));
vi.mock("./TutorQuotaBar", () => ({ TutorQuotaBar: () => null, tutorFetch: vi.fn() }));
vi.mock("./SayaOwlAvatar", () => ({ SayaOwlAvatar: () => <span>Owl</span> }));
vi.mock("@/hooks/useDraggable", () => ({
  useDraggable: () => ({ ref: null, style: {}, handleProps: {} }),
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/lib/examUpload", () => ({ onExamUpload: () => () => {}, fileToDataUrl: vi.fn() }));
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  mock.chat = {
    messages: [],
    status: "ready",
    sendMessage: vi.fn().mockResolvedValue(undefined),
    setMessages: vi.fn(),
    stop: vi.fn(),
  };
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] }) },
  });
  vi.stubGlobal(
    "MediaRecorder",
    class {
      static isTypeSupported() {
        return true;
      }
      state = "inactive";
      mimeType = "audio/webm";
      onstop?: () => void;
      ondataavailable?: (event: { data: Blob }) => void;
      constructor() {
        mock.recorder = this;
      }
      start() {
        this.state = "recording";
        this.ondataavailable?.({ data: new Blob(["x".repeat(3000)]) });
      }
      stop() {
        this.state = "inactive";
        void this.onstop?.();
      }
    },
  );
  vi.stubGlobal(
    "AudioContext",
    class {
      createAnalyser() {
        return {
          fftSize: 1024,
          getByteTimeDomainData: (data: Uint8Array) => data.fill(Date.now() < 400 ? 128 : 160),
        };
      }
      createBiquadFilter() {
        return { type: "", frequency: { value: 0 }, connect: vi.fn() };
      }
      createMediaStreamSource() {
        return { connect: vi.fn() };
      }
      close() {
        return Promise.resolve();
      }
    },
  );
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url) =>
      url === "/api/transcribe"
        ? { ok: true, json: async () => ({ text: "ဒါလေး ရှင်းပြပေးပါ" }) }
        : { ok: false, status: 503 },
    ),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
async function startAndSpeak() {
  fireEvent.click(screen.getByRole("button", { name: "Talk to Sayar Owl" }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(800);
  });
  await act(async () => {
    mock.recorder.stop();
  });
}
it("processes a fast reply even if the user-only render was skipped, and recovers from TTS failure", async () => {
  const view = render(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await startAndSpeak();
  expect(mock.chat.sendMessage).toHaveBeenCalledOnce();
  expect(mock.chat.sendMessage.mock.calls[0][1].body.grade).toBe(11);
  const transcriptCall = vi.mocked(fetch).mock.calls.find(([url]) => url === "/api/transcribe");
  const transcriptForm = transcriptCall![1]!.body as FormData;
  expect(transcriptForm.get("grade")).toBe("11");
  expect(transcriptForm.get("language")).toBe("my");
  expect(transcriptForm.get("lessonContext")).toBe("Grade 11 Unit 1");
  mock.chat.messages = [
    { role: "user", parts: [] },
    { role: "assistant", parts: [{ type: "text", text: "ဟုတ်ကဲ့။ ရှင်းပြပေးပါမယ်။" }] },
  ];
  view.rerender(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(screen.getByRole("button", { name: "နားထောင်နေပါတယ်… မေးလိုက်ပါ" })).toBeInTheDocument();
  expect(screen.getByText(/ဟုတ်ကဲ့။/)).toBeInTheDocument();
});
it("stops on chat error and lets the student restart with the owl", async () => {
  render(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await startAndSpeak();
  act(() => mock.options.onError(new Error("Service unavailable")));
  expect(screen.getByRole("alert")).toHaveTextContent("Service unavailable");
  expect(mock.chat.stop).toHaveBeenCalled();
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "ဆရာနဲ့ စကားပြောရန် နှိပ်ပါ" }));
  });
  expect(screen.queryByRole("alert")).toBeNull();
});
it("ends a stalled thinking turn with a visible retry message", async () => {
  render(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await startAndSpeak();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(90001);
  });
  expect(screen.getByRole("alert")).toHaveTextContent("စောင့်ချိန်ကြာသွားပါပြီ");
  expect(mock.chat.stop).toHaveBeenCalled();
});
