/**
 * Renders Unit 2 (Literature) skills using the REAL textbook data in
 * `src/data/textbookUnit2.json` + `src/data/unit2Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1 data.
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
import { UNIT2_GRAMMAR } from "@/data/grammar/unit2";
import { listeningSpeakingTranslations1to6 } from "@/data/listeningSpeakingTranslations1to6";
import { useCurriculumUnit2 } from "@/hooks/use-curriculum-unit2";
import { getUnit2Lesson } from "@/lib/curriculumUnit2";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function Unit2SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView2 />;
  if (skill === "vocabulary") return <VocabularyView2 />;
  if (skill === "grammar") return <GrammarView2 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView2 skill={skill} />;
  return <WritingView2 />;
}

/* ------------------------------ Reading (2A) ----------------------------- */

function ReadingView2() {
  const { unit, supplement } = useCurriculumUnit2();
  const { partA2A_translations, partB2A_translations, partC2A_translations } = supplement;
  const data = unit.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">2A · Reading</span>
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
            ဘယ်ဘက်က စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း A, B, C တစ်ခုချင်း ဖြေကြည့်ပါ။{" "}
            <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
          </p>
        </OwlBadge>

        <ExerciseGroup
          title="Exercise A — Complete each sentence"
          titleMy="လေ့ကျင့်ခန်း A — စာကြောင်းများ ဖြည့်စွက်ပါ"
          instructions={comp.part_A.instructions}
          items={comp.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.text,
            translation: partA2A_translations[e.question_number] ?? "",
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
            translation: partB2A_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />

        <ExerciseGroup
          title="Exercise C — Full-sentence answers"
          titleMy="လေ့ကျင့်ခန်း C — စာကြောင်းအပြည့် အဖြေများ"
          instructions={comp.part_C.instructions}
          items={comp.part_C.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question,
            translation: partC2A_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (2B) ---------------------------- */

function VocabularyView2() {
  const { unit, supplement } = useCurriculumUnit2();
  const { vocab2B, partA2B_translations, partB2B_translations } = supplement;
  const data = unit.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">2B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ စာပေဝေါဟာရတွေရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab2B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>
      </section>

      <ExerciseGroup
        title="Exercise A — Copy the meaning of each word"
        titleMy="လေ့ကျင့်ခန်း A — စကားလုံးတစ်ခုစီ၏ အဓိပ္ပာယ်ကို ကူးယူပါ"
        instructions={partA.instructions}
        enableStructure={false}
        placeholder="Type the meaning from the passage…"
        items={partA.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA2B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise B — Match Column A with Column B
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{partB.instructions}</p>

        <div className="mt-3 rounded-xl border border-border bg-background p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Column B</p>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            {partB.column_b.map((c: any) => (
              <li key={c.letter}>
                <span className="font-semibold">{c.letter})</span> {c.text}
              </li>
            ))}
          </ul>
        </div>

        <ol className="mt-4 space-y-4">
          {partB.exercises.map((q: any) => (
            <li key={q.question_number} className="rounded-xl border border-border bg-background p-3">
              <div className="flex gap-2">
                <span className="text-sm font-bold text-primary">{q.question_number}.</span>
                <p className="text-sm font-medium leading-relaxed">{q.text}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ToggleReveal label="Show Translation" icon={Languages}>
                  {partB2B_translations[q.question_number] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                </ToggleReveal>
              </div>
              <AnswerTryBox
                correct={`${q.answer}) ${q.answer_text}`}
                placeholder="Type the matching letter (a–j)…"
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ------------------------------ Grammar (2C) ----------------------------- */

function GrammarView2() {
  const { unit, supplement } = useCurriculumUnit2();
  const { partA2C_translations, partB2C_translations, partC2C_translations } =
    supplement;
  const data = unit.sections[2] as any;
  const partA = data.part_A;
  const partB = data.part_B;
  const partC = data.part_C;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">2C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT2_GRAMMAR} />
      <GrammarVideos unit={2} />

      <ExerciseGroup grammarPractice
        title="Exercise A — Box the adjectival phrase"
        titleMy="လေ့ကျင့်ခန်း A — နာမဝိသေသန စကားစုကို ဘောင်ခတ်ပါ"
        instructions={partA.instructions}
        placeholder="Type the adjectival phrase…"
        items={partA.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA2C_translations[e.question_number] ?? "",
          answer: `${e.adjectival_phrase} → modifies "${e.modified_noun}"`,
        }))}
      />

      <ExerciseGroup grammarPractice
        title="Exercise B — Underline the verbs"
        titleMy="လေ့ကျင့်ခန်း B — ကြိယာများကို မျဉ်းသားပါ"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the verb(s)…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB2C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise C — Right or wrong?
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{partC.instructions}</p>
        <ol className="mt-4 space-y-4">
          {partC.exercises.map((q: any) => (
            <li key={q.question_number} className="rounded-xl border border-border bg-background p-3">
              <div className="flex gap-2">
                <span className="text-sm font-bold text-primary">{q.question_number}.</span>
                <p className="text-sm font-medium leading-relaxed">{q.text}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ToggleReveal label="Translate" icon={Languages}>
                  {partC2C_translations[q.question_number] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                </ToggleReveal>
              </div>
              <AnswerTryBox
                correct={q.is_correct ? `✔ ${q.answer}` : `✘ Correct form: ${q.answer}`}
                placeholder="Tick it, or type the correct form…"
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ------------------------ Listening / Speaking (2D) ----------------------- */

function ListeningSpeakingView2({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit2Lesson("2D") as any;
  const audio = getUnitAudio(2);
  const translations = listeningSpeakingTranslations1to6[2];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            2D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={2}
        src={audio}
        script={lesson?.intro ?? ""}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး ပြောဆိုသူတစ်ဦးချင်းစီကို တွဲဆက်ပါ။"
        }
      />

      <ExerciseGroup
        title={
          skill === "speaking"
            ? "Exercise B — Pair work: Romeo and Juliet"
            : "Exercise A — Match speaker to utterance"
        }
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း B — သူငယ်ချင်းနှင့် တွဲဖက် စကားပြောပါ"
            : "လေ့ကျင့်ခန်း A — ပြောဆိုသူနှင့် စကားလုံးကို တွဲဆက်ပါ"
        }
        instructions={lesson?.intro ?? ""}
        instructionsMy={
          skill === "speaking"
            ? translations.speakingInstructionsMy
            : translations.listeningInstructionsMy
        }
        enableStructure={false}
        placeholder={skill === "speaking" ? "Type your reply…" : "Type the speaker's name…"}
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

      {skill === "speaking" && lesson?.pairActivity ? (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <h3 className="text-base font-semibold">Exercise B — Pair work</h3>
            <p className="mt-1 text-sm leading-relaxed">{lesson.pairActivity.instruction}</p>
            {lesson.pairActivity.instructionMy ? (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {lesson.pairActivity.instructionMy}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(["studentA", "studentB"] as const).map((role) => (
              <article key={role} className="rounded-xl border border-border bg-background p-4">
                <h4 className="mb-2 text-sm font-semibold">
                  {role === "studentA" ? "Student A" : "Student B"}
                </h4>
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {lesson.pairActivity[role]}
                </p>
              </article>
            ))}
          </div>
          <ExerciseGroup
            title="Ask and answer to complete the texts"
            titleMy="စာသားများကို ဖြည့်စွက်ရန် အမေးအဖြေပြုလုပ်ပါ"
            instructions={lesson.pairActivity.instruction}
            instructionsMy={lesson.pairActivity.instructionMy}
            enableStructure={false}
            items={lesson.pairActivity.questions.map((q: any) => ({
              id: q.id,
              text: q.question,
              translation: q.translation,
            }))}
          />
        </section>
      ) : null}
    </div>
  );
}

/* ------------------------------ Writing (2E) ----------------------------- */

function WritingView2() {
  const lesson = getUnit2Lesson("2E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">2E · Writing</span>
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
        {lesson?.planningPoints?.length ? (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {lesson.planningPoints.map((point: any, index: number) => (
              <li key={`${index}-${point.text}`}>
                <span>{point.text}</span>
                {point.translation ? <span className="ml-2">— {point.translation}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}
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
