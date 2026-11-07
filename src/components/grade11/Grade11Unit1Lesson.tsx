import { useState } from "react";
import { Languages, PenLine, Sparkles } from "lucide-react";
import {
  AnswerTryBox,
  OwlBadge,
  StructureBreakdown,
  ToggleReveal,
} from "@/components/lesson/ExerciseKit";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
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
  type Unit1Section,
} from "@/lib/grade11Unit1";

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
  answerKeys: Record<string, { answer: string; answerMy?: string; origin: "source-derived" }>;
  scanUrl: (page: number) => string | null;
};

export function Grade11Unit1Lesson({ kind }: { kind: G11SkillKind }) {
  return (
    <Grade11SourceLesson
      kind={kind}
      unitNumber={1}
      sections={UNIT1_SECTIONS}
      answerKeys={UNIT1_KEYS}
      scanUrl={unit1ScanUrl}
    />
  );
}

/** Verified Grade 11 content reuses the existing lesson controls and AI calls. */
export function Grade11SourceLesson({
  kind,
  unitNumber,
  sections,
  answerKeys,
  scanUrl,
}: SourceLessonProps) {
  const section = sections.find((s) => s.code === `${unitNumber}${LETTER[kind]}`)!;
  const { lesson, exercises } = splitUnit1(section);
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="space-y-3 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {section.code} · {section.title}
          </span>
          <ToggleReveal label="Translate whole section to Burmese" icon={Languages}>
            <p className="whitespace-pre-line leading-relaxed">
              {lesson
                .map((b) => b.my)
                .filter(Boolean)
                .join("\n\n")}
            </p>
          </ToggleReveal>
          {lesson.map((block) => (
            <SourceBlock key={block.id} block={block} scanUrl={scanUrl} />
          ))}
        </article>
        <section className="min-w-0 space-y-4" aria-label={`${section.title} exercises`}>
          <OwlBadge>သင်ခန်းစာကို အရင်လေ့လာပြီး လေ့ကျင့်ခန်းများကို ကိုယ်တိုင်ဖြေကြည့်ပါ။</OwlBadge>
          {exercises.map((ex) => {
            const questions = ex.blocks.filter((b) => b.t === "q");
            const matching = section.code === "1B" && ex.instruction.x.startsWith("A.");
            return (
              <div key={ex.instruction.id} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="flex gap-2 border-b border-border pb-2 font-semibold">
                  <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {ex.instruction.x}
                </h3>
                <ToggleReveal label="Translate Instructions" icon={Languages}>
                  {ex.instruction.my}
                </ToggleReveal>
                {matching && <MatchingColumns blocks={ex.blocks} />}
                <div className="mt-3 space-y-3">
                  {ex.blocks.map((block) => {
                    if (block.t === "q")
                      return (
                        <Question
                          key={block.id}
                          block={block}
                          answerKey={answerKeys[block.id]}
                          scanUrl={scanUrl}
                          instructions={ex.instruction.x}
                          noStructure={/find the bold-faced words/i.test(ex.instruction.x)}
                          onAnswer={(value) => setAnswer(block.id, value)}
                        />
                      );
                    if (matching) return null;
                    return <SourceBlock key={block.id} block={block} scanUrl={scanUrl} />;
                  })}
                </div>
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
            <td className="border border-border p-2">{block.x}</td>
            <td className="border border-border p-2">{right[i]?.x}</td>
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
  onAnswer,
}: {
  block: Unit1Block;
  answerKey?: { answer: string; answerMy?: string };
  scanUrl: (page: number) => string | null;
  instructions: string;
  noStructure: boolean;
  onAnswer: (value: string) => void;
}) {
  const key = answerKey;
  const label = `Your answer: ${block.x}`;
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <p className="whitespace-pre-line text-sm font-medium leading-relaxed">{block.x}</p>
      {block.scanPage && <SourceScan page={block.scanPage} scanUrl={scanUrl} />}
      {!block.scanPage && (
        <div className="mt-2 flex flex-wrap gap-2">
          <ToggleReveal label="Translate Question" icon={Languages}>
            {block.my}
          </ToggleReveal>
          {!noStructure && (
            <ToggleReveal label="Sentence Structure" icon={Sparkles} tone="primary">
              <StructureBreakdown questionText={block.x} />
            </ToggleReveal>
          )}
        </div>
      )}
      {key ? (
        <div onInput={(event) => onAnswer((event.target as HTMLInputElement).value ?? "")}>
          <p className="mt-2 text-xs text-muted-foreground">
            သင်ခန်းစာမှ ဆက်စပ်ဖြေဆိုထားသောအဖြေ — တရားဝင်အဖြေလွှာ မဟုတ်ပါ။
          </p>
          <AnswerTryBox
            correct={key.answer}
            correctMy={key.answerMy}
            question={block.x}
            instructions={instructions}
          />
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <Input
            aria-label={label}
            placeholder={
              block.response === "personal" && /^[a-e]\./.test(block.x)
                ? "✓ / ✗"
                : "Type your answer here…"
            }
            onChange={(event) => onAnswer(event.target.value)}
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {block.response === "audio"
              ? "🎧 ဤလေ့ကျင့်ခန်းအတွက် Grade 11 အသံဖိုင် မရရှိသေးပါ။"
              : block.response === "personal"
                ? "မိမိအတွေ့အကြုံနှင့် ခံစားချက်အတိုင်း ဖြေဆိုပါ။"
                : "မူရင်းဖတ်စာအုပ်တွင် ဤမေးခွန်း၏ အဖြေလွှာ မပေးထားပါ။ ကိုယ်တိုင်ဖြေပြီး ဆရာနှင့် ဆွေးနွေးနိုင်ပါသည်။"}
          </p>
        </div>
      )}
    </div>
  );
}
