import { createFileRoute } from "@tanstack/react-router";

import { sanitizeForSpeech } from "@/lib/sanitizeSpeech";

type TtsBody = {
  text?: string;
  voice?: string;
  speed?: number;
  provider?: "openai";
};

/**
 * Voice pipeline for Sayar Owl.
 *
 * Primary: Google Gemini TTS through the Lovable AI Gateway — it reads
 * Burmese (Pyidaungsu Unicode) naturally, which ElevenLabs/OpenAI voices do not.
 * Fallback: OpenAI gpt-4o-mini-tts through the same gateway.
 */

// Sayar Owl uses a warm, clear, upbeat male voice everywhere.
const GEMINI_VOICES: Record<string, string> = {
  alloy: "Puck",
  sarah: "Puck",
  nova: "Puck",
  shimmer: "Puck",
  echo: "Charon",
  fable: "Puck",
  onyx: "Charon",
};

const DEFAULT_GEMINI_VOICE = "Puck";

function pcmToWav(pcm: Uint8Array, sampleRate = 24000): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const write = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, pcm.byteLength, true);
  const out = new Uint8Array(44 + pcm.byteLength);
  out.set(new Uint8Array(header), 0);
  out.set(pcm, 44);
  return out;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { text, voice, speed, provider } = (await request.json()) as TtsBody;
        if (!text || typeof text !== "string") {
          return new Response("text is required", { status: 400 });
        }

        const lovableKey = process.env.LOVABLE_API_KEY;
        if (!lovableKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        // Strip markdown / tags / emoji, keep Burmese script and English words intact.
        const clean = sanitizeForSpeech(text);
        if (!clean) return new Response("empty text", { status: 400 });

        const input = clean.length > 3500 ? clean.slice(0, 3500) : clean;
        const safeSpeed = Math.min(1.3, Math.max(0.7, speed ?? 1.0));
        const geminiVoice =
          (voice && GEMINI_VOICES[voice.toLowerCase()]) || DEFAULT_GEMINI_VOICE;

        // 1) Gemini TTS — natural Burmese.
        try {
          if (provider === "openai") throw new Error("openai requested");
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: {
              "Lovable-API-Key": lovableKey,
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              model: process.env.LOVABLE_TTS_MODEL?.trim() || "google/gemini-2.5-flash-tts",
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: input,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: geminiVoice } },
                },
              },
            }),
          });

          if (!upstream.ok) {
            const detail = await upstream.text().catch(() => "");
            throw new Error(`Gemini TTS ${upstream.status}: ${detail.slice(0, 300)}`);
          }

          const buf = new Uint8Array(await upstream.arrayBuffer());
          if (buf.byteLength < 1024) throw new Error("Gemini TTS returned no audio");

          // Gateway returns a complete WAV file; pass through. If it ever
          // returns raw PCM, wrap it so the browser can decode it.
          const isWav =
            buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
          const body = isWav ? buf : pcmToWav(buf);

          return new Response(body.slice().buffer as ArrayBuffer, {
            headers: {
              "Content-Type": "audio/wav",
              "Cache-Control": "no-store",
              "X-TTS-Provider": "gemini",
            },
          });
        } catch (err) {
          console.warn(
            "[tts] gemini failed, falling back to openai",
            err instanceof Error ? err.message : err,
          );

          // Male fallback voice to match Sayar Owl.
          const openaiVoice = provider === "openai" && voice ? voice.toLowerCase() : "echo";

          const fallback = await fetch(
            "https://ai.gateway.lovable.dev/v1/audio/speech",
            {
              method: "POST",
              headers: {
                "Lovable-API-Key": lovableKey,
                "Content-Type": "application/json; charset=utf-8",
                Accept: "audio/mpeg",
              },
              body: JSON.stringify({
                model: process.env.LOVABLE_TTS_FALLBACK_MODEL?.trim() || "openai/gpt-4o-mini-tts",
                input,
                voice: openaiVoice,
                response_format: "mp3",
                speed: safeSpeed,
              }),
            },
          ).catch((e) => {
            console.error("[tts] openai fallback network error", e);
            return null;
          });

          if (!fallback || !fallback.ok) {
            const detail = fallback ? await fallback.text().catch(() => "") : "network error";
            console.error("[tts] openai fallback failed", fallback?.status, detail);
            return new Response(detail || "TTS failed", { status: fallback?.status ?? 502 });
          }

          return new Response(fallback.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
              "X-TTS-Provider": "openai",
            },
          });
        }
      },
    },
  },
});
