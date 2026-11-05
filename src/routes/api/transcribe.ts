import { requireUser, untrusted, cleanLine } from "@/lib/api-guard.server";
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
        const authed = await requireUser(request);
        if (authed instanceof Response) return authed;
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
        // Speaking Practice sends language "en"; everything else keeps the Burmese default.
        const lang = String(form.get("language") ?? "").toLowerCase() === "en" ? "en" : "my";
        const isSpeaking = String(form.get("context") ?? "") === "speaking";
        // Burmese/mixed speech → Google Gemini (much stronger Myanmar training data);
        // English speaking practice stays on the OpenAI transcriber.
        upstreamForm.append(
          "model",
          process.env.LOVABLE_TRANSCRIPTION_MODEL?.trim() ||
            (lang === "en" ? "openai/gpt-4o-transcribe" : "google/gemini-3.5-transcribe"),
        );
        upstreamForm.append("file", file, `recording.${ext}`);
        // The transcriber rejects "my" as a language code — only pin English;
        // Burmese/mixed speech is auto-detected and guided by the prompt below.
        if (lang === "en") upstreamForm.append("language", "en");
        upstreamForm.append(
          "prompt",
          isSpeaking
            ? "A Grade 10 Myanmar student practising spoken English in a friendly conversation. Transcribe exactly what is said in English, with correct spelling and punctuation. Do not translate or add words."
            : "The speaker uses the Burmese (Myanmar) language; write Burmese in Myanmar Unicode script. Grade 10 Myanmar student speaking Burmese mixed with English textbook words (Unit, Exercise, Lesson, Grammar, Reading, Vocabulary). Transcribe exactly what is said; keep exercise letters and numbers exactly as spoken. Common English words the student says: Lesson, Paragraph, Passage, Sentence, Question, Answer, Tense, Present Perfect, Past Simple, Exercise A, Exercise B, Exercise C, blank, option, meaning, translate, explain, vocabulary, poem, reading, writing, listening, speaking. Write those English words in English letters. Typical Burmese phrases: ဆရာ, ဒါလေး ရှင်းပြပေးပါ, ဘာအဓိပ္ပာယ်လဲ, ဘယ်လိုဖြေရမလဲ, အဖြေမှန်လား, နားမလည်လို့ပါ, ဒီမေးခွန်းက, သဒ္ဒါ, စာကြောင်း, ဝါကျ, ဘာသာပြန်ပေးပါ, ဥပမာ ပေးပါ. Use standard Myanmar Unicode spelling (not Zawgyi). Do not translate, summarise or add words; if the audio is silent or unclear, return empty text.",
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
