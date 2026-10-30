/**
 * Renders Unit 5 (Trains) skills using the REAL textbook data in
 * `src/data/textbookUnit5.json` + `src/data/unit5Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1–4 data.
 */
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
import { UNIT5_GRAMMAR } from "@/data/grammar/unit5";
import { listeningSpeakingTranslations1to6 } from "@/data/listeningSpeakingTranslations1to6";
import { useCurriculumUnit5 } from "@/hooks/use-curriculum-unit5";
import { getUnit5Lesson } from "@/lib/curriculumUnit5";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function Unit5SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView5 />;
  if (skill === "vocabulary") return <VocabularyView5 />;
  if (skill === "grammar") return <GrammarView5 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView5 skill={skill} />;
  return <WritingView5 />;
}

/* ------------------------------ Reading (5A) ----------------------------- */

function ReadingView5() {
  const { unit, supplement } = useCurriculumUnit5();
  const {
    partA5A_translations,
    partB5A_translations,
    partC5A_translations,
    partA5A_breakdowns,
    partB5A_breakdowns,
    partC5A_breakdowns,
  } = supplement;
  const data = unit.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">5A · Reading</span>
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
            translation: partA5A_translations[e.question_number] ?? "",
            breakdown: partA5A_breakdowns[e.question_number],
            answer: e.answer,
          }))}
        />

        <ExerciseGroup
          title="Exercise B — Short answers"
          titleMy="လေ့ကျင့်ခန်း B — အတိုချုံး အဖြေများ"
          instructions={comp.part_B.instructions}
          items={comp.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question,
            translation: partB5A_translations[e.question_number] ?? "",
            breakdown: partB5A_breakdowns[e.question_number],
            answer: e.answer,
          }))}
        />

        {comp.part_C?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise C — Complete answers"
            titleMy="လေ့ကျင့်ခန်း C — အဖြေအပြည့်အစုံ"
            instructions={comp.part_C.instructions}
            items={comp.part_C.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partC5A_translations[e.question_number] ?? "",
              breakdown: partC5A_breakdowns[e.question_number],
              answer: e.answer,
            }))}
          />
        ) : null}
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (5B) ---------------------------- */

function VocabularyView5() {
  const { unit, supplement } = useCurriculumUnit5();
  const { vocab5B, partA5B_translations, partB5B_translations } = supplement;
  const data = unit.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">5B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ ရထားနှင့် ဆက်စပ်သော စကားလုံးများနှင့် '-friendly' နာမဝိသေသနများကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab5B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {partA?.words?.length ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 Glossary — meanings of the words in Exercise A
            </summary>
            <ul className="mt-2 space-y-1.5 text-sm">
              {partA.words.map((w: any) => (
                <li key={`${w.number}-${w.word}`}>
                  <span className="font-semibold">
                    {w.number}. {w.word}
                  </span>{" "}
                  ({w.letter}) — {w.meaning}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <ExerciseGroup
        title="Exercise A — Fill each blank with a suitable word"
        titleMy="လေ့ကျင့်ခန်း A — သင့်လျော်သော စကားလုံးဖြင့် ဖြည့်ပါ"
        instructions={partA.instructions}
        enableStructure={false}
        placeholder="Type the word…"
        items={partA.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA5B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise B — Match the '-friendly' expressions
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{partB.instructions}</p>

        {partB.column_b?.length ? (
          <div className="mt-3 rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Column B</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {partB.column_b.map((c: any) => (
                <li key={c.letter}>
                  <span className="font-semibold">{c.letter})</span> {c.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ol className="mt-4 space-y-3">
          {(partB.matches ?? []).map((m: any) => (
            <li key={m.question_number} className="rounded-xl border border-border bg-background p-3">
              <p className="text-sm font-medium">
                {m.question_number}. {m.text}
              </p>
              {partB5B_translations[m.question_number] ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {partB5B_translations[m.question_number]}
                </p>
              ) : null}
              <AnswerTryBox correct={m.answer} placeholder="Type the matching letter (a–e)…" />
              <ToggleReveal label="Show meaning" tone="emerald">
                {m.answer}) {m.answer_text}
              </ToggleReveal>
            </li>
          ))}
        </ol>

        {partB.sentences?.length ? (
          <ol className="mt-4 space-y-3">
            {partB.sentences.map((s: any) => (
              <li key={s.question_number} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium">
                  {s.question_number}. {s.text}
                </p>
                {partB5B_translations[s.question_number] ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {partB5B_translations[s.question_number]}
                  </p>
                ) : null}
                <AnswerTryBox correct={s.answer} placeholder="Type the expression…" />
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </div>
  );
}

/* ------------------------------ Grammar (5C) ----------------------------- */

function GrammarView5() {
  const { unit, supplement } = useCurriculumUnit5();
  const { partA5C_translations, partB5C_translations } = supplement;
  const data = unit.sections[2] as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">5C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT5_GRAMMAR} />

      <ExerciseGroup grammarPractice
        title="Exercise A — Rewrite with 'used to'"
        titleMy="လေ့ကျင့်ခန်း A — 'used to' ဖြင့် ပြန်ရေးပါ"
        instructions={data.part_A.instructions}
        enableStructure={false}
        placeholder="Type the rewritten sentence…"
        items={data.part_A.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA5C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup grammarPractice
        title="Exercise B — Present perfect or present perfect continuous"
        titleMy="လေ့ကျင့်ခန်း B — present perfect သို့မဟုတ် present perfect continuous"
        instructions={data.part_B.instructions}
        enableStructure={false}
        placeholder="Type the verb form…"
        items={data.part_B.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB5C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------ Listening / Speaking (5D) ----------------------- */

function ListeningSpeakingView5({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit5Lesson("5D") as any;
  const audio = getUnitAudio(5);
  const translations = listeningSpeakingTranslations1to6[5];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            5D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={5}
        src={audio}
        script={lesson?.transcript ?? lesson?.intro ?? ""}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး ကွက်လပ်တွေကို ဖြည့်ပါ။"
        }
      />

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
            translation: (skill === "speaking" ? translations.speaking : translations.listening)[q.id] ?? "",
            answer: q.suggested_answer ?? q.answer ?? "",
          }),
        )}
      />
    </div>
  );
}

/* ------------------------------ Writing (5E) ----------------------------- */

function WritingView5() {
  const lesson = getUnit5Lesson("5E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">5E · Writing</span>
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
