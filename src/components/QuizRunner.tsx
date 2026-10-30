import { useState } from "react";
import { Check, Loader2, RefreshCw, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation_my: string;
};

type QuizRunnerProps = {
  title: string;
  questions: QuizQuestion[];
  loading?: boolean;
  error?: string | null;
  onRegenerate?: () => void;
  onFinish?: (score: number, total: number) => void;
  onFocusQuestion?: (q: string | null) => void;
};

/** Step-by-step gamified quiz: answer -> instant feedback -> Burmese "why". */
export function QuizRunner({
  title,
  questions,
  loading,
  error,
  onRegenerate,
  onFinish,
  onFocusQuestion,
}: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Saya Owl is writing your exercises…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm">
        <p className="font-medium">Saya Owl couldn&apos;t build this set.</p>
        <p className="mt-1 text-muted-foreground">{error}</p>
        {onRegenerate && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onRegenerate}>
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </Button>
        )}
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[Math.min(index, questions.length - 1)];
  const correct = picked !== null && picked === q.answer;

  const reset = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    onRegenerate?.();
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{title}</p>
        <p className="mt-2 text-4xl font-bold">
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {pct >= 80
            ? "တော်လိုက်တာ! ဆက်ကြိုးစားပါ 🦉"
            : pct >= 50
              ? "ကောင်းပါတယ်။ ထပ်လေ့ကျင့်ရင် ပိုကောင်းလာမယ်။"
              : "ရပါတယ်။ ရှင်းလင်းချက်တွေ ပြန်ဖတ်ပြီး ထပ်လုပ်ကြည့်ပါ။"}
        </p>
        <Button className="mt-4" variant="outline" size="sm" onClick={reset}>
          <RefreshCw className="h-3.5 w-3.5" /> New set
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-[0.16em] text-primary">{title}</span>
        <span className="text-muted-foreground">
          {index + 1} / {questions.length} · score {score}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((index + (picked ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed">{q.prompt}</p>

      <div className="mt-4 space-y-2">
        {q.options.map((opt) => {
          const isPicked = picked === opt;
          const isAnswer = opt === q.answer;
          const state =
            picked === null
              ? "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
              : isAnswer
                ? "border-primary bg-primary/10"
                : isPicked
                  ? "border-destructive bg-destructive/10"
                  : "border-border bg-background opacity-60";
          return (
            <button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(opt);
                onFocusQuestion?.(q.prompt);
                if (opt === q.answer) setScore((s) => s + 1);
              }}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left text-sm transition ${state}`}
            >
              {picked !== null && isAnswer && <Check className="h-4 w-4 shrink-0 text-primary" />}
              {picked !== null && isPicked && !isAnswer && (
                <X className="h-4 w-4 shrink-0 text-destructive" />
              )}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-4 rounded-xl bg-secondary/60 p-3.5 text-sm leading-relaxed">
          <p className="font-semibold">
            {correct ? "မှန်ပါတယ် ✅" : "မမှန်သေးပါ — ဒါပေမယ့် ရပါတယ် 💪"}
          </p>
          <p className="mt-1 text-muted-foreground">{q.explanation_my}</p>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => {
              if (index + 1 >= questions.length) {
                setDone(true);
                onFinish?.(score, questions.length);
              } else {
                setIndex(index + 1);
                setPicked(null);
              }
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {index + 1 >= questions.length ? "See my score" : "Next question"}
          </Button>
        </div>
      )}
    </div>
  );
}
