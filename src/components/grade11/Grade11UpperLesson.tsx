import { UPPER_STRUCTURES } from "@/lib/grade11UpperStructure";
import { Grade11GrammarQuestion } from "./Grade11GrammarExercise";
import grammarSupport from "@/data/grade11/grammarExerciseSupport.json";
import { useEffect, useRef, useState } from "react";
import { Languages, Sparkles } from "lucide-react";
import { ToggleReveal } from "@/components/lesson/ExerciseKit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { isAnswerMatch } from "@/lib/answerMatch";
import {
  UPPER_UNITS,
  UPPER_KEYS,
  type UpperAnswer,
  type UpperGroup,
  type UpperItem,
  type UpperSource,
  type UpperUnitNumber,
} from "@/lib/grade11Upper";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import { Grade11GrammarVideos } from "./Grade11GrammarVideos";
import { Grade11SourceStructure } from "./Grade11SourceStructure";

export function Grade11UpperLesson({ unit, kind }: { unit: UpperUnitNumber; kind: G11SkillKind }) {
  return <UpperWorkspace key={`${unit}:${kind}`} unit={unit} kind={kind} />;
}

function UpperWorkspace({ unit, kind }: { unit: UpperUnitNumber; kind: G11SkillKind }) {
  const content = UPPER_UNITS[unit].skills[kind];
  const storageKey = `grade11:unit${unit}:${kind}:drafts:v1`;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const drafts = useRef<Record<string, string>>({});
  useEffect(() => {
    let restored: Record<string, string> = {};
    try {
      const data: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "{}");
      if (data && typeof data === "object" && !Array.isArray(data))
        restored = Object.fromEntries(
          Object.entries(data).filter(([, value]) => typeof value === "string"),
        );
    } catch {
      /* Storage is optional; the lesson remains usable. */
    }
    drafts.current = restored;
    setAnswers(restored);
    setLoaded(true);
  }, [storageKey]);
  const tasks = content.groups.flatMap((group) => group.items);
  const done = tasks.filter((item) => answers[item.id]?.trim()).length;
  const setAnswer = (id: string, value: string) => {
    const next = { ...drafts.current, [id]: value };
    drafts.current = next;
    setAnswers(next);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* In-memory fallback. */
    }
  };
  return (
    <div className="mt-5 min-w-0 space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          Progress: {done} / {tasks.length} answered
        </p>
        <Progress
          aria-label="Answers completed"
          value={tasks.length ? (done / tasks.length) * 100 : 0}
          className="mt-2 h-2"
        />
      </div>
      {kind === "grammar" && <Grade11GrammarVideos unit={unit} />}
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-2">
        <aside
          aria-label="Original textbook"
          className="min-w-0 space-y-3 rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto"
        >
          <h2 className="font-semibold">
            Original textbook · Unit {unit} · {kind[0].toUpperCase() + kind.slice(1)}
          </h2>
          {content.sources.map((source, index) => (
            <SourcePage key={source.url} source={source} open={index === 0} />
          ))}
        </aside>
        <section aria-label={`${kind} exercises`} className="min-w-0 space-y-5">
          <fieldset disabled={!loaded} className="min-w-0 space-y-5">
            <legend className="sr-only">Answers</legend>
            {content.groups.map((group) => (
              <section
                key={group.id}
                aria-labelledby={`${group.id}-title`}
                className="min-w-0 rounded-2xl border border-border bg-card p-4"
              >
                <h3
                  id={`${group.id}-title`}
                  lang="en"
                  className="border-b border-border pb-3 font-semibold"
                >
                  {group.instruction}
                </h3>
                {group.instruction === "Pre-reading" ? (
                  <p lang="my" className="mt-2 text-sm text-muted-foreground">
                    {group.instructionMy}
                  </p>
                ) : (
                  <ToggleReveal label="Translate Instructions" icon={Languages}>
                    <p lang="my">{group.instructionMy}</p>
                  </ToggleReveal>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Textbook {group.pages.length === 1 ? "page" : "pages"}{" "}
                  {group.pages.map((page) => page - 5).join(", ")}
                </p>
                {group.sourceRequired && (
                  <p lang="my" className="mt-2 rounded-lg bg-muted p-3 text-sm">
                    မူရင်းစာမျက်နှာရှိ မျဉ်းသားထားသော အပိုင်းကို ကြည့်၍ ဖြေပါ။
                  </p>
                )}
                {kind === "grammar" ? (
                  <div className="mt-3 space-y-3">
                    {group.items.map((item) => {
                      const support = (
                        grammarSupport.items as Record<
                          string,
                          {
                            questionMy: string;
                            answer: string;
                            semantic?: boolean;
                            emphasis?: string;
                            context?: string;
                          }
                        >
                      )[item.id];
                      return (
                        <Grade11GrammarQuestion
                          key={item.id}
                          id={item.id}
                          question={item.prompt}
                          questionMy={item.promptMy ?? support.questionMy}
                          instructions={group.instruction}
                          answer={{ answer: support.answer }}
                          value={answers[item.id] ?? ""}
                          onChange={(value) => setAnswer(item.id, value)}
                          multiline={item.multiline ?? group.multiline ?? false}
                          semantic={support.semantic}
                          emphasis={support.emphasis}
                          context={support.context}
                        />
                      );
                    })}
                  </div>
                ) : group.table ? (
                  <div className="mt-3 max-w-full overflow-x-auto">
                    <table className="w-full min-w-[360px] table-fixed border-collapse text-sm">
                      <caption className="sr-only">{group.instruction}</caption>
                      <thead>
                        <tr>
                          <th scope="col" className="w-[45%] border border-border p-2 text-left">
                            Textbook item
                          </th>
                          <th scope="col" className="border border-border p-2 text-left">
                            Your answer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.id}>
                            <th
                              scope="row"
                              lang="en"
                              className="break-words border border-border p-2 text-left align-top font-normal"
                            >
                              {item.prompt}
                            </th>
                            <td className="border border-border p-2 align-top">
                              <Question
                                item={item}
                                group={group}
                                answer={UPPER_KEYS[unit][item.id]}
                                value={answers[item.id] ?? ""}
                                onChange={(value) => setAnswer(item.id, value)}
                                hidePrompt
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {group.items.map((item) => (
                      <Question
                        key={item.id}
                        item={item}
                        group={group}
                        answer={UPPER_KEYS[unit][item.id]}
                        value={answers[item.id] ?? ""}
                        onChange={(value) => setAnswer(item.id, value)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </fieldset>
        </section>
      </div>
    </div>
  );
}

function SourcePage({ source, open }: { source: UpperSource; open: boolean }) {
  return (
    <details open={open} className="overflow-hidden rounded-xl border border-border">
      <summary className="cursor-pointer p-3 text-sm font-medium">
        Textbook page {source.page - 5}
      </summary>
      <figure>
        <a
          href={source.originalUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open original textbook page ${source.page - 5}`}
        >
          <img
            src={source.url}
            alt={`Grade 11 textbook page ${source.page - 5}`}
            loading="lazy"
            className="h-auto w-full"
          />
        </a>
      </figure>
    </details>
  );
}

function Question({
  item,
  group,
  answer,
  value,
  onChange,
  hidePrompt = false,
}: {
  item: UpperItem;
  group: UpperGroup;
  answer?: UpperAnswer;
  value: string;
  onChange: (value: string) => void;
  hidePrompt?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<boolean | null>(null);
  const multiline = item.multiline ?? group.multiline ?? false;
  const update = (text: string) => {
    onChange(text);
    setChecked(null);
  };
  const fieldLabel = `Your answer: ${item.prompt}`;
  return (
    <div className="min-w-0 space-y-2 rounded-xl border border-border bg-background p-3">
      {!hidePrompt && (
        <p lang="en" className="whitespace-pre-line text-sm font-medium leading-relaxed">
          {item.prompt}
        </p>
      )}
      {item.promptMy && (
        <div className="flex flex-wrap gap-2">
          <ToggleReveal label="Translate Question" icon={Languages}>
            <p lang="my">{item.promptMy}</p>
          </ToggleReveal>
          {group.structure && UPPER_STRUCTURES[item.id] && (
            <ToggleReveal label="Sentence Structure" icon={Sparkles}>
              <Grade11SourceStructure
                questionText={item.prompt.replace(/^\d+\.\s*/, "")}
                sentenceMy={item.promptMy}
                breakdown={UPPER_STRUCTURES[item.id]}
              />
            </ToggleReveal>
          )}
        </div>
      )}
      {item.choices ? (
        item.multiple ? (
          <fieldset disabled={revealed} className="space-y-2">
            <legend className="sr-only">{fieldLabel}</legend>
            {item.choices.map((choice) => (
              <label key={choice} lang="en" className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={value.split("\n").includes(choice)}
                  onChange={(event) => {
                    const values = new Set(value ? value.split("\n") : []);
                    if (event.target.checked) values.add(choice);
                    else values.delete(choice);
                    update(item.choices!.filter((option) => values.has(option)).join("\n"));
                  }}
                />
                {choice}
              </label>
            ))}
          </fieldset>
        ) : (
          <select
            aria-label={fieldLabel}
            disabled={revealed}
            value={value}
            onChange={(event) => update(event.target.value)}
            className="w-full min-w-0 rounded-md border border-border bg-background p-2 text-sm"
          >
            <option value="">Choose…</option>
            {item.choices.map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        )
      ) : multiline ? (
        <Textarea
          aria-label={fieldLabel}
          rows={item.wordTarget ? 10 : 3}
          disabled={revealed}
          value={value}
          onChange={(event) => update(event.target.value)}
          placeholder="Write your answer…"
        />
      ) : (
        <Input
          aria-label={fieldLabel}
          disabled={revealed}
          value={value}
          onChange={(event) => update(event.target.value)}
          placeholder="Type your answer here…"
        />
      )}
      {item.wordTarget && (
        <p aria-live="polite" className="text-xs text-muted-foreground">
          Words: {value.trim().split(/\s+/).filter(Boolean).length} ·{" "}
          {item.wordTarget[0] === item.wordTarget[1]
            ? `About ${item.wordTarget[0]}`
            : `${item.wordTarget[0]}–${item.wordTarget[1]}`}
        </p>
      )}
      {answer && !group.audio && (
        <div className="flex flex-wrap gap-2">
          {!multiline && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!value.trim() || revealed}
              onClick={() => setChecked(isAnswerMatch(value, answer.answer))}
            >
              Check Answer
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setRevealed((old) => !old);
              setChecked(null);
            }}
          >
            {revealed ? "Hide Answer" : "Reveal Answer"}
          </Button>
        </div>
      )}
      {checked !== null && (
        <p
          role="status"
          lang="my"
          className={checked ? "text-sm text-emerald-700" : "text-sm text-rose-700"}
        >
          {checked ? "✅ မှန်ပါတယ်။" : "ထပ်စဉ်းစားပြီး ပြန်ဖြေကြည့်ပါ။"}
        </p>
      )}
      {revealed && answer && (
        <div className="rounded-lg bg-primary/5 p-3 text-sm">
          <p lang="en">Answer: {answer.answer}</p>
          {answer.answerMy && (
            <p lang="my" className="mt-2 text-muted-foreground">
              {answer.answerMy}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
