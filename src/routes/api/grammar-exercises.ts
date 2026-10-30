import { createFileRoute } from "@tanstack/react-router";

import { generateJson } from "@/lib/ai-json.server";

type Item = { text: string; translation: string; answer: string };

const s = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export const Route = createFileRoute("/api/grammar-exercises")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const title = s(body.title, 200);
        const instructions = s(body.instructions, 600);
        const samples = (Array.isArray(body.samples) ? body.samples : [])
          .slice(0, 8)
          .map((x: any) => ({ text: s(x?.text, 400), answer: s(x?.answer, 400) }))
          .filter((x) => x.text);
        const avoid = (Array.isArray(body.avoid) ? body.avoid : [])
          .slice(-40)
          .map((x) => s(x, 200))
          .filter(Boolean);
        if (!title || !samples.length) {
          return Response.json({ error: "Invalid exercise" }, { status: 400 });
        }
        try {
          const raw = await generateJson<Item[]>({
            system: `You are Saya Owl, a Myanmar Grade 10 English teacher. Write exactly 10 NEW practice items for the textbook grammar exercise below.
Copy the exact task type, format, sentence length and difficulty of the real textbook items. Do not invent a different kind of task, do not add explanations or lessons.
Each item: "text" (the question, same style as the samples), "translation" (natural Burmese Unicode translation of the question), "answer" (the correct answer in the same style as the sample answers).
Return a JSON array: [{"text": string, "translation": string, "answer": string}]`,
            prompt: `Exercise: ${title}
Instructions: ${instructions}
Real textbook items:
${samples.map((x, i) => `${i + 1}. ${x.text}${x.answer ? `  => ${x.answer}` : ""}`).join("\n")}
Do not repeat: ${avoid.join(" || ") || "none"}`,
          });
          const items = (Array.isArray(raw) ? raw : [])
            .filter((q) => q && typeof q.text === "string" && typeof q.answer === "string")
            .slice(0, 10)
            .map((q) => ({
              text: q.text,
              translation: typeof q.translation === "string" ? q.translation : "",
              answer: q.answer,
            }));
          if (!items.length) throw new Error("No usable items generated");
          return Response.json({ items });
        } catch (error) {
          console.error("[grammar-exercises]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
