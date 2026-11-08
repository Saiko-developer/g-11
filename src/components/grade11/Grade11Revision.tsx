import { BookOpen, Languages, ListChecks, Sparkles } from "lucide-react";
import {
  AnswerTryBox,
  OwlBadge,
  StructureBreakdown,
  ToggleReveal,
} from "@/components/lesson/ExerciseKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import review from "@/data/grade11/textbook/review1.json";
import reviewAnswers from "@/data/grade11/textbook/review1-answer.json";
import poem from "@/data/grade11/textbook/poem1.json";
import poemAnswers from "@/data/grade11/textbook/poem1-answer.json";
import { grade11AnswerKeys, type SourceAnswer } from "@/lib/grade11Answers";

const REVIEW_KEYS = grade11AnswerKeys(reviewAnswers);
const POEM_KEYS = grade11AnswerKeys(poemAnswers);
type Item = {
  id: string;
  number: number;
  question: string;
  translationMy: string;
  scanPage?: number;
};

/** The Grade 10 question controls and layout, with separate Grade 11 source data. */
function RevisionQuestion({
  item,
  answer,
  instructions,
  structure = false,
  composition = false,
}: {
  item: Item;
  answer?: SourceAnswer;
  instructions: string;
  structure?: boolean;
  composition?: boolean;
}) {
  return (
    <li className="rounded-xl border border-border bg-background p-3">
      <p className="whitespace-pre-line text-sm font-medium leading-relaxed">
        {item.scanPage || /^[a-e]\./.test(item.question)
          ? item.question
          : `${item.number}. ${item.question}`}
      </p>
      {item.scanPage ? (
        <a href="/grade11/review1/page-37.jpg" target="_blank" rel="noreferrer">
          <img
            src="/grade11/review1/page-37.jpg"
            alt="Original Grade 11 Review 1 page, question B4"
            loading="lazy"
            className="mt-3 h-auto w-full rounded-xl"
          />
        </a>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          <ToggleReveal label="Translate Question" icon={Languages}>
            {item.translationMy}
          </ToggleReveal>
          {structure && (
            <ToggleReveal label="Question Structure" icon={Sparkles} tone="primary">
              <StructureBreakdown questionText={item.question} />
            </ToggleReveal>
          )}
        </div>
      )}
      {answer ? (
        <>
          <p className="mt-2 text-xs text-muted-foreground">
            စာအုပ်ကို အခြေခံထားသော အကြံပြုအဖြေ — တရားဝင်အဖြေလွှာ မဟုတ်ပါ။
          </p>
          <AnswerTryBox
            correct={answer.answer}
            correctMy={answer.answerMy}
            question={item.question}
            instructions={instructions}
            placeholder="Write your answer…"
          />
        </>
      ) : (
        <div className="mt-3 space-y-2">
          {composition ? (
            <Textarea
              aria-label={`Your answer: ${item.id}`}
              rows={7}
              placeholder="Write your verse…"
            />
          ) : (
            <Input aria-label={`Your answer: ${item.id}`} placeholder="Write your answer…" />
          )}
          <p className="text-xs text-muted-foreground">
            {item.scanPage
              ? "မရှင်းလင်းသော မူရင်းစာသားကို ပုံမှကြည့်၍ ဖြေဆိုပါ။ အဖြေကို မခန့်မှန်းထားပါ။"
              : "မိမိအတွေ့အကြုံနှင့် စိတ်ကူးအတိုင်း ဖြေဆိုပါ။"}
          </p>
        </div>
      )}
    </li>
  );
}

export function Grade11Review1View() {
  return (
    <div className="space-y-5">
      <OwlBadge>
        <p className="font-semibold">Review 1 — Units 1–3</p>
        <p>အဖြေကို မကြည့်မီ ကိုယ်တိုင် ရေးဖြေကြည့်ပါ။</p>
      </OwlBadge>
      {review.groups.map((group) => (
        <section key={group.code} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" />
            Part {group.code}
          </div>
          <h3 className="mt-1 font-semibold">{group.instruction}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{group.instructionMy}</p>
          <ol className="mt-4 space-y-4">
            {group.items.map((item) => (
              <RevisionQuestion
                key={item.id}
                item={item}
                answer={REVIEW_KEYS[item.id]}
                instructions={group.instruction}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

export function Grade11Poem1View() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          Poem 1 · Reading
        </span>
        <h2 className="mt-2 text-2xl font-bold">{poem.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{poem.author}</p>
        <div className="mt-4 space-y-5">
          {poem.stanzas.map((stanza, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              {stanza.map((line, j) => (
                <p key={j} className="text-sm leading-relaxed">
                  {line.english}
                </p>
              ))}
              <ToggleReveal label="Translate Stanza" hiddenLabel="Hide Burmese" icon={Languages}>
                {stanza.map((line, j) => (
                  <p key={j} className="leading-relaxed">
                    {line.myanmar}
                  </p>
                ))}
              </ToggleReveal>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Glossary
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {poem.glossary.map((entry) => (
              <div key={entry.word} className="rounded-lg border border-border bg-background p-3">
                <dt className="text-sm font-bold">{entry.word}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{entry.meaning}</dd>
                <dd className="mt-1 text-xs">{entry.meaningMy}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="min-w-0 space-y-5">
        <OwlBadge>
          ကဗျာကို ဖတ်ပြီး Glossary ကိုလေ့လာပါ။ မေးခွန်းများကို ကိုယ်တိုင် ဖြေဆိုပါ။
        </OwlBadge>
        {poem.groups.map((group) => (
          <section key={group.code} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
              <ListChecks className="h-3.5 w-3.5" />
              {group.code}
            </div>
            <h3 className="mt-1 text-sm font-semibold">{group.instruction}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{group.instructionMy}</p>
            {"example" in group && group.example && (
              <div className="mt-3 rounded-xl bg-muted p-3 text-sm">
                <p>{group.example.english}</p>
                <p>{group.example.myanmar}</p>
              </div>
            )}
            {"wordBox" in group && group.wordBox && (
              <p className="mt-3 text-sm">
                {group.wordBox.join(" · ")}
                <br />
                {group.wordBoxMy?.join(" · ")}
              </p>
            )}
            <ol className="mt-4 space-y-4">
              {group.items.map((item) => (
                <RevisionQuestion
                  key={item.id}
                  item={item}
                  answer={POEM_KEYS[item.id]}
                  instructions={group.instruction}
                  structure={group.code === "A"}
                  composition={group.code === "D"}
                />
              ))}
            </ol>
          </section>
        ))}
      </section>
    </div>
  );
}
