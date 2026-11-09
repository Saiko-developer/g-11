import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Grade11PopupVoiceError,
  grade11PopupVoiceMessage,
  grade11PopupVoiceRequest,
} from "./grade11PopupVoice";
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("Grade 11 popup voice requests", () => {
  it("retries one transient speech failure but never duplicates successful output", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("busy", { status: 429 }))
        .mockResolvedValueOnce(new Response("audio")),
    );
    const result = grade11PopupVoiceRequest("speech", "/api/tts", {}, (response) =>
      response.text(),
    );
    await vi.advanceTimersByTimeAsync(701);
    expect(await result).toBe("audio");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it.each([401, 402, 400, 500])(
    "does not retry permanent status %i or label it a comprehension error",
    async (status) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("failed", { status })));
      let error: unknown;
      try {
        await grade11PopupVoiceRequest("transcription", "/api/transcribe", {}, (response) =>
          response.json(),
        );
      } catch (failure) {
        error = failure;
      }
      expect(fetch).toHaveBeenCalledOnce();
      expect(error).toBeInstanceOf(Grade11PopupVoiceError);
      expect(grade11PopupVoiceMessage(error, "transcription")).not.toContain("နားမလည်");
      expect(grade11PopupVoiceMessage(error, "transcription")).not.toContain("အလုပ်များ");
    },
  );
  it("respects long retry-after instead of immediately retrying rate limits", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response("busy", { status: 429, headers: { "Retry-After": "60" } })),
    );
    await expect(
      grade11PopupVoiceRequest("speech", "/api/tts", {}, (r) => r.blob()),
    ).rejects.toMatchObject({ status: 429 });
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("bounds the entire request, including stalled body decoding", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("audio")));
    const result = grade11PopupVoiceRequest(
      "speech",
      "/api/tts",
      {},
      () => new Promise(() => {}),
      100,
    );
    const rejected = expect(result).rejects.toMatchObject({ kind: "timeout" });
    await vi.advanceTimersByTimeAsync(101);
    await rejected;
  });
  it("does not disguise missing provider configuration as busy speech", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Missing LOVABLE_API_KEY", { status: 500 })),
    );
    await expect(
      grade11PopupVoiceRequest("speech", "/api/tts", {}, (r) => r.blob()),
    ).rejects.toMatchObject({ kind: "configuration" });
    expect(fetch).toHaveBeenCalledOnce();
  });
});
it("does not retry a stopped call during rate-limit backoff", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("busy", { status: 429 })));
  const controller = new AbortController();
  const result = grade11PopupVoiceRequest(
    "speech",
    "/api/tts",
    { signal: controller.signal },
    (r) => r.blob(),
  );
  const rejected = expect(result).rejects.toBeInstanceOf(Grade11PopupVoiceError);
  await vi.advanceTimersByTimeAsync(10);
  controller.abort();
  await rejected;
  expect(fetch).toHaveBeenCalledOnce();
});
it("separates malformed transcription data from unclear user speech", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json")));
  await expect(
    grade11PopupVoiceRequest("transcription", "/api/transcribe", {}, (r) => r.json()),
  ).rejects.toMatchObject({ kind: "invalid_response" });
});
