/**
 * Renders Unit 6 (The Prodigal Son) skills using the REAL textbook data in
 * `src/data/textbookUnit6.json` + `src/data/unit6Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1–5 data.
 */
import { useState } from "react";
import { BookOpen, Languages, ListChecks } from "lucide-react";

import { LessonAudioPlayer } from "@/components/LessonAudioPlayer";
import {
  ExerciseGroup,
  OwlBadge,
  ParagraphBlock,
  ToggleReveal,
  VocabCard,
} from "@/components/lesson/ExerciseKit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { UNIT6_GRAMMAR } from "@/data/grammar/unit6";
import { listeningSpeakingTranslations1to6 } from "@/data/listeningSpeakingTranslations1to6";
import unit6 from "@/data/textbookUnit6.json";
import {
  partA6A_translations,
  partB6A_translations,
  partA6A_breakdowns,
  partB6A_breakdowns,
  partA6B_translations,
  partB6B_translations,
  partA6C_translations,
  partB6C_translations,
  partC6C_translations,
  vocab6B,
} from "@/data/unit6Supplement";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const UNIT6 = unit6 as any;

function getUnit6Lesson(code: string) {
  const all = [...(UNIT6.lessons ?? []), ...(UNIT6.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

export function Unit6SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView6 />;
  if (skill === "vocabulary") return <VocabularyView6 />;
  if (skill === "grammar") return <GrammarView6 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView6 skill={skill} />;
  return <WritingView6 />;
}

/* ------------------------------ Reading (6A) ----------------------------- */

function ReadingView6() {
  const data = UNIT6.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">6A · Reading</span>
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
            ဘယ်ဘက်က ပုံပြင်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း တစ်ခုချင်း ဖြေကြည့်ပါ။{" "}
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
          title="Exercise A — Short answers"
          titleMy="လေ့ကျင့်ခန်း A — အတိုချုံး အဖြေများ"
          instructions={comp.part_A.instructions}
          items={comp.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partA6A_translations[e.question_number] ?? "",
            breakdown: partA6A_breakdowns[e.question_number],
            answer: e.answer,
          }))}
        />

        <ExerciseGroup
          title="Exercise B — Full-sentence answers"
          titleMy="လေ့ကျင့်ခန်း B — အဖြေအပြည့်အစုံ"
          instructions={comp.part_B.instructions}
          items={comp.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partB6A_translations[e.question_number] ?? "",
            breakdown: partB6A_breakdowns[e.question_number],
            answer: e.answer,
          }))}
        />
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (6B) ---------------------------- */

function VocabularyView6() {
  const data = UNIT6.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">6B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ 'run' ဖြင့် ဖွဲ့စည်းထားသော phrasal verb များနှင့် 'say / tell' အသုံးပြုပုံကို
          လေ့လာပါမယ်။ <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab6B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {partA?.words?.length ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 Glossary — phrasal verbs used in Exercise A
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
        title="Exercise A — Complete with a phrasal verb"
        titleMy="လေ့ကျင့်ခန်း A — phrasal verb ဖြင့် ဖြည့်စွက်ပါ"
        instructions={partA.instructions}
        enableStructure={false}
        placeholder="Type the phrasal verb…"
        items={partA.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA6B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup
        title="Exercise B — 'say' or 'tell'"
        titleMy="လေ့ကျင့်ခန်း B — 'say' သို့မဟုတ် 'tell'"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the correct form…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB6B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------------ Grammar (6C) ----------------------------- */

function GrammarView6() {
  const data = UNIT6.sections[2] as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">6C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT6_GRAMMAR} />

      <ExerciseGroup grammarPractice
        title="Exercise A — Change into reported speech"
        titleMy="လေ့ကျင့်ခန်း A — သွယ်ဝိုက်ပြောဆိုချက်သို့ ပြောင်းပါ"
        instructions={data.part_A.instructions}
        enableStructure={false}
        placeholder="Type the reported sentence…"
        items={data.part_A.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA6C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup grammarPractice
        title="Exercise B — Change into direct speech"
        titleMy="လေ့ကျင့်ခန်း B — တိုက်ရိုက်ပြောဆိုချက်သို့ ပြောင်းပါ"
        instructions={data.part_B.instructions}
        enableStructure={false}
        placeholder="Type the direct sentence…"
        items={data.part_B.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB6C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      {data.part_C?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise C — Commands and requests in reported speech"
          titleMy="လေ့ကျင့်ခန်း C — ညွှန်ကြားချက်နှင့် တောင်းဆိုချက်များ"
          instructions={data.part_C.instructions}
          enableStructure={false}
          placeholder="Type the reported sentence…"
          items={data.part_C.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.text,
            translation: partC6C_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />
      ) : null}
    </div>
  );
}

/* ------------------------ Listening / Speaking (6D) ----------------------- */

function ListeningSpeakingView6({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit6Lesson("6D") as any;
  const audio = getUnitAudio(6);
  const translations = listeningSpeakingTranslations1to6[6];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            6D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={6}
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
          skill === "speaking" ? "Exercise B — Speak about the topic" : "Exercise A — Answer the questions"
        }
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း B — အကြောင်းအရာအကြောင်း ပြောပါ"
            : "လေ့ကျင့်ခန်း A — မေးခွန်းများကို ဖြေပါ"
        }
        instructions={lesson?.intro ?? ""}
        instructionsMy={
          skill === "speaking"
            ? translations.speakingInstructionsMy
            : translations.listeningInstructionsMy
        }
        enableStructure={false}
        placeholder={skill === "speaking" ? "Type what you would say…" : "Type your answer…"}
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

/* ------------------------------ Writing (6E) ----------------------------- */

function WritingView6() {
  const lesson = getUnit6Lesson("6E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">6E · Writing</span>
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
