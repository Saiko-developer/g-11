/**
 * Poem 4 — "What Is Pink?" (Christina Rossetti). Uses the shared ExerciseKit
 * building blocks so the layout matches the other poem views.
 */
import { BookOpen, Languages, ListChecks, PenLine, Sparkles } from "lucide-react";

import { OwlBadge, ToggleReveal } from "@/components/lesson/ExerciseKit";
import { Textarea } from "@/components/ui/textarea";
import {
  POEM4_AUTHOR,
  POEM4_GLOSSARY,
  POEM4_PRE_READING,
  POEM4_PRE_READING_STRUCTURES,
  POEM4_PRE_READING_TRANSLATIONS,
  POEM4_STANZAS,
  POEM4_STANZA_TRANSLATIONS,
  POEM4_TABLE_COLUMNS,
  POEM4_TABLE_INSTRUCTIONS,
  POEM4_TABLE_ROWS,
  POEM4_TITLE,
  POEM4_WRITING_SAMPLE,
  POEM4_WRITING_TASK,
  POEM4_WRITING_TASK_MY,
} from "@/data/poem4";

function StructureBlock({ formula }: { formula: string }) {
  return <p className="font-mono text-xs leading-relaxed">{formula}</p>;
}

export function Poem4View() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">Poem 4 · Reading</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{POEM4_TITLE}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{POEM4_AUTHOR}</p>

        <div className="mt-4 space-y-4">
          {POEM4_STANZAS.map((stanza, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              {stanza.map((line, j) => (
                <p key={j} className="text-sm leading-relaxed">
                  {line}
                </p>
              ))}
              <ToggleReveal label="Translate Lines" hiddenLabel="Hide Burmese" icon={Languages}>
                {(POEM4_STANZA_TRANSLATIONS[i] ?? []).map((line, k) => (
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
            {POEM4_GLOSSARY.map((g) => (
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
            ဒီကဗျာက အရောင်တွေအကြောင်း ဖြစ်ပါတယ်။ ကဗျာကို အသံထွက်ဖတ်ပြီး ဇယားကို ကိုယ်တိုင်
            ဖြည့်ကြည့်ပါ။ ပြီးမှ အဖြေကို ဖွင့်ကြည့်ပါ။
          </p>
        </OwlBadge>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Pre-reading
          </div>
          <ol className="mt-3 space-y-3">
            {POEM4_PRE_READING.map((q) => (
              <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium leading-relaxed">
                  {q.id}. {q.question}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleReveal label="Translate Question" icon={Languages}>
                    {POEM4_PRE_READING_TRANSLATIONS[q.id] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                  <ToggleReveal label="Question Structure" icon={Sparkles} tone="primary">
                    <StructureBlock formula={POEM4_PRE_READING_STRUCTURES[q.id] ?? ""} />
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
            <ListChecks className="h-3.5 w-3.5" /> Exercise A — Complete the table
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{POEM4_TABLE_INSTRUCTIONS}</p>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-xs">
              <thead>
                <tr>
                  {POEM4_TABLE_COLUMNS.map((c) => (
                    <th
                      key={c}
                      className="border border-border bg-muted/60 p-2 text-left font-semibold"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POEM4_TABLE_ROWS.map((row) => (
                  <tr key={row.colour}>
                    <td className="border border-border p-2 font-semibold">
                      {row.colour}
                      {row.example && (
                        <span className="ml-1 text-[10px] uppercase text-muted-foreground">
                          (example)
                        </span>
                      )}
                    </td>
                    {row.example ? (
                      <>
                        <td className="border border-border p-2">{row.thing}</td>
                        <td className="border border-border p-2">{row.place}</td>
                        <td className="border border-border p-2">{row.time}</td>
                        <td className="border border-border p-2">{row.adjective}</td>
                      </>
                    ) : (
                      <>
                        <td className="border border-border p-2">
                          <ToggleReveal label="Answer" tone="emerald">
                            {row.thing}
                          </ToggleReveal>
                        </td>
                        <td className="border border-border p-2">
                          <ToggleReveal label="Answer" tone="emerald">
                            {row.place}
                          </ToggleReveal>
                        </td>
                        <td className="border border-border p-2">
                          <ToggleReveal label="Answer" tone="emerald">
                            {row.time}
                          </ToggleReveal>
                        </td>
                        <td className="border border-border p-2">
                          <ToggleReveal label="Answer" tone="emerald">
                            {row.adjective}
                          </ToggleReveal>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <PenLine className="h-3.5 w-3.5" /> Exercise B — Write your own verse
          </div>
          <p className="mt-1 text-sm font-medium leading-relaxed">{POEM4_WRITING_TASK}</p>
          <p className="mt-1 text-xs text-muted-foreground">{POEM4_WRITING_TASK_MY}</p>
          <Textarea
            className="mt-3 min-h-[120px]"
            placeholder="What is brown? …"
            aria-label="Write your four line verse"
          />
          <ToggleReveal label="Show a sample verse" tone="emerald">
            {POEM4_WRITING_SAMPLE.split("\n").map((line, i) => (
              <p key={i} className="leading-relaxed">
                {line}
              </p>
            ))}
          </ToggleReveal>
        </div>
      </section>
    </div>
  );
}
