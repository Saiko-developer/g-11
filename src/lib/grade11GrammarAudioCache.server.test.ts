import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { webcrypto } from "node:crypto";
import { UNIT1_GRAMMAR } from "./grade11Unit1Grammar";
import { chunkScript } from "./grammarSpeechChunks";
import { sanitizeForSpeech } from "./sanitizeSpeech";

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("crypto", webcrypto);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
const request = new Request("https://school.example/api/tts");
const body = {
  text: chunkScript(sanitizeForSpeech(UNIT1_GRAMMAR.sections[0].oral.segments![0].scriptMy))[0],
  voice: "sarah",
  speed: 1,
};
const audio = () =>
  new Response(new Uint8Array(2048), {
    headers: { "Content-Type": "audio/wav", "X-TTS-Provider": "gemini" },
  });
it("reuses authored clips without calling TTS and invalidates on model change", async () => {
  const { unit1GrammarAudio } = await import("./grade11GrammarAudioCache.server");
  const generate = vi.fn(async () => audio());
  const first = await unit1GrammarAudio(request, body, generate);
  expect(first.headers.get("X-Grade11-Audio-Cache")).toBe("miss");
  expect((await first.arrayBuffer()).byteLength).toBe(2048);
  const next = await unit1GrammarAudio(request, body, generate);
  expect(next.headers.get("X-Grade11-Audio-Cache")).toBe("hit");
  expect((await next.arrayBuffer()).byteLength).toBe(2048);
  expect(generate).toHaveBeenCalledTimes(1);
  vi.stubEnv("LOVABLE_TTS_MODEL", "new-model");
  await unit1GrammarAudio(request, body, generate);
  expect(generate).toHaveBeenCalledTimes(2);
});
it("coalesces simultaneous requests for the same clip", async () => {
  const { unit1GrammarAudio } = await import("./grade11GrammarAudioCache.server");
  let finish!: (value: Response) => void;
  const generate = vi.fn(
    () =>
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
  );
  const one = unit1GrammarAudio(request, body, generate);
  const two = unit1GrammarAudio(request, body, generate);
  await vi.waitFor(() => expect(generate).toHaveBeenCalledTimes(1));
  finish(audio());
  const results = await Promise.all([one, two]);
  expect(
    await Promise.all(results.map(async (result) => (await result.arrayBuffer()).byteLength)),
  ).toEqual([2048, 2048]);
});
it("never caches student text, other voices, errors or fallback speech", async () => {
  const { unit1GrammarAudio } = await import("./grade11GrammarAudioCache.server");
  const generate = vi.fn(async () => audio());
  for (let i = 0; i < 2; i++) {
    await unit1GrammarAudio(request, { ...body, text: "private student message" }, generate);
    await unit1GrammarAudio(request, { ...body, voice: "echo" }, generate);
  }
  expect(generate).toHaveBeenCalledTimes(4);
  const failed = vi.fn(async () => new Response("credits", { status: 402 }));
  await unit1GrammarAudio(request, body, failed);
  await unit1GrammarAudio(request, body, failed);
  expect(failed).toHaveBeenCalledTimes(2);
  const fallback = vi.fn(
    async () => new Response(new Uint8Array(2048), { headers: { "X-TTS-Provider": "openai" } }),
  );
  await unit1GrammarAudio(request, body, fallback);
  await unit1GrammarAudio(request, body, fallback);
  expect(fallback).toHaveBeenCalledTimes(2);
});
it("uses shared edge audio after a worker restart and survives cache failures", async () => {
  const stored = new Map<string, Response>();
  vi.stubGlobal("caches", {
    default: {
      match: async (key: Request) => stored.get(key.url)?.clone(),
      put: async (key: Request, value: Response) => {
        stored.set(key.url, value);
      },
    },
  });
  let module = await import("./grade11GrammarAudioCache.server");
  const generate = vi.fn(async () => audio());
  await module.unit1GrammarAudio(request, body, generate);
  vi.resetModules();
  module = await import("./grade11GrammarAudioCache.server");
  expect(
    (await module.unit1GrammarAudio(request, body, generate)).headers.get("X-Grade11-Audio-Cache"),
  ).toBe("hit");
  expect(generate).toHaveBeenCalledTimes(1);
  vi.resetModules();
  module = await import("./grade11GrammarAudioCache.server");
  vi.stubGlobal("caches", {
    default: {
      match: async () => {
        throw new Error("offline");
      },
      put: async () => {
        throw new Error("full");
      },
    },
  });
  expect((await module.unit1GrammarAudio(request, body, generate)).ok).toBe(true);
});
