import { createFileRoute } from "@tanstack/react-router";

/**
 * Speech-to-text for the Saya Owl chatbox (Syllabus Curriculum Explorer only).
 *
 * Uses the Lovable AI Gateway transcription endpoint, which auto-detects the
 * spoken language. We intentionally do NOT pin `language`, so Burmese (my-MM),
 * English (en-US) and mixed code-switching sentences all transcribe correctly.
 */
export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return new Response("Expected multipart/form-data", { status: 400 });
        }

        const file = form.get("file");
        if (!(file instanceof File) || file.size === 0) {
          return new Response("audio file is required", { status: 400 });
        }
        if (file.size > 20 * 1024 * 1024) {
          return new Response("audio file too large", { status: 413 });
        }

        const type = (file.type || "audio/webm").split(";")[0];
        const ext =
          ({
            "audio/webm": "webm",
            "audio/ogg": "ogg",
            "audio/mp4": "mp4",
            "audio/mpeg": "mp3",
            "audio/wav": "wav",
            "audio/x-wav": "wav",
          } as Record<string, string>)[type] ?? "webm";

        const upstreamForm = new FormData();
        upstreamForm.append(
          "model",
          process.env.LOVABLE_TRANSCRIPTION_MODEL?.trim() || "openai/gpt-4o-mini-transcribe",
        );
        upstreamForm.append("file", file, `recording.${ext}`);
        upstreamForm.append("language", "my");
        upstreamForm.append(
          "prompt",
          "Grade 10 Myanmar student speaking Burmese mixed with English textbook words (Unit, Exercise, Lesson, Grammar, Reading, Vocabulary). Transcribe exactly what is said; keep exercise letters and numbers exactly as spoken.",
        );

        const upstream = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: upstreamForm,
          },
        ).catch(() => null);

        if (!upstream) return new Response("Transcription network error", { status: 502 });
        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          return new Response(detail || "Transcription failed", { status: upstream.status });
        }

        const data = (await upstream.json().catch(() => null)) as { text?: string } | null;
        return new Response(JSON.stringify({ text: data?.text ?? "" }), {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
