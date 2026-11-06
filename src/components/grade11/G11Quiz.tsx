import { useState } from "react";
import type { G11Quiz } from "@/data/grade11/part1";

export function G11QuizBlock({ items }: { items: G11Quiz[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const score = items.filter((it, i) => picked[i] === it.answer).length;
  const done = Object.keys(picked).length === items.length;
  return (
    <div className="mt-4 space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-border bg-background p-3">
          <p className="text-sm font-medium">{i + 1}. {it.q}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {it.options.map((o, j) => {
              const chosen = picked[i] === j;
              const answered = picked[i] !== undefined;
              const cls = answered && j === it.answer
                ? "border-primary bg-primary/10 text-primary"
                : chosen
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border hover:bg-muted";
              return (
                <button key={j} type="button" disabled={answered}
                  onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
                  className={`rounded-full border px-3 py-1 text-sm transition ${cls}`}>
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {done && (
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
          <span>ရမှတ်: {score}/{items.length}</span>
          <button type="button" className="text-primary underline" onClick={() => setPicked({})}>ပြန်ဖြေမည်</button>
        </div>
      )}
    </div>
  );
}
