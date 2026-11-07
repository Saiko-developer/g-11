import { Grade11Unit2Lesson } from "@/components/grade11/Grade11Unit2Lesson";
import { Grade11Unit4Lesson } from "@/components/grade11/Grade11Unit4Lesson";
/**
 * Renders a Grade 11 unit skill as text, from the teacher-provided DOCX
 * transcriptions (src/data/grade11/textbook/unitN.json), checked against the textbook PDF.
 * Layout mirrors Grade 10: lesson text on the left, exercises + Saya Owl on the right.
 */
import { useMemo, useState } from "react";
import { BookOpen, Languages, PenLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerTryBox, OwlBadge, StructureBreakdown, ToggleReveal } from "@/components/lesson/ExerciseKit";
import { ListTree } from "lucide-react";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import unit1 from "@/data/grade11/textbook/unit1.json";
import unit2 from "@/data/grade11/textbook/unit2.json";
import unit3 from "@/data/grade11/textbook/unit3.json";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import { Grade11Unit3Lesson } from "@/components/grade11/Grade11Unit3Lesson";
import { Grade11Unit1Lesson } from "@/components/grade11/Grade11Unit1Lesson";

/** Optional `a` = answer key (enables Check/Reveal), `my` = Burmese translation. */
type Block = {
  t: "sub" | "h" | "para" | "ins" | "q" | "line" | "model";
  x: string; a?: string; my?: string;
  /** model (sample) answer for open questions, with Burmese */
  ma?: string; maMy?: string;
  /** Burmese explanation shown after Reveal */
  exMy?: string;
};

function ModelAnswer({ en, my, label = "Model Answer" }: { en: string; my?: string; label?: string }) {
  return (
    <ToggleReveal label={label} icon={BookOpen} tone="primary">
      <p className="whitespace-pre-line text-sm leading-relaxed">{en}</p>
      {my && <p className="mt-2 whitespace-pre-line border-t border-border pt-2 text-sm leading-relaxed">{my}</p>}
    </ToggleReveal>
  );
}

function sentences(text: string) {
  return (text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? []).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3);
}
type Section = { code: string; title: string; blocks: Block[] };
type Exercise = { ins: string; insMy?: string; blocks: Block[] };

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
  return unit === 4 || unit in UNITS;
}

function split(blocks: Block[]) {
  const lesson: Block[] = [];
  const exercises: Exercise[] = [];
  for (const b of blocks) {
    if (b.t === "ins") exercises.push({ ins: b.x, insMy: b.my, blocks: [] });
    else if (exercises.length) exercises[exercises.length - 1].blocks.push(b);
    else lesson.push(b);
  }
  return { lesson, exercises };
}

export function Grade11TextLesson({ unit, kind }: { unit: number; kind: G11SkillKind }) {
  if (unit === 2) return <Grade11Unit2Lesson key={kind} kind={kind} />;
  if (unit === 4) return <Grade11Unit4Lesson key={kind} kind={kind} />;
  if (unit === 3) return <Grade11Unit3Lesson key={kind} kind={kind} />;
  if (unit === 1) return <Grade11Unit1Lesson key={kind} kind={kind} />;
  return <LegacyGrade11TextLesson key={`${unit}-${kind}`} unit={unit} kind={kind} />;
}

function LegacyGrade11TextLesson({ unit, kind }: { unit: number; kind: G11SkillKind }) {
  const section = UNITS[unit]?.find((s) => s.code === `${unit}${LETTER[kind]}`);
  const { lesson, exercises } = useMemo(() => split(section?.blocks ?? []), [section]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  if (!section) return null;

  const isTask = (b: Block) => b.t === "q" || (b.t === "line" && (kind === "grammar" ? !/^e\.g\./i.test(b.x) : /^\d+[.)]\s/.test(b.x)));
  const lessonText = lesson.map((b) => b.x).join("\n").slice(0, 6000);
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
          <TranslateSlot label="Translate whole section to Burmese"
            text={lesson.map((b) => b.my).filter(Boolean).join("\n\n") || undefined} />
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
                <TranslateSlot label="Translate Instructions" small
                  text={[ex.insMy, ...ex.blocks.filter((b) => !isTask(b) && b.t !== "model").map((b) => b.my)].filter(Boolean).join("\n") || undefined} />
                <div className="mt-3 space-y-3">
                  {ex.blocks.map((b, bi) => {
                    const k = `${ei}-${bi}`;
                    if (isTask(b))
                      return (
                        <QuestionCard key={bi} b={b} instructions={ex.ins} context={lessonText}
                          noStructure={/find the bold-faced words/i.test(ex.ins)}
                          onAnswer={(v) => setA(k, v)} />
                      );
                    if (b.t === "model")
                      return <ModelAnswer key={bi} en={b.x} my={b.my} label="Sample Answer" />;
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
        <p className="mt-2 whitespace-pre-line rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">{text}</p>
      ) : (
        <p className="mt-2 rounded-lg border border-dashed border-border bg-muted/40 p-2 text-xs text-muted-foreground">
          🔜 မြန်မာဘာသာပြန်ကို မကြာမီ ထည့်ပေးပါမည်။
        </p>
      ))}
    </div>
  );
}

