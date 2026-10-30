/**
 * Renders Unit 7 (Typical Myanmar Snacks) skills using the REAL textbook data in
 * `src/data/textbookUnit7.json` + `src/data/unit7Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes other units' data.
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
import { UNIT7_GRAMMAR } from "@/data/grammar/unit7";
import unit7 from "@/data/textbookUnit7.json";
import {
  partA7A_translations,
  partB7A_translations,
  partC7A_translations,
  partA7A_breakdowns,
  partB7A_breakdowns,
  partC7A_breakdowns,
  partB7B_translations,
  partA7C_translations,
  partB7C_translations,
  grammar7C,
  vocab7B,
} from "@/data/unit7Supplement";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const UNIT7 = unit7 as any;

const listening7DTranslations: Record<number, string> = {
  1: "မုန့်စားခြင်းက စိတ်ဖိစီးမှုကို လျော့နည်းစေနိုင်သည်။",
  2: "လူအများစုသည် ဝမ်းနည်းနေသောအခါ မုန့်စားကြသည်။",
  3: "လူများသည် မိမိတို့၏ အောင်မြင်မှုများကို မုန့်စားခြင်းဖြင့် ပုံမှန်အားဖြင့် ဂုဏ်ပြုကြသည်။",
  4: "လူများစွာသည် နေ့စဉ်ဘဝ၏ ငြီးငွေ့ဖွယ်ပုံစံကို ပြောင်းလဲရန် မုန့်စားကြသည်။",
  5: "အချို့သူများသည် လုပ်စရာအလုပ်ကို မနှောင့်နှေးဘဲ ပြီးစီးစေရန် မုန့်စားကြသည်။",
  6: "မုန့်စားခြင်းသည် ရယ်စရာကောင်းသည်။",
  7: "လူမှုယဉ်ကျေးမှု မတူလျှင် မုန့်စားပုံလည်း ကွဲပြားသည်။",
  8: "ပြင်သစ်၊ မက္ကဆီကိုနှင့် ဖိလစ်ပိုင်နိုင်ငံတို့မှ လူများသည် မုန့်ကို ပဉ္စမမြောက် အစားအစာအဖြစ် စားကြသည်။",
};
const speaking7DTranslations: Record<number, string> = {
  1: "အောက်ပါအသုံးအနှုန်းများကို လေ့လာပြီး ဇယားကွက်တစ်ခုစီအတွက် သင့်လျော်သော ခေါင်းစဉ်ကို ရွေးရေးပါ။",
  2: "စကားပြောခန်းကို ဖြည့်ပါ။ A: အဘွားက မကြာသေးခင်က ကျန်းမာရေးသိပ်မကောင်းဘူး။ B: (၁) ______",
  3: "စကားပြောခန်းကို ဖြည့်ပါ။ A: သူမအသက် ၈၀ ရှိပြီ။ သူ့အသက်အရွယ်နဲ့ဆို နည်းနည်းအနားယူသင့်တယ်။ ဒါပေမဲ့ ကျိုက်ထီးရိုးဘုရားကို ကျွန်တော်တို့နဲ့ လိုက်မယ်လို့ ပြောတယ်။ B: (၂) ______",
  4: "စကားပြောခန်းကို ဖြည့်ပါ။ A: သူမက ဘဝကို အပြည့်အဝ ပျော်ရွှင်ခံစားချင်တယ်လို့ ပြောတယ်။ B: (၃) ______",
  5: "စကားပြောခန်းကို ဖြည့်ပါ။ A: ပြီးခဲ့တဲ့အပတ်က သူမ စူပါမားကတ်သွားပြီး မိသားစုတစ်စုလုံးအတွက် ချက်ပြုတ်ခဲ့တယ်။ B: (၄) ______",
  6: "စကားပြောခန်းကို ဖြည့်ပါ။ A: သူမရဲ့ ၈၁ နှစ်ပြည့်မွေးနေ့အတွက် ပါတီကြီးတစ်ခု လုပ်ပေးမယ်။ B: (၅) ______",
  7: "နှစ်ယောက်တစ်တွဲ စကားပြောခန်းကို လေ့ကျင့်ပါ။ A နဲ့ B အဖြစ် အလှည့်ကျ ပြောပါ။",
};

function getUnit7Lesson(code: string) {
  const all = [...(UNIT7.lessons ?? []), ...(UNIT7.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

export function Unit7SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView7 />;
  if (skill === "vocabulary") return <VocabularyView7 />;
  if (skill === "grammar") return <GrammarView7 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView7 skill={skill} />;
  return <WritingView7 />;
}

/* ------------------------------ Reading (7A) ----------------------------- */

function ReadingView7() {
  const data = UNIT7.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">7A · Reading</span>
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
            ဘယ်ဘက်က မြန်မာ့သရေစာများ စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း တစ်ခုချင်း
            ဖြေကြည့်ပါ။ <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး
            ကြိုးစားကြည့်ပါ။
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
          title="Exercise A — Find the word with a similar meaning"
          titleMy="လေ့ကျင့်ခန်း A — အဓိပ္ပာယ်တူ စကားလုံးကို ရှာပါ"
          instructions={comp.part_A.instructions}
          placeholder="Type the word…"
          items={comp.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partA7A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partA7A_breakdowns[e.question_number],
          }))}
        />

        <ExerciseGroup
          title="Exercise B — Fill in the blanks"
          titleMy="လေ့ကျင့်ခန်း B — ကွက်လပ်ဖြည့်ပါ"
          instructions={comp.part_B.instructions}
          placeholder="Type the missing word…"
          items={comp.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partB7A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partB7A_breakdowns[e.question_number],
          }))}
        />

        <ExerciseGroup
          title="Exercise C — Full-sentence answers"
          titleMy="လေ့ကျင့်ခန်း C — အဖြေအပြည့်အစုံ"
          instructions={comp.part_C.instructions}
          items={comp.part_C.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partC7A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partC7A_breakdowns[e.question_number],
          }))}
        />
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (7B) ---------------------------- */

