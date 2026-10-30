import { createFileRoute } from "@tanstack/react-router";

import { generateJson } from "@/lib/ai-json.server";

export type GeneratedQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation_my: string;
};

type Body = { topic?: string; unitTitle?: string; count?: number; ruleMy?: string | null };

export const Route = createFileRoute("/api/exercises")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const topic = (body.topic ?? "").trim();
        if (!topic) return new Response("topic is required", { status: 400 });
        const count = Math.min(Math.max(body.count ?? 8, 4), 12);

        try {
          const questions = await generateJson<GeneratedQuestion[]>({
            system: `You are Saya Owl, a Grade 10 English teacher in Myanmar writing practice exercises for the Myanmar Grade 10 English textbook.
Write ${count} multiple-choice questions on the given grammar or vocabulary topic.
Rules:
- Each question has exactly 4 options and one correct answer that appears verbatim in the options.
- Use vocabulary and contexts familiar to Myanmar students (Yangon, Bagan, thanaka, school life).
- "explanation_my" must be written in natural Burmese (Pyidaungsu Unicode) with strict Burmese SOV word order and correct ending particles. No raw English sentences inside it; single English grammar terms in parentheses are allowed.
- Return a JSON array of objects: [{"prompt": string, "options": [string, string, string, string], "answer": string, "explanation_my": string}]`,
            prompt: `Unit: ${body.unitTitle ?? "Grade 10 English"}
Topic: ${topic}
${body.ruleMy ? `Rule reference (Burmese): ${body.ruleMy}` : ""}`,
          });

          const clean = (Array.isArray(questions) ? questions : [])
            .filter(
              (q) =>
                q &&
                typeof q.prompt === "string" &&
                Array.isArray(q.options) &&
                q.options.length >= 2 &&
                q.options.includes(q.answer),
            )
            .slice(0, count);

          if (clean.length === 0) throw new Error("No usable questions generated");

          return Response.json({ questions: clean });
        } catch (error) {
          console.error("[exercises]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