/** Grade 10-style question card: number, Translate Question + Sentence Structure, answer row with Check/Reveal. */
function QuestionCard({ b, instructions, context, onAnswer, noStructure }: {
  b: Block; instructions: string; context: string; onAnswer: (v: string) => void; noStructure?: boolean;
}) {
  const m = b.x.match(/^\s*(\d+|[a-z])[.)]\s+(.*)$/is);
  const num = m?.[1];
  const text = m ? m[2] : b.x;
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex gap-2">
        {num && <span className="text-sm font-bold text-primary">{num}.</span>}
        <p className="text-sm font-medium leading-relaxed">{text}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <ToggleReveal label="Translate Question" icon={Languages}>
          {b.my || "🔜 မြန်မာဘာသာပြန်ကို မကြာမီ ထည့်ပေးပါမည်။"}
        </ToggleReveal>
        {!noStructure && (
          <ToggleReveal label="Sentence Structure" icon={Sparkles} tone="primary">
            <StructureBreakdown questionText={text} />
          </ToggleReveal>
        )}
      </div>
      {b.a || b.ma ? (
        <div onInput={(e) => onAnswer((e.target as HTMLInputElement).value ?? "")}>
          <AnswerTryBox correct={(b.a || b.ma) as string} correctMy={b.a ? undefined : b.maMy}
            question={text} instructions={instructions} />
        </div>
      ) : (
        <p className="mt-2 rounded-lg border border-dashed border-border bg-muted/40 p-2 text-xs text-muted-foreground">
          🎧 ဒီမေးခွန်းအတွက် အဖြေကို နားထောင်ရန်အသံဖိုင် ရပြီးမှ ထည့်ပေးပါမည်။
        </p>
      )}
      {b.exMy && (
        <div className="mt-2 flex flex-wrap gap-2">
          {b.exMy && (
            <ToggleReveal label="ဘာကြောင့်လဲ? (ရှင်းလင်းချက်)" icon={Sparkles}>{b.exMy}</ToggleReveal>
          )}
        </div>
      )}
    </div>
  );
}

/** Same look as AnswerTryBox; Saya Owl checks / suggests the answer since no answer key exists yet. */
function OwlAnswerBox({ question, instructions, context, onAnswer }: {
  question: string; instructions: string; context: string; onAnswer: (v: string) => void;
}) {
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState<null | "check" | "reveal">(null);
  const [result, setResult] = useState<null | { correct: boolean; feedback: string }>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const call = async (mode: "check" | "reveal") => {
    setBusy(mode); setErr(null);
    try {
      const res = await fetch("/api/g11-check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, question, instructions, context, studentAnswer: val }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      if (mode === "check") setResult({ correct: !!data.correct, feedback: data.feedback ?? "" });
      else { if (!data.answer) throw new Error(); setAnswer(data.answer); setShowAnswer(true); }
    } catch {
      setErr("ဆရာဇီးကွက် အခု မဖြေနိုင်သေးပါ — ခဏနေ ထပ်စမ်းကြည့်ပါ။");
    } finally { setBusy(null); }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input value={val} placeholder="Type your answer here…" className="flex-1"
          onChange={(e) => { setVal(e.target.value); onAnswer(e.target.value); setResult(null); }} />
        <Button size="sm" variant="outline" className="gap-1.5" disabled={!val.trim() || !!busy} onClick={() => call("check")}>
          {busy === "check" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Check Answer
        </Button>
        <Button size="sm" variant="ghost" className="gap-1.5" disabled={!!busy}
          onClick={() => (answer ? setShowAnswer((v) => !v) : call("reveal"))}>
          {busy === "reveal" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}
          {showAnswer ? "Hide Answer" : "Reveal Answer"}
        </Button>
      </div>
      {result && (result.correct ? (
        <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs">✅ မှန်ပါတယ်! တော်လိုက်တာ။ {result.feedback}</div>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs">❌ နည်းနည်းလွဲသွားတယ်နော်။ {result.feedback}</div>
      ))}
      {err && <p className="text-xs text-muted-foreground">{err}</p>}
      {showAnswer && answer && (
        <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-semibold">Answer (Saya Owl): </span>{answer}
        </div>
      )}
    </div>
  );
}
