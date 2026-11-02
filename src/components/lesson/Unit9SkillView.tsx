/**
 * Renders Unit 9 (Climate Change) skills using the REAL textbook data in
 * `src/data/textbookUnit9.json` + `src/data/unit9Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1–8 data.
 */
import { GrammarVideos } from "@/components/lesson/GrammarVideos";
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
import { UNIT9_GRAMMAR } from "@/data/grammar/unit9";
import unit9 from "@/data/textbookUnit9.json";
import {
  partA9A_translations,
  partB9A_translations,
  partC9A_translations,
  partA9A_breakdowns,
  partB9A_breakdowns,
  partC9A_breakdowns,
  partA9C_translations,
  partB9C_translations,
  grammar9C,
  vocab9B,
  listening9D_translations,
  opinionPhrases9D,
  dialogue9D,
} from "@/data/unit9Supplement";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const UNIT9 = unit9 as any;

const vocabulary9BTranslations: Record<number, string> = {
  1: "ရာသီဥတုပြောင်းလဲမှု၏ အကြောင်းရင်းများနှင့် သက်ဆိုင်သော အသုံးအနှုန်းများမှာ မည်သည့်အရာများနည်း။",
  2: "ရာသီဥတုပြောင်းလဲမှုကို ကာကွယ်ရန် နည်းလမ်းများနှင့် သက်ဆိုင်သော အသုံးအနှုန်းများမှာ မည်သည့်အရာများနည်း။",
  3: "ရာသီဥတုပြောင်းလဲမှု၏ သက်ရောက်မှုများနှင့် သက်ဆိုင်သော အသုံးအနှုန်းများမှာ မည်သည့်အရာများနည်း။",
  4: "စာအုပ်ထဲရှိ ဇယားကွက်တစ်ခုစီအတွက် မည်သည့်ဥပမာကို ပေးထားသနည်း။",
};

function getUnit9Lesson(code: string) {
  const all = [...(UNIT9.lessons ?? []), ...(UNIT9.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

function getUnit9Section(prefix: string) {
  return (UNIT9.sections ?? []).find((s: any) => String(s?.lesson ?? "").startsWith(prefix)) ?? null;
}

export function Unit9SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView9 />;
  if (skill === "vocabulary") return <VocabularyView9 />;
  if (skill === "grammar") return <GrammarView9 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView9 skill={skill} />;
  return <WritingView9 />;
}

/* ------------------------------ Reading (9A) ----------------------------- */

function ReadingView9() {
  const data = getUnit9Section("9A") as any;
  const passage = data?.reading_passage;
  const comp = data?.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">9A · Reading</span>
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
            ဘယ်ဘက်က ရာသီဥတုပြောင်းလဲမှု စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း
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

        {comp?.part_A?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise A — Match the question to the paragraph"
            titleMy="လေ့ကျင့်ခန်း A — မေးခွန်းနှင့် စာပိုဒ်ကို တွဲပါ"
            instructions={comp.part_A.instructions}
            placeholder="A–G…"
            items={comp.part_A.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partA9A_translations[e.question_number] ?? "",
              breakdown: partA9A_breakdowns[e.question_number],
              answer: e.answer,
            }))}
          />
        ) : null}

        {comp?.part_B?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise B — Fill each blank"
            titleMy="လေ့ကျင့်ခန်း B — ကွက်လပ်များ ဖြည့်စွက်ပါ"
            instructions={comp.part_B.instructions}
            placeholder="Type the missing phrase…"
            items={comp.part_B.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partB9A_translations[e.question_number] ?? "",
              breakdown: partB9A_breakdowns[e.question_number],
              answer: e.answer,
            }))}
          />
        ) : null}

        {comp?.part_C?.exercises?.length ? (
          <ExerciseGroup
            title="Exercise C — Full-sentence answers"
            titleMy="လေ့ကျင့်ခန်း C — အဖြေအပြည့်အစုံ"
            instructions={comp.part_C.instructions}
            items={comp.part_C.exercises.map((e: any) => ({
              id: e.question_number,
              text: e.question ?? e.text,
              translation: partC9A_translations[e.question_number] ?? "",
              breakdown: partC9A_breakdowns[e.question_number],
              answer: e.answer,
            }))}
          />
        ) : null}
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (9B) ---------------------------- */

