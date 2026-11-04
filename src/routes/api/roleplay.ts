import { createFileRoute } from "@tanstack/react-router";
import { generateJson } from "@/lib/ai-json.server";
import { consumeTutorQuota } from "@/lib/tutor-quota.server";

type Turn = { role: "ai" | "student"; text: string };
type Body = { unit?: number; unitTitle?: string; turns?: Turn[]; finish?: boolean };

export type RoleplayReply = {
  partner?: string;
  scenario?: string;
  scenarioMy?: string;
  reply: string;
  replyMy: string;
  hints: string[];
  tip?: string;
};
export type RoleplaySummary = { summaryMy: string; good: string[]; improve: string[] };

const SYSTEM = `You are Saya Owl, a friendly, encouraging owl English tutor, running a live spoken English role-play for a Myanmar Grade 10 student.
Invent a realistic everyday scenario that fits the unit theme. You are ALWAYS Saya Owl; never use any other name or character (no Teacher Daw Nu or others).
Rules: speak simple, clear Grade 10 English; 1-2 short sentences per turn (under 25 words); always end with a question so the student keeps talking.
The student's text comes from speech recognition, so ignore small spelling oddities and respond to the meaning.
Never write markdown or emoji. Keep JSON short.`;

export const Route = createFileRoute("/api/roleplay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const blocked = await consumeTutorQuota(request);
        if (blocked) return blocked;
        const body = (await request.json()) as Body;
        const turns = Array.isArray(body.turns) ? body.turns.slice(-20) : [];
        const theme = `Unit ${body.unit ?? ""}: ${body.unitTitle ?? "Grade 10 English"}`;
        const history = turns.map((t) => `${t.role === "ai" ? "PARTNER" : "STUDENT"}: ${t.text}`).join("\n");
        try {
          if (body.finish) {
            const out = await generateJson<RoleplaySummary>({
              system: SYSTEM,
              prompt: `Theme: ${theme}\nConversation:\n${history}\n\nThe call ended. Give feedback on the STUDENT lines only as JSON {"summaryMy": "2 sentence encouraging summary in Burmese", "good": ["up to 3 things done well, Burmese"], "improve": ["up to 3 corrections: quote the student's phrase -> better English, with a short Burmese reason"]}.`,
            });
            return Response.json(out);
          }
          const first = turns.length === 0;
          const out = await generateJson<RoleplayReply>({
            system: SYSTEM,
            prompt: first
              ? `Theme: ${theme}\nStart a new role-play. JSON {"partner": "Saya Owl", "scenario": "one English sentence describing the situation and who the student is", "scenarioMy": "same in Burmese", "reply": "your opening line", "replyMy": "Burmese translation", "hints": ["2 short sample answers the student could say"]}.`
              : `Theme: ${theme}\nConversation so far:\n${history}\n\nContinue as the partner. JSON {"reply": "your next line", "replyMy": "Burmese translation", "hints": ["2 short sample answers"], "tip": "if the student's last line had a clear mistake, one short Burmese correction tip, otherwise empty string"}.`,
          });
          return Response.json(out);
        } catch (err) {
          console.error("[roleplay]", err);
          const msg = err instanceof Error ? err.message : "";
          const status = msg.includes("402") ? 402 : msg.includes("429") ? 429 : 500;
          return new Response("Role-play failed", { status });
        }
      },
    },
  },
});
