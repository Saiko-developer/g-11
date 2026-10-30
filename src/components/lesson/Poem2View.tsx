/**
 * Poem 2 — "The Blind Boy" (Colley Cibber). Uses the shared ExerciseKit
 * building blocks so the layout matches the unit lesson views.
 */
import { BookOpen, Languages, ListChecks, Sparkles } from "lucide-react";

import { AnswerTryBox, OwlBadge, ToggleReveal } from "@/components/lesson/ExerciseKit";
import {
  POEM2_AUTHOR,
  POEM2_GLOSSARY,
  POEM2_PRE_READING,
  POEM2_PRE_READING_STRUCTURES,
  POEM2_PRE_READING_TRANSLATIONS,
  POEM2_QUESTIONS,
  POEM2_QUESTION_STRUCTURES,
  POEM2_QUESTION_TRANSLATIONS,
  POEM2_STANZAS,
  POEM2_STANZA_TRANSLATIONS,
  POEM2_TITLE,
} from "@/data/poem2";

function StructureBlock({ formula }: { formula: string }) {
  return <p className="font-mono text-xs leading-relaxed">{formula}</p>;
}

export function Poem2View() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">Poem 2 · Reading</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{POEM2_TITLE}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{POEM2_AUTHOR}</p>

        <div className="mt-4 space-y-5">
          {POEM2_STANZAS.map((stanza, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stanza {i + 1}
              </div>
              {stanza.map((line, j) => (
                <p key={j} className="text-sm leading-relaxed">
                  {line}
                </p>
              ))}
              <ToggleReveal label="Translate Stanza" hiddenLabel="Hide Burmese" icon={Languages}>
                {(POEM2_STANZA_TRANSLATIONS[i] ?? []).map((line, k) => (
                  <p key={k} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </ToggleReveal>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Glossary
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {POEM2_GLOSSARY.map((g) => (
              <div key={g.word} className="rounded-lg border border-border bg-background p-3">
                <dt className="text-sm font-bold">{g.word}</dt>
                <dd className="mt-0.5 text-xs text-muted-foreground">{g.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-5">
        <OwlBadge>
          <p className="font-semibold">မင်္ဂလာပါ! ဆရာ ဇီးကွက်ပါ 🦉</p>
          <p>
            ကဗျာကို အသံထွက်ဖတ်ပြီး စာလုံးအဓိပ္ပာယ်များကို Glossary မှာ ကြည့်ပါ။ ပြီးရင် မေးခွန်းများကို
            ဝါကျအပြည့်ဖြင့် ဖြေဆိုပါ။
          </p>
        </OwlBadge>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Pre-reading
          </div>
          <ol className="mt-3 space-y-3">
            {POEM2_PRE_READING.map((q) => (
              <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium leading-relaxed">
                  {q.id}. {q.question}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleReveal label="Translate Question" icon={Languages}>
                    {POEM2_PRE_READING_TRANSLATIONS[q.id] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                  <ToggleReveal label="Question Structure" icon={Sparkles} tone="primary">
                    <StructureBlock formula={POEM2_PRE_READING_STRUCTURES[q.id] ?? ""} />
                  </ToggleReveal>
                </div>
                <ToggleReveal label="Show idea" tone="emerald">
                  {q.suggested_answer}
                </ToggleReveal>
              </li>
            ))}
          </ol>
        </section>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Comprehension — Answer in complete sentences
          </div>
          <h3 className="mt-1 text-base font-semibold">
            နားလည်မှု စစ်ဆေးခြင်း — ဝါကျအပြည့်ဖြင့် ဖြေပါ
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Answer the following questions in complete sentences.
          </p>

          <ol className="mt-4 space-y-4">
            {POEM2_QUESTIONS.map((q) => (
              <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                <div className="flex gap-2">
                  <span className="text-sm font-bold text-primary">{q.id}.</span>
                  <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleReveal label="Translate Question" icon={Languages}>
                    {POEM2_QUESTION_TRANSLATIONS[q.id] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                  <ToggleReveal label="Question Structure" icon={Sparkles} tone="primary">
                    <StructureBlock formula={POEM2_QUESTION_STRUCTURES[q.id] ?? ""} />
                  </ToggleReveal>
                </div>

                <AnswerTryBox correct={q.answer} placeholder="Write your full-sentence answer…" />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
