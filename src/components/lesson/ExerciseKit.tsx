/**
 * Shared lesson-exercise presentation kit.
 *
 * These are the exact building blocks used by the dedicated Lesson Page
 * (/section/$sectionId). The homepage unit workspace imports the very same
 * components so both surfaces have perfect feature parity: translation
 * blocks, sentence-structure "train", answer validation and audio triggers.
 */
import { useEffect, useState } from "react";

import { usePracticeProgress } from "@/lib/practiceProgress";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Languages,
  Lightbulb,
  ListChecks,
  Loader2,
  Sparkles,
  Volume2,
} from "lucide-react";

import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import tutorLogo from "@/assets/tutor-logo.png";
import { isAnswerMatch } from "@/lib/answerMatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type SentenceBreakdown } from "@/data/unit1Supplement";
import { TAG_INFO, buildTrainCars } from "@/lib/sentenceStructure";

export function OwlBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
      <img src={tutorLogo} alt="" className="h-8 w-8 shrink-0" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function ToggleReveal({
  label,
  hiddenLabel,
  children,
  icon: Icon = Eye,
  tone = "amber",
}: {
  label: string;
  hiddenLabel?: string;
  children: React.ReactNode;
  icon?: typeof Eye;
  tone?: "amber" | "primary" | "emerald";
}) {
  const [open, setOpen] = useState(false);
  const toneClass = {
    amber: "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
    primary: "border-primary/30 bg-primary/5",
    emerald:
      "border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100",
  }[tone];
  return (
    <div className="mt-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen((v) => !v)}>
        {open ? <EyeOff className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
        {open ? (hiddenLabel ?? "Hide") : label}
      </Button>
      {open && (
        <div className={`mt-2 rounded-lg border p-3 text-sm leading-relaxed ${toneClass}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function StructureBreakdown({
  questionText,
  breakdown,
  sentenceMy,
}: {
  questionText: string;
  breakdown?: SentenceBreakdown;
  /** Real Burmese translation of the whole sentence; replaces word-by-word auto translations. */
  sentenceMy?: string;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const info = activeTag ? TAG_INFO[activeTag] : null;
  const sentence = questionText.trim();

  // Curated breakdown when available, otherwise derive one from the question
  // itself so every unit's reading questions get a structure view.
  const cars = breakdown?.cars ?? (sentence ? buildTrainCars(sentence).cars : []);

  if (!cars.length) {
    return (
      <div className="text-sm text-muted-foreground">
        🦉 ဒီမေးခွန်းအတွက် ဝါကျဖွဲ့စည်းပုံ ရှင်းလင်းချက်ကို မကြာမီ ထည့်ပေးပါမည်။
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-4">
        {cars.map((car, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <span className="text-sm font-bold leading-tight text-slate-900">{car.word}</span>
            {!sentenceMy && (
              <span className="mt-1 break-words text-[11px] leading-tight text-slate-600">
                ({car.translation})
              </span>
            )}
            <button
              type="button"
              onClick={() => setActiveTag(car.tag)}
              className="mt-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary/20"
              aria-label={`Explain ${car.tag}`}
            >
              [{car.tag}]
            </button>
          </div>
        ))}
      </div>
      {sentenceMy && (
        <p className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">
          🇲🇲 {sentenceMy}
        </p>
      )}

      <Sheet open={!!activeTag} onOpenChange={(o) => !o && setActiveTag(null)}>
        <SheetContent side="right" className="w-[88vw] sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{info ? info.titleMy : ""}</SheetTitle>
            <SheetDescription className="font-mono text-xs">[{activeTag}]</SheetDescription>
          </SheetHeader>
          {info && (
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p>{info.bodyMy}</p>
              {info.example && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider">Example</p>
                  <p className="mt-1 font-medium">{info.example}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                🦉 ဆရာ ဇီးကွက် — ဒီအပိုင်းကို နားလည်ပြီးရင် မေးခွန်းကို ပြန်ကြိုးစားကြည့်ပါ။
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function AnswerTryBox({
  correct,
  placeholder = "Type your answer here…",
  question,
  instructions,
  correctMy,
}: {
  correct: string;
  placeholder?: string;
  question?: string;
  instructions?: string;
  correctMy?: string;
}) {
  const [val, setVal] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const progress = usePracticeProgress();
  const progressKey = `${question ?? ""}::${correct}`;
  const saved = progress?.attempts[progressKey];
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    if (restored || !saved) return;
    setRestored(true);
    setVal((v) => v || saved.answer);
    setChecked((c) => c ?? saved.correct);
  }, [saved, restored]);

  const isMatch = () => isAnswerMatch(val, correct);
  const check = () => {
    const ok = isMatch();
    setChecked(ok);
    progress?.save(progressKey, val, ok);
  };

  const askHint = async () => {
    setHintLoading(true);
    setHintError(null);
    try {
      const res = await fetch("/api/answer-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, instructions, studentAnswer: val, correct }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.hint) throw new Error();
      setHint(data.hint);
    } catch {
      setHintError("ဆရာဇီးကွက် အခု မဖြေနိုင်သေးပါ — ခဏနေ ထပ်စမ်းကြည့်ပါ။");
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setChecked(null);
            setHint(null);
            setHintError(null);
          }}
          placeholder={placeholder}
          disabled={revealed}
          className="flex-1"
        />
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={check}
          disabled={!val.trim() || revealed}
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Check Answer
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5"
          onClick={() => setRevealed((v) => !v)}
        >
          <Lightbulb className="h-3.5 w-3.5" /> {revealed ? "Hide Answer" : "Reveal Answer"}
        </Button>
      </div>
      {checked === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
          ✅ မှန်ပါတယ်! တော်လိုက်တာ။
        </div>
      )}
      {checked === false && (
        <div className="space-y-2 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
          <div>❌ နည်းနည်းလွဲသွားတယ်နော် — ထပ်စဉ်းစားကြည့်ပါ။</div>
          {!hint && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={askHint}
              disabled={hintLoading}
            >
              {hintLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <img src={tutorLogo} alt="" className="h-4 w-4" />
              )}
              ဘာလို့မှားလဲ? ဆရာဇီးကွက်ကို မေးမယ်
            </Button>
          )}
          {hintError && <div>{hintError}</div>}
        </div>
      )}
      {checked === false && hint && (
        <OwlBadge>
          <div className="space-y-1 whitespace-pre-line">
            {hint.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i} className="font-semibold text-primary">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </div>
        </OwlBadge>
      )}
      {revealed && (
        <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-semibold">Answer: </span>
          {correct}
          {correctMy && <p className="mt-1 text-muted-foreground">🇲🇲 {correctMy}</p>}
        </div>
      )}
    </div>
  );
}

export function ParagraphBlock({
  block,
  forceShowMy,
}: {
  block: {
    paragraph_id: number;
    lines: string;
    english_text: string;
    burmese_explanation: string;
  };
  forceShowMy: boolean;
}) {
  const [showMy, setShowMy] = useState(false);
  const visible = forceShowMy || showMy;
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          ¶ {block.paragraph_id} · lines {block.lines}
        </span>
        {!forceShowMy && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-xs"
            onClick={() => setShowMy((v) => !v)}
          >
            <Languages className="h-3 w-3" />
            {showMy ? "Hide Burmese" : "Translate Paragraph"}
          </Button>
        )}
      </div>
      <p className="mt-2 leading-relaxed">{block.english_text}</p>
      {visible && (
        <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
          <span className="text-xs font-semibold">🌐 မြန်မာ ဘာသာပြန် — </span>
          {block.burmese_explanation}
        </div>
      )}
    </div>
  );
}

export function VocabCard({
  item,
}: {
  item: { word: string; pronunciation: string; meaningMy: string };
}) {
  const speak = () => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(item.word);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-bold">{item.word}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={speak}
          aria-label={`Speak ${item.word}`}
        >
          <Volume2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{item.pronunciation}</p>
      <p className="mt-1 text-sm">🇲🇲 {item.meaningMy}</p>
    </div>
  );
}

export type ExItem = {
  id: number;
  text: string;
  translation: string;
  answer?: string;
  breakdown?: SentenceBreakdown;
};

export function ExerciseGroup({
  title,
  titleMy,
  instructions,
  instructionsMy,
  items,
  enableStructure = true,
  enableTranslate = true,
  placeholder,
  grammarPractice = false,
}: {
  grammarPractice?: boolean;
  title: string;
  titleMy: string;
  instructions: string;
  instructionsMy?: string;
  items: ExItem[];
  enableStructure?: boolean;
  enableTranslate?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <ListChecks className="h-3.5 w-3.5" /> {title}
      </div>
      <h3 className="mt-1 text-base font-semibold">{titleMy}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{instructions}</p>
      {instructionsMy ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{instructionsMy}</p>
      ) : null}

      <ol className="mt-4 space-y-4">
        {items.map((q) => (
          <li key={q.id} className="rounded-xl border border-border bg-background p-3">
            <div className="flex gap-2">
              <span className="text-sm font-bold text-primary">{q.id}.</span>
              <p className="text-sm font-medium leading-relaxed">{q.text}</p>
            </div>

            {(enableTranslate || enableStructure) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {enableTranslate && (
                  <ToggleReveal label="Translate Question" icon={Languages}>
                    {q.translation || "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                )}
                {enableStructure && (
                  <ToggleReveal label="Sentence Structure" icon={Sparkles} tone="primary">
                    <StructureBreakdown
                      questionText={q.text.replace(/^"|"$/g, "")}
                      breakdown={q.breakdown}
                    />
                  </ToggleReveal>
                )}
              </div>
            )}


            {q.answer ? <AnswerTryBox correct={q.answer} placeholder={placeholder} question={q.text} instructions={instructions} /> : null}
          </li>
        ))}
      </ol>

      {grammarPractice ? (
        <GrammarExerciseGenerator
          title={title}
          instructions={instructions}
          samples={items.map((q) => ({ text: q.text, answer: q.answer }))}
          placeholder={placeholder}
        />
      ) : null}
    </div>
  );
}