function VocabularyView9() {
  const data = getUnit9Section("9B") as any;
  const lesson = getUnit9Lesson("9B") as any;
  const partA = data?.part_A;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">9B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data?.topic}</h2>
        <OwlBadge>
          {lesson?.introMy ?? "ရာသီဥတုပြောင်းလဲမှုနှင့် ဆိုင်သော အသုံးအနှုန်းများကို လေ့လာပါမယ်။"}{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab9B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {partA?.table_data?.length ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 Reference Table (Exercise A — Causes · Effects · Ways to prevent it)
            </summary>
            <p className="mt-2 text-xs text-muted-foreground">{partA.instructions}</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr>
                    {partA.headers.map((h: string) => (
                      <th key={h} className="px-2 py-1.5 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partA.table_data.map((r: any) => (
                    <tr key={r.box} className="border-b border-border">
                      <td className="px-2 py-1.5 font-semibold">{r.box}</td>
                      <td className="px-2 py-1.5">{r.example_given}</td>
                      <td className="px-2 py-1.5 text-muted-foreground">{r.more_expressions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
      </section>

      <ExerciseGroup
        title="Exercise B — Sort the expressions"
        titleMy="လေ့ကျင့်ခန်း B — အသုံးအနှုန်းများကို ခွဲခြားပါ"
        instructions={lesson?.intro ?? partA?.instructions ?? ""}
        instructionsMy="အောက်ပါအသုံးအနှုန်းများကို အကြောင်းရင်း၊ သက်ရောက်မှုနှင့် ကာကွယ်နည်း ကဏ္ဍများအလိုက် ခွဲခြားပါ။"
        enableStructure={false}
        placeholder="Type your answer…"
        items={[...(lesson?.questions ?? []), ...(lesson?.bonusQuestions ?? [])].map(
          (q: any, i: number) => ({
            id: i + 1,
            text: q.question,
            translation: vocabulary9BTranslations[i + 1] ?? "",
            answer: q.suggested_answer ?? q.answer ?? "",
          }),
        )}
      />
    </div>
  );
}

/* ------------------------------ Grammar (9C) ----------------------------- */

function GrammarView9() {
  const data = getUnit9Section("9C") as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">9C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data?.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT9_GRAMMAR} />
      <GrammarVideos unit={9} />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> ဂရမ်မာ ရှင်းလင်းချက်
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>{grammar9C.whatMy}</p>
          <p>{grammar9C.whenMy}</p>
          <p>{grammar9C.whyMy}</p>
        </div>
        {grammar9C.examples?.length ? (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 ဥပမာများ (Examples)
            </summary>
            <ul className="mt-2 space-y-1.5 text-sm">
              {grammar9C.examples.map((ex: any) => (
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
          title="Exercise A — Complete with the future tense"
          titleMy="လေ့ကျင့်ခန်း A — အနာဂတ်ကာလဖြင့် ဖြည့်စွက်ပါ"
          instructions={data.part_A.instructions}
          enableStructure={false}
          placeholder="Type the completion…"
          items={data.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partA9C_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />
      ) : null}

      {data?.part_B?.exercises?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise B — Conditional clauses"
          titleMy="လေ့ကျင့်ခန်း B — အကယ်၍ ဝါကျများ"
          instructions={data.part_B.instructions}
          enableStructure={false}
          placeholder="Type the correct verb form…"
          items={data.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partB9C_translations[e.question_number] ?? "",
            answer: e.answer,
          }))}
        />
      ) : null}
    </div>
  );
}

/* ------------------------ Listening / Speaking (9D) ----------------------- */

function ListeningSpeakingView9({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit9Lesson("9D") as any;
  const audio = getUnitAudio(9);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            9D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      {skill === "listening" ? (
        <>
          <LessonAudioPlayer
        unit={9}
            src={audio}
            script={lesson?.intro ?? ""}
            label="Unit 9 — Climate Change (listening track)"
            hint="အသံဖိုင်ကို နားထောင်ပြီး အောက်ပါ ဖော်ပြချက်တွေ မှန် (TRUE) လား မှား (FALSE) လား ဆုံးဖြတ်ပါ။"
          />

          <ExerciseGroup
            title="Exercise A — Listen and mark TRUE (T) or FALSE (F)"
            titleMy="လေ့ကျင့်ခန်း A — နားထောင်ပြီး မှန်/မှား ရွေးပါ"
            instructions="Listen to the recording and say whether the following statements are TRUE (T) or FALSE (F)."
            instructionsMy="အသံဖိုင်ကို နားထောင်ပြီး အောက်ပါဖော်ပြချက်များ မှန် (T) သလား၊ မှား (F) သလား ဆုံးဖြတ်ပါ။"
            enableStructure={false}
            placeholder="TRUE or FALSE…"
            items={(lesson?.questions ?? []).map((q: any) => ({
              id: q.id,
              text: q.question,
              translation: listening9D_translations[q.id] ?? "",
              answer: q.suggested_answer ?? q.answer ?? "",
            }))}
          />
        </>
      ) : (
        <SpeakingView9D audio={audio} lesson={lesson} />
      )}
    </div>
  );
}

function SpeakingView9D({ audio, lesson }: { audio: string | null; lesson: any }) {
  return (
    <>
      <LessonAudioPlayer
        unit={9}
        src={audio}
        script={lesson?.intro ?? ""}
        label="Model pronunciation"
        hint="နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
      />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Expressing Opinions — ထင်မြင်ချက် ဖော်ပြခြင်း
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">Personal · ကိုယ်ပိုင်အမြင်</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {opinionPhrases9D.personal.map((p) => (
                <li key={p.en} className="rounded-lg border border-border bg-background p-2">
                  <span className="font-medium">{p.en}</span>
                  <span className="block text-xs text-muted-foreground">{p.my}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">General · ယေဘုယျအမြင်</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {opinionPhrases9D.general.map((p) => (
                <li key={p.en} className="rounded-lg border border-border bg-background p-2">
                  <span className="font-medium">{p.en}</span>
                  <span className="block text-xs text-muted-foreground">{p.my}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise B — Complete the dialogue
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          လေ့ကျင့်ခန်း B — ပေးထားသော အသုံးအနှုန်းများဖြင့် စကားဝိုင်း ကွက်လပ်များကို ဖြည့်ပါ။
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {dialogue9D.options.map((o) => (
            <span
              key={o.letter}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
            >
              ({o.letter}) {o.text}
            </span>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {dialogue9D.lines.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed">
              <span className="mr-1.5 font-bold text-primary">{line.speaker}:</span>
              {line.text.split(/(\{\d\})/).map((part, j) => {
                const m = part.match(/^\{(\d)\}$/);
                if (!m) return <span key={j}>{part}</span>;
                return (
                  <span
                    key={j}
                    className="mx-0.5 inline-block rounded bg-primary/10 px-2 font-semibold text-primary"
                  >
                    ({m[1]}) ______
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {Object.entries(dialogue9D.answers).map(([n, a]) => (
            <div key={n} className="rounded-xl border border-border bg-background p-3">
              <p className="text-sm font-medium">Blank ({n})</p>
              <ToggleReveal label="Show answer" tone="emerald">
                ({a.letter}) {a.text} — {a.my}
              </ToggleReveal>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise C — In pairs, practise the dialogue
        </div>
        <p className="mt-2 text-sm leading-relaxed">
          လေ့ကျင့်ခန်း C — သူငယ်ချင်းတစ်ယောက်နှင့် A နှင့် B အခန်းကဏ္ဍ ခွဲယူပြီး စကားဝိုင်းကို
          အသံထွက် လေ့ကျင့်ပါ။
        </p>
        <ToggleReveal label="Show the completed dialogue" tone="emerald">
          {dialogue9D.lines
            .map(
              (line) =>
                `${line.speaker}: ${line.text.replace(/\{(\d)\}/g, (_, n) => dialogue9D.answers[Number(n)].text)}`,
            )
            .join("\n")}
        </ToggleReveal>
      </section>
    </>
  );
}

/* ------------------------------ Writing (9E) ----------------------------- */

function WritingView9() {
  const lesson = getUnit9Lesson("9E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">9E · Writing</span>
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
          <ToggleReveal label="Show model answer" tone="emerald">
            {task.suggested_answer}
          </ToggleReveal>
        )}
      </section>
    </div>
  );
}
