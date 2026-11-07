/**
 * Renders a Grade 11 unit skill as text, from the teacher-provided DOCX
 * transcriptions (src/data/grade11/textbook/unitN.json), checked against the textbook PDF.
 * Layout mirrors Grade 10: lesson text on the left, exercises + Saya Owl on the right.
 */
import { useMemo, useState } from "react";
import { BookOpen, Languages, PenLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerTryBox, OwlBadge, StructureBreakdown, ToggleReveal } from "@/components/lesson/ExerciseKit";
import { ListTree } from "lucide-react";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import unit1 from "@/data/grade11/textbook/unit1.json";
import unit2 from "@/data/grade11/textbook/unit2.json";
import unit3 from "@/data/grade11/textbook/unit3.json";
import type { G11SkillKind } from "@/data/grade11/syllabus";

/** Optional `a` = answer key (enables Check/Reveal), `my` = Burmese translation. */
type Block = { t: "sub" | "h" | "para" | "ins" | "q" | "line"; x: string; a?: string; my?: string };

function sentences(text: string) {
  return (text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? []).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3);
}
type Section = { code: string; title: string; blocks: Block[] };
type Exercise = { ins: string; blocks: Block[] };

const UNITS: Record<number, Section[]> = {
  1: unit1 as Section[],
  2: unit2 as Section[],
  3: unit3 as Section[],
};
const LETTER: Record<G11SkillKind, string> = {
  reading: "A", vocabulary: "B", grammar: "C", listening: "D", speaking: "D", writing: "E",
};
const OWL_NOTE: Record<G11SkillKind, string> = {
  reading: "မင်္ဂလာပါ! ဆရာဇီးကွက်ပါ။ ဘယ်ဘက်က စာပိုဒ်တွေကို အရင်ဖတ်ပြီး ညာဘက်က လေ့ကျင့်ခန်းတွေကို ကိုယ်တိုင်ဖြေကြည့်ပါ။",
  vocabulary: "စကားလုံးတွေကို အရင်လေ့လာပြီး လေ့ကျင့်ခန်းထဲမှာ သုံးကြည့်ပါ။",
  grammar: "သဒ္ဒါစည်းမျဉ်းကို အရင်ဖတ်ပါ။ စာအုပ်လေ့ကျင့်ခန်း ပြီးရင် \"Practice 10 more\" နဲ့ ထပ်လေ့ကျင့်နိုင်ပါတယ်။",
  listening: "မေးခွန်းတွေကို အရင်ဖတ်ထားပြီးမှ နားထောင်ပါ။",
  speaking: "စကားပြောလေ့ကျင့်ခန်းအတွက် အဖြေကို အရင်ရေးကြည့်ပြီး အသံထွက်ပြောကြည့်ပါ။",
  writing: "လမ်းညွှန်ချက်အတိုင်း ကိုယ်ပိုင်စာကို ရေးကြည့်ပါ။",
};

export function hasGrade11Text(unit: number) {
  return unit in UNITS;
}

function split(blocks: Block[]) {
  const lesson: Block[] = [];
  const exercises: Exercise[] = [];
  for (const b of blocks) {
    if (b.t === "ins") exercises.push({ ins: b.x, blocks: [] });
    else if (exercises.length) exercises[exercises.length - 1].blocks.push(b);
    else lesson.push(b);
  }
  return { lesson, exercises };
}

