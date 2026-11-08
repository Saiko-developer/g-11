import { Languages } from "lucide-react";
import { ToggleReveal } from "@/components/lesson/ExerciseKit";
import { Textarea } from "@/components/ui/textarea";
import { Grade11GrammarAnswer } from "./Grade11GrammarAnswer";
import { Grade11AIReview } from "./Grade11AIReview";
import type { Unit1Exercise } from "@/lib/grade11Unit1";

type Answer = { answer: string; answerMy?: string | null };

/** Grammar-only controls: each textbook question owns its translation and feedback. */
export function Grade11GrammarQuestion({
  id,
  question,
  questionMy,
  instructions,
  answer,
  value,
  onChange,
  multiline = true,
  semantic = false,
  emphasis,
  context,
}: {
  id: string;
  question: string;
  questionMy: string;
  instructions: string;
  answer: Answer;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  semantic?: boolean;
  emphasis?: string;
  context?: string;
}) {
  const start = emphasis ? question.indexOf(emphasis) : -1;
  return (
    <article
      data-grammar-question={id}
      className="min-w-0 rounded-xl border border-border bg-background p-3"
    >
      <p lang="en" className="whitespace-pre-line text-sm font-medium leading-relaxed">
        {start >= 0 ? (
          <>
            {question.slice(0, start)}
            <u>{emphasis}</u>
            {question.slice(start + emphasis!.length)}
          </>
        ) : (
          question
        )}
      </p>
      <ToggleReveal
        label="Translate Question"
        hiddenLabel="Hide Myanmar Translation"
        icon={Languages}
      >
        <p lang="my" className="whitespace-pre-line">
          {questionMy}
        </p>
      </ToggleReveal>
      {semantic ? (
        <>
          <Textarea
            aria-label={`Your answer: ${question}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            maxLength={12000}
            className="mt-3"
            placeholder="Write your answer…"
          />
          <Grade11AIReview
            question={question}
            instructions={instructions}
            context={
              context ??
              "Accept any grammatically correct, logical result that completes the supplied sentence. This is an open-ended grammar exercise, not an exact model-answer match."
            }
            answer={value}
            checkLabel="Check Answer"
          />
          <ToggleReveal label="Reveal Answer" hiddenLabel="Hide Answer">
            <p lang="my" className="text-xs text-muted-foreground">
              နမူနာအဖြေဖြစ်ပြီး အခြားသင့်လျော်သော အဖြေများလည်း ရနိုင်ပါတယ်။
            </p>
            <p lang="en" className="mt-2">
              {answer.answer}
            </p>
          </ToggleReveal>
        </>
      ) : (
        <Grade11GrammarAnswer
          question={question}
          instructions={instructions}
          correct={answer.answer}
          correctMy={answer.answerMy}
          value={value}
          onChange={onChange}
          multiline={multiline}
        />
      )}
    </article>
  );
}

export function Grade11GrammarExercise({
  exercise,
  keys,
  answers,
  setAnswer,
}: {
  exercise: Unit1Exercise;
  keys: Record<string, Answer>;
  answers: Record<string, string>;
  setAnswer: (id: string, value: string) => void;
}) {
  return (
    <section
      data-exercise={exercise.instruction.id}
      className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <h3 className="border-b border-border pb-2 font-semibold">{exercise.instruction.x}</h3>
      <ToggleReveal
        label="Translate Instructions"
        hiddenLabel="Hide Myanmar Translation"
        icon={Languages}
      >
        <p lang="my">{exercise.instruction.my}</p>
      </ToggleReveal>
      {exercise.blocks.map((block) =>
        block.t === "q" && keys[block.id] ? (
          <Grade11GrammarQuestion
            key={block.id}
            id={block.id}
            question={block.x}
            questionMy={block.my}
            instructions={exercise.instruction.x}
            answer={keys[block.id]}
            value={answers[block.id] ?? ""}
            onChange={(value) => setAnswer(block.id, value)}
            multiline={!/^2C-(6[89]|7[0-7])$/.test(block.id)}
          />
        ) : (
          <div key={block.id} className="space-y-2 rounded-lg bg-muted/30 p-3 text-sm">
            <p lang="en" className="whitespace-pre-line">
              {block.x}
            </p>
            {block.my && (
              <p lang="my" className="text-muted-foreground">
                {block.my}
              </p>
            )}
          </div>
        ),
      )}
    </section>
  );
}
