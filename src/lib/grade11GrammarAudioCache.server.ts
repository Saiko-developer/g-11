import { UNIT1_GRAMMAR } from "./grade11Unit1Grammar";
import { chunkScript } from "./grammarSpeechChunks";
import { sanitizeForSpeech } from "./sanitizeSpeech";

// Only public, authored Unit 1 clips may enter this shared cache. Never cache chat.
const authored = new Set(
  UNIT1_GRAMMAR.sections.flatMap((section) =>
    (section.oral.segments ?? []).flatMap((segment) =>
      chunkScript(sanitizeForSpeech(segment.scriptMy)),
    ),
  ),
);
const pending = new Map<string, Promise<Response>>();
const memory = new Map<string, { response: Response; bytes: number }>();
let memoryBytes = 0;
const MAX_BYTES = 24 * 1024 * 1024;
const MAX_CLIP = 8 * 1024 * 1024;
type EdgeCache = {
  match(key: Request): Promise<Response | undefined>;
  put(key: Request, value: Response): Promise<void>;
};
const bounded = <T>(task: Promise<T>, fallback: T): Promise<T> =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), 500);
    task.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });

/** Auth is checked by /api/tts before entering here, including on cache hits. */
export async function unit1GrammarAudio(
  request: Request,
  body: { text: string; voice?: string; speed?: number; provider?: string },
  generate: () => Promise<Response>,
): Promise<Response> {
  if (
    body.voice !== "sarah" ||
    (body.speed ?? 1) !== 1 ||
    body.provider ||
    !authored.has(body.text)
  )
    return generate();
  // Changing either model or authored text gives a fresh key. Bump v1 for voice/pipeline changes.
  const identity = JSON.stringify([
    "g11-unit1-v1",
    body.text,
    "Puck",
    "echo",
    1,
    process.env.LOVABLE_TTS_MODEL || "google/gemini-2.5-flash-tts",
    process.env.LOVABLE_TTS_FALLBACK_MODEL || "openai/gpt-4o-mini-tts",
  ]);
  let hash: string;
  try {
    hash = Array.from(
      new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(identity))),
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return generate();
  }
  const key = new Request(new URL(`/__grade11-grammar-audio/${hash}`, request.url));
  const edge = (globalThis as typeof globalThis & { caches?: { default?: EdgeCache } }).caches
    ?.default;
  const hit =
    memory.get(hash)?.response ??
    (edge
      ? await bounded(
          Promise.resolve().then(() => edge.match(key)),
          undefined,
        )
      : undefined);
  const report = (response: Response, result: string) => {
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-store"); // authenticated response; edge copy is stored separately
    headers.set("X-Grade11-Audio-Cache", result);
    console.info("[grade11-grammar-audio]", result, hash.slice(0, 12));
    return new Response(response.body, { status: response.status, headers });
  };
  if (hit) return report(hit.clone(), "hit");
  const existing = pending.get(hash);
  if (existing) return report((await existing).clone(), "shared");
  const job = (async () => {
    const response = await generate();
    // Do not preserve temporary fallback voices or any provider failure.
    if (!response.ok || response.headers.get("X-TTS-Provider") !== "gemini") return response;
    const bytes = await response.arrayBuffer();
    const saved = new Response(bytes, { status: response.status, headers: response.headers });
    if (bytes.byteLength < 1024 || bytes.byteLength > MAX_CLIP) return saved;
    while (memoryBytes + bytes.byteLength > MAX_BYTES && memory.size) {
      const oldest = memory.keys().next().value!;
      memoryBytes -= memory.get(oldest)!.bytes;
      memory.delete(oldest);
    }
    memory.set(hash, { response: saved.clone(), bytes: bytes.byteLength });
    memoryBytes += bytes.byteLength;
    if (edge) {
      const headers = new Headers(saved.headers);
      headers.set("Cache-Control", "public, max-age=2592000");
      await bounded(
        Promise.resolve().then(() => edge.put(key, new Response(bytes.slice(0), { headers }))),
        undefined,
      );
    }
    return saved;
  })();
  pending.set(hash, job);
  try {
    return report((await job).clone(), "miss");
  } finally {
    pending.delete(hash);
  }
}
