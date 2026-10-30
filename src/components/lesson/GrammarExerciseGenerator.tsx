import { useState } from "react";
import { Languages, Loader2, Sparkles } from "lucide-react";

import { AnswerTryBox, ToggleReveal } from "@/components/lesson/ExerciseKit";
import { Button } from "@/components/ui/button";

type Item = { text: string; translation: string; answer: string };

/** "Practice 10 more" — AI items modelled on one real textbook grammar exercise. */
export function GrammarExerciseGenerator({
  title,
  instructions,
  samples,
  placeholder,
}: {
  title: string;
  instructions: string;
  samples: { text: string; answer?: string }[];
  placeholder?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/grammar-exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          instructions,
          samples: samples.slice(0, 8),
          avoid: items.map((i) => i.text),
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Failed");
      setItems((prev) => [...prev, ...(d.items as Item[])]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          ✨ More practice{items.length ? ` (${items.length})` : ""}
        </p>
        <Button size="sm" className="gap-1.5" onClick={() => void generate()} disabled={loading}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? "Generating…" : items.length ? "Generate 10 more" : "Generate 10 exercises"}
        </Button>
      </div>
      {error ? <p className="mt-2 text-xs text-destructive">ထုတ်လုပ်၍ မရပါ။ ထပ်ကြိုးစားပါ။ ({error})</p> : null}
      {items.length ? (
        <ol className="mt-4 space-y-4">
          {items.map((q, i) => (
            <li key={i} className="rounded-xl border border-border bg-background p-3">
              <div className="flex gap-2">
                <span className="text-sm font-bold text-primary">{i + 1}.</span>
                <p className="text-sm font-medium leading-relaxed">{q.text}</p>
              </div>
              {q.translation ? (
                <div className="mt-2">
                  <ToggleReveal label="Translate Question" icon={Languages}>
                    {q.translation}
                  </ToggleReveal>
                </div>
              ) : null}
              <AnswerTryBox correct={q.answer} placeholder={placeholder} question={q.text} instructions={instructions} />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
