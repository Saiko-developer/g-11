import { Grade11SourceStructure } from "./Grade11SourceStructure";
import { Grade11GrammarVideos } from "./Grade11GrammarVideos";
import { Grade11SourceAnswer } from "./Grade11SourceAnswer";
import { useEffect, useState } from "react";
import { Languages, PenLine, Sparkles } from "lucide-react";
import { OwlBadge, ToggleReveal } from "@/components/lesson/ExerciseKit";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import { splitUnit1, type Unit1Block, type Unit1Section } from "@/lib/grade11Unit1";

const LETTER: Record<G11SkillKind, string> = {
  reading: "A",
  vocabulary: "B",
  grammar: "C",
  listening: "D",
  speaking: "D",
  writing: "E",
};

type SourceLessonProps = {
  kind: G11SkillKind;
  unitNumber: number;
  sections: Unit1Section[];
  answerKeys: Record<
    string,
    { answer: string; answerMy?: string; origin: "source-derived"; kind?: "closed" | "suggested" }
  >;
  scanUrl: (page: number) => string | null;
};

/** Verified Grade 11 content reuses the existing lesson controls and AI calls. */
export function Grade11SourceWorkspace({
  kind,
  unitNumber,
  sections,
  answerKeys,
  scanUrl,
}: SourceLessonProps) {
  const section = sections.find((s) => s.code === `${unitNumber}${LETTER[kind]}`)!;
  const split = splitUnit1(section);
  const speakingStart = ({ 3: 11, 4: 11, 5: 14, 6: 11 } as Record<number, number>)[unitNumber] ?? 0;
  const belongs = (id: string) => Number(id.split("-")[1]) >= speakingStart;
  const lesson = split.lesson.filter((b) =>
    kind === "listening" ? !belongs(b.id) : kind === "speaking" ? belongs(b.id) : true,
  );
  const exercises = split.exercises.filter((ex) =>
    kind === "listening"
      ? !belongs(ex.instruction.id)
      : kind === "speaking"
        ? belongs(ex.instruction.id)
        : true,
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const storageKey = `grade11:unit${unitNumber}:${kind}:drafts:v1`;
  const [loadedKey, setLoadedKey] = useState("");
  useEffect(() => {
    let restored: Record<string, string> = {};
    try {
      const data: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "{}");
      if (data && typeof data === "object" && !Array.isArray(data))
        restored = Object.fromEntries(
          Object.entries(data).filter(([, value]) => typeof value === "string"),
        );
    } catch {
      /* Storage is optional. */
    }
    setAnswers(restored);
    setLoadedKey(storageKey);
  }, [storageKey]);
  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      /* In-memory fallback. */
    }
  }, [answers, loadedKey, storageKey]);
  const tasks = exercises.flatMap((ex) => ex.blocks.filter((b) => b.t === "q"));
  const writeFree = kind === "writing" || kind === "speaking";
  const survey = kind === "speaking" && unitNumber === 4;
  const taskIds = tasks.flatMap((b) =>
    survey
      ? [1, 2, 3, 4].map((student) => `${b.id}:student${student}`)
      : b.id.startsWith("6A-") && Number(b.id.slice(3)) >= 34 && Number(b.id.slice(3)) <= 42
        ? [`${b.id}:country`, b.id]
        : ["4A-26", "4A-27"].includes(b.id)
          ? [`${b.id}:lunch`, `${b.id}:dinner`]
          : [b.id],
  );
  const freeTasks = writeFree
    ? kind === "speaking" && unitNumber === 5
      ? exercises
          .filter((ex) => ["5D-14", "5D-21"].includes(ex.instruction.id))
          .map((ex) => ({ id: `${ex.instruction.id}:response`, title: ex.instruction.x }))
      : [{ id: "free", title: "✍️ Your answer" }]
    : [];
  const total = taskIds.length + freeTasks.length;
  const done = [...taskIds, ...freeTasks.map((task) => task.id)].filter((id) =>
    answers[id]?.trim(),
  ).length;
  const setAnswer = (id: string, value: string) => setAnswers((old) => ({ ...old, [id]: value }));

  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Progress: {done} / {total} answered
          </span>
          <span>{total ? Math.round((done / total) * 100) : 0}%</span>
        </div>
        <Progress value={total ? (done / total) * 100 : 0} className="mt-2 h-2" />
      </div>
      {kind === "grammar" && <Grade11GrammarVideos unit={unitNumber} />}
      <header className="rounded-2xl border border-border bg-card p-4">
        <h2 className="font-semibold">
          {section.code} ·{" "}
          {kind === "listening" ? "Listening" : kind === "speaking" ? "Speaking" : section.title}
        </h2>
      </header>
      <div
        className={
          kind === "reading" && lesson.length
            ? "grid items-start gap-5 lg:grid-cols-2"
            : "space-y-5"
        }
      >
        {lesson.length > 0 && (
          <article
            className={`space-y-3 rounded-2xl border border-border bg-card p-5 ${kind === "reading" ? "lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto" : ""}`}
          >
            {lesson.some((b) => b.t !== "scan") && (
              <ToggleReveal label="Translate whole section to Burmese" icon={Languages}>
                <p className="whitespace-pre-line leading-relaxed">
                  {lesson
                    .map((b) => b.my)
                    .filter(Boolean)
                    .join("\n\n")}
                </p>
              </ToggleReveal>
            )}
            {lesson.map((block) => (
              <SourceBlock key={block.id} block={block} scanUrl={scanUrl} />
            ))}
          </article>
        )}
        <section className="min-w-0 space-y-4" aria-label={`${section.title} exercises`}>
          <OwlBadge>သင်ခန်းစာကို အရင်လေ့လာပြီး လေ့ကျင့်ခန်းများကို ကိုယ်တိုင်ဖြေကြည့်ပါ။</OwlBadge>
          {exercises.map((ex) => {
            const questions = ex.blocks.filter((b) => b.t === "q");
            const matching = /Match .*Column A/i.test(ex.instruction.x);
            const table =
              matching ||
              /Complete .*table|capital cit|tourism.*information/i.test(ex.instruction.x) ||
              ["4A-24", "4E-2", "5B-4", "6A-32", "6E-0"].includes(ex.instruction.id);
            const renderQuestion = (block: Unit1Block) => (
              <Question
                key={block.id}
                block={block}
                answerKey={answerKeys[block.id]}
                scanUrl={scanUrl}
                instructions={ex.instruction.x}
                noStructure={!(kind === "reading" && /full-sentence/i.test(ex.instruction.x))}
                multiline={
                  (kind === "reading" && !table) ||
                  (kind === "grammar" && unitNumber !== 3) ||
                  ex.instruction.id === "5B-4" ||
                  ex.instruction.id === "6A-32" ||
                  kind === "writing" ||
                  kind === "speaking"
                }
                value={answers[block.id] ?? ""}
                onAnswer={(value) => setAnswer(block.id, value)}
                hidePrompt={table}
              />
            );
            return (
              <div key={ex.instruction.id} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="flex gap-2 border-b border-border pb-2 font-semibold">
                  <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {ex.instruction.x}
                </h3>
                {ex.instruction.x === "Pre-reading" ? (
                  <p lang="my" className="mt-2 text-sm text-muted-foreground">
                    {ex.instruction.my}
                  </p>
                ) : (
                  ex.instruction.my && (
                    <ToggleReveal label="Translate Instructions" icon={Languages}>
                      {ex.instruction.my}
                    </ToggleReveal>
                  )
                )}
                {survey ? (
                  <div className="mt-3 space-y-4">
                    {questions.map((block, index) => (
                      <fieldset key={block.id} className="rounded-xl border border-border p-3">
                        <legend className="px-1 text-sm font-medium">{block.x}</legend>
                        <ToggleReveal label="Translate Question" icon={Languages}>
                          {block.my}
                        </ToggleReveal>
                        {ex.blocks.filter((b) => b.t === "line")[index] && (
                          <p lang="en" className="mt-2 text-sm text-muted-foreground">
                            Sample response: {ex.blocks.filter((b) => b.t === "line")[index].x}
                          </p>
                        )}
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {[1, 2, 3, 4].map((student) => (
                            <label key={student} className="text-sm">
                              Student {student}
                              <Textarea
                                aria-label={`${block.x} — Student ${student}`}
                                value={answers[`${block.id}:student${student}`] ?? ""}
                                onChange={(e) =>
                                  setAnswer(`${block.id}:student${student}`, e.target.value)
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                    {ex.blocks
                      .filter((b) => b.t !== "q" && b.t !== "line")
                      .map((b) => (
                        <SourceBlock key={b.id} block={b} scanUrl={scanUrl} />
                      ))}
                  </div>
                ) : ex.instruction.id === "4A-24" ? (
                  <div className="mt-3 max-w-full overflow-x-auto">
                    <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
                      <caption className="sr-only">{ex.instruction.x}</caption>
                      <thead>
                        <tr>
                          {["Food", "Breakfast", "Lunch", "Dinner"].map((heading) => (
                            <th key={heading} scope="col" className="border border-border p-2">
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((block) => (
                          <tr key={block.id}>
                            <th
                              scope="row"
                              className="border border-border p-2 text-left font-normal"
                            >
                              {block.x.split(" — ")[0]}
                              <ToggleReveal label="Translate Question" icon={Languages}>
                                {block.my}
                              </ToggleReveal>
                            </th>
                            <td className="border border-border p-2">
                              {block.x.match(/breakfast: ([^;]+)/)?.[1]}
                            </td>
                            {["lunch", "dinner"].map((meal) => (
                              <td key={meal} className="border border-border p-2">
                                <Input
                                  aria-label={`${meal}: ${block.x.split(" — ")[0]}`}
                                  value={answers[`${block.id}:${meal}`] ?? ""}
                                  onChange={(event) =>
                                    setAnswer(`${block.id}:${meal}`, event.target.value)
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {ex.blocks
                      .filter((b) => b.t !== "q")
                      .map((b) => (
                        <SourceBlock key={b.id} block={b} scanUrl={scanUrl} />
                      ))}
                  </div>
                ) : table ? (
                  <div className="mt-3 space-y-3">
                    {matching ? (
                      <div className="grid gap-2 sm:grid-cols-2" aria-label="Column B meanings">
                        {ex.blocks
                          .filter((b) => b.t === "line")
                          .map((b) => (
                            <SourceBlock key={b.id} block={b} scanUrl={scanUrl} />
                          ))}
                      </div>
                    ) : (
                      ex.blocks
                        .filter((b) => b.t !== "q")
                        .map((b) => <SourceBlock key={b.id} block={b} scanUrl={scanUrl} />)
                    )}
                    <div className="max-w-full overflow-x-auto">
                      <table
                        className={`w-full table-fixed border-collapse text-sm ${ex.instruction.id === "6A-32" ? "min-w-[600px]" : "min-w-[360px]"}`}
                      >
                        <caption className="sr-only">{ex.instruction.x}</caption>
                        <thead>
                          <tr>
                            <th scope="col" className="w-1/2 border border-border p-2">
                              {matching
                                ? "Column A"
                                : ex.instruction.id === "6A-32"
                                  ? "Tourist destination"
                                  : "Textbook item"}
                            </th>
                            {ex.instruction.id === "6A-32" && (
                              <th scope="col" className="border border-border p-2">
                                Country
                              </th>
                            )}
                            <th scope="col" className="border border-border p-2">
                              {matching
                                ? "Your match"
                                : ex.instruction.id === "6A-32"
                                  ? "Why it is famous"
                                  : "Your answer"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.map((block) => (
                            <tr key={block.id}>
                              <th
                                scope="row"
                                className="break-words border border-border p-2 text-left align-top font-normal"
                              >
                                {block.x}
                              </th>
                              {ex.instruction.id === "6A-32" && (
                                <td className="border border-border p-2 align-top">
                                  <Input
                                    aria-label={`Country: ${block.x}`}
                                    value={answers[`${block.id}:country`] ?? ""}
                                    onChange={(e) =>
                                      setAnswer(`${block.id}:country`, e.target.value)
                                    }
                                  />
                                </td>
                              )}
                              <td className="border border-border p-2 align-top">
                                {renderQuestion(block)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {ex.blocks.map((block) =>
                      block.t === "q" ? (
                        renderQuestion(block)
                      ) : block.t === "scan" &&
                        lesson.some((b) => b.scanPage === block.scanPage) ? null : (
                        <SourceBlock key={block.id} block={block} scanUrl={scanUrl} />
                      ),
                    )}
                  </div>
                )}
                {kind === "grammar" && questions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">
                      အောက်ပါ AI အပိုလေ့ကျင့်ခန်းများသည် မူရင်းဖတ်စာအုပ်ထဲမှ မဟုတ်ပါ။
                    </p>
                    <GrammarExerciseGenerator
                      title={`Grade 11 ${section.code} ${ex.instruction.x.slice(0, 60)}`}
                      instructions={ex.instruction.x}
                      samples={questions.filter((b) => !b.scanPage).map((b) => ({ text: b.x }))}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {freeTasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-border bg-card p-4">
              <label
                htmlFor={`unit${unitNumber}-${kind}-${task.id}-response`}
                className="font-semibold"
              >
                {task.title}
              </label>
              {kind === "writing" && unitNumber === 6 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Words: {answers.free?.trim().split(/\s+/).filter(Boolean).length ?? 0} / 200–250
                </p>
              )}
              <Textarea
                id={`unit${unitNumber}-${kind}-${task.id}-response`}
                rows={8}
                value={answers[task.id] ?? ""}
                onChange={(event) => setAnswer(task.id, event.target.value)}
                placeholder="Write your answer…"
                className="mt-2"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function SourceScan({ page, scanUrl }: { page: number; scanUrl: (page: number) => string | null }) {
  const url = scanUrl(page);
  if (!url) return null;
  return (
    <details open={page === 29 || page === 51} className="mt-3 rounded-xl border border-border">
      <summary className="cursor-pointer p-3 text-sm font-medium">
        View original textbook page {page - 5}
      </summary>
      <figure className="overflow-hidden rounded-xl">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open textbook page ${page - 5}`}
        >
          <img
            src={url}
            alt={`Grade 11 textbook page ${page - 5}`}
            loading="lazy"
            className="h-auto w-full"
          />
        </a>
        <figcaption className="bg-muted p-2 text-xs text-muted-foreground">
          မူရင်းဖတ်စာအုပ် စာမျက်နှာ {page - 5} — ပုံကိုနှိပ်၍ ချဲ့ကြည့်နိုင်ပါသည်။
        </figcaption>
      </figure>
    </details>
  );
}

function SourceBlock({
  block,
  scanUrl,
}: {
  block: Unit1Block;
  scanUrl: (page: number) => string | null;
}) {
  if (block.t === "scan")
    return (
      <div>
        <SourceScan page={block.scanPage!} scanUrl={scanUrl} />
        {block.my && (
          <ToggleReveal label="Show Myanmar Translation" icon={Languages}>
            <p className="whitespace-pre-line">{block.my}</p>
          </ToggleReveal>
        )}
      </div>
    );
  return (
    <div className={block.t === "para" ? "rounded-xl bg-secondary/50 p-4" : ""}>
      {block.t === "sub" || block.t === "h" ? (
        <h4 className="pt-2 font-semibold text-primary">{block.x}</h4>
      ) : (
        <p className="whitespace-pre-line text-sm leading-relaxed">
          <SourceText block={block} />
        </p>
      )}
      {block.my && (
        <ToggleReveal label="Show Myanmar Translation" icon={Languages}>
          <p className="whitespace-pre-line">{block.my}</p>
        </ToggleReveal>
      )}
    </div>
  );
}

/** Preserve the textbook's bold-faced vocabulary without HTML in source data. */
function SourceText({ block }: { block: Unit1Block }) {
  const words = block.emphasis ?? [];
  if (!words.length) return block.x;
  const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return block.x
    .split(new RegExp(`(${escaped.join("|")})`, "g"))
    .map((part, i) => (words.includes(part) ? <strong key={i}>{part}</strong> : part));
}

function Question({
  block,
  answerKey,
  scanUrl,
  instructions,
  noStructure,
  onAnswer,
  value,
  multiline,
  hidePrompt = false,
}: {
  block: Unit1Block;
  answerKey?: { answer: string; answerMy?: string; kind?: "closed" | "suggested" };
  scanUrl: (page: number) => string | null;
  instructions: string;
  noStructure: boolean;
  onAnswer: (value: string) => void;
  value: string;
  multiline: boolean;
  hidePrompt?: boolean;
}) {
  const key = answerKey;
  const label = `Your answer: ${block.x}`;
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      {!hidePrompt && (
        <p lang="en" className="whitespace-pre-line text-sm font-medium leading-relaxed">
          {block.x}
        </p>
      )}
      {block.scanPage && <SourceScan page={block.scanPage} scanUrl={scanUrl} />}
      {!block.scanPage && (
        <div className="mt-2 flex flex-wrap gap-2">
          <ToggleReveal label="Translate Question" icon={Languages}>
            {block.my}
          </ToggleReveal>
          {!noStructure && (
            <ToggleReveal label="Sentence Structure" icon={Sparkles} tone="primary">
              <Grade11SourceStructure
                questionText={block.x.replace(/^\d+\.\s*/, "")}
                sentenceMy={block.my}
              />
            </ToggleReveal>
          )}
        </div>
      )}
      {key ? (
        <Grade11SourceAnswer
          correct={key.answer}
          correctMy={key.answerMy}
          question={block.x}
          instructions={instructions}
          value={value}
          onChange={onAnswer}
          multiline={multiline}
          allowCheck={key.kind !== "suggested"}
          choices={
            block.id === "5A-3"
              ? [...block.x.matchAll(/\(([a-f])\)\s*([A-Za-z]+)/g)].map((match) => ({
                  value: match[1],
                  label: match[2],
                }))
              : undefined
          }
          order={block.id === "5E-23"}
        />
      ) : (
        <div className="mt-3 space-y-2">
          {block.response === "audio" && block.id.startsWith("3D-") ? (
            <select
              aria-label={label}
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              value={value}
              onChange={(e) => onAnswer(e.target.value)}
            >
              <option value="">Choose…</option>
              <option value="TRUE">TRUE</option>
              <option value="FALSE">FALSE</option>
            </select>
          ) : multiline ? (
            <Textarea
              aria-label={label}
              rows={3}
              value={value}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Write your answer…"
            />
          ) : (
            <Input
              aria-label={label}
              value={value}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Type your answer here…"
            />
          )}
          {block.response !== "audio" && (
            <p lang="my" className="text-xs text-muted-foreground">
              {block.response === "personal"
                ? "မိမိအတွေ့အကြုံနှင့် ခံစားချက်အတိုင်း ဖြေဆိုပါ။"
                : "မူရင်းစာအုပ်နှင့် တိုက်စစ်ပြီး ဆရာနှင့် ဆွေးနွေးနိုင်ပါသည်။"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
