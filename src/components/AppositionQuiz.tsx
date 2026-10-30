import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Lightbulb, Loader2, RotateCcw, XCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  expectedAnswers,
  fetchGrammarQuiz,
  isCorrect,
  type GrammarExercise,
} from "@/lib/grammarQuiz";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function AppositionQuiz({ open, onOpenChange }: Props) {
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["grammar-quiz", "1c-apposition"],
    queryFn: fetchGrammarQuiz,
    staleTime: 5 * 60_000,
    enabled: open,
  });

  const [partIndex, setPartIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);

  const part = quiz?.parts[partIndex];
  const exercises = useMemo<GrammarExercise[]>(() => part?.exercises ?? [], [part]);
  const current = exercises[index];
  const correct = current ? isCorrect(current, value) : false;

  function reset(nextPart = partIndex) {
    setPartIndex(nextPart);
    setIndex(0);
    setValue("");
    setChecked(false);
    setReveal(false);
    setScore(0);
  }

  function next() {
    setValue("");
    setChecked(false);
    setReveal(false);
    setIndex((i) => Math.min(i + 1, exercises.length - 1));
  }

  const finished = checked && index === exercises.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouns in Apposition — Live Practice</DialogTitle>
          <DialogDescription>
            1C Grammar · အဖြေကို မှန်အောင် စမ်းကြည့်ပါ — ဆရာဇီးကွက် အရိပ်အမြွက် ပေးပါမယ်။
          </DialogDescription>
        </DialogHeader>

        {isLoading || !quiz || !part || !current ? (
          <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading exercises…
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {quiz.parts.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => reset(i)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    i === partIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Part {p.id}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">
                Score {score}/{exercises.length}
              </span>
            </div>

            <p className="rounded-xl border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
              {part.instructions}
            </p>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                Question {index + 1} of {exercises.length}
              </div>
              <p className="mt-2 text-base leading-relaxed">{current.text}</p>

              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setChecked(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!checked) {
                      setChecked(true);
                      if (isCorrect(current, value)) setScore((s) => s + 1);
                    } else if (!finished) next();
                  }
                }}
                placeholder={
                  part.id === "A" ? "Type the noun in apposition…" : "Type the combined sentence…"
                }
                className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (checked) return;
                    setChecked(true);
                    if (correct) setScore((s) => s + 1);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Check answer
                </button>
                <button
                  type="button"
                  onClick={() => setReveal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Lightbulb className="h-4 w-4" /> Show answer
                </button>
                {checked && !finished && (
                  <button
                    type="button"
                    onClick={next}
                    className="ml-auto rounded-lg border border-primary/40 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                  >
                    Next →
                  </button>
                )}
                {finished && (
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm transition hover:bg-secondary"
                  >
                    <RotateCcw className="h-4 w-4" /> Restart
                  </button>
                )}
              </div>

              {checked && (
                <div
                  className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ${
                    correct
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>
                    {correct
                      ? "မှန်ပါတယ်! Great work — that is the noun in apposition."
                      : "မမှန်သေးပါဘူး။ Look for the noun group that renames another noun, usually between commas."}
                  </span>
                </div>
              )}

              {reveal && (
                <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-3 text-sm">
                  <div className="font-semibold">Answer</div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                    {expectedAnswers(current).map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground">
              Data source: {quiz.source === "remote" ? "live textbook file" : "bundled textbook file"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
