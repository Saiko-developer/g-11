import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { grade11LessonContext } from "@/lib/grade11LessonContext";
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
        : new Response("unavailable", { status: 503 }),
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
it("processes a fast reply, preserves full text after TTS failure and avoids filler requests", async () => {
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
    await vi.advanceTimersByTimeAsync(701);
  });
  expect(screen.getByRole("button", { name: "ဆရာနဲ့ စကားပြောရန် နှိပ်ပါ" })).toBeInTheDocument();
  expect(screen.getByText("အဖြေစာသားကို ဖတ်မယ်")).toBeVisible();
  expect(vi.mocked(fetch).mock.calls.filter(([url]) => url === "/api/tts")).toHaveLength(2);
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
  expect(screen.getByRole("alert")).toHaveTextContent("တုံ့ပြန်မှု မရတာ ကြာသွားပါပြီ");
  expect(mock.chat.stop).toHaveBeenCalled();
});

it("keeps a long explanation alive while new streamed text arrives", async () => {
  const view = render(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await startAndSpeak();
  mock.chat.status = "streaming";
  for (let i = 1; i <= 4; i++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });
    mock.chat.messages = [
      { role: "user", parts: [] },
      { role: "assistant", parts: [{ type: "text", text: "ဒီစာပိုဒ်အကြောင်း ".repeat(i) }] },
    ];
    view.rerender(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
    expect(screen.queryByRole("alert")).toBeNull();
  }
  expect(mock.chat.stop).not.toHaveBeenCalled();
  // A real stall after progress still times out.
  await act(async () => {
    await vi.advanceTimersByTimeAsync(91000);
  });
  expect(screen.getByRole("alert")).toHaveTextContent("တုံ့ပြန်မှု မရတာ ကြာသွားပါပြီ");
});
it("does not interrupt audio that is still playing beyond 90 seconds after streaming finishes", async () => {
  class TestAudio {
    static last: TestAudio;
    paused = true;
    startedAt = 0;
    onended?: () => void;
    onerror?: () => void;
    onpause?: () => void;
    constructor() {
      TestAudio.last = this;
    }
    get currentTime() {
      return (Date.now() - this.startedAt) / 1000;
    }
    play() {
      this.paused = false;
      this.startedAt = Date.now();
      return Promise.resolve();
    }
    pause() {
      this.paused = true;
      this.onpause?.();
    }
  }
  vi.stubGlobal("Audio", TestAudio);
  URL.createObjectURL = vi.fn(() => "blob:test");
  URL.revokeObjectURL = vi.fn();
  vi.mocked(fetch).mockImplementation(async (url) =>
    url === "/api/transcribe"
      ? Response.json({ text: "စာပိုဒ်တစ်ကို အသေးစိတ်ရှင်းပြပါ" })
      : new Response("audio"),
  );
  const view = render(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await startAndSpeak();
  mock.chat.messages = [
    { role: "user", parts: [] },
    {
      role: "assistant",
      parts: [{ type: "text", text: "ဒီစာပိုဒ်ကို အသေးစိတ် ရှင်းပြပေးပါမယ်။" }],
    },
  ];
  view.rerender(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(6000);
  });
  expect(
    screen.getByRole("button", { name: "ဆရာ ရှင်းပြနေပါတယ်… (နှိပ်ပြီး ရပ်နိုင်)" }),
  ).toBeInTheDocument();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(180000);
  });
  expect(screen.queryByRole("alert")).toBeNull();
  expect(TestAudio.last.paused).toBe(false);
  expect(mock.chat.stop).not.toHaveBeenCalled();
  await act(async () => {
    TestAudio.last.onended?.();
  });
  expect(screen.getByRole("button", { name: "နားထောင်နေပါတယ်… မေးလိုက်ပါ" })).toBeInTheDocument();
});

it("reports a failed transcription request as a service error, not unclear Burmese", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response("Missing LOVABLE_API_KEY", { status: 500 }));
  render(<SayaOwlHome grade={11} lessonContext="Grade 11 Unit 1" />);
  await startAndSpeak();
  expect(screen.getByRole("alert")).not.toHaveTextContent("နားမလည်");
  expect(screen.getByRole("alert")).toHaveTextContent("စာသားပြောင်းသည့်စနစ်");
  expect(mock.chat.sendMessage).not.toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledOnce();
});

it("sends the user's reported Unit 3 Grammar number 3 as a unique textbook reference", async () => {
  vi.mocked(fetch).mockImplementation(async (url) =>
    url === "/api/transcribe"
      ? Response.json({ text: "လေ့ကျင့်ခန်း နံပါတ် ၃ ကို မြန်မာလို ရှင်းပြပါ" })
      : new Response("unavailable", { status: 503 }),
  );
  render(<SayaOwlHome grade={11} lessonContext={grade11LessonContext(3, "grammar").context} />);
  await startAndSpeak();
  const body = mock.chat.sendMessage.mock.calls[0][1].body;
  expect(body.currentQuestion).toContain("source 3C-32");
  expect(body.currentQuestion).toContain("I finished ___________ (write) the assignment");
  expect(vi.mocked(fetch).mock.calls.filter(([url]) => url === "/api/tts")).toHaveLength(0);
});