function VocabularyView7() {
  const data = UNIT7.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">7B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ နာမ်များမှ နောက်ဆက် (suffix) ထည့်၍ နာမဝိသေသန ဖွဲ့နည်းကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab7B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {partA?.table_data?.length ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 Reference Table (Exercise A — Suffixes that form adjectives)
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
                  {partA.table_data.map((r: any, i: number) => (
                    <tr key={`${r.root_word}-${i}`} className="border-b border-border">
                      <td className="px-2 py-1.5 font-semibold">{r.suffix}</td>
                      <td className="px-2 py-1.5">{r.root_word}</td>
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
        title="Exercise B — Complete with the correct adjective"
        titleMy="လေ့ကျင့်ခန်း B — မှန်ကန်သော နာမဝိသေသနဖြင့် ဖြည့်စွက်ပါ"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the adjective…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB7B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------------ Grammar (7C) ----------------------------- */

function GrammarView7() {
  const data = UNIT7.sections[2] as any;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">7C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT7_GRAMMAR} />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> ဂရမ်မာ ရှင်းလင်းချက်
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>{grammar7C.whatMy}</p>
          <p>{grammar7C.whenMy}</p>
          <p>{grammar7C.whyMy}</p>
        </div>
        {grammar7C.examples?.length ? (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 ဥပမာများ (Examples)
            </summary>
            <ul className="mt-2 space-y-1.5 text-sm">
              {grammar7C.examples.map((ex: any) => (
                <li key={ex.en}>
                  {ex.en}{" "}
                  {ex.phrase ? <span className="text-muted-foreground">— {ex.phrase}</span> : null}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <ExerciseGroup grammarPractice
        title="Exercise A — Rewrite in the passive"
        titleMy="လေ့ကျင့်ခန်း A — Passive ပုံစံသို့ ပြောင်းရေးပါ"
        instructions={data.part_A.instructions}
        enableStructure={false}
        placeholder="Type the passive sentence…"
        items={data.part_A.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA7C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      {partB?.passage ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Exercise B — Passage
          </div>
          <p className="mt-2 text-sm leading-relaxed">{partB.passage}</p>
          {partB.verbs?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {partB.verbs.map((v: string) => (
                <span
                  key={v}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <ExerciseGroup grammarPractice
        title="Exercise B — Complete with the correct passive form"
        titleMy="လေ့ကျင့်ခန်း B — မှန်ကန်သော Passive ပုံစံဖြင့် ဖြည့်စွက်ပါ"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the passive form…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text ?? e.blank,
          translation: partB7C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------ Listening / Speaking (7D) ----------------------- */

function ListeningSpeakingView7({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit7Lesson("7D") as any;
  const audio = getUnitAudio(7);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            7D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={7}
        src={audio}
        script={lesson?.transcript ?? lesson?.intro ?? ""}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး အဖြေများကို ရွေးပါ။"
        }
      />

      <ExerciseGroup
        title={
          skill === "speaking"
            ? "Exercise B — Expressions and dialogue practice"
            : "Exercise A — Listen and decide TRUE or FALSE"
        }
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း B — စကားရပ်များနှင့် စကားဝိုင်း လေ့ကျင့်ခန်း"
            : "လေ့ကျင့်ခန်း A — နားထောင်ပြီး မှန် / မှား ဆုံးဖြတ်ပါ"
        }
        instructions={lesson?.intro ?? ""}
        instructionsMy={lesson?.introMy ?? ""}
        enableStructure={false}
        placeholder={skill === "speaking" ? "Type what you would say…" : "T or F…"}
        items={(skill === "speaking" ? (lesson?.bonusQuestions ?? []) : (lesson?.questions ?? [])).map(
          (q: any) => ({
            id: q.id,
            text: q.question,
            translation: (skill === "speaking" ? speaking7DTranslations : listening7DTranslations)[q.id] ?? "",
            answer: q.suggested_answer ?? q.answer ?? "",
          }),
        )}
      />
    </div>
  );
}

/* ------------------------------ Writing (7E) ----------------------------- */

function WritingView7() {
  const lesson = getUnit7Lesson("7E") as any;
  const task = lesson?.questions?.[lesson.questions.length - 1];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">7E · Writing</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      {lesson?.questions?.length > 1 ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Preparation
          </div>
          <ol className="mt-3 space-y-3">
            {lesson.questions.slice(0, -1).map((q: any) => (
              <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium leading-relaxed">
                  {q.id}. {q.question}
                </p>
                {q.suggested_answer ? (
                  <ToggleReveal label="Show answer" tone="emerald">
                    {q.suggested_answer}
                  </ToggleReveal>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

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
          <ToggleReveal label="Show model answer" tone="emerald">
            {task.suggested_answer}
          </ToggleReveal>
        )}
      </section>
    </div>
  );
}