export function Grade11TextLesson({ unit, kind }: { unit: number; kind: G11SkillKind }) {
  const section = UNITS[unit]?.find((s) => s.code === `${unit}${LETTER[kind]}`);
  const { lesson, exercises } = useMemo(() => split(section?.blocks ?? []), [section]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  if (!section) return null;

  const isTask = (b: Block) => b.t === "q" || (kind === "grammar" && b.t === "line" && !/^e\.g\./i.test(b.x));
  const keys: string[] = [];
  exercises.forEach((ex, ei) => ex.blocks.forEach((b, bi) => isTask(b) && keys.push(`${ei}-${bi}`)));
  const freeKey = "free";
  const writeFree = kind === "writing" || kind === "speaking" || exercises.length === 0;
  if (writeFree) keys.push(freeKey);
  const done = keys.filter((k) => answers[k]?.trim()).length;
  const pct = keys.length ? Math.round((done / keys.length) * 100) : 0;
  const setA = (k: string, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  let paraNo = 0;
  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Progress: {done} / {keys.length} answered</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="mt-2 h-2" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* LEFT — lesson text */}
        <article className="space-y-3 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {section.code} · {section.title}
          </span>
          <TranslateSlot label="Translate whole section to Burmese" />
          {lesson.length === 0 && (
            <p className="text-sm text-muted-foreground">ဒီအပိုင်းမှာ လေ့ကျင့်ခန်းများသာ ပါဝင်ပါတယ်။</p>
          )}
          {lesson.map((b, i) => {
            if (b.t === "sub")
              return (
                <h3 key={i} className="flex items-center gap-2 pt-2 text-base font-bold">
                  <BookOpen className="h-4 w-4 text-primary" /> {b.x}
                </h3>
              );
            if (b.t === "h") return <h4 key={i} className="pt-2 font-semibold text-primary">{b.x}</h4>;
            if (b.t === "para") {
              paraNo += 1;
              return (
                <div key={i} className="rounded-xl bg-secondary/50 p-4">
                  <p className="font-mono text-xs text-muted-foreground">Paragraph {paraNo}</p>
                  <p className="mt-1 text-[15px] leading-relaxed">{b.x}</p>
                  <TranslateSlot label="Show Myanmar Translation" small text={b.my} />
                  <ToggleReveal label="Sentence Structure" hiddenLabel="Hide Sentence Structure" icon={ListTree} tone="primary">
                    <div className="space-y-4">
                      {sentences(b.x).map((s, si) => (
                        <div key={si} className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">Sentence {si + 1}</p>
                          <StructureBreakdown questionText={s} />
                        </div>
                      ))}
                    </div>
                  </ToggleReveal>
                </div>
              );
            }
            return <p key={i} className="whitespace-pre-line text-[15px] leading-relaxed">{b.x}</p>;
          })}
        </article>

        {/* RIGHT — exercises */}
        <section className="space-y-4">
          <OwlBadge>{OWL_NOTE[kind]}</OwlBadge>
          {exercises.map((ex, ei) => {
            const tasks = ex.blocks.filter(isTask);
            return (
              <div key={ei} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-2 border-b border-border pb-2 font-semibold">
                  <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{ex.ins}</span>
                </div>
                <div className="mt-3 space-y-3">
                  {ex.blocks.map((b, bi) => {
                    const k = `${ei}-${bi}`;
                    if (isTask(b))
                      return (
                        <div key={bi} className="space-y-1.5">
                          <p className="text-[15px] leading-relaxed">{b.x}</p>
                          {b.a ? (
                            <div onInput={(e) => setA(k, (e.target as HTMLInputElement).value ?? "")}>
                              <AnswerTryBox correct={b.a} question={b.x} instructions={ex.ins} />
                            </div>
                          ) : (
                            <Textarea rows={1} value={answers[k] ?? ""} onChange={(e) => setA(k, e.target.value)}
                              placeholder="Type your answer…" className="min-h-0 text-sm" />
                          )}
                          {kind === "reading" && (
                            <ToggleReveal label="Sentence Structure" hiddenLabel="Hide Sentence Structure" icon={ListTree} tone="primary">
                              <StructureBreakdown questionText={b.x} />
                            </ToggleReveal>
                          )}
                          {b.my && <TranslateSlot label="Show Myanmar Translation" small text={b.my} />}
                        </div>
                      );
                    if (b.t === "sub" || b.t === "h")
                      return <h4 key={bi} className="pt-1 font-semibold text-primary">{b.x}</h4>;
                    return <p key={bi} className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{b.x}</p>;
                  })}
                </div>
                {kind === "grammar" && tasks.length > 0 && (
                  <GrammarExerciseGenerator
                    title={`Grade 11 ${section.code} ${ex.ins.slice(0, 60)}`}
                    instructions={ex.ins}
                    samples={tasks.map((t) => ({ text: t.x }))}
                  />
                )}
              </div>
            );
          })}
          {writeFree && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-semibold">✍️ Your answer</p>
              <Textarea rows={8} value={answers[freeKey] ?? ""} onChange={(e) => setA(freeKey, e.target.value)}
                placeholder="Write your answer…" className="mt-2 text-sm" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TranslateSlot({ label, small, text }: { label: string; small?: boolean; text?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={small ? "mt-2" : ""}>
      <Button size="sm" variant={small ? "ghost" : "outline"} className="h-7 gap-1 text-xs" onClick={() => setOpen((v) => !v)}>
        <Languages className="h-3 w-3" /> {open ? "Hide Myanmar Translation" : label}
      </Button>
      {open && (text ? (
        <p className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">{text}</p>
      ) : (
        <p className="mt-2 rounded-lg border border-dashed border-border bg-muted/40 p-2 text-xs text-muted-foreground">
          🔜 မြန်မာဘာသာပြန်ကို မကြာမီ ထည့်ပေးပါမည်။
        </p>
      ))}
    </div>
  );
}
