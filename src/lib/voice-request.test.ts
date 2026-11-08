import { afterEach, describe, expect, it, vi } from "vitest";
import { voiceRequest } from "./voice-request";
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("bounded voice requests", () => {
  it("aborts a stalled network request", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal;
    vi.stubGlobal(
      "fetch",
      vi.fn((_url, init) => {
        signal = init.signal;
        return new Promise(() => {});
      }),
    );
    const result = voiceRequest("/api/transcribe", {}, (r) => r.json(), 100);
    const rejected = expect(result).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(101);
    await rejected;
    expect(signal!.aborted).toBe(true);
  });
  it("also bounds response-body decoding", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const result = voiceRequest("/api/tts", {}, () => new Promise(() => {}), 100);
    const rejected = expect(result).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(101);
    await rejected;
  });
  it("rejects upstream failures and returns successful decoded data", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 503 })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ text: "ရှင်းပြပေးပါ" }) }),
    );
    await expect(voiceRequest("/api/transcribe", {}, (r) => r.json())).rejects.toThrow("503");
    await expect(voiceRequest("/api/transcribe", {}, (r) => r.json())).resolves.toEqual({
      text: "ရှင်းပြပေးပါ",
    });
  });
});
