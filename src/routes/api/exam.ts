import { createFileRoute } from "@tanstack/react-router";

import { generateJson } from "@/lib/ai-json.server";

type Body = { text?: string; units?: string[]; topics?: string[]; count?: number };

export type ExamQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation_my: string;
};

/**
 * Builds an exam paper.
 * - With `text`: Saya Owl reads a student's uploaded school exam and rebuilds it
 *   as practice questions with Burmese explanations.
 * - Without `text`: Saya Owl writes a monthly revision exam from the given topics.
 */
export const Route = createFileRoute("/api/exam")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const count = Math.min(Math.max(body.count ?? 15, 5), 25);
        const source = (body.text ?? "").slice(0, 12000).trim();

        const system = `You are Saya Owl, a Grade 10 English teacher in Myanmar building exam practice.
Rules:
- Produce exactly ${count} multiple-choice questions, each with 4 options and one correct answer copied verbatim into "answer".
- "explanation_my" is written in natural Burmese (Pyidaungsu Unicode) using strict Burmese SOV order with proper ending particles. Never paste raw English sentences into it; single English grammar terms in parentheses are fine.
- Return JSON: {"title": string, "questions": [{"prompt": string, "options": [string,string,string,string], "answer": string, "explanation_my": string}]}`;

        const prompt = source
          ? `The student uploaded this outside-school exam paper. Rebuild it as answerable multiple-choice practice covering the same grammar and vocabulary it tests.\n\n---\n${source}\n---`
          : `Write a monthly revision exam covering these Grade 10 units and topics:\n${(body.units ?? []).join(", ")}\nTopics: ${(body.topics ?? []).join("; ")}`;

        try {
          const data = await generateJson<{ title?: string; questions?: ExamQuestion[] }>({
            system,
            prompt,
          });
          const questions = (data.questions ?? []).filter(
            (q) =>
              q &&
              typeof q.prompt === "string" &&
              Array.isArray(q.options) &&
              q.options.includes(q.answer),
          );
          if (questions.length === 0) throw new Error("No usable questions generated");
          return Response.json({ title: data.title ?? "Saya Owl Exam", questions });
        } catch (error) {
          console.error("[exam]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
