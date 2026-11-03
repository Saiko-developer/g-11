import type { WritingEval } from "@/lib/writing-eval";

type Props = { evals: WritingEval[]; onChange?: (next: WritingEval[]) => void };

/** Rubric cards for Sections VIII/IX. Editable when onChange is given (teacher view). */
export function WritingEvalCards({ evals, onChange }: Props) {
  if (!evals?.length) return null;
  const edit = (i: number, patch: Partial<WritingEval>) => {
    if (!onChange) return;
    onChange(evals.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  };
  return (
    <div className="space-y-3">
      {evals.map((w, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-3 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="font-semibold">Section {w.section} — {w.title}</h4>
            <span className="rounded bg-primary/15 px-2 py-0.5 font-bold text-primary">{w.score} / {w.marks}</span>
          </div>
          {w.chosenTopic && <p className="mt-1 text-muted-foreground"><b>ရွေးချယ်ထားသော ခေါင်းစဉ်:</b> {w.chosenTopic}</p>}
          {w.studentText && (
            <details className="mt-2 rounded-md bg-muted/50 p-2">
              <summary className="cursor-pointer font-medium">ကျောင်းသား ရေးသားချက် (စာသားပြောင်းထားသည်)</summary>
              <p className="mt-1 whitespace-pre-wrap">{w.studentText}</p>
            </details>
          )}
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {w.rubric?.map((r, k) => (
              <li key={k} className="rounded-md border border-border p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{r.criterion}</span>
                  {onChange ? (
                    <span className="flex items-center gap-1 text-xs">
                      <input type="number" step="0.5" min={0} max={r.marks} value={r.awarded}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(r.marks, Number(e.target.value) || 0));
                          const rubric = w.rubric.map((x, m) => (m === k ? { ...x, awarded: v } : x));
                          edit(i, { rubric, score: rubric.reduce((s, x) => s + x.awarded, 0) });
                        }}
                        className="w-14 rounded-md border border-input bg-background px-1 py-0.5" />
                      / {r.marks}
                    </span>
                  ) : <span className="text-xs font-semibold">{r.awarded} / {r.marks}</span>}
                </div>
                {r.comment && <p className="mt-1 text-xs text-muted-foreground">{r.comment}</p>}
              </li>
            ))}
          </ul>
          {w.aiCritique?.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">AI အကြံပြုချက်</p>
              <ul className="ml-5 list-disc text-muted-foreground">{w.aiCritique.map((c, k) => <li key={k}>{c}</li>)}</ul>
            </div>
          )}
          {onChange ? (
            <label className="mt-2 block text-xs font-medium">ဆရာ့ မှတ်ချက်
              <textarea value={w.teacherFeedback ?? ""} onChange={(e) => edit(i, { teacherFeedback: e.target.value })} rows={2}
                className="mt-1 w-full rounded-md border border-input bg-background p-1.5 text-sm" />
            </label>
          ) : w.teacherFeedback ? (
            <p className="mt-2 rounded-md bg-accent p-2 text-accent-foreground"><b>ဆရာ့ မှတ်ချက်:</b> {w.teacherFeedback}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
