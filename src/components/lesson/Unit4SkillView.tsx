/**
 * Renders Unit 4 (Painting) skills using the REAL textbook data in
 * `src/data/textbookUnit4.json` + `src/data/unit4Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1 / 2 / 3 data.
 */
import { GrammarVideos } from "@/components/lesson/GrammarVideos";
import { useState } from "react";
import { BookOpen, Languages, ListChecks } from "lucide-react";

import { LessonAudioPlayer } from "@/components/LessonAudioPlayer";
import {
  AnswerTryBox,
  ExerciseGroup,
  OwlBadge,
  ParagraphBlock,
  ToggleReveal,
  VocabCard,
} from "@/components/lesson/ExerciseKit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { UNIT4_GRAMMAR } from "@/data/grammar/unit4";
import { listeningSpeakingTranslations1to6 } from "@/data/listeningSpeakingTranslations1to6";
import { useCurriculumUnit4 } from "@/hooks/use-curriculum-unit4";
import { getUnit4Lesson } from "@/lib/curriculumUnit4";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function Unit4SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView4 />;
  if (skill === "vocabulary") return <VocabularyView4 />;
  if (skill === "grammar") return <GrammarView4 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView4 skill={skill} />;
  return <WritingView4 />;
}

/* ------------------------------ Reading (4A) ----------------------------- */

