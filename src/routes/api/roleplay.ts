import { createFileRoute } from "@tanstack/react-router";
import { generateJson } from "@/lib/ai-json.server";
import { chargeSpeakingTurn, startSpeakingSession } from "@/lib/speaking-session.server";

type Turn = { role: "ai" | "student"; text: string };
type Body = { unit?: number; unitTitle?: string; turns?: Turn[]; finish?: boolean; session?: string; goodbye?: boolean };

export type RoleplayReply = {
  partner?: string;
  scenario?: string;
  scenarioMy?: string;
  reply: string;
  replyMy: string;
  hints: string[];
  tip?: string;
  emotion?: string;
};
export type RoleplaySummary = { feedbackMy: string };

const SYSTEM = `You are Saya Owl, a friendly, encouraging owl English tutor, running a live spoken English role-play for a Myanmar Grade 10 student.
Invent a realistic everyday scenario that fits the unit theme. You are ALWAYS Saya Owl; never use any other name or character (no Teacher Daw Nu or others).
Rules: speak simple, clear Grade 10 English; 1-2 short sentences per turn (under 25 words); always end with a question so the student keeps talking.
The student's text comes from speech recognition, so ignore small spelling oddities and respond to the meaning.
Sound like a real, warm human friend on a call, not a robot: react naturally to what the student says with short spoken expressions ("Oh wow!", "Haha, really?", "Hmm, interesting...", "Don't worry, take your time.").
Choose your own emotion each turn to fit the moment: "happy", "excited", "curious", "encouraging" (when the student struggles or makes mistakes), or "calm". Never ask the student to pick a mood.
Never write markdown or emoji. Keep JSON short.`;

export const Route = createFileRoute("/api/roleplay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const turns = Array.isArray(body.turns) ? body.turns.slice(-20) : [];
        let session = typeof body.session === "string" ? body.session : "";
        if (body.finish) {
          if (!session) return Response.json({ error: "signin" }, { status: 401 });
          const b = await chargeSpeakingTurn(request, session);
          if (b && b.status !== 402) return b; // feedback is free even if credits just ran out
        } else if (!session) {
          const s = await startSpeakingSession(request, Number(body.unit));
          if (s instanceof Response) return s;
          session = s.session;
        } else {
          const b = await chargeSpeakingTurn(request, session);
          if (b) return b;
        }
        const theme = `Unit ${body.unit ?? ""}: ${body.unitTitle ?? "Grade 10 English"}`;
        const history = turns.map((t) => `${t.role === "ai" ? "PARTNER" : "STUDENT"}: ${t.text}`).join("\n");
        try {
          if (body.finish) {
            const out = await generateJson<RoleplaySummary>({
              system: SYSTEM,
              prompt: `Theme: ${theme}\nConversation:\n${history}\n\nThe call ended. Give short feedback on the STUDENT lines only as JSON {"feedbackMy": "2-3 warm sentences in Burmese: one thing done well and one thing to improve next time"}.`,
            });
            return Response.json(out);
          }
          const first = turns.length === 0;
          const out = await generateJson<RoleplayReply>({
            system: SYSTEM,
            prompt: body.goodbye
              ? `Theme: ${theme}\nConversation so far:\n${history}\n\nThe student has gone quiet, so end the call now. JSON {"reply": "one short warm goodbye line, no question", "emotion": "calm", "replyMy": "Burmese translation", "hints": []}.`
              : first
              ? `Theme: ${theme}\nStart a new role-play. JSON {"partner": "Saya Owl", "scenario": "one English sentence describing the situation and who the student is", "scenarioMy": "same in Burmese", "reply": "your opening line", "emotion": "happy|excited|curious|encouraging|calm", "replyMy": "Burmese translation", "hints": ["2 short sample answers the student could say"]}.`
              : `Theme: ${theme}\nConversation so far:\n${history}\n\nContinue as the partner. JSON {"reply": "your next line", "emotion": "happy|excited|curious|encouraging|calm", "replyMy": "Burmese translation", "hints": ["2 short sample answers"], "tip": "if the student's last line had a clear mistake, one short Burmese correction tip, otherwise empty string"}.`,
          });
          return Response.json({ ...out, session });
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
