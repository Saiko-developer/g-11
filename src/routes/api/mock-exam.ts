import { withTone } from "@/lib/tone-rules";
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import { generateJson } from "@/lib/ai-json.server";
import type { MockExamPaper } from "@/lib/mockExam";
import { configKey, examTotals, isFullExam, normalizeConfig, type SectionId } from "@/lib/examBlueprint";

type Body = { unit?: number; unitTitle?: string; topics?: string; fresh?: boolean; units?: number[]; sections?: string[]; count?: number };
export type ExamQuota = { role: string; limit: number; used: number; extra?: number };

function userClient(token: string) {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}`, apikey: key } },
  });
}

/**
 * Sayar Owl mock-exam generation engine for the Syllabus Curriculum Explorer.
 * Dynamic across all 12 units — the unit number and topics are passed per request.
 */
export const Route = createFileRoute("/api/mock-exam")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (!token) return Response.json({ error: "Please sign in first." }, { status: 401 });
        const db = userClient(token);
        const { data: q0, error: qErr } = await db.rpc("exam_quota");
        if (qErr) return Response.json({ error: "Please sign in again." }, { status: 401 });
        const quota = q0 as unknown as ExamQuota;
        if (quota.limit === 0) return Response.json({ error: "Please sign in first." }, { status: 401 });

        const body = (await request.json()) as Body;
        const config = normalizeConfig(body, Number(body.unit ?? 1));
        const key = configKey(config);
        const unitNo = config.units[0];
        // Re-opening the page shows today's paper again without using the limit.
        if (!body.fresh) {
          const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
          const { data: last } = await db
            .from("exam_generations")
            .select("paper,created_at")
            .eq("unit", unitNo)
            .gte("created_at", since)
            .order("created_at", { ascending: false })
            .limit(5);
          const hit = (last ?? []).find((r) => {
            const k = (r.paper as { configKey?: string } | null)?.configKey;
            return k ? k === key : isFullExam(config) && config.units.length === 1;
          });
          if (hit) return Response.json({ paper: hit.paper, quota, cached: true });
        }
        if (quota.limit >= 0 && quota.used >= quota.limit && (quota.extra ?? 0) <= 0) {
          return Response.json(
            { error: `ယနေ့အတွက် မေးခွန်းထုတ်ခွင့် (${quota.limit} ကြိမ်) ပြည့်သွားပါပြီ။ မနက်ဖြန် ပြန်ထုတ်နိုင်ပါသည် (သို့) Exam Credit ဝယ်ယူ / Admin ထံ ဆက်သွယ်ပါ။`, quota, limitReached: true },
            { status: 429 },
          );
        }
        const unit = unitNo;
        const topics = (body.topics ?? "").slice(0, 4000);
        const unitLabel = config.units.length > 1 ? `Units ${config.units.join(", ")}` : `Unit ${unit}`;
        const unitTitle = body.unitTitle ?? unitLabel;
        const n = config.count;
        const totals = examTotals(config);
        const LINES: Record<SectionId, string> = {
          I: `I Vocabulary Completion (Initial Letters Provided) — ${n} marks, type "fill": ${n} contextual sentences using unit vocabulary; each sentence contains a blank written as "______"; "hint" is the first letter of the missing word.`,
          II: `II Multiple Choice Vocabulary & Expressions — ${n} marks, type "mcq": ${n} sentences testing phrasal collocations or word forms from the unit text, options labelled A, B, C; "answer" is the label letter.`,
          III: `III Sentence Transformation & Grammar Rules — ${n} marks, type "transformation": ${n} rewriting items; "instruction" is the bracketed instruction text; about half must test the primary grammar focus of the chosen unit(s).`,
          IV: `IV Poetry Text & Poetry Comprehension — 10 marks, type "poetry": partA = 5 fill-in-the-blank lines of verse (blank as "______"); partB = 5 comprehension questions on those exact lines with full-sentence answers.`,
          V: `V Reading Passage A — 10 marks, type "passage": an original unseen ~150-word passage expanding the unit theme; partA = 5 text-completion blanks; partB = 5 literal questions with strict ONE-SENTENCE answers.`,
          VI: `VI Extended Reading Passage B — 15 marks, type "passage_extended": an original ~250-word text on the unit's broader themes with the target words written in **bold** inside the passage; "definitions" = 5 definitions whose answers are those boldfaced words; "distractorDefinition" = exactly 1 extra definition with no match; partB = 5 analytical questions with full-sentence answers.`,
          VII: `VII Functional English & Situational Dialogues — 10 marks, type "functional": "dialogue" = one continuous 5-turn dialogue matching the unit's speaking themes, each turn containing a "______" blank filled from "wordBank" (word bank has 6 entries = 5 answers + 1 distractor); "matches" = 5 independent situational speaker prompts answered from "phraseBank" (6 entries).`,
          VIII: `VIII Directed Guided Writing (Letter) — 10 marks, type "writing", maxWords 200: 2 optional letter-writing scenarios matching the unit's communicative tasks, with "sampleAnswers" (one polished model per prompt).`,
          IX: `IX Free Composition (Essay) — 10 marks, type "writing", maxWords 300: 3 thematic essay prompts rooted in the unit's core concept, with "sampleAnswers" (one polished model per prompt).`,
        };
        const sectionLines = config.sections.map((id) => LINES[id]).join("\n");
        const mix = config.units.length > 1 ? `\nMix the units fairly: spread items across ${unitLabel} so every chosen unit is tested.` : "";

        const system = `You are Sayar Owl, the automated examination generation engine for Grade 10 English in Myanmar.
Generate an exam paper based strictly on the themes, reading materials and grammar targets of ${unitLabel} (${unitTitle}: ${topics}).${mix}

DIFFICULTY INDEX: Balanced / Standard Intermediate — match real Myanmar matriculation papers. No trivial items, no obscure terminology.

Generate ONLY these ${config.sections.length} section(s), in this order, with these exact ids, types and marks:
${sectionLines}

Return ONLY JSON of this shape:
{"title":string,"unit":${unit},"unitTopics":string,"totalMarks":${totals.marks},"durationMinutes":${totals.minutes},"sections":[ ...one object per section above... ]}
Section object shapes by type:
fill: {"id","title","marks","instructions","type":"fill","items":[{"number","sentence","hint","answer"}]}
mcq: {"id","title","marks","instructions","type":"mcq","items":[{"number","sentence","options":[{"label":"A","text"},{"label":"B","text"},{"label":"C","text"}],"answer":"A"}]}
transformation: {"id","title","marks","instructions","type":"transformation","items":[{"number","sentence","instruction","answer"}]}
poetry: {"id","title","marks","instructions","type":"poetry","poemTitle","partA":[{"number","sentence","answer"}],"partB":[{"number","question","answer"}]}
passage: {"id","title","marks","instructions","type":"passage","passage","partA":[{"number","sentence","answer"}],"partB":[{"number","question","answer"}]}
passage_extended: {"id","title","marks","instructions","type":"passage_extended","passage","definitions":[{"number","definition","answer"}],"distractorDefinition","partB":[{"number","question","answer"}]}
functional: {"id","title","marks","instructions","type":"functional","wordBank":[string],"dialogue":[{"number","speaker","text","answer"}],"phraseBank":[string],"matches":[{"number","question","answer"}]}
writing: {"id","title","marks","instructions","type":"writing","maxWords","prompts":[string],"sampleAnswers":[string]}
No conversational text.`;

        try {
          const paper = await generateJson<MockExamPaper>({
            system: withTone(system),
            prompt: `Generate the ${unitLabel} exam paper now. Title: ${unitTitle}. Topics: ${topics}`,
          });
          if (!paper?.sections?.length) throw new Error("Empty exam paper");
          paper.totalMarks = totals.marks;
          paper.durationMinutes = totals.minutes;
          paper.units = config.units;
          paper.configKey = key;
          const { data: q1, error: recErr } = await db.rpc("record_exam_generation", { _unit: unit, _paper: paper as never });
          if (recErr) return Response.json({ error: "ယနေ့အတွက် မေးခွန်းထုတ်ခွင့် ပြည့်သွားပါပြီ။", quota, limitReached: true }, { status: 429 });
          return Response.json({ paper, quota: q1, cached: false });
        } catch (error) {
          console.error("[mock-exam]", error);
          const msg = error instanceof Error ? error.message : "unknown";
          const status =
            msg.includes("429") || msg.toLowerCase().includes("rate limit")
              ? 429
              : msg.includes("402") || msg.toLowerCase().includes("payment required")
                ? 402
                : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
