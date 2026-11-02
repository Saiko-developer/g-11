/**
 * Renders Unit 3 (Zero) skills using the REAL textbook data in
 * `src/data/textbookUnit3.json` + `src/data/unit3Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1 / Unit 2 data.
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
import { UNIT3_GRAMMAR } from "@/data/grammar/unit3";
import { listeningSpeakingTranslations1to6 } from "@/data/listeningSpeakingTranslations1to6";
import { useCurriculumUnit3 } from "@/hooks/use-curriculum-unit3";
import { getUnit3Lesson } from "@/lib/curriculumUnit3";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function Unit3SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView3 />;
  if (skill === "vocabulary") return <VocabularyView3 />;
  if (skill === "grammar") return <GrammarView3 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView3 skill={skill} />;
  return <WritingView3 />;
}

/* ------------------------------ Reading (3A) ----------------------------- */

function ReadingView3() {
  const { unit, supplement } = useCurriculumUnit3();
  const { partA3A_translations, partB3A_translations } = supplement;
  const data = unit.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">3A · Reading</span>
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
            translation: partA3A_translations[e.question_number] ?? "",
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
            translation: partB3A_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />

        {comp.part_C?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise C"
            titleMy="လေ့ကျင့်ခန်း C"
            instructions={comp.part_C.instructions}
            items={comp.part_C.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: "",
              answer: e.answer,
            }))}
          />
        ) : null}
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (3B) ---------------------------- */

function VocabularyView3() {
  const { unit, supplement } = useCurriculumUnit3();
  const { vocab3B, partA3B_translations, partB3B_translations } = supplement;
  const data = unit.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">3B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ "zero" နှင့် ဆက်စပ်သော အသုံးအနှုန်းများနှင့် စကားလုံး ပုံစံပြောင်းခြင်းကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab3B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {data.expressions?.length ? (
          <div className="mt-5 rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Expressions with “zero”
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {data.expressions.map((e: any) => (
                <li key={e.letter}>
                  <span className="font-semibold">{e.letter}) {e.expression}</span> — {e.meaning}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.word_forms?.length ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 Reference Table — Noun / Verb / Adjective forms
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold">Noun</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Verb</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Adjective</th>
                  </tr>
                </thead>
                <tbody>
                  {data.word_forms.map((r: any) => (
                    <tr key={r.noun} className="border-b border-border">
                      <td className="px-2 py-1.5">{r.noun}</td>
                      <td className="px-2 py-1.5">{r.verb}</td>
                      <td className="px-2 py-1.5">{r.adjective}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
      </section>

      <ExerciseGroup
        title="Exercise A — Complete with a suitable expression"
        titleMy="လေ့ကျင့်ခန်း A — သင့်လျော်သော အသုံးအနှုန်းဖြင့် ဖြည့်ပါ"
        instructions={partA.instructions}
        enableStructure={false}
        placeholder="Type the expression…"
        items={partA.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA3B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup
        title="Exercise B — Use the correct form of the word"
        titleMy="လေ့ကျင့်ခန်း B — စကားလုံး၏ မှန်ကန်သော ပုံစံကို သုံးပါ"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the correct word form…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB3B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------------ Grammar (3C) ----------------------------- */

function GrammarView3() {
  const { unit, supplement } = useCurriculumUnit3();
  const { partA3C_translations, partB3C_translations } = supplement;
  const data = unit.sections[2] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">3C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT3_GRAMMAR} />
      <GrammarVideos unit={3} />

      {data.samples?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Sample sentences — Subject / Predicate
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {data.samples.map((s: any) => (
              <li key={s.letter} className="rounded-xl border border-border bg-background p-3">
                <p className="font-medium">
                  {s.letter}) {s.text}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Subject: <span className="font-semibold">{s.subject}</span> · Verb:{" "}
                  <span className="font-semibold">{s.verb}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ExerciseGroup grammarPractice
        title="Exercise A — Separate Subject and Predicate"
        titleMy="လေ့ကျင့်ခန်း A — ကတ္တားနှင့် ကြိယာစုကို ခွဲပါ"
        instructions={partA.instructions}
        enableStructure={false}
        placeholder="Type the sentence with a / and the verb…"
        items={partA.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA3C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup grammarPractice
        title="Exercise B — Join with either…or / neither…nor"
        titleMy="လေ့ကျင့်ခန်း B — either…or / neither…nor ဖြင့် ပေါင်းစပ်ပါ"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the joined sentence…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB3C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------ Listening / Speaking (3D) ----------------------- */

function ListeningSpeakingView3({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit3Lesson("3D") as any;
  const audio = getUnitAudio(3);
  const translations = listeningSpeakingTranslations1to6[3];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            3D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={3}
        src={audio}
        script={lesson?.intro ?? ""}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး ကွက်လပ်တွေကို ဖြည့်ပါ။"
        }
      />

      <ExerciseGroup
        title={
          skill === "speaking"
            ? "Exercise B — Talk about a famous person"
            : "Exercise A — Complete the sentences"
        }
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း B — နာမည်ကျော် ပုဂ္ဂိုလ်တစ်ဦးအကြောင်း ပြောပါ"
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
        items={(skill === "speaking"
          ? (lesson?.bonusQuestions ?? [])
          : (lesson?.questions ?? [])
        ).map((q: any) => ({
          id: q.id,
          text: q.question,
          translation: (skill === "speaking" ? translations.speaking : translations.listening)[q.id] ?? "",
          answer: q.suggested_answer ?? q.answer ?? "",
        }))}
      />
    </div>
  );
}

/* ------------------------------ Writing (3E) ----------------------------- */

function WritingView3() {
  const lesson = getUnit3Lesson("3E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">3E · Writing</span>
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
