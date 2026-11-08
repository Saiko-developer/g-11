import { Grade11Unit5Map, Grade11Unit5Speaking } from "./Grade11Unit5Tools";
import { Grade11ExpressionsTable } from "./Grade11ExpressionsTable";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleReveal } from "@/components/lesson/ExerciseKit";
import { Grade11SourceStructure } from "./Grade11SourceStructure";
import { Grade11Unit2Structure } from "./Grade11Unit2Structure";
import { Grade11AIReview } from "./Grade11AIReview";
import { isAnswerMatch } from "@/lib/answerMatch";
import type { Unit1Block, Unit1Exercise } from "@/lib/grade11Unit1";
import type { G11SkillKind } from "@/data/grade11/syllabus";

type Key = { answer: string; answerMy?: string; kind?: string };
export function Grade11LessonTips({ kind }: { kind: G11SkillKind }) {
  const tips = {
    reading:
      "စာပိုဒ်ထဲက အထောက်အထားကို ရှာပြီး ကိုယ့်စကားနဲ့ ဖြေပါ။ ကိုယ်ပိုင်အမြင်မေးခွန်းတွေမှာ အကြောင်းပြချက်ပါ ထည့်ပါ။",
    grammar:
      "အချိန်ပြစကားလုံး၊ ကတ္တားနဲ့ ကြိယာပုံစံကို အရင်စစ်ပါ။ ဝါကျပြန်ရေးတဲ့အခါ မူရင်းအဓိပ္ပာယ်ကို ထိန်းပါ။",
    listening:
      "မေးခွန်းကို အရင်ဖတ်ပြီး အသံကို လိုသလို ပြန်နားထောင်ပါ။ ဖြည့်ပြီးမှ အဖြေအားလုံးကို စစ်ပါ။",
    writing:
      "ညွှန်ကြားချက်အတိုင်း အကြောင်းအရာစုံအောင် ရေးပါ။ စာပိုဒ်ဖွဲ့စည်းပုံ၊ သဒ္ဒါနဲ့ စာလုံးပေါင်းကို ပြန်စစ်ပါ။",
    speaking: "ဝါကျအပြည့်နဲ့ ပြောပြီး အကြောင်းပြချက် ထည့်ပြောပါ။",
    vocabulary: "ဝါကျအဓိပ္ပာယ်နဲ့ ကိုက်တဲ့ စကားလုံးပုံစံကို ရွေးပါ။",
  };
  return (
    <details className="rounded-xl border border-border bg-card p-3">
      <summary className="cursor-pointer font-medium text-primary">Tips</summary>
      <p lang="my" className="mt-2 text-sm leading-relaxed">
        {tips[kind]}
      </p>
    </details>
  );
}
export function Grade11ExerciseCard({
  exercise,
  unit,
  kind,
  keys,
  answers,
  setAnswer,
  context,
  activeSpeakingExercise,
  onSpeakingExerciseChange,
}: {
  exercise: Unit1Exercise;
  unit: number;
  kind: G11SkillKind;
  keys: Record<string, Key>;
  answers: Record<string, string>;
  setAnswer: (id: string, value: string) => void;
  context: string;
  activeSpeakingExercise?: string | null;
  onSpeakingExerciseChange?: (id: string | null) => void;
}) {
  const { instruction, blocks } = exercise;
  const questions = blocks.filter((b) => b.t === "q");
  const notes = blocks.filter((b) => b.t !== "q" && b.t !== "scan");
  const classify = instruction.id === "2A-16";
  const definitions = instruction.id === "3A-15";
  const matching = /Match .*Column A/i.test(instruction.x);
  const survey = instruction.id === "4D-11";
  const food = instruction.id === "4A-24";
  const personal =
    instruction.x === "Pre-reading" ||
    survey ||
    food ||
    (kind === "speaking" && !questions.some((q) => keys[q.id]));
  const openReading =
    instruction.id === "2A-30" || (kind === "reading" && /full-sentence/i.test(instruction.x));
  const order = instruction.id === "5E-17";
  const ai = openReading || instruction.id === "5A-55" || (kind === "writing" && !order) || food;
  const ids = survey
    ? questions.flatMap((q) => [1, 2, 3, 4].map((n) => `${q.id}:student${n}`))
    : food
      ? questions.flatMap((q) => ["lunch", "dinner"].map((meal) => `${q.id}:${meal}`))
      : questions.map((q) => q.id);
  const signature = JSON.stringify(ids.map((id) => answers[id] ?? ""));
  const [checked, setChecked] = useState("");
  const [revealed, setRevealed] = useState(false);
  const graded = checked === signature;
  const closed = questions.filter((q) => keys[q.id]);
  const canCheck = closed.length > 0 && !ai && !personal;
  const score = closed.filter((q) => isAnswerMatch(answers[q.id] ?? "", keys[q.id].answer)).length;
  const status = (q: Unit1Block) =>
    graded && canCheck ? (
      <p
        role="status"
        lang="my"
        className={`mt-2 text-xs ${isAnswerMatch(answers[q.id] ?? "", keys[q.id]?.answer ?? "") ? "text-primary" : "text-destructive"}`}
      >
        {!answers[q.id]?.trim()
          ? "မဖြေရသေးပါ။"
          : isAnswerMatch(answers[q.id], keys[q.id]?.answer ?? "")
            ? "✓ မှန်ပါတယ်။"
            : "ထပ်စဉ်းစားကြည့်ပါ။"}
      </p>
    ) : null;
  const field = (q: Unit1Block, id = q.id) => {
    const value = answers[id] ?? "";
    const label =
      food && id !== q.id
        ? `${id.split(":").at(-1)}: ${q.x.split(" — ")[0]}`
        : `Your answer: ${q.x}${id !== q.id ? ` — ${id.split(":").at(-1)?.replace("student", "Student ")}` : ""}`;
    const choices = classify
      ? ["Advantage", "Disadvantage"]
      : q.id.startsWith("3D-") && kind === "listening"
        ? ["TRUE", "FALSE"]
        : instruction.id === "2D-0"
          ? ["1", "2", "3"]
          : instruction.id === "5D-0"
            ? ["A", "B", "C", "D", "E"]
            : instruction.id === "5A-4"
              ? [
                  "Myanmar",
                  "Thailand",
                  "Malaysia",
                  "Singapore",
                  "Indonesia",
                  "Laos",
                  "Vietnam",
                  "The Philippines",
                  "Cambodia",
                  "Brunei Darussalam",
                ]
              : instruction.id === "5A-44"
                ? ["a", "b", "c", "d", "e"]
                : instruction.id === "5A-75"
                  ? (q.x.match(/([A-Za-z]+) \/ ([A-Za-z]+)/)?.slice(1) ?? [])
                  : matching
                    ? (notes
                        .map((n) => n.x.match(/^\(?([a-z])\)?[.)]?\s/i)?.[1])
                        .filter(Boolean) as string[])
                    : [];
    return (
      <div>
        <label className="sr-only" htmlFor={`response-${id}`}>
          {label}
        </label>
        {choices.length ? (
          <select
            id={`response-${id}`}
            aria-label={`Your answer: ${q.x}`}
            value={value}
            onChange={(e) => setAnswer(id, e.target.value)}
            className="w-full rounded-lg border border-border bg-background p-2 text-sm"
          >
            <option value="">Choose…</option>
            {choices.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ) : ai ||
          (kind === "grammar" && (unit === 4 || /^2C-(8[5-9]|9\d)$/.test(q.id))) ||
          kind === "speaking" ? (
          <Textarea
            id={`response-${id}`}
            rows={3}
            maxLength={12000}
            value={value}
            onChange={(e) => setAnswer(id, e.target.value)}
            placeholder="Write your answer…"
          />
        ) : (
          <Input
            id={`response-${id}`}
            value={value}
            onChange={(e) => setAnswer(id, e.target.value)}
            placeholder="Type your answer…"
          />
        )}
        {status(q)}
        {revealed && keys[q.id] && (
          <p className="mt-2 text-sm text-primary">
            {keys[q.id].answer}
            <br />
            {keys[q.id].answerMy}
          </p>
        )}
      </div>
    );
  };
  const prompt = (q: Unit1Block) => (
    <>
      <p lang="en" className="whitespace-pre-line font-medium">
        {q.x}
      </p>
      {q.my && (
        <p lang="my" className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {q.my}
        </p>
      )}
    </>
  );
  const renderNotes = (items: Unit1Block[]) =>
    items.map((b) => (
      <div key={b.id} className="space-y-1">
        {["h", "sub"].includes(b.t) ? (
          <h4 className="font-semibold">{b.x}</h4>
        ) : (
          <p lang="en" className="whitespace-pre-line text-sm leading-relaxed">
            {b.x}
          </p>
        )}
        {b.my && !/^\([ab]\)$/.test(b.x) && (
          <p lang="my" className="text-sm leading-relaxed text-muted-foreground">
            {b.my}
          </p>
        )}
      </div>
    ));
  const poem = instruction.id === "3A-35" ? notes : [];
  const table =
    classify ||
    definitions ||
    matching ||
    kind === "listening" ||
    survey ||
    food ||
    instruction.id === "4E-2" ||
    kind === "speaking" ||
    (unit === 5 && ["5A-4", "5A-44", "5A-55", "5A-62", "5A-68", "5B-4"].includes(instruction.id));
  const tableRows = questions.length ? questions : notes.filter((b) => b.t === "line");
  const summaryAnswer = ids
    .filter((id) => answers[id]?.trim())
    .map((id) => `${id}: ${answers[id]}`)
    .join("\n");
  return (
    <section
      data-exercise={instruction.id}
      className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <header>
        <h3 className="font-semibold">{instruction.x}</h3>
        <p lang="my" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {instruction.my}
        </p>
      </header>
      {instruction.id === "5A-4" && <Grade11Unit5Map />}
      {unit === 5 && table && notes.length > 0 && kind !== "speaking" && (
        <div className="rounded-xl bg-muted/30 p-3 space-y-2">{renderNotes(notes)}</div>
      )}
      {instruction.id === "2D-0" && (
        <div className="grid gap-3 sm:grid-cols-3">
          {questions.map((q, i) => (
            <figure key={q.id}>
              <svg
                viewBox={`${[265, 591, 922][i]} 320 335 310`}
                role="img"
                aria-label={`Textbook listening picture ${i + 1}`}
                className="w-full"
              >
                <image href="/grade11/unit2/page-25.jpg" width="1273" height="1800" />
              </svg>
              <figcaption className="text-sm">Picture {i + 1}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {poem.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            poem.filter((b) => Number(b.id.split("-")[1]) >= 43 && Number(b.id.split("-")[1]) < 50),
            poem.filter((b) => Number(b.id.split("-")[1]) >= 50),
          ].map((lines, i) => (
            <div key={i} className="rounded-xl bg-muted/40 p-4">
              <h4 className="mb-2 font-semibold">Extract ({i === 0 ? "a" : "b"})</h4>
              {renderNotes(lines)}
            </div>
          ))}
        </div>
      )}
      {kind === "speaking" &&
        questions.length > 0 &&
        notes.length > 0 &&
        (survey ? (
          <details className="rounded-xl bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">Sample responses</summary>
            <div className="mt-3 space-y-3">{renderNotes(notes)}</div>
          </details>
        ) : (
          <div className="space-y-3 rounded-xl bg-muted/30 p-4">{renderNotes(notes)}</div>
        ))}
      {instruction.id === "4E-2" && (
        <details className="rounded-xl border border-border p-3">
          <summary className="cursor-pointer font-medium text-primary">
            Sample essay and planning points
          </summary>
          <div className="mt-4 space-y-4">{renderNotes(notes)}</div>
        </details>
      )}
      {unit === 5 && ["5D-14", "5D-21"].includes(instruction.id) ? (
        <Grade11Unit5Speaking
          exercise={instruction.id as "5D-14" | "5D-21"}
          notes={notes}
          open={activeSpeakingExercise === instruction.id}
          onToggle={() =>
            onSpeakingExerciseChange?.(
              activeSpeakingExercise === instruction.id ? null : instruction.id,
            )
          }
          answers={answers}
          setAnswer={setAnswer}
        />
      ) : order ? (
        <div className="space-y-4">
          {notes.map((n) => (
            <details key={n.id} className="rounded-xl border border-border p-3">
              <summary className="cursor-pointer font-semibold">
                Paragraph {n.x.slice(0, 1)}
              </summary>
              <div className="mt-3 space-y-2">{renderNotes([n])}</div>
            </details>
          ))}
          <fieldset className="flex flex-wrap gap-3">
            <legend className="mb-2 font-medium">Paragraph order</legend>
            {[0, 1, 2, 3, 4].map((i) => (
              <label key={i} className="text-sm">
                {i + 1}
                <select
                  aria-label={`Paragraph position ${i + 1}`}
                  className="ml-2 rounded-md border border-border bg-background p-2"
                  value={(answers["5E-23"] ?? "").split(",")[i]?.trim() ?? ""}
                  onChange={(e) => {
                    const parts = Array.from(
                      { length: 5 },
                      (_, j) => (answers["5E-23"] ?? "").split(",")[j]?.trim() ?? "",
                    );
                    parts[i] = e.target.value;
                    setAnswer("5E-23", parts.join(","));
                  }}
                >
                  <option value="">—</option>
                  {["A", "B", "C", "D", "E"].map((letter) => (
                    <option
                      key={letter}
                      value={letter}
                      disabled={
                        (answers["5E-23"] ?? "")
                          .split(",")
                          .map((v) => v.trim())
                          .includes(letter) &&
                        (answers["5E-23"] ?? "").split(",")[i]?.trim() !== letter
                      }
                    >
                      {letter}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </fieldset>
          {status(questions[0])}
          {revealed && <p className="text-sm text-primary">{keys["5E-23"].answer}</p>}
        </div>
      ) : instruction.id === "3D-11" ? (
        <Grade11ExpressionsTable blocks={blocks} />
      ) : table && tableRows.length > 0 ? (
        <div className="relative max-w-full overflow-x-auto">
          <table
            className={`w-full table-fixed border-collapse text-sm ${survey ? "min-w-[850px]" : food || matching ? "min-w-[640px]" : ""}`}
          >
            <caption className="sr-only">{instruction.x}</caption>
            <thead>
              <tr>
                <th
                  className={`${matching ? "w-1/4" : "w-1/2"} border border-border p-3 text-left`}
                >
                  {instruction.id === "5B-4"
                    ? "Noun as modifier"
                    : instruction.id === "5A-62"
                      ? "Country"
                      : definitions
                        ? "Meaning"
                        : matching
                          ? "Column A"
                          : "Textbook item"}
                </th>
                {matching && (
                  <th className="border border-border p-3 text-left">Column B — meanings</th>
                )}
                {survey ? (
                  [1, 2, 3, 4].map((n) => (
                    <th key={n} className="border border-border p-3">
                      Student {n}
                    </th>
                  ))
                ) : food ? (
                  ["Breakfast", "Lunch", "Dinner"].map((meal) => (
                    <th key={meal} className="border border-border p-3">
                      {meal}
                    </th>
                  ))
                ) : (
                  <th className="border border-border p-3 text-left">
                    {instruction.id === "5B-4"
                      ? "Noun which is modified"
                      : instruction.id === "5A-62"
                        ? "Capital city"
                        : classify
                          ? "Advantage / Disadvantage"
                          : "Your answer"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((q, i) => (
                <tr key={q.id}>
                  <th
                    scope="row"
                    className="break-words border border-border p-3 text-left align-top font-normal"
                  >
                    {definitions ? (
                      prompt(notes.filter((b) => b.t === "line")[i])
                    ) : food ? (
                      <>
                        <p>{q.x.split(" — ")[0]}</p>
                        <p lang="my" className="mt-1 leading-relaxed text-muted-foreground">
                          {q.my}
                        </p>
                      </>
                    ) : questions.length === 0 ? (
                      <p lang="en">{q.x}</p>
                    ) : (
                      prompt(q)
                    )}
                  </th>
                  {matching && (
                    <td className="border border-border p-3 align-top">
                      {notes.filter((b) => b.t === "line")[i] &&
                        renderNotes([notes.filter((b) => b.t === "line")[i]])}
                    </td>
                  )}
                  {survey ? (
                    [1, 2, 3, 4].map((n) => (
                      <td key={n} className="border border-border p-2 align-top">
                        {field(q, `${q.id}:student${n}`)}
                      </td>
                    ))
                  ) : food ? (
                    <>
                      <td className="border border-border p-3">
                        {q.x.match(/breakfast: ([^;]+)/)?.[1]}
                      </td>
                      {["lunch", "dinner"].map((meal) => (
                        <td key={meal} className="border border-border p-2">
                          {field(q, `${q.id}:${meal}`)}
                        </td>
                      ))}
                    </>
                  ) : (
                    <td className="border border-border p-3 align-top">
                      {q.t === "q" ? (
                        field(q)
                      ) : (
                        <p lang="my" className="leading-relaxed">
                          {q.my}
                        </p>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {notes.length > 0 && !poem.length && (
            <div className="space-y-3 rounded-xl bg-muted/30 p-4">{renderNotes(notes)}</div>
          )}
          <div className={instruction.id === "3A-28" ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>
            {questions.map((q) => (
              <article
                key={q.id}
                className="min-w-0 space-y-3 rounded-xl border border-border bg-background p-4"
              >
                {prompt(q)}
                {openReading && (
                  <ToggleReveal label="Sentence Structure">
                    {unit === 2 ? (
                      <Grade11Unit2Structure questionId={q.id} />
                    ) : (
                      <Grade11SourceStructure
                        questionText={q.x.replace(/^\d+\.\s*/, "")}
                        sentenceMy={q.my}
                      />
                    )}
                  </ToggleReveal>
                )}
                {field(q)}
              </article>
            ))}
          </div>
        </>
      )}
      {canCheck && (
        <div className="space-y-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={!closed.some((q) => answers[q.id]?.trim())}
            onClick={() => setChecked(signature)}
          >
            Check Answer
          </Button>
          {graded && (
            <p role="status" className="text-sm font-medium">
              {score} / {closed.length} correct
            </p>
          )}
          {!classify && (
            <Button type="button" variant="ghost" onClick={() => setRevealed((old) => !old)}>
              {revealed ? "Hide Answers" : "Reveal Answers"}
            </Button>
          )}
        </div>
      )}
      {ai && questions.length > 0 && (
        <Grade11AIReview
          question={questions.map((q) => `[${q.id}] ${q.x}`).join("\n")}
          instructions={instruction.x}
          context={context}
          answer={summaryAnswer}
          writing={kind === "writing"}
        />
      )}
    </section>
  );
}
