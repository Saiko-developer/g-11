import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { ToggleReveal } from "@/components/lesson/ExerciseKit";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import { Grade11GrammarVideos } from "./Grade11GrammarVideos";
import { Grade11Pronunciation } from "./Grade11Pronunciation";
import { Grade11Unit1Answer } from "./Grade11Unit1Answer";
import { Grade11Unit2Structure } from "./Grade11Unit2Structure";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UNIT2_KEYS, UNIT2_SECTIONS, unit2ScanUrl } from "@/lib/grade11Unit2";
import { UNIT2_GRAMMAR } from "@/lib/grade11Unit2Grammar";
import { splitUnit1, type Unit1Block } from "@/lib/grade11Unit1";
import type { G11SkillKind } from "@/data/grade11/syllabus";

const LETTER = {
  reading: "A",
  vocabulary: "B",
  grammar: "C",
  listening: "D",
  speaking: "D",
  writing: "E",
};

/** Unit 2 owns its layout and drafts; other units keep their current behavior. */
export function Grade11Unit2Workspace({ kind }: { kind: G11SkillKind }) {
  const section = UNIT2_SECTIONS.find((s) => s.code === `2${LETTER[kind]}`)!;
  const { lesson, exercises: allExercises } = splitUnit1(section);
  const exercises = allExercises.filter((ex) =>
    kind === "listening"
      ? ["2D-0", "2D-4"].includes(ex.instruction.id)
      : kind === "speaking"
        ? ["2D-10", "2D-18"].includes(ex.instruction.id)
        : true,
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadedKey, setLoadedKey] = useState("");
  const storageKey = `grade11:unit2:${kind}:drafts`;
  useEffect(() => {
    let restored: Record<string, string> = {};
    try {
      const data: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "{}");
      if (data && typeof data === "object" && !Array.isArray(data))
        restored = Object.fromEntries(
          Object.entries(data).filter(([, v]) => typeof v === "string"),
        );
    } catch {
      /* Keep the lesson usable when storage is unavailable. */
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
  const setAnswer = (id: string, value: string) => setAnswers((old) => ({ ...old, [id]: value }));
  const tasks = exercises.flatMap((ex) => ex.blocks.filter((b) => b.t === "q"));
  const free = kind === "speaking" || kind === "writing";
  const ids = [...tasks.map((b) => b.id), ...(free ? ["free"] : [])];
  const done = ids.filter((id) => answers[id]?.trim()).length;
  const question = (block: Unit1Block, instructions: string, classification = false) => (
    <Unit2Question
      key={block.id}
      block={block}
      instructions={instructions}
      kind={kind}
      value={answers[block.id] ?? ""}
      onChange={(value) => setAnswer(block.id, value)}
      classification={classification}
    />
  );
  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          Progress: {done} / {ids.length} answered
        </p>
        <Progress value={ids.length ? (done / ids.length) * 100 : 0} className="mt-2 h-2" />
      </div>
      {kind !== "speaking" && (
        <header className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-primary">
            {section.code} · {kind === "listening" ? "Listening" : section.title}
          </p>
        </header>
      )}
      <div className={kind === "reading" ? "grid items-start gap-5 lg:grid-cols-2" : "space-y-5"}>
        {kind === "grammar" ? (
          <div className="space-y-5">
            <GrammarScriptView grammar={UNIT2_GRAMMAR} />
            <Grade11GrammarVideos unit={2} />
          </div>
        ) : kind === "reading" || kind === "writing" ? (
          <article className="space-y-3 rounded-2xl border border-border bg-card p-5">
            {lesson.map((b) => (
              <SourceBlock key={b.id} block={b} direct={kind === "writing"} />
            ))}
          </article>
        ) : null}
        <section className="min-w-0 space-y-4" aria-label={`${kind} exercises`}>
          {kind === "vocabulary" && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-semibold">{lesson[0].x}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {lesson.slice(1).map((b) => (
                  <div key={b.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{b.x}</span>
                      <Grade11Pronunciation text={b.x} />
                    </div>
                    <p lang="my" className="text-sm text-muted-foreground">
                      {b.my}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {exercises.map((ex) => (
            <div key={ex.instruction.id} className="rounded-2xl border border-border bg-card p-4">
              <h3 className="border-b border-border pb-2 font-semibold">{ex.instruction.x}</h3>
              {ex.instruction.id === "2A-0" ? (
                <p lang="my" className="mt-2 text-sm text-muted-foreground">
                  {ex.instruction.my}
                </p>
              ) : ex.instruction.id === "2A-16" ? (
                <p lang="my" className="mt-2 text-sm text-muted-foreground">
                  {ex.instruction.my}
                </p>
              ) : (
                kind !== "grammar" && (
                  <ToggleReveal label="Translate Instructions" icon={Languages}>
                    {ex.instruction.my}
                  </ToggleReveal>
                )
              )}
              {ex.instruction.id === "2A-16" ? (
                <table className="mt-3 w-full table-fixed border-collapse text-sm">
                  <caption className="sr-only">
                    Advantages and disadvantages of online shopping
                  </caption>
                  <thead>
                    <tr>
                      <th className="w-[58%] border border-border p-2">Statement</th>
                      <th className="border border-border p-2">
                        Advantage / Disadvantage<p lang="my">ကောင်းကျိုး / ဆိုးကျိုး</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ex.blocks
                      .filter((b) => b.t === "q")
                      .map((b) => (
                        <tr key={b.id}>
                          <th
                            scope="row"
                            className="border border-border p-2 text-left align-top font-normal"
                          >
                            {b.x}
                          </th>
                          <td className="border border-border p-2 align-top">
                            {question(b, ex.instruction.x, true)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : ex.instruction.id === "2D-0" ? (
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  {ex.blocks
                    .filter((b) => b.t === "q")
                    .map((b, index) => (
                      <div
                        key={b.id}
                        className="min-w-0 space-y-2 rounded-xl border border-border p-2"
                      >
                        <svg
                          viewBox={`${[265, 591, 922][index]} 320 335 310`}
                          role="img"
                          aria-label={`Textbook listening picture ${index + 1}`}
                          className="w-full"
                        >
                          <image href={unit2ScanUrl(25)!} width="1273" height="1800" />
                        </svg>
                        {question(b, ex.instruction.x)}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {ex.blocks.map((b) =>
                    b.t === "q" ? (
                      question(b, ex.instruction.x)
                    ) : (
                      <SourceBlock key={b.id} block={b} />
                    ),
                  )}
                </div>
              )}
              {kind === "grammar" && (
                <div className="mt-4">
                  <GrammarExerciseGenerator
                    title={`Grade 11 ${section.code} ${ex.instruction.x.slice(0, 60)}`}
                    instructions={ex.instruction.x}
                    samples={ex.blocks.filter((b) => b.t === "q").map((b) => ({ text: b.x }))}
                  />
                </div>
              )}
            </div>
          ))}
          {free && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <label htmlFor={`unit2-${kind}-response`} className="font-semibold">
                ✍️ Your answer
              </label>
              <Textarea
                id={`unit2-${kind}-response`}
                rows={8}
                value={answers.free ?? ""}
                onChange={(e) => setAnswer("free", e.target.value)}
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

function SourceBlock({ block, direct = false }: { block: Unit1Block; direct?: boolean }) {
  if (block.t === "scan") return null;
  return (
    <div className={block.t === "para" ? "rounded-xl bg-secondary/50 p-4" : ""}>
      {["sub", "h", "ins"].includes(block.t) ? (
        <h4 className="font-semibold text-primary">{block.x}</h4>
      ) : (
        <p className="whitespace-pre-line text-sm leading-relaxed">{block.x}</p>
      )}
      {block.my &&
        (direct ? (
          <p
            lang="my"
            className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground"
          >
            {block.my}
          </p>
        ) : (
          <ToggleReveal label="Show Myanmar Translation" icon={Languages}>
            {block.my}
          </ToggleReveal>
        ))}
    </div>
  );
}

function Unit2Question({
  block,
  instructions,
  kind,
  value,
  onChange,
  classification,
}: {
  block: Unit1Block;
  instructions: string;
  kind: G11SkillKind;
  value: string;
  onChange: (value: string) => void;
  classification: boolean;
}) {
  const key = UNIT2_KEYS[block.id];
  const readingB = /^2A-(3[1-9]|40)$/.test(block.id);
  const personal = block.response === "personal" || ["2A-38", "2A-39", "2A-40"].includes(block.id);
  const rewrite = /^2C-(8[5-9]|9\d)$/.test(block.id);
  return (
    <div
      className={
        classification ? "min-w-0" : "min-w-0 rounded-xl border border-border bg-background p-3"
      }
    >
      {!classification && (
        <p className="whitespace-pre-line text-sm font-medium leading-relaxed">{block.x}</p>
      )}
      {!classification && (
        <div className="mt-2 flex flex-wrap gap-2">
          <ToggleReveal label="Translate Question" icon={Languages}>
            {block.my}
          </ToggleReveal>
          {readingB && (
            <ToggleReveal label="Sentence Structure">
              <Grade11Unit2Structure questionId={block.id} />
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
          onChange={onChange}
          multiline={kind === "reading" || rewrite}
          allowReveal={!classification}
          placeholder={
            classification
              ? "Advantage / Disadvantage"
              : rewrite
                ? "Rewrite the full sentence…"
                : "Type your answer here…"
          }
        />
      ) : kind === "reading" ? (
        <Textarea
          aria-label={`Your answer: ${block.x}`}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your answer…"
        />
      ) : (
        <Input
          aria-label={`Your answer: ${block.x}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here…"
        />
      )}
      {readingB && personal && (
        <p lang="my" className="mt-2 text-xs text-muted-foreground">
          မိမိအမြင်နှင့် အကြောင်းပြချက်ကို ရေးပါ။
        </p>
      )}
    </div>
  );
}
