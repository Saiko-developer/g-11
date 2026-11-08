import { Grade11RolePlay } from "./Grade11RolePlay";
import { RequireSignIn } from "@/components/RequireSignIn";
import { Button } from "@/components/ui/button";
import { Grade11Unit1ExerciseBlocks } from "./Grade11Unit1ExerciseBlocks";
import { Grade11GrammarVideos } from "./Grade11GrammarVideos";
import { Grade11Pronunciation } from "./Grade11Pronunciation";
import { UNIT1_READING_C_WORDS } from "@/data/grade11/unit1ReadingStructure";
import { Grade11ReadingStructure } from "./Grade11ReadingStructure";
import { useEffect, useState } from "react";
import { Languages, PenLine, Sparkles } from "lucide-react";
import { OwlBadge, StructureBreakdown, ToggleReveal } from "@/components/lesson/ExerciseKit";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import { Grade11Unit1Answer } from "./Grade11Unit1Answer";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { UNIT1_GRAMMAR } from "@/lib/grade11Unit1Grammar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import {
  splitUnit1,
  UNIT1_KEYS,
  UNIT1_SECTIONS,
  unit1ScanUrl,
  type Unit1Block,
} from "@/lib/grade11Unit1";

const LETTER: Record<G11SkillKind, string> = {
  reading: "A",
  vocabulary: "B",
  grammar: "C",
  listening: "D",
  speaking: "D",
  writing: "E",
};

