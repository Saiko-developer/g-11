import { grade11ApiFetch } from "@/lib/grade11ApiFetch";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isAnswerMatch } from "@/lib/answerMatch";

/** Unit 1's answer controls, scoped to grammar with draft-safe asynchronous hints. */
export function Grade11GrammarAnswer({
  question,
  instructions,
  correct,
  correctMy,
  value,
  onChange,
  multiline,
}: {
  question: string;
  instructions: string;
  correct: string;
  correctMy?: string | null;
  value: string;
  onChange: (value: string) => void;
  multiline: boolean;
}) {
  const [checked, setChecked] = useState<{ value: string; correct: boolean } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState<{ value: string; text: string; error?: boolean } | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const version = useRef(0);
  useEffect(
    () => () => {
      version.current++;
      requestRef.current?.abort();
    },
    [value, question],
  );
  const askHint = async () => {
    const id = ++version.current;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setPending(value);
    setHint(null);
    try {
      const response = await grade11ApiFetch("/api/answer-hint", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: 11, question, instructions, studentAnswer: value, correct }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.hint !== "string" || !data.hint.trim())
        throw new Error(
          response.status === 401
            ? "AI အကူအညီ ရယူရန် Login ဝင်ပါ။"
            : "အကြံပြုချက် မရသေးပါ။ ခဏစောင့်ပြီး ပြန်စမ်းနိုင်ပါတယ်။",
        );
      if (id === version.current) setHint({ value, text: data.hint });
    } catch (error) {
      if (id === version.current && !controller.signal.aborted)
        setHint({
          value,
          text: error instanceof Error ? error.message : "ပြန်စမ်းနိုင်ပါတယ်။",
          error: true,
        });
    } finally {
      if (id === version.current) setPending(null);
    }
  };
  const activeCheck = checked?.value === value ? checked : null;
  const activeHint = hint?.value === value ? hint : null;
  const busy = pending === value && !requestRef.current?.signal.aborted;
  const Field = multiline ? Textarea : Input;
  return (
    <div className="mt-3 space-y-3">
      <Field
        aria-label={`Your answer: ${question}`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setChecked(null);
          setHint(null);
        }}
        disabled={revealed}
        placeholder="Type your answer here…"
        className="w-full"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!value.trim() || revealed}
          onClick={() => setChecked({ value, correct: isAnswerMatch(value, correct) })}
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Check Answer
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setRevealed((old) => !old);
            setChecked(null);
          }}
        >
          <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
          {revealed ? "Hide Answer" : "Reveal Answer"}
        </Button>
      </div>
      {activeCheck && (
        <div
          role="status"
          lang="my"
          className={`rounded-lg border p-3 text-sm ${activeCheck.correct ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"}`}
        >
          {activeCheck.correct ? (
            "✅ မှန်ပါတယ်! တော်လိုက်တာ။"
          ) : (
            <div className="space-y-3">
              <p>❌ နည်းနည်းလွဲသွားတယ်နော် — ထပ်စဉ်းစားကြည့်ပါ။</p>
              {!activeHint || activeHint.error ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-auto max-w-full whitespace-normal text-left"
                  disabled={busy}
                  onClick={() => void askHint()}
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />}ဘာလို့မှားလဲ?
                  ဆရာဇီးကွက်ကို မေးမယ်
                </Button>
              ) : null}
              {activeHint && (
                <p role={activeHint.error ? "alert" : undefined} className="whitespace-pre-line">
                  {activeHint.text}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {revealed && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <p lang="en" className="whitespace-pre-line">
            <strong>Answer: </strong>
            {correct}
          </p>
          {correctMy && (
            <p lang="my" className="mt-2 text-muted-foreground">
              {correctMy}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
