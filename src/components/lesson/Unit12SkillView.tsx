/**
 * Renders Unit 12 (Urbanization) skills using the REAL textbook data in
 * `src/data/textbookUnit12.json` + `src/data/unit12Supplement.ts` +
 * `src/data/grammar/unit12.ts`, reusing the shared ExerciseKit presentation.
 * Fully sandboxed: nothing here reads or changes Unit 1–11 data.
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
import { UNIT12_GRAMMAR } from "@/data/grammar/unit12";
import unit12 from "@/data/textbookUnit12.json";
import {
  partA12A_translations,
  partB12A_translations,
  partC12A_translations,
  partC12A_breakdowns,
  compCheck12A_translations,
  compCheck12A_breakdowns,

  partA12B_translations,
  partB12B_translations,
  partC12B_translations,
  partA12C_translations,
  partB12C_translations,
  partC12C_translations,
  partD12C_translations,
  partA12D_translations,
  partB12D_translations,
  listening12D_transcript,
  partC12D_modelDialogue,
  writing12E_structureMy,
  grammar12C,
  vocab12B,
} from "@/data/unit12Supplement";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const UNIT12 = unit12 as any;

function getUnit12Lesson(code: string) {
  const all = [...(UNIT12.lessons ?? []), ...(UNIT12.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

function getUnit12Section(prefix: string) {
  return (
    (UNIT12.sections ?? []).find((s: any) => String(s?.lesson ?? "").startsWith(prefix)) ?? null
  );
}

/**
 * Local-only Burmese translations for the 12D "Comprehension check" questions.
 * Kept inside this file on purpose so nothing leaks into shared localisation.
 */
const compCheck12D_translationsMy: Record<string, string> = {
  "How is life in urban areas described in the talk?":
    "အသံဖိုင်တွင် မြို့ပြဘဝကို ဘယ်လိုဖော်ပြထားလဲ။",
  "How is rural life described?": "ကျေးလက်ဘဝကို ဘယ်လိုဖော်ပြထားလဲ။",
  "What does the urban settlement include?":
    "မြို့ပြနေထိုင်မှုဒေသတွင် ဘာတွေ ပါဝင်သလဲ။",
  "What does the rural settlement include?":
    "ကျေးလက်နေထိုင်မှုဒေသတွင် ဘာတွေ ပါဝင်သလဲ။",
  "What is said about the environment in the two areas?":
    "ဒေသနှစ်ခု၏ ပတ်ဝန်းကျင်အကြောင်း ဘယ်လိုဆိုထားလဲ။",
  "What kind of work are urban people engaged in?":
    "မြို့ပြနေလူတွေက ဘယ်လိုအလုပ်မျိုး လုပ်ကိုင်သလဲ။",
  "What is the primary occupation of rural people?":
    "ကျေးလက်နေလူတွေ၏ အဓိကအလုပ်အကိုင်က ဘာလဲ။",
  "Compare the population of urban and rural areas.":
    "မြို့ပြနှင့် ကျေးလက်ဒေသများ၏ လူဦးရေကို နှိုင်းယှဉ်ပါ။",
  "Why do urban people often change their jobs?":
    "မြို့ပြနေလူတွေက အလုပ်ကို အဘယ်ကြောင့် မကြာခဏ ပြောင်းသလဲ။",
  "Do rural people change their jobs often?":
    "ကျေးလက်နေလူတွေက အလုပ်ကို မကြာခဏ ပြောင်းသလားလဲ။",
  // 12D speaking (bonus) prompts
  "You phone the clinic. How do you begin the call?":
    "သင် ဆေးခန်းကို ဖုန်းဆက်သည်။ ဖုန်းကို ဘယ်လို စတင်ပြောမလဲ။",
  "The receptionist asks what your problem is. What do you say?":
    "လက်ခံဝန်ထမ်းက သင့်ရဲ့ပြဿနာကို မေးသည်။ ဘယ်လိုပြောမလဲ။",
  "The receptionist asks if you can come in the morning. What do you say?":
    "လက်ခံဝန်ထမ်းက မနက်ပိုင်း လာနိုင်မလားဟု မေးသည်။ ဘယ်လိုပြောမလဲ။",
  "She offers 10 o'clock. How do you accept?":
    "သူက ၁၀ နာရီကို အဆိုပြုသည်။ ဘယ်လို လက်ခံမလဲ။",
  "She asks for your name. What do you say?":
    "သူက သင့်နာမည်ကို မေးသည်။ ဘယ်လိုပြောမလဲ။",
  "How do you end the call politely?": "ဖုန်းကို ယဉ်ကျေးစွာ ဘယ်လို အဆုံးသတ်မလဲ။",
  "Now make an appointment with a dentist: how do you ask for an early appointment because of toothache?":
    "အခု သွားဆရာဝန်နှင့် ချိန်းဆိုပါ — သွားကိုက်တာကြောင့် အချိန်စောစော ချိန်းဆိုမှုကို ဘယ်လို တောင်းဆိုမလဲ။",
};

