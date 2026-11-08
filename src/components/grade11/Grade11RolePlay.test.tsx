import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Grade11RolePlay } from "./Grade11RolePlay";
const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  refreshSession: vi.fn(),
  rpc: vi.fn(),
  speak: vi.fn(),
  stopVoice: vi.fn(),
  startMic: vi.fn(),
  stopMic: vi.fn(),
  finishVoice: () => {},
  callbacks: null as null | { onFinal: (text: string) => void; onSilence: () => void },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getSession: mocks.getSession, refreshSession: mocks.refreshSession },
    rpc: mocks.rpc,
  },
}));
vi.mock("@/components/RequireSignIn", () => ({ signInWithGoogle: vi.fn() }));
vi.mock("@/hooks/use-whisper", () => ({
  useWhisperRecognition: (callbacks: typeof mocks.callbacks) => {
    mocks.callbacks = callbacks;
    return {
      supported: true,
      listening: false,
      start: mocks.startMic,
      stop: mocks.stopMic,
      isCapturing: () => false,
    };
  },
}));
vi.mock("@/hooks/use-voice", async () => {
  const { useState } = await import("react");
  return {
    useSpeechSynthesis: () => {
      const [speaking, setSpeaking] = useState(false);
      mocks.finishVoice = () => setSpeaking(false);
      mocks.speak.mockImplementation(async () => {
        setSpeaking(true);
      });
      return { speaking, speak: mocks.speak, stop: mocks.stopVoice };
    },
  };
});
const session = "1bb5ec00-a69a-4f0e-a5d6-607ca4ab4177";
const reply = (text = "Where would you like to travel?") =>
  Response.json({
    session,
    reply: text,
    replyMy: "ဘယ်ကို ခရီးသွားချင်ပါသလဲ။",
    hints: ["I would like to visit Bagan."],
    scenario: "Planning a trip",
    emotion: "curious",
  });
const start = () => fireEvent.click(screen.getByRole("button", { name: "စကားပြော စတင်မည်" }));
const typedMode = () => fireEvent.click(screen.getByRole("checkbox"));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ data: { session: { access_token: "test-token" } } });
  mocks.refreshSession.mockResolvedValue({ data: { session: null }, error: new Error("expired") });
  mocks.rpc.mockResolvedValue({ data: { used: 0, limit: 2, unlimited: false } });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async () => reply()),
  );
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] }) },
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Grade 11 AI speaking lifecycle", () => {
  it("uses Grade 11 context and the existing session for typed turns and final feedback", async () => {
    render(<Grade11RolePlay unit={5} />);
    typedMode();
    start();
    await screen.findByLabelText("Your AI conversation reply");
    expect(mocks.speak).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "/api/g11-roleplay",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(new Headers(vi.mocked(fetch).mock.calls[0][1]!.headers).get("authorization")).toBe(
      "Bearer test-token",
    );
    const first = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(first.unit).toBe(5);
    expect(first.unitTitle).toContain("Travel");
    fireEvent.change(screen.getByLabelText("Your AI conversation reply"), {
      target: { value: "I would like to visit Bagan." },
    });
    fireEvent.click(screen.getByRole("button", { name: "ပို့မည်" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    const next = JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string);
    expect(next.session).toBe(session);
    expect(next.turns.at(-1).text).toBe("I would like to visit Bagan.");
    await screen.findByLabelText("Your AI conversation reply");
    vi.mocked(fetch).mockResolvedValueOnce(
      Response.json({ feedbackMy: "အတွေးကို ရှင်းလင်းစွာ ပြောနိုင်ပါတယ်။" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "ရပ်မည်" }));
    await screen.findByText("အတွေးကို ရှင်းလင်းစွာ ပြောနိုင်ပါတယ်။");
    expect(JSON.parse(vi.mocked(fetch).mock.calls[2][1]!.body as string).finish).toBe(true);
  });
  it("shows AI captions, then automatically opens the mic and sends recognized speech", async () => {
    render(<Grade11RolePlay unit={7} />);
    start();
    await screen.findAllByText("Where would you like to travel?");
    expect(mocks.speak).toHaveBeenCalled();
    act(() => mocks.finishVoice());
    await waitFor(() => expect(mocks.startMic).toHaveBeenCalled());
    act(() => {
      mocks.callbacks!.onFinal("I enjoy swimming.");
    });
    expect(screen.getByLabelText("Your AI conversation reply")).toHaveValue("I enjoy swimming.");
    act(() => mocks.callbacks!.onSilence());
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string).turns.at(-1).text).toBe(
      "I enjoy swimming.",
    );
  });
  it("handles exhausted credits and lets the student retry", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 402 }));
    render(<Grade11RolePlay unit={1} />);
    typedMode();
    start();
    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: "စကားပြော စတင်မည်" })).toBeEnabled();
  });
  it("aborts in-flight requests and releases voice/mic on unmount", async () => {
    let resolve!: (value: Response) => void;
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const view = render(<Grade11RolePlay unit={12} />);
    typedMode();
    start();
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const signal = vi.mocked(fetch).mock.calls[0][1]!.signal!;
    view.unmount();
    expect(signal.aborted).toBe(true);
    expect(mocks.stopMic).toHaveBeenCalled();
    expect(mocks.stopVoice).toHaveBeenCalled();
    await act(async () => {
      resolve(reply("Stale reply"));
    });
    expect(mocks.speak).not.toHaveBeenCalled();
  });
  it("does not open a paid session when microphone permission is denied", async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(new Error("denied"));
    render(<Grade11RolePlay unit={2} />);
    start();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "စကားပြော စတင်မည်" })).toBeVisible(),
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});

it("does not ask a signed-in student to login again for a speaking service error", async () => {
  vi.mocked(fetch).mockResolvedValue(
    Response.json(
      { error: "speaking_service_unavailable", message: "စကားပြောဝန်ဆောင်မှုကို ချိတ်ဆက်မရပါ။" },
      { status: 503 },
    ),
  );
  render(<Grade11RolePlay unit={5} />);
  typedMode();
  start();
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "စကားပြောဝန်ဆောင်မှုကို ချိတ်ဆက်မရပါ။",
  );
  expect(screen.queryByRole("button", { name: "Login" })).toBeNull();
  expect(mocks.refreshSession).not.toHaveBeenCalled();
});
it("offers login only after a real auth rejection and unsuccessful token refresh", async () => {
  vi.mocked(fetch).mockResolvedValue(Response.json({ error: "signin" }, { status: 401 }));
  render(<Grade11RolePlay unit={5} />);
  typedMode();
  start();
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "Login" })).toBeVisible();
  expect(mocks.refreshSession).toHaveBeenCalledOnce();
});
it("continues to the student's turn when speech playback fails before reporting speaking=true", async () => {
  mocks.speak.mockImplementationOnce(async () => {
    throw new Error("audio unavailable");
  });
  render(<Grade11RolePlay unit={5} />);
  start();
  await screen.findByLabelText("Your AI conversation reply");
  expect(mocks.startMic).toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledOnce();
});