function ReadingView4() {
  const { unit, supplement } = useCurriculumUnit4();
  const {
    partA4A_translations,
    partB4A_translations,
    partC4A_translations,
    partA4A_breakdowns,
    partB4A_breakdowns,
  } = supplement;
  const data = unit.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">4A · Reading</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{passage.title}</p>

        <Button
          size="sm"
          variant={showFullMy ? "default" : "outline"}
          className="mt-3 gap-1.5"
          onClick={() => setShowFullMy((v) => !v)}
        >
          <Languages className="h-3.5 w-3.5" />
          {showFullMy ? "Hide all Burmese" : "Translate Whole Passage to Burmese"}
        </Button>

        <div className="mt-4 space-y-5">
          {passage.paragraphs.map((p: any) => (
            <ParagraphBlock key={p.paragraph_id} block={p} forceShowMy={showFullMy} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <OwlBadge>
          <p className="font-semibold">မင်္ဂလာပါ! ဆရာ ဇီးကွက်ပါ 🦉</p>
          <p>
            ဘယ်ဘက်က စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း တစ်ခုချင်း ဖြေကြည့်ပါ။{" "}
            <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
          </p>
        </OwlBadge>

        {data.pre_reading?.length ? (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Pre-reading
            </div>
            <ol className="mt-3 space-y-3">
              {data.pre_reading.map((q: any) => (
                <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                  <p className="text-sm font-medium leading-relaxed">
                    {q.id}. {q.question}
                  </p>
                  <ToggleReveal label="Show idea" tone="emerald">
                    {q.suggested_answer}
                  </ToggleReveal>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <ExerciseGroup
          title="Exercise A — Complete each sentence"
          titleMy="လေ့ကျင့်ခန်း A — စာကြောင်းများ ဖြည့်စွက်ပါ"
          instructions={comp.part_A.instructions}
          items={comp.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.text,
            translation: partA4A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partA4A_breakdowns[e.question_number],
          }))}
        />

        <ExerciseGroup
          title="Exercise B — Full-sentence answers"
          titleMy="လေ့ကျင့်ခန်း B — စာကြောင်းအပြည့် အဖြေများ"
          instructions={comp.part_B.instructions}
          items={comp.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question,
            translation: partB4A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partB4A_breakdowns[e.question_number],
          }))}
        />

        {comp.part_C?.exercises?.length ? (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Exercise C — Types of painting table
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{comp.part_C.instructions}</p>
            <ol className="mt-3 space-y-3">
              {comp.part_C.exercises.map((e: any) => (
                <li key={e.question_number} className="rounded-xl border border-border bg-background p-3">
                  <p className="text-sm font-semibold">
                    {e.question_number}. {e.type}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {partC4A_translations[e.question_number] ?? ""}
                  </p>
                  <ToggleReveal label="Show answer" tone="emerald">
                    <span className="block">Done on: {e.done_on}</span>
                    <span className="block">Paints used: {e.paints_used}</span>
                  </ToggleReveal>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (4B) ---------------------------- */

/** Small helper for the prefix tables in 4B part B / part C. */
function PrefixTable({
  heading,
  instructions,
  rows,
  answerKey,
  translations,
}: {
  heading: string;
  instructions?: string;
  rows: any[];
  answerKey: "noun" | "verb" | "adjective";
  translations?: Record<number, string>;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <ListChecks className="h-3.5 w-3.5" /> {heading}
      </div>
      {instructions ? <p className="mt-2 text-sm text-muted-foreground">{instructions}</p> : null}
      <ol className="mt-3 space-y-3">
        {rows.map((r) => (
          <li key={`${r.question_number}-${r.root}`} className="rounded-xl border border-border bg-background p-3">
            <p className="text-sm font-medium">
              {r.question_number}. {r.prefix} + {r.root} → ?
            </p>
            {translations?.[r.question_number] ? (
              <p className="mt-1 text-xs text-muted-foreground">{translations[r.question_number]}</p>
            ) : null}
            <AnswerTryBox correct={r[answerKey]} placeholder="Type the word…" />
          </li>
        ))}
      </ol>
    </section>
  );
}

function VocabularyView4() {
  const { unit, supplement } = useCurriculumUnit4();
  const {
    vocab4B,
    partA4B_translations,
    partB4B_translations,
    partC4B_translations,
    partD4B_translations,
  } = supplement;
  const data = unit.sections[1] as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">4B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ ပန်းချီနှင့် ဆက်စပ်သော စကားလုံးများနှင့် prefix (ရှေ့ဆက်) များကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab4B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>
      </section>

      <ExerciseGroup
        title="Exercise A — Complete the pairs of sentences"
        titleMy="လေ့ကျင့်ခန်း A — စာကြောင်းအတွဲများ ဖြည့်ပါ"
        instructions={data.part_A.instructions}
        enableStructure={false}
        placeholder="Type both words, separated by ;"
        items={data.part_A.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA4B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      {data.part_B?.nouns?.length ? (
        <PrefixTable
          heading="Exercise B1 — Nouns formed with prefixes"
          instructions={data.part_B.instructions}
          rows={data.part_B.nouns}
          answerKey="noun"
          translations={partB4B_translations}
        />
      ) : null}

      {data.part_B?.verbs?.length ? (
        <PrefixTable
          heading="Exercise B2 — Verbs formed with prefixes"
          rows={data.part_B.verbs}
          answerKey="verb"
        />
      ) : null}

      {data.part_C?.exercises?.length ? (
        <PrefixTable
          heading="Exercise C — Adjectives formed with prefixes"
          instructions={data.part_C.instructions}
          rows={data.part_C.exercises}
          answerKey="adjective"
          translations={partC4B_translations}
        />
      ) : null}

      {data.part_D?.exercises?.length ? (
        <ExerciseGroup
          title="Exercise D — Use the correct form of the word"
          titleMy="လေ့ကျင့်ခန်း D — စကားလုံး၏ မှန်ကန်သော ပုံစံကို သုံးပါ"
          instructions={data.part_D.instructions}
          enableStructure={false}
          placeholder="Type the correct word form…"
          items={data.part_D.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.text,
            translation: partD4B_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------ Grammar (4C) ----------------------------- */

function GrammarView4() {
  const { unit, supplement } = useCurriculumUnit4();
  const { partA4C_translations, partB4C_translations, partC4C_translations } = supplement;
  const data = unit.sections[2] as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">4C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT4_GRAMMAR} />
      <GrammarVideos unit={4} />

      <ExerciseGroup grammarPractice
        title="Exercise A — Spot the participial phrases"
        titleMy="လေ့ကျင့်ခန်း A — participial phrase များကို ရှာပါ"
        instructions={data.part_A.instructions}
        enableStructure={false}
        placeholder="Type the phrase and the noun it modifies…"
        items={data.part_A.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA4C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup grammarPractice
        title="Exercise B — Choose the appropriate answer"
        titleMy="လေ့ကျင့်ခန်း B — သင့်လျော်သော အဖြေကို ရွေးပါ"
        instructions={data.part_B.instructions}
        enableStructure={false}
        placeholder="Type your choice…"
        items={data.part_B.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB4C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      {data.part_C?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise C — Past simple or past continuous"
          titleMy="လေ့ကျင့်ခန်း C — past simple သို့မဟုတ် past continuous"
          instructions={data.part_C.instructions}
          enableStructure={false}
          placeholder="Type the verb forms…"
          items={data.part_C.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.text,
            translation: partC4C_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />
      ) : null}
    </div>
  );
}

/* ------------------------ Listening / Speaking (4D) ----------------------- */

function ListeningSpeakingView4({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit4Lesson("4D") as any;
  const audio = getUnitAudio(4);
  const translations = listeningSpeakingTranslations1to6[4];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            4D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={4}
        src={audio}
        script={lesson?.intro ?? ""}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး ကွက်လပ်တွေကို ဖြည့်ပါ။"
        }
      />

      {skill === "speaking" && lesson?.pairTexts?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Exercise B — Talking about interests
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            စာသား A နှင့် B ကို အလှည့်ကျ ဖတ်ပြီး တစ်ဦးကို တစ်ဦး မေးခွန်းများ မေးပါ။
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {lesson.pairTexts.map((t: any) => (
              <article key={t.label} className="rounded-xl border border-border bg-background p-3">
                <h3 className="text-sm font-bold text-primary">
                  {t.label} · {t.forStudent}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed">{t.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}



      <ExerciseGroup
        title={
          skill === "speaking" ? "Exercise B — Speak about the topic" : "Exercise A — Complete the sentences"
        }
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း B — အကြောင်းအရာအကြောင်း ပြောပါ"
            : "လေ့ကျင့်ခန်း A — စာကြောင်းများ ဖြည့်စွက်ပါ"
        }
        instructions={lesson?.intro ?? ""}
        instructionsMy={
          skill === "speaking"
            ? translations.speakingInstructionsMy
            : translations.listeningInstructionsMy
        }
        enableStructure={false}
        placeholder={skill === "speaking" ? "Type what you would say…" : "Type the missing word…"}
        items={(skill === "speaking" ? (lesson?.bonusQuestions ?? []) : (lesson?.questions ?? [])).map(
          (q: any) => ({
            id: q.id,
            text: q.question,
            translation:
              (skill === "speaking" ? translations.speaking : translations.listening)[q.id] ?? "",
            answer: q.suggested_answer ?? q.answer ?? "",
          }),
        )}
      />
    </div>
  );
}

/* ------------------------------ Writing (4E) ----------------------------- */

function WritingView4() {
  const lesson = getUnit4Lesson("4E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">4E · Writing</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Writing task
        </div>
        <p className="mt-2 text-sm leading-relaxed">{task?.question}</p>
        {lesson?.bonusQuestions?.length ? (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {lesson.bonusQuestions.map((q: any) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
        ) : null}
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={10}
          placeholder="Start writing here… ဒီနေရာမှာ စရေးပါ။"
          className="mt-4 text-sm leading-relaxed"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {draft.trim() ? draft.trim().split(/\s+/).length : 0} words
        </p>
        {task?.suggested_answer && (
          <ToggleReveal label="Show model paragraph" tone="emerald">
            {task.suggested_answer}
          </ToggleReveal>
        )}
      </section>
    </div>
  );
}
