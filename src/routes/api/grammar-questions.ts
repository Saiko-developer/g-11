import { withTone } from "@/lib/tone-rules";
import { createFileRoute } from "@tanstack/react-router";

import { generateJson } from "@/lib/ai-json.server";

export type GrammarPracticeQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation_my: string;
};

const BATCH_SIZE = 10;
const MAX_BATCHES = 30;

type PostBody = {
  unit?: number;
  sectionId?: string;
  titleEn?: string;
  formulas?: string[];
  rules?: string[];
  examples?: string[];
};

async function admin() {
  const supabaseAdmin: any = (await import("@/integrations/supabase/client.server")).supabaseAdmin;
  return supabaseAdmin as any;
}

export const Route = createFileRoute("/api/grammar-questions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sectionId = new URL(request.url).searchParams.get("sectionId")?.trim();
        if (!sectionId) return Response.json({ error: "sectionId required" }, { status: 400 });
        const db = await admin();
        const { data, error } = await db
          .from("grammar_generated_questions")
          .select("batch, questions")
          .eq("section_id", sectionId)
          .order("batch", { ascending: true });
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ batches: data ?? [] });
      },
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as PostBody;
        const sectionId = (body.sectionId ?? "").trim().slice(0, 120);
        const titleEn = (body.titleEn ?? "").trim().slice(0, 200);
        const unit = Number(body.unit);
        if (!sectionId || !titleEn || !Number.isInteger(unit) || unit < 1 || unit > 12) {
          return Response.json({ error: "Invalid lesson" }, { status: 400 });
        }
        const list = (v: unknown) =>
          Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 8).map((s) => s.slice(0, 300)) : [];

        const db = await admin();
        const { data: existing } = await db
          .from("grammar_generated_questions")
          .select("batch, questions")
          .eq("section_id", sectionId)
          .order("batch", { ascending: true });
        const batches = existing ?? [];
        if (batches.length >= MAX_BATCHES) {
          return Response.json({ error: "Question limit reached for this lesson" }, { status: 429 });
        }
        const previous = batches
          .flatMap((b: any) => (b.questions as GrammarPracticeQuestion[]) ?? [])
          .map((q: any) => q.question)
          .slice(-60);

        try {
          const raw = await generateJson<GrammarPracticeQuestion[]>({
            system: withTone`You are Saya Owl, a Grade 10 English teacher in Myanmar writing grammar practice for the Myanmar Grade 10 English textbook (Unit ${unit}).
Write exactly ${BATCH_SIZE} multiple-choice questions testing ONLY the given grammar lesson, at the same difficulty as the textbook lesson (Grade 10, exam style).
Rules:
- Each question has exactly 4 options and one correct answer that appears verbatim in the options.
- Mix types: fill in the blank, choose the correct sentence, sentence combining/transformation.
- Use contexts familiar to Myanmar students.
- Do not repeat any previously generated question.
- "explanation_my" in natural Burmese (Unicode); English only for example words or grammar terms in parentheses.
- Return a JSON array: [{"question": string, "options": [string,string,string,string], "answer": string, "explanation_my": string}]`,
            prompt: `Lesson: ${titleEn}
Formulas: ${list(body.formulas).join(" | ")}
Golden rules (Burmese): ${list(body.rules).join(" | ")}
Textbook examples: ${list(body.examples).join(" | ")}
Previously generated questions (avoid): ${previous.join(" || ") || "none"}`,
          });
          const clean = (Array.isArray(raw) ? raw : [])
            .filter(
              (q) =>
                q &&
                typeof q.question === "string" &&
                Array.isArray(q.options) &&
                q.options.length >= 2 &&
                q.options.includes(q.answer),
            )
            .slice(0, BATCH_SIZE);
          if (!clean.length) throw new Error("No usable questions generated");

          const batch = (batches.at(-1)?.batch ?? 0) + 1;
          const { error } = await db
            .from("grammar_generated_questions")
            .insert({ unit, section_id: sectionId, batch, questions: clean });
          if (error) throw new Error(error.message);
          return Response.json({ batch, questions: clean });
        } catch (error) {
          console.error("[grammar-questions]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