/** Remove trailing parenthetical grammar hints such as (အခန်းကဏ္ဍ → as). */
function stripHints(text: string) {
  return text.replace(/\s*\([^)]*\)\s*$/g, "").trim();
}


export function Unit12SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView12 />;
  if (skill === "vocabulary") return <VocabularyView12 />;
  if (skill === "grammar") return <GrammarView12 />;
  if (skill === "listening" || skill === "speaking")
    return <ListeningSpeakingView12 skill={skill} />;
  return <WritingView12 />;
}

/* ------------------------------ Reading (12A) ---------------------------- */

function ReadingView12() {
  const data = getUnit12Section("12A") as any;
  const lesson = getUnit12Lesson("12A") as any;
  const passage = data?.reading_passage;
  const comp = data?.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">12A · Reading</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data?.topic}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{passage?.title}</p>

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
          {(passage?.paragraphs ?? []).map((p: any) => (
            <ParagraphBlock key={p.paragraph_id} block={p} forceShowMy={showFullMy} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <OwlBadge>
          <p className="font-semibold">မင်္ဂလာပါ! ဆရာ ဇီးကွက်ပါ 🦉</p>
          <p>
            ဘယ်ဘက်က မြို့ပြပြောင်းလဲမှု စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း
            တစ်ခုချင်း ဖြေကြည့်ပါ။ <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး
            ကြိုးစားကြည့်ပါ။
          </p>
        </OwlBadge>

        {data?.pre_reading?.length ? (
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

        {comp?.part_A?.options?.length ? (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Options A–E
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose the sentence that best fits each gap.
            </p>
            <ol className="mt-3 space-y-2">
              {comp.part_A.options.map((opt: any) => (
                <li
                  key={opt.letter}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <span className="font-bold text-primary">{opt.letter}.</span> {opt.text}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {comp?.part_A?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise A — Fill the gaps with sentences A–E"
            titleMy="လေ့ကျင့်ခန်း A — ကွက်လပ်များတွင် ဝါကျ A–E ဖြည့်ပါ"
            instructions={comp.part_A.instructions}
            instructionsMy="အောက်ပါကွက်လပ်တစ်ခုစီတွင် အကိုက်ညီဆုံး ဝါကျကို A မှ E အထိ ရွေးပြီး ဖြည့်ပါ။"
            placeholder="A–E…"
            enableStructure={false}
            items={comp.part_A.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partA12A_translations[e.question_number] ?? "",
              answer: e.answer ?? "",
            }))}
          />
        ) : null}

        {comp?.part_B?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise B — Examples for each general expression"
            titleMy="လေ့ကျင့်ခန်း B — အထွေထွေ အသုံးအနှုန်းများ၏ ဥပမာများ"
            instructions={comp.part_B.instructions}
            instructionsMy="အထွေထွေဖော်ပြချက်တစ်ခုစီအတွက် ဥပမာများ ပေးပါ။"
            placeholder="List the examples…"
            enableStructure={false}
            items={comp.part_B.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partB12A_translations[e.question_number] ?? "",
              answer: e.answer ?? "",
            }))}
          />
        ) : null}

        {comp?.part_C?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise C — Full-sentence answers"
            titleMy="လေ့ကျင့်ခန်း C — အဖြေအပြည့်အစုံ"
            instructions={comp.part_C.instructions}
            instructionsMy="အောက်ပါမေးခွန်းများကို ဝါကျပြည့်ဖြင့် ဖြေပါ။"
            items={comp.part_C.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partC12A_translations[e.question_number] ?? "",
              answer: e.answer ?? "",
              breakdown: partC12A_breakdowns[e.question_number],
            }))}
          />
        ) : null}

        {lesson?.questions?.length ? (
          <ExerciseGroup
            title="Comprehension check"
            titleMy="နားလည်မှု စစ်ဆေးခြင်း"
            instructions={lesson?.intro ?? ""}
            placeholder="Type your answer…"
            items={lesson.questions.map((q: any) => ({
              id: q.id,
              text: q.question,
              translation: compCheck12A_translations[q.id] ?? "",
              answer: q.suggested_answer ?? q.answer ?? "",
              breakdown: compCheck12A_breakdowns[q.id],
            }))}
          />
        ) : null}

      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (12B) --------------------------- */

