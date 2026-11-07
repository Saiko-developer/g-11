/**
 * Renders a Grade 11 unit skill as text, from the teacher-provided DOCX
 * transcriptions (src/data/grade11/textbook/unitN.json), checked against the textbook PDF.
 */
import { useState } from "react";
import { BookOpen, PenLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import unit1 from "@/data/grade11/textbook/unit1.json";
import unit2 from "@/data/grade11/textbook/unit2.json";
import unit3 from "@/data/grade11/textbook/unit3.json";
import type { G11SkillKind } from "@/data/grade11/syllabus";

type Block = { t: "sub" | "h" | "para" | "ins" | "q" | "line"; x: string };
type Section = { code: string; title: string; blocks: Block[] };

const UNITS: Record<number, Section[]> = {
  1: unit1 as Section[],
  2: unit2 as Section[],
  3: unit3 as Section[],
};
const LETTER: Record<G11SkillKind, string> = {
  reading: "A", vocabulary: "B", grammar: "C", listening: "D", speaking: "D", writing: "E",
};

export function hasGrade11Text(unit: number) {
  return unit in UNITS;
}

export function Grade11TextLesson({ unit, kind }: { unit: number; kind: G11SkillKind }) {
  const section = UNITS[unit]?.find((s) => s.code === `${unit}${LETTER[kind]}`);
  if (!section) return null;
  let paraNo = 0;
  return (
    <article className="mt-5 space-y-3 rounded-2xl border border-border bg-card p-5 md:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {section.code} · {section.title}
      </p>
      {section.blocks.map((b, i) => {
        switch (b.t) {
          case "sub":
            return (
              <h3 key={i} className="flex items-center gap-2 pt-3 text-base font-bold">
                <BookOpen className="h-4 w-4 text-primary" /> {b.x}
              </h3>
            );
          case "h":
            return <h4 key={i} className="pt-2 font-semibold text-primary">{b.x}</h4>;
          case "para":
            paraNo += 1;
            return (
              <div key={i} className="flex gap-3 rounded-xl bg-secondary/50 p-4 leading-relaxed">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {paraNo}
                </span>
                <p className="text-[15px]">{b.x}</p>
              </div>
            );
          case "ins":
            return (
              <div key={i} className="mt-4 flex items-start gap-2 rounded-xl border-l-4 border-primary bg-primary/5 px-4 py-3 font-semibold">
                <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{b.x}</span>
              </div>
            );
          case "q":
            return <QuestionItem key={i} text={b.x} />;
          default:
            return <p key={i} className="whitespace-pre-line pl-1 text-[15px] leading-relaxed">{b.x}</p>;
        }
      })}
      {(kind === "writing" || kind === "speaking") && <QuestionItem text="✍️ Your answer" big />}
    </article>
  );
}

function QuestionItem({ text, big }: { text: string; big?: boolean }) {
  const [v, setV] = useState("");
  return (
    <div className="space-y-1.5 rounded-xl border border-border p-3">
      <p className="text-[15px] leading-relaxed">{text}</p>
      <Textarea value={v} onChange={(e) => setV(e.target.value)} rows={big ? 8 : 1}
        placeholder="Write your answer…" className="min-h-0 text-sm" />
    </div>
  );
}
