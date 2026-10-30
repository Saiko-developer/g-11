import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";

import { createLovableGatewayClient, DEFAULT_LOVABLE_CHAT_MODEL } from "@/lib/ai-gateway.server";
import { parseJson } from "@/lib/ai-json.server";
import type { MockExamPaper } from "@/lib/mockExam";

export type GradeItem = {
  section: string;
  number: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  marks: number;
  awarded: number;
  status: "correct" | "partial" | "wrong";
  explanation: string;
};

export type GradeResult = {
  score: number;
  totalMarks: number;
  sections: { id: string; title: string; score: number; marks: number; feedback: string }[];
  /** Every question, in paper order (newer results). */
  items?: GradeItem[];
  mistakes: { question: string; studentAnswer: string; correctAnswer: string; explanation: string }[];
  writingFeedback: string;
  overallFeedback: string;
  unreadable: string;
};

type Body = { paper?: MockExamPaper; images?: string[] };

export const Route = createFileRoute("/api/grade-exam")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Require a signed-in user so the AI endpoint isn't open to the internet.
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.replace(/^Bearer\s+/i, "");
        if (!token) return Response.json({ error: "Please sign in first." }, { status: 401 });
        const authRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
          headers: { Authorization: `Bearer ${token}`, apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "" },
        });
        if (!authRes.ok) return Response.json({ error: "Please sign in again." }, { status: 401 });

        const body = (await request.json()) as Body;
        const images = (body.images ?? []).filter((s) => /^data:image\//.test(s)).slice(0, 6);
        if (!body.paper?.sections?.length) return Response.json({ error: "Missing exam paper" }, { status: 400 });
        if (images.length === 0) return Response.json({ error: "Please add at least one photo." }, { status: 400 });

        const system = `You are Sayar Owl, a kind but STRICT Grade 10 Myanmar English examiner who marks like a real matriculation examiner.
The student wrote answers by hand on paper and uploaded photos (pages in order). Read the handwriting carefully, letter by letter.
Mark strictly against the ANSWER KEY JSON below. Compare the student's text WORD BY WORD with the key answer.

STRICT MARKING RULES:
- Vocabulary / fill-in / MCQ: must match the key exactly (accept only case differences). Wrong word, wrong form (singular vs plural, e.g. "painters" for "painter"), or wrong option = 0.
- Sentence transformation / rewritten sentences: the tested grammar point must be correct, AND the rest of the sentence must be copied accurately. If the grammar point is correct but there is any copying slip — a missing or extra letter, a missing plural "s"/"es" (e.g. "friend" instead of "friends"), a missing/extra/changed word, a spelling mistake — deduct 0.5 mark per item (status "partial") and name the exact slip in the explanation. If the tested grammar point is wrong = 0.
- Short-answer questions (reading Part B): accept the same meaning, but deduct 0.5 for grammar/spelling slips.
- For writing sections (VIII, IX) mark on content, organisation, grammar and vocabulary.
- Never invent answers the student did not write; if something is unreadable or missing, give 0, set studentAnswer to "(မဖြေထား / မဖတ်နိုင်)" and mention it in "unreadable".

OUTPUT: list EVERY question of the paper in "items", in paper order, including correct ones. status = "correct" (full marks), "partial" (some marks), "wrong" (0). For correct items the explanation can be a short praise.
"mistakes" must contain every item that is partial or wrong.
All feedback / explanation text must be in Burmese (Myanmar Unicode), English examples allowed.
Return ONLY JSON: {"score":number,"totalMarks":number,"sections":[{"id":string,"title":string,"score":number,"marks":number,"feedback":string}],"items":[{"section":string,"number":string,"question":string,"studentAnswer":string,"correctAnswer":string,"marks":number,"awarded":number,"status":"correct"|"partial"|"wrong","explanation":string}],"mistakes":[{"question":string,"studentAnswer":string,"correctAnswer":string,"explanation":string}],"writingFeedback":string,"overallFeedback":string,"unreadable":string}
Keep "question" short (first ~12 words of the question). Skip items for writing sections; use writingFeedback for them.

ANSWER KEY:
${JSON.stringify(body.paper).slice(0, 60000)}`;

        try {
          const gateway = createLovableGatewayClient();
          const modelId = process.env.LOVABLE_CHAT_MODEL?.trim() || DEFAULT_LOVABLE_CHAT_MODEL;
          const result = streamText({
            model: gateway.chat(modelId),
            system,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: `Here are my ${images.length} answer page photo(s). Please mark my exam.` },
                  ...images.map((url) => ({ type: "image" as const, image: url })),
                ],
              },
            ],
          });
          let text = "";
          const errs: string[] = [];
          for await (const part of result.fullStream) {
            if (part.type === "text-delta") text += part.text;
            else if (part.type === "error") errs.push(part.error instanceof Error ? part.error.message : String(part.error));
          }
          if (!text.trim()) throw new Error(errs.join("; ") || "Model returned no output");
          const graded = parseJson<GradeResult>(text);
          return Response.json(graded);
        } catch (error) {
          console.error("[grade-exam]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          const friendly =
            status === 429 ? "Too many requests right now — please try again in a minute."
            : status === 402 ? "AI credits have run out. Please tell your teacher."
            : "Sayar Owl could not mark this paper. Please try again with clearer photos.";
          return Response.json({ error: friendly }, { status });
        }
      },
    },
  },
});