function VocabularyView12() {
  const lesson = getUnit12Lesson("12B") as any;
  const data = getUnit12Section("12B") as any;
  const partA = data?.part_A;
  const partB = data?.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">12B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>
          {lesson?.introMy ?? "Compound nouns များကို လေ့လာပါမယ်။"}{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab12B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            📋 Example sentences from the unit
          </summary>
          <ul className="mt-2 space-y-1.5 text-sm">
            {vocab12B
              .filter((v) => v.exampleEn)
              .map((v) => (
                <li key={v.word}>
                  <span className="font-semibold">{v.word}</span> — {v.exampleEn}
                </li>
              ))}
          </ul>
        </details>
      </section>

      {partA?.exercises?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Exercise A — Compound nouns
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            လေ့ကျင့်ခန်း A — ပေါင်းစပ် နာမ်များ
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{partA.instructions}</p>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
            {/* Column A — starters with blanks */}
            <div className="min-w-0">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                Column A
              </h4>
              <ol className="space-y-3">
                {partA.exercises.map((e: any) => (
                  <li
                    key={e.question_number}
                    className="min-w-0 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex min-w-0 gap-2">
                      <span className="shrink-0 text-sm font-bold text-primary">
                        {e.question_number}.
                      </span>
                      <p className="min-w-0 break-words text-sm font-medium leading-relaxed">
                        {e.question ?? e.text}
                      </p>
                    </div>
                    {partA12B_translations[e.question_number] ? (
                      <div className="mt-2">
                        <ToggleReveal label="Show Translation" icon={Languages}>
                          {stripHints(partA12B_translations[e.question_number])}
                        </ToggleReveal>
                      </div>
                    ) : null}
                    <AnswerTryBox correct={e.answer ?? ""} placeholder="Type the compound noun…" />
                  </li>
                ))}
              </ol>
            </div>

            {/* Column B — options reference */}
            <div className="min-w-0">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                Column B — choose from these
              </h4>
              <div className="rounded-xl border border-border bg-secondary/40 p-3">
                <div className="flex flex-wrap gap-2">
                  {(partA.column_B ?? []).map((word: string) => (
                    <span
                      key={word}
                      className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}


      {partB?.exercises?.length ? (
        <ExerciseGroup
          title="Exercise B — Complete the sentences"
          titleMy="လေ့ကျင့်ခန်း B — ဝါကျများ ဖြည့်စွက်ပါ"
          instructions={partB.instructions}
          enableStructure={false}
          placeholder="Type your answer…"
          items={partB.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partB12B_translations[e.question_number] ?? "",
            answer: e.answer ?? "",
          }))}
        />
      ) : null}

      {data?.part_C ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> {data.part_C.title ?? "'As' and 'like'"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{data.part_C.instructions}</p>

          {data.part_C.study_examples?.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.part_C.study_examples.map((ex: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <p className="font-medium">{ex.text}</p>
                  {ex.note ? <p className="mt-1 text-xs text-muted-foreground">{ex.note}</p> : null}
                </div>
              ))}
            </div>
          ) : null}

          {data.part_C.rules?.length ? (
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
              {data.part_C.rules.map((rule: string, i: number) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          ) : null}

          {data.part_C.exercises?.length ? (
            <div className="mt-5">
              <ExerciseGroup
                title="Exercise C — as or like"
                titleMy="လေ့ကျင့်ခန်း C — as သို့မဟုတ် like"
                instructions={data.part_C.instructions}
                enableStructure={false}
                placeholder="as or like…"
                items={data.part_C.exercises.map((e: any) => ({
                  id: e.question_number,
                  text: e.question ?? e.text,
                  translation: stripHints(partC12B_translations[e.question_number] ?? ""),
                  answer: e.answer ?? "",
                }))}
              />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

/* ------------------------------ Grammar (12C) ---------------------------- */

function GrammarView12() {
  const lesson = getUnit12Lesson("12C") as any;
  const data = getUnit12Section("12C") as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">12C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
      </header>

      <GrammarScriptView grammar={UNIT12_GRAMMAR} />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> ဂရမ်မာ ရှင်းလင်းချက်
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>{grammar12C.whatMy}</p>
          <p>{grammar12C.whenMy}</p>
          <p>{grammar12C.whyMy}</p>
        </div>
        {grammar12C.examples?.length ? (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 ဥပမာများ (Examples)
            </summary>
            <ul className="mt-2 space-y-1.5 text-sm">
              {grammar12C.examples.map((ex: any) => (
                <li key={ex.en}>
                  {ex.en}{" "}
                  {ex.phrase ? <span className="text-muted-foreground">— {ex.phrase}</span> : null}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      {data?.part_A?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise A — that / which"
          titleMy="လေ့ကျင့်ခန်း A — that / which ဖြည့်စွက်ပါ"
          instructions={data.part_A.instructions}
          enableStructure={false}
          placeholder="that or which…"
          items={data.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partA12C_translations[e.question_number] ?? "",
            answer: e.answer ?? "",
          }))}
        />
      ) : null}

      {data?.part_B?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise B — Build sentences with relative clauses"
          titleMy="လေ့ကျင့်ခန်း B — ဆက်စပ်နာမစာလုံး ဝါကျများ ဖွဲ့ပါ"
          instructions={data.part_B.instructions}
          enableStructure={false}
          placeholder="Type the sentence…"
          items={data.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partB12C_translations[e.question_number] ?? "",
            answer: e.answer ?? "",
          }))}
        />
      ) : null}

      {data?.comparisons_study ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> {data.comparisons_study.title}
          </div>
          {data.comparisons_study.rules?.length ? (
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
              {data.comparisons_study.rules.map((rule: string, i: number) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          ) : null}
          {data.comparisons_study.pairs?.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.comparisons_study.pairs.map((pair: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <p className="text-muted-foreground">{pair.given}</p>
                  <p className="mt-1 font-semibold">{pair.result}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {data?.part_C?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise C — as … as"
          titleMy="လေ့ကျင့်ခန်း C — as … as ဖြည့်စွက်ပါ"
          instructions={data.part_C.instructions}
          enableStructure={false}
          placeholder="Type the sentence…"
          items={data.part_C.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partC12C_translations[e.question_number] ?? "",
            answer: e.answer ?? "",
          }))}
        />
      ) : null}

      {data?.part_D?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise D — not as … as"
          titleMy="လေ့ကျင့်ခန်း D — not as … as ဖြည့်စွက်ပါ"
          instructions={data.part_D.instructions}
          enableStructure={false}
          placeholder="Type the sentence…"
          items={data.part_D.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partD12C_translations[e.question_number] ?? "",
            answer: e.answer ?? "",
          }))}
        />
      ) : null}
    </div>
  );
}

