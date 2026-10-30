/**
 * Teacher/Admin-only editor for a generated mock exam paper.
 * Lets staff edit question text and answers, delete questions or whole
 * sections, and change section marks. Questions are renumbered after deletes.
 */
import { Trash2 } from "lucide-react";
import type { ExamSection, MockExamPaper } from "@/lib/mockExam";
import { Button } from "@/components/ui/button";

type AnyItem = Record<string, unknown> & { number?: number };

// Which arrays in each section hold questions, and which field is the question text.
const LISTS: Record<string, { key: string; label: string; text: string }[]> = {
  fill: [{ key: "items", label: "Questions", text: "sentence" }],
  mcq: [{ key: "items", label: "Questions", text: "sentence" }],
  transformation: [{ key: "items", label: "Questions", text: "sentence" }],
  poetry: [
    { key: "partA", label: "Part A", text: "sentence" },
    { key: "partB", label: "Part B", text: "question" },
  ],
  passage: [
    { key: "partA", label: "Part A", text: "sentence" },
    { key: "partB", label: "Part B", text: "question" },
  ],
  passage_extended: [
    { key: "definitions", label: "Part A", text: "definition" },
    { key: "partB", label: "Part B", text: "question" },
  ],
  functional: [
    { key: "dialogue", label: "Part A", text: "text" },
    { key: "matches", label: "Part B", text: "question" },
  ],
};

const inputCls =
  "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function PaperEditor({
  paper,
  onChange,
}: {
  paper: MockExamPaper;
  onChange: (p: MockExamPaper) => void;
}) {
  const commit = (sections: ExamSection[]) =>
    onChange({ ...paper, sections, totalMarks: sections.reduce((t, s) => t + (Number(s.marks) || 0), 0) });

  const updateSection = (idx: number, next: ExamSection) =>
    commit(paper.sections.map((s, i) => (i === idx ? next : s)));

  return (
    <div className="mt-2 space-y-6">
      {paper.sections.map((section, sIdx) => {
        const sec = section as unknown as Record<string, unknown>;
        const lists = LISTS[section.type] ?? [];
        return (
          <section key={section.id + sIdx} className="rounded-2xl border border-primary/40 bg-card p-5">
            <header className="mb-3 flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
              <span className="font-bold text-primary">Section {section.id}.</span>
              <input
                className={`${inputCls} flex-1 font-semibold`}
                value={section.title}
                onChange={(e) => updateSection(sIdx, { ...section, title: e.target.value })}
              />
              <input
                type="number"
                className={`${inputCls} w-20`}
                value={section.marks}
                onChange={(e) => updateSection(sIdx, { ...section, marks: Number(e.target.value) })}
                aria-label="Marks"
              />
              <span className="text-xs text-muted-foreground">marks</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm(`Section ${section.id} ကို ဖျက်မလား?`))
                    commit(paper.sections.filter((_, i) => i !== sIdx));
                }}
              >
                <Trash2 className="h-4 w-4" /> Section ဖျက်မည်
              </Button>
            </header>
            <textarea
              className={`${inputCls} mb-4 italic`}
              rows={2}
              value={section.instructions}
              onChange={(e) => updateSection(sIdx, { ...section, instructions: e.target.value })}
            />
            {typeof sec.passage === "string" && (
              <textarea
                className={`${inputCls} mb-4`}
                rows={6}
                value={sec.passage as string}
                onChange={(e) => updateSection(sIdx, { ...sec, passage: e.target.value } as unknown as ExamSection)}
              />
            )}
            {section.type === "writing" && (
              <EditableList
                label="Prompts"
                items={section.prompts.map((p) => ({ text: p }))}
                text="text"
                onChange={(arr) =>
                  updateSection(sIdx, { ...section, prompts: arr.map((a) => String(a.text ?? "")) })
                }
              />
            )}
            {lists.map((l) => (
              <EditableList
                key={l.key}
                label={l.label}
                items={(sec[l.key] as AnyItem[]) ?? []}
                text={l.text}
                onChange={(arr) => updateSection(sIdx, { ...sec, [l.key]: arr } as unknown as ExamSection)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

function EditableList({
  label,
  items,
  text,
  onChange,
}: {
  label: string;
  items: AnyItem[];
  text: string;
  onChange: (items: AnyItem[]) => void;
}) {
  const set = (i: number, patch: AnyItem) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = (i: number) =>
    onChange(
      items
        .filter((_, j) => j !== i)
        .map((it, j) => ("number" in it ? { ...it, number: j + 1 } : it)),
    );
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">{label}</p>
      <ol className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 rounded-lg border border-border p-2">
            <span className="pt-1.5 text-sm font-semibold">{it.number ?? String.fromCharCode(97 + i)}.</span>
            <div className="flex-1 space-y-1.5">
              <textarea
                className={inputCls}
                rows={2}
                value={String(it[text] ?? "")}
                onChange={(e) => set(i, { [text]: e.target.value })}
              />
              {Array.isArray(it.options) && (
                <div className="grid gap-1.5 sm:grid-cols-3">
                  {(it.options as { label: string; text: string }[]).map((o, k) => (
                    <input
                      key={k}
                      className={inputCls}
                      value={o.text}
                      aria-label={`Option ${o.label}`}
                      onChange={(e) =>
                        set(i, {
                          options: (it.options as { label: string; text: string }[]).map((x, m) =>
                            m === k ? { ...x, text: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  ))}
                </div>
              )}
              {typeof it.instruction === "string" && (
                <input
                  className={inputCls}
                  value={it.instruction}
                  placeholder="Instruction"
                  onChange={(e) => set(i, { instruction: e.target.value })}
                />
              )}
              {"answer" in it && (
                <input
                  className={`${inputCls} border-primary/40`}
                  value={String(it.answer ?? "")}
                  placeholder="Answer"
                  onChange={(e) => set(i, { answer: e.target.value })}
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => remove(i)}
              aria-label="Delete question"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
}
