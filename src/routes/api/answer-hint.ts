import { requireUser, untrusted, cleanLine } from "@/lib/api-guard.server";
import { withTone } from "@/lib/tone-rules";
import { createFileRoute } from "@tanstack/react-router";

import { generateJson } from "@/lib/ai-json.server";

const s = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export const Route = createFileRoute("/api/answer-hint")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authed = await requireUser(request);
        if (authed instanceof Response) return authed;
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const question = s(body.question, 600);
        const studentAnswer = s(body.studentAnswer, 600);
        const correct = s(body.correct, 600);
        const instructions = s(body.instructions, 400);
        if (!studentAnswer || !correct) {
          return Response.json({ error: "Missing answer" }, { status: 400 });
        }
        try {
          const raw = await generateJson<{ hint: string }>({
            system: withTone`You are Saya Owl, an expert Myanmar Grade 10 English grammar teacher.
A student's answer is wrong. Write a direct, targeted explanation in clear Burmese (Unicode) with exactly two parts, formatted like this:

**မှားယွင်းနေသည့် အချက်:**
<Quote the exact part of the STUDENT'S OWN answer that is wrong (only words the student wrote), and state precisely what is wrong with it (incomplete noun phrase, wrong tense, missing/extra comma, wrong pronoun, subject-verb agreement, word order, extra words, etc.).>

**သဒ္ဒါစည်းမျဉ်း:**
<Explain in detail the grammar rule that the answer breaks: what the rule is, why it exists, and why the student's answer does not satisfy it. 3-5 sentences. English grammar terms may be kept in English in brackets.>

STRICT ANTI-LEAK RULES (most important):
- NEVER write, quote, translate or hint at any word from the correct answer that the student did not already write.
- NEVER give the corrected sentence, the missing words, a fill-in-the-blank frame, word counts, or "look between the commas" style location clues.
- Explain ONLY the rule. The student must find the answer themselves.
- No games, no questions back to the student, no long encouragement.
Return JSON: {"hint": string}`,
            prompt: `Instructions: ${instructions || "-"}
Question: ${question || "-"}
Student's answer: ${studentAnswer}
Correct answer (SECRET — never reveal): ${correct}`,
          });
          const hint = typeof raw?.hint === "string" ? raw.hint.trim() : "";
          if (!hint) throw new Error("No hint generated");
          return Response.json({ hint });
        } catch (error) {
          console.error("[answer-hint]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