/* ----------------------- Listening / Speaking (12D) ---------------------- */

function ListeningSpeakingView12({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit12Lesson("12D") as any;
  const data = getUnit12Section("12D") as any;
  const audio = getUnitAudio(12);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            12D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy ?? lesson?.intro}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={12}
        src={audio}
        script={listening12D_transcript.map((l) => l.en).join(" ")}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး ကွက်လပ်တွေကို ဖြည့်ပါ။"
        }
      />

      {skill === "listening" ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Listening script — Unit 12 · Urbanization
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            အသံဖိုင်ကို နားထောင်ပြီးမှ စာကြောင်းများကို ဖွင့်ကြည့်ပါ။
          </p>
          <ToggleReveal label="Show transcript" hiddenLabel="Hide transcript" tone="primary">
            <div className="space-y-3">
              {listening12D_transcript.map((line, i) => (
                <div key={i}>
                  <p className="font-medium">{line.en}</p>
                  <p className="text-xs text-muted-foreground">{line.my}</p>
                </div>
              ))}
            </div>
          </ToggleReveal>
        </section>
      ) : null}

      {skill === "listening" && data?.part_A?.table_rows?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> {data.part_A.table_title ?? "Urban vs Rural Life"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{data.part_A.instructions}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-left font-semibold">Feature</th>
                  <th className="py-2 px-4 text-left font-semibold text-primary">Urban</th>
                  <th className="py-2 pl-4 text-left font-semibold text-emerald-600 dark:text-emerald-400">Rural</th>
                </tr>
              </thead>
              <tbody>
                {data.part_A.table_rows.map((row: any, idx: number) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium capitalize">{row.feature}</td>
                    <td className="py-3 px-4">
                      <p>{row.urban}</p>
                    </td>
                    <td className="py-3 pl-4">
                      <p>{row.rural}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.part_A?.exercises?.length ? (
            <div className="mt-5">
              <ExerciseGroup
                title="Exercise A — Listen and complete"
                titleMy="လေ့ကျင့်ခန်း A — နားထောင်ပြီး ဖြည့်စွက်ပါ"
                instructions={data.part_A.instructions}
                instructionsMy="အောက်ပါစကားလုံးကွက်လပ်များကို နားထောင်ပြီး ဖြည့်ပါ။"
                enableStructure={false}
                placeholder="Type what you hear…"
                items={data.part_A.exercises.map((e: any) => ({
                  id: e.question_number,
                  text: e.question ?? e.text,
                  translation: partA12D_translations[e.question_number] ?? "",
                  answer: e.answer ?? "Listen to the talk to confirm your answer",
                }))}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {skill === "speaking" && data?.part_B?.dialogue?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> {data.part_B.title ?? "Making an appointment"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{data.part_B.instructions}</p>

          {data.part_B.options?.length ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.part_B.options.map((opt: any) => (
                <div
                  key={opt.letter}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <span className="font-bold text-primary">({opt.letter})</span> {opt.text}
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {data.part_B.dialogue.map((line: any, idx: number) => (
              <div
                key={idx}
                className={`rounded-xl border border-border bg-background p-3 text-sm ${
                  line.speaker === "Patient" ? "ml-4 sm:ml-8" : ""
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {line.speaker}
                </span>
                {line.text ? (
                  <p className="mt-1">{line.text}</p>
                ) : (
                  <div className="mt-1">
                    <p className="font-medium">({line.slot}) __________</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {data?.part_B?.exercises?.length ? (
            <div className="mt-5">
              <ExerciseGroup
                title="Exercise B — Choose the expression"
                titleMy="လေ့ကျင့်ခန်း B — အသုံးအနှုန်း ရွေးချယ်ပါ"
                instructions={data.part_B.instructions}
                instructionsMy="ပေးထားသော အသုံးအနှုန်းများကို အသုံးပြုပြီး အောက်ပါစကားပြောခန်းကို ဖြည့်ပါ။"
                enableStructure={false}
                placeholder="a–f…"
                items={data.part_B.exercises.map((e: any) => ({
                  id: e.question_number,
                  text: e.question ?? e.text,
                  translation: partB12D_translations[e.question_number] ?? "",
                  answer: e.answer ?? "",
                }))}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {skill === "speaking" ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Exercise C — pair work
          </div>
          <p className="mt-1 text-sm">
            {data?.part_C?.instructions ??
              "In pairs, practise making an appointment with a dentist."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            တွဲဖက်နှင့် အတူ သွားဆရာဝန်နှင့် ချိန်းဆိုမှု ပြုလုပ်ပုံကို လေ့ကျင့်ပါ။
          </p>
          <ToggleReveal label="Show model dialogue" hiddenLabel="Hide model dialogue" tone="emerald">
            <div className="space-y-3">
              {partC12D_modelDialogue.map((line, i) => (
                <div key={i}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {line.speaker}
                  </span>
                  <p className="font-medium">{line.en}</p>
                  <p className="text-xs text-muted-foreground">{line.my}</p>
                </div>
              ))}
            </div>
          </ToggleReveal>
        </section>
      ) : null}

      <ExerciseGroup
        title={skill === "speaking" ? "Speak — practise aloud" : "Comprehension check"}
        titleMy={
          skill === "speaking" ? "လေ့ကျင့်ခန်း — အသံထွက် လေ့ကျင့်ပါ" : "နားထောင်ခြင်း မေးခွန်းများ"
        }
        instructions={lesson?.intro ?? ""}
        enableStructure={false}
        placeholder={skill === "speaking" ? "Type what you would say…" : "Type your answer…"}
        items={(skill === "speaking"
          ? (lesson?.bonusQuestions ?? lesson?.questions ?? [])
          : (lesson?.questions ?? [])
        ).map((q: any) => ({
          id: q.id,
          text: q.question,
          translation: compCheck12D_translationsMy[String(q.question ?? "").trim()] ?? "",
          answer: q.suggested_answer ?? q.answer ?? "",
        }))}
      />
    </div>
  );
}

/* ------------------------------ Writing (12E) ---------------------------- */

function WritingView12() {
  const lesson = getUnit12Lesson("12E") as any;
  const data = getUnit12Section("12E") as any;
  const task = data?.writing_task;
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">12E · Writing</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy ?? lesson?.intro}</OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Writing task
        </div>
        <p className="mt-2 text-sm leading-relaxed">{task?.instructions ?? lesson?.intro}</p>
        {task?.opening ? (
          <div className="mt-3 rounded-lg border border-border bg-background p-3 text-sm leading-relaxed">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Opening
            </span>
            <p className="mt-1">{task.opening}</p>
          </div>
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
        {lesson?.bonusQuestions?.[0]?.suggested_answer ? (
          <ToggleReveal label="Show model answer" tone="emerald">
            {lesson.bonusQuestions[0].suggested_answer}
          </ToggleReveal>
        ) : null}
      </section>

      {data?.structure?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Essay structure
          </div>
          <ol className="mt-3 space-y-3">
            {data.structure.map((step: any) => (
              <li key={step.step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {step.step}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.name}</p>
                  <p className="text-sm text-muted-foreground">{step.detail}</p>
                  {writing12E_structureMy[step.step] ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {writing12E_structureMy[step.step]}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {data?.useful_language?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Languages className="h-3.5 w-3.5" /> Useful language
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.useful_language.map((phrase: string, i: number) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-background p-3 text-sm leading-relaxed"
              >
                {phrase}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