/** Unit 1 presentation is isolated from Grade 10 and other Grade 11 units. */
export function Grade11Unit1Workspace({ kind }: { kind: G11SkillKind }) {
  const unitNumber = 1;
  const [aiExercise, setAiExercise] = useState<string | null>(null);
  const sections = UNIT1_SECTIONS;
  const answerKeys = UNIT1_KEYS;
  const scanUrl = unit1ScanUrl;
  const section = sections.find((s) => s.code === `${unitNumber}${LETTER[kind]}`)!;
  const { lesson, exercises: allExercises } = splitUnit1(section);
  const exercises = allExercises.filter((ex) =>
    kind === "listening"
      ? ex.instruction.id === "1D-0"
      : kind === "speaking"
        ? ex.instruction.id !== "1D-0"
        : true,
  );
  const storageKey = `grade11:unit1:${kind}:drafts`;
  const [loadedKey, setLoadedKey] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  useEffect(() => {
    let restored: Record<string, string> = {};
    try {
      const parsed: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        restored = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => typeof v === "string"),
        );
    } catch {
      /* Storage may be unavailable; the lesson still works in memory. */
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
  const total = tasks.length + Number(writeFree);
  const done = [...tasks.map((b) => b.id), ...(writeFree ? ["free"] : [])].filter((id) =>
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
      {(kind === "vocabulary" || kind === "grammar") && (
        <header className="rounded-2xl border border-border bg-card p-5">
          <span className="text-xs font-semibold text-primary">
            {section.code} · {kind === "grammar" ? "Grammar" : "Vocabulary"}
          </span>
          <h2 className="mt-2 text-2xl font-bold">{section.title}</h2>
        </header>
      )}

      <div className={kind === "reading" ? "grid gap-5 lg:grid-cols-2" : "space-y-5"}>
        {kind !== "vocabulary" &&
          (kind !== "speaking" || lesson.length > 0) &&
          (kind === "grammar" ? (
            <GrammarScriptView grammar={UNIT1_GRAMMAR} />
          ) : (
            <article className="space-y-3 rounded-2xl border border-border bg-card p-5">
              {kind !== "speaking" && (
                <header>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {section.code} · {kind === "listening" ? "Listening" : section.title}
                  </span>
                </header>
              )}
              {lesson
                .filter((block) => !(kind === "writing" && block.t === "scan"))
                .map((block) => (
                  <SourceBlock
                    key={block.id}
                    block={block}
                    scanUrl={scanUrl}
                    directMy={kind === "writing"}
                  />
                ))}
            </article>
          ))}
        {kind === "grammar" && <Grade11GrammarVideos unit={1} />}
        <section className="min-w-0 space-y-4" aria-label={`${section.title} exercises`}>
          <OwlBadge>သင်ခန်းစာကို အရင်လေ့လာပြီး လေ့ကျင့်ခန်းများကို ကိုယ်တိုင်ဖြေကြည့်ပါ။</OwlBadge>
          {exercises.map((ex) => {
            const questions = ex.blocks.filter((b) => b.t === "q");
            const matching = section.code === "1B" && ex.instruction.x.startsWith("A.");
            return (
              <div
                key={ex.instruction.id}
                data-exercise={ex.instruction.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <h3 className="flex gap-2 border-b border-border pb-2 font-semibold">
                  <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {ex.instruction.x}
                </h3>
                {kind === "writing" ||
                kind === "speaking" ||
                ["1A-0", "1A-28"].includes(ex.instruction.id) ? (
                  <p className="mt-2 text-sm text-muted-foreground">{ex.instruction.my}</p>
                ) : (
                  (kind !== "reading" || ex.instruction.id === "1A-36") &&
                  ex.instruction.id !== "1C-12" && (
                    <ToggleReveal label="Translate Instructions" icon={Languages}>
                      {ex.instruction.my}
                    </ToggleReveal>
                  )
                )}

                {matching && <MatchingColumns blocks={ex.blocks} />}
                {ex.instruction.id === "1D-12" && (
                  <table className="mt-3 w-full table-fixed border-collapse text-sm">
                    <caption className="sr-only">Questions for the trip dialogue</caption>
                    <thead>
                      <tr>
                        <th className="border border-border p-3 text-left">Question</th>
                        <th className="border border-border p-3 text-left">မြန်မာပြန်</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ex.blocks
                        .filter((b) => /^1D-1[3-7]$/.test(b.id))
                        .map((b) => (
                          <tr key={b.id}>
                            <th
                              scope="row"
                              className="border border-border p-3 text-left font-normal"
                            >
                              {b.x}
                            </th>
                            <td lang="my" className="border border-border p-3 leading-relaxed">
                              {b.my}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {["1D-30", "1D-31"].includes(ex.instruction.id) && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      aria-expanded={aiExercise === ex.instruction.id}
                      onClick={() =>
                        setAiExercise((old) =>
                          old === ex.instruction.id ? null : ex.instruction.id,
                        )
                      }
                    >
                      Practise with AI
                    </Button>
                    {aiExercise === ex.instruction.id && (
                      <div className="mt-3">
                        <RequireSignIn>
                          <Grade11RolePlay
                            key={ex.instruction.id}
                            unit={1}
                            exercise={ex.instruction.id as "1D-30" | "1D-31"}
                          />
                        </RequireSignIn>
                      </div>
                    )}
                  </div>
                )}
                <Grade11Unit1ExerciseBlocks
                  blocks={
                    ex.instruction.id === "1D-12"
                      ? ex.blocks.filter((b) => !/^1D-1[3-7]$/.test(b.id))
                      : ex.blocks
                  }
                  layout={
                    ex.instruction.id === "1D-0"
                      ? "listening"
                      : ex.instruction.id === "1D-12"
                        ? "dialogue"
                        : undefined
                  }
                  renderBlock={(block) => {
                    if (block.t === "q")
                      return (
                        <Question
                          key={block.id}
                          block={block}
                          answerKey={answerKeys[block.id]}
                          scanUrl={scanUrl}
                          instructions={ex.instruction.x}
                          value={answers[block.id] ?? ""}
                          textarea={kind === "reading"}
                          directMy={kind === "speaking"}
                          translate={
                            kind !== "speaking" &&
                            (kind !== "reading" ||
                              ["1A-0", "1A-28", "1A-36"].includes(ex.instruction.id))
                          }
                          reveal={
                            !(kind === "reading" && ["1A-16", "1A-28"].includes(ex.instruction.id))
                          }
                          noStructure={ex.instruction.id !== "1A-36"}
                          onAnswer={(value) => setAnswer(block.id, value)}
                        />
                      );
                    if (matching) return null;
                    return (
                      <SourceBlock
                        key={block.id}
                        block={block}
                        scanUrl={scanUrl}
                        directMy={
                          kind === "writing" ||
                          kind === "speaking" ||
                          /^1A-(18|19|20|21|22)$/.test(block.id)
                        }
                        hideMy={
                          kind === "reading" &&
                          ex.instruction.id !== "1A-0" &&
                          !/^1A-(18|19|20|21|22)$/.test(block.id)
                        }
                      />
                    );
                  }}
                />
                {kind === "grammar" && questions.length > 0 && (
                  <div className="mt-4">
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
          {writeFree && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <label htmlFor={`unit${unitNumber}-${kind}-response`} className="font-semibold">
                ✍️ Your answer
              </label>
              <Textarea
                id={`unit${unitNumber}-${kind}-response`}
                rows={8}
                value={answers.free ?? ""}
                onChange={(event) => setAnswer("free", event.target.value)}
                placeholder="Write your answer…"
                className="mt-2"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SourceScan({ page, scanUrl }: { page: number; scanUrl: (page: number) => string | null }) {
  const url = scanUrl(page);
  if (!url) return null;
  return (
    <figure className="mt-3 overflow-hidden rounded-xl border border-border">
      <a href={url} target="_blank" rel="noreferrer" aria-label={`Open textbook page ${page - 5}`}>
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
  );
}

function SourceBlock({
  block,
  scanUrl,
  directMy = false,
  hideMy = false,
}: {
  directMy?: boolean;
  hideMy?: boolean;
  block: Unit1Block;
  scanUrl: (page: number) => string | null;
}) {
  if (block.t === "scan")
    return (
      <div>
        <SourceScan page={block.scanPage!} scanUrl={scanUrl} />
        {block.my &&
          !hideMy &&
          (directMy ? (
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{block.my}</p>
          ) : (
            <ToggleReveal label="Show Myanmar Translation" icon={Languages}>
              <p className="whitespace-pre-line">{block.my}</p>
            </ToggleReveal>
          ))}
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
      {block.my &&
        !hideMy &&
        (directMy ? (
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{block.my}</p>
        ) : (
          <ToggleReveal label="Show Myanmar Translation" icon={Languages}>
            <p className="whitespace-pre-line">{block.my}</p>
          </ToggleReveal>
        ))}
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

function MatchingColumns({ blocks }: { blocks: Unit1Block[] }) {
  const left = blocks.filter((b) => b.t === "q");
  const right = blocks.filter((b) => b.t === "line" && /^[a-j]\./.test(b.x));
  return (
    <table className="mt-4 w-full table-fixed border-collapse text-sm">
      <caption className="sr-only">Adverb and adjective matching</caption>
      <thead>
        <tr>
          <th scope="col" className="border border-border p-2">
            Column A
          </th>
          <th scope="col" className="border border-border p-2">
            Column B
          </th>
        </tr>
      </thead>
      <tbody>
        {left.map((block, i) => (
          <tr key={block.id}>
            <td className="border border-border p-2">
              <div className="flex items-center justify-between gap-1">
                <span>{block.x}</span>
                <Grade11Pronunciation text={block.x} />
              </div>
            </td>
            <td className="border border-border p-2">
              <div className="flex items-center justify-between gap-1">
                <span>{right[i]?.x}</span>
                {right[i] && <Grade11Pronunciation text={right[i].x} />}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Question({
  block,
  answerKey,
  scanUrl,
  instructions,
  noStructure,
  value,
  textarea,
  directMy,
  translate,
  reveal,
  onAnswer,
}: {
  block: Unit1Block;
  answerKey?: { answer: string; answerMy?: string };
  scanUrl: (page: number) => string | null;
  instructions: string;
  noStructure: boolean;
  value: string;
  textarea: boolean;
  directMy: boolean;
  translate: boolean;
  reveal: boolean;
  onAnswer: (value: string) => void;
}) {
  const key = answerKey;
  const label = `Your answer: ${block.x}`;
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <p className="whitespace-pre-line text-sm font-medium leading-relaxed">{block.x}</p>
      {block.scanPage && <SourceScan page={block.scanPage} scanUrl={scanUrl} />}
      {directMy && <p className="mt-2 text-sm text-muted-foreground">{block.my}</p>}
      {!block.scanPage && (
        <div className="mt-2 flex flex-wrap gap-2">
          {translate && (
            <ToggleReveal label="Translate Question" icon={Languages}>
              {block.my}
            </ToggleReveal>
          )}
          {!noStructure && (
            <ToggleReveal label="Sentence Structure" icon={Sparkles} tone="primary">
              {UNIT1_READING_C_WORDS[block.id] ? (
                <Grade11ReadingStructure questionId={block.id} />
              ) : (
                <StructureBreakdown questionText={block.x} />
              )}
            </ToggleReveal>
          )}
        </div>
      )}
      {key ? (
        <Grade11Unit1Answer
          correct={key.answer}
          correctMy={key.answerMy}
          question={block.x}
          instructions={instructions}
          value={value}
          onChange={onAnswer}
          multiline={textarea}
          allowReveal={reveal}
        />
      ) : (
        <div className="mt-3 space-y-2">
          {textarea ? (
            <Textarea
              aria-label={label}
              rows={3}
              value={value}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Type your answer here…"
            />
          ) : (
            <Input
              aria-label={label}
              value={value}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Type your answer here…"
            />
          )}
        </div>
      )}
    </div>
  );
}
