import { useState } from "react";
import { CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { OwlBadge } from "@/components/lesson/ExerciseKit";
import { isAnswerMatch } from "@/lib/answerMatch";
import tutorLogo from "@/assets/tutor-logo.png";

export function Grade11SourceAnswer({
  correct,
  placeholder = "Type your answer here…",
  question,
  instructions,
  correctMy,
  value: val,
  onChange: setVal,
  multiline = false,
  allowReveal = true,
  allowCheck = true,
  choices,
  order = false,
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  allowReveal?: boolean;
  allowCheck?: boolean;
  choices?: { value: string; label: string }[];
  order?: boolean;
  correct: string;
  placeholder?: string;
  question?: string;
  instructions?: string;
  correctMy?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const isMatch = () => isAnswerMatch(val, correct);
  const check = () => {
    const ok = isMatch();
    setChecked(ok);
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

  const Field = multiline ? Textarea : Input;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        {choices ? (
          <fieldset className="flex flex-1 flex-wrap gap-3" disabled={revealed}>
            <legend className="sr-only">{question}</legend>
            {choices.map((choice) => (
              <label key={choice.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={val.split(", ").includes(choice.value)}
                  onChange={(event) => {
                    const selected = new Set(val ? val.split(", ") : []);
                    if (event.target.checked) selected.add(choice.value);
                    else selected.delete(choice.value);
                    setVal([...selected].sort().join(", "));
                    setChecked(null);
                    setHint(null);
                    setHintError(null);
                  }}
                />
                {choice.label}
              </label>
            ))}
          </fieldset>
        ) : order ? (
          <div className="flex flex-1 flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <label key={index} className="text-xs">
                {index + 1}
                <select
                  aria-label={`Paragraph position ${index + 1}`}
                  className="ml-1 rounded-md border border-border bg-background p-2 text-sm"
                  value={val.split(",")[index]?.trim() ?? ""}
                  disabled={revealed}
                  onChange={(event) => {
                    const parts = Array.from(
                      { length: 5 },
                      (_, i) => val.split(",")[i]?.trim() ?? "",
                    );
                    parts[index] = event.target.value;
                    setVal(parts.some(Boolean) ? parts.join(",") : "");
                    setChecked(null);
                    setHint(null);
                    setHintError(null);
                  }}
                >
                  <option value="">—</option>
                  {["A", "B", "C", "D", "E"].map((letter) => (
                    <option
                      key={letter}
                      value={letter}
                      disabled={val.split(",").includes(letter) && val.split(",")[index] !== letter}
                    >
                      {letter}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : (
          <Field
            aria-label={`Your answer: ${question}`}
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
        )}
        {allowCheck && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={check}
            disabled={
              !val.trim() || revealed || (order && val.split(",").filter(Boolean).length !== 5)
            }
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Check Answer
          </Button>
        )}
        {allowReveal && (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={() => setRevealed((v) => !v)}
          >
            <Lightbulb className="h-3.5 w-3.5" /> {revealed ? "Hide Answer" : "Reveal Answer"}
          </Button>
        )}
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
