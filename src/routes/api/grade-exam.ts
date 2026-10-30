import { createFileRoute } from "@tanstack/react-router";
import { gradePaper } from "@/lib/grade-paper.server";
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

        try {
          const graded = await gradePaper(body.paper, images);
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
