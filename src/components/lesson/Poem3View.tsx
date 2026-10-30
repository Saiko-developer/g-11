/**
 * Poem 3 — "Song" (Christina Rossetti). Uses the shared ExerciseKit pieces.
 */
import { BookOpen, Languages, ListChecks, Sparkles } from "lucide-react";

import { ExerciseGroup, OwlBadge, ToggleReveal } from "@/components/lesson/ExerciseKit";
import {
  POEM3_AUTHOR,
  POEM3_GLOSSARY,
  POEM3_PRE_READING,
  POEM3_PRE_READING_STRUCTURES,
  POEM3_PRE_READING_TRANSLATIONS,
  POEM3_QUESTIONS,
  POEM3_QUESTION_TRANSLATIONS,
  POEM3_STANZAS,
  POEM3_STANZA_TRANSLATIONS,
  POEM3_TITLE,
} from "@/data/poem3";

export function Poem3View() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">Poem 3 · Reading</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{POEM3_TITLE}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{POEM3_AUTHOR}</p>

        <div className="mt-4 space-y-4">
          {POEM3_STANZAS.map((stanza, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              {stanza.map((line, j) => (
                <p key={j} className="text-sm leading-relaxed">
                  {line}
                </p>
              ))}
              <ToggleReveal label="Translate Lines" hiddenLabel="Hide Burmese" icon={Languages}>
                {(POEM3_STANZA_TRANSLATIONS[i] ?? []).map((line, k) => (
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
            {POEM3_GLOSSARY.map((g) => (
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
            ဒီကဗျာက သီချင်းတစ်ပုဒ်လို ရေးထားတဲ့ ကဗျာ ဖြစ်ပါတယ်။ ကဗျာကို အသံထွက်ဖတ်ပြီး
            မေးခွန်းတွေကို ကိုယ်တိုင် ဖြေကြည့်ပါ။ ပြီးမှ အဖြေကို ဖွင့်ကြည့်ပါ။
          </p>
        </OwlBadge>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Pre-reading
          </div>
          <ol className="mt-3 space-y-3">
            {POEM3_PRE_READING.map((q) => (
              <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium leading-relaxed">
                  {q.id}. {q.question}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleReveal label="Translate Question" icon={Languages}>
                    {POEM3_PRE_READING_TRANSLATIONS[q.id] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                  <ToggleReveal label="Question Structure" icon={Sparkles} tone="primary">
                    <p className="font-mono text-xs leading-relaxed">
                      {POEM3_PRE_READING_STRUCTURES[q.id] ?? ""}
                    </p>
                  </ToggleReveal>
                </div>
                <ToggleReveal label="Show idea" tone="emerald">
                  {q.suggested_answer}
                </ToggleReveal>
              </li>
            ))}
          </ol>
        </section>

        <ExerciseGroup
          title="Answer the questions in complete sentences"
          titleMy="မေးခွန်းများကို ဝါကျပြည့်ဖြင့် ဖြေပါ"
          instructions="Answer the following questions in complete sentences."
          enableStructure={false}
          placeholder="Type your answer…"
          items={POEM3_QUESTIONS.map((q) => ({
            id: q.id,
            text: q.question,
            translation: POEM3_QUESTION_TRANSLATIONS[q.id] ?? "",
            answer: q.answer,
          }))}
        />
      </section>
    </div>
  );
}
