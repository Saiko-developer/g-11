/**
 * Renders Unit 8 (Food Chain) skills using the REAL textbook data in
 * `src/data/textbookUnit8.json` + `src/data/unit8Supplement.ts`, reusing the
 * shared ExerciseKit presentation. Fully sandboxed: nothing here reads or
 * changes Unit 1–7 data.
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
import { UNIT8_GRAMMAR } from "@/data/grammar/unit8";
import unit8 from "@/data/textbookUnit8.json";
import {
  partA8A_breakdowns,
  partA8A_translations,
  partB8A_breakdowns,
  partB8A_translations,
  partC8A_translations,
  partB8B_translations,
  partA8C_translations,
  partB8C_translations,
  grammar8C,
  vocab8B,
} from "@/data/unit8Supplement";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const UNIT8 = unit8 as any;

const listening8DTranslations: Record<number, string> = {
  1: "နားထောင်ပြီး ဇယားကို ဖြည့်ပါ။ ယုန်များနှင့် ကြွက်များသည် ______ ကို စားကြသည်။",
  2: "နားထောင်ပြီး ဇယားကို ဖြည့်ပါ။ ဖားများသည် ______ ကို စားကြသည်။",
  3: "နားထောင်ပြီး ဇယားကို ဖြည့်ပါ။ ပျားများနှင့် လိပ်ပြာများသည် ______ ကို စားကြသည်။",
  4: "ရှဉ့်ကဲ့သို့သော တိရစ္ဆာန်များသည် မာကျောသော ______ နှင့် အခွံမာသီးများကို စားကြသည်။",
  5: "မြွေများတွင် ဝါးစားရန် ______ မရှိသောကြောင့် အစာကို မျိုချကြသည်။",
  6: "ဖားသည် သားကောင်ကို ဖမ်းရန် ရှည်လျားပြီး စေးကပ်သော ______ ကို အသုံးပြုသည်။",
  7: "နွားနှင့် ______ တို့သည် အစာကို အရင်မျိုချပြီးနောက် ပါးစပ်ထဲသို့ ပြန်ယူကာ နာရီပေါင်းများစွာ ဝါးစားကြသည်။",
  8: "ခွေးနှင့် ကြောင်များသည် အစာကို လျက်စားရန် ၎င်းတို့၏ ______ ကို အသုံးပြုကြသည်။",
  9: "သစ်ပင်မြင့်များကို လှမ်းမီရန် သစ်ကုလားအုတ်သည် ၎င်း၏ ______ ကို အသုံးပြုသည်။",
  10: "အစာကို ယူစားရန် ဆင်သည် ၎င်း၏ ______ ကို အသုံးပြုသည်။",
};
const speaking8DTranslations: Record<number, string> = {
  1: "အောက်ပါအစားအစာများကို သင့်လျော်သော အမျိုးအစားကော်လံများ (သစ်သီး၊ အသား၊ ဟင်းသီးဟင်းရွက်) ထဲသို့ ထည့်ပါ။",
  2: "ပေးထားသောမေးခွန်းများကို အသုံးပြုပြီး နှစ်ယောက်တစ်တွဲ အချင်းချင်း၏ စားသောက်ပုံအလေ့အထများအကြောင်း မေးမြန်းဖြေဆိုပါ။",
  3: "သင့်အဖော်ပြောခဲ့သည့်အကြောင်းကို အတန်းရှေ့တွင် ပြန်လည်ပြောပြပါ။",
};

function getUnit8Lesson(code: string) {
  const all = [...(UNIT8.lessons ?? []), ...(UNIT8.sections ?? [])];
  return all.find((l: any) => l?.code === code) ?? null;
}

export function Unit8SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView8 />;
  if (skill === "vocabulary") return <VocabularyView8 />;
  if (skill === "grammar") return <GrammarView8 />;
  if (skill === "listening" || skill === "speaking") return <ListeningSpeakingView8 skill={skill} />;
  return <WritingView8 />;
}

/* ------------------------------ Reading (8A) ----------------------------- */

function ReadingView8() {
  const data = UNIT8.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">8A · Reading</span>
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
            ဘယ်ဘက်က အစာကွင်းဆက် စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် လေ့ကျင့်ခန်း တစ်ခုချင်း
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
          title="Exercise A — True, False or Not Mentioned"
          titleMy="လေ့ကျင့်ခန်း A — မှန်၊ မှား သို့မဟုတ် မဖော်ပြထား"
          instructions={comp.part_A.instructions}
          placeholder="T, F or NM…"
          items={comp.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question ?? e.text,
            translation: partA8A_translations[e.question_number] ?? "",
            breakdown: partA8A_breakdowns[e.question_number],
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
            translation: partB8A_translations[e.question_number] ?? "",
            breakdown: partB8A_breakdowns[e.question_number],
            answer: e.answer,
          }))}
        />

        {comp.part_C?.table_data?.length ? (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Exercise C — Complete the table
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{comp.part_C.instructions}</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr>
                    {comp.part_C.headers.map((h: string) => (
                      <th key={h} className="px-2 py-1.5 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comp.part_C.table_data.map((r: any) => (
                    <tr key={r.category} className="border-b border-border">
                      <td className="px-2 py-1.5 font-semibold capitalize">{r.category}</td>
                      <td className="px-2 py-1.5">{r.example_given}</td>
                      <td className="px-2 py-1.5">{r.from_passage}</td>
                      <td className="px-2 py-1.5 text-muted-foreground">{r.own_examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {Object.keys(partC8A_translations).length ? (
              <div className="mt-3">
                <ToggleReveal label="Translate instructions" icon={Languages}>
                  {partC8A_translations[1]}
                </ToggleReveal>
              </div>
            ) : null}
          </section>
        ) : null}
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (8B) ---------------------------- */

function VocabularyView8() {
  const data = UNIT8.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">8B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ 'up' နှင့် 'behind' ဖြင့် ဖွဲ့စည်းထားသော phrasal verb များကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab8B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {partA?.table_data?.length ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 Reference Table (Exercise A — Phrasal verbs with 'up' and 'behind')
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
                    <tr key={r.phrasal_verb} className="border-b border-border">
                      <td className="px-2 py-1.5 font-semibold">{r.phrasal_verb}</td>
                      <td className="px-2 py-1.5">{r.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
      </section>

      <ExerciseGroup
        title="Exercise B — Complete with the correct phrasal verb"
        titleMy="လေ့ကျင့်ခန်း B — မှန်ကန်သော phrasal verb ဖြင့် ဖြည့်စွက်ပါ"
        instructions={partB.instructions}
        enableStructure={false}
        placeholder="Type the phrasal verb…"
        items={partB.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB8B_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------------ Grammar (8C) ----------------------------- */

function GrammarView8() {
  const data = UNIT8.sections[2] as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">8C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT8_GRAMMAR} />
      <GrammarVideos unit={8} />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> ဂရမ်မာ ရှင်းလင်းချက်
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>{grammar8C.whatMy}</p>
          <p>{grammar8C.whenMy}</p>
          <p>{grammar8C.whyMy}</p>
        </div>
        {grammar8C.examples?.length ? (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 ဥပမာများ (Examples)
            </summary>
            <ul className="mt-2 space-y-1.5 text-sm">
              {grammar8C.examples.map((ex: any) => (
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
        title="Exercise A — Change into the passive voice"
        titleMy="လေ့ကျင့်ခန်း A — ခံယ်းအသံသို့ ပြောင်းပါ"
        instructions={data.part_A.instructions}
        enableStructure={false}
        placeholder="Type the passive sentence…"
        items={data.part_A.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partA8C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />

      <ExerciseGroup grammarPractice
        title="Exercise B — Omit the repeated verbs"
        titleMy="လေ့ကျင့်ခန်း B — ထပ်နေသော ကြိယာများ ချန်လှပ်ပါ"
        instructions={data.part_B.instructions}
        enableStructure={false}
        placeholder="Type the shortened sentence…"
        items={data.part_B.exercises.map((e: any) => ({
          id: e.question_number,
          text: e.text,
          translation: partB8C_translations[e.question_number] ?? "",
          answer: e.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------ Listening / Speaking (8D) ----------------------- */

function ListeningSpeakingView8({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit8Lesson("8D") as any;
  const audio = getUnitAudio(8);
  const speakingQuestions = (lesson?.bonusQuestions ?? []).filter((q: any) => q.id !== 1);
  const orderedSpeakingQuestions = [
    ...speakingQuestions.filter((q: any) => q.id === 2),
    ...speakingQuestions.filter((q: any) => q.id >= 4),
    ...speakingQuestions.filter((q: any) => q.id === 3),
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            8D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={8}
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
          skill === "speaking"
            ? "Exercises D–E — Interview and report"
            : "Exercises A–B — Listen and complete"
        }
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း B — အကြောင်းအရာအကြောင်း ပြောပါ"
            : "လေ့ကျင့်ခန်း A — နားထောင်ပြီး ဖြည့်စွက်ပါ"
        }
        instructions={lesson?.intro ?? ""}
        instructionsMy={lesson?.introMy ?? ""}
        enableStructure={false}
        placeholder={skill === "speaking" ? "Type what you would say…" : "Type your answer…"}
        items={(skill === "speaking" ? orderedSpeakingQuestions : (lesson?.questions ?? [])).map(
          (q: any, index: number) => ({
            id: skill === "speaking" ? index + 1 : q.id,
            text: q.question,
            translation:
              q.translation ??
              (skill === "speaking" ? speaking8DTranslations : listening8DTranslations)[q.id] ??
              "",
            answer: q.suggested_answer ?? q.answer ?? "",
          }),
        )}
      />
      {skill === "listening" && lesson?.bonusQuestions?.[0] ? (
        <ExerciseGroup
          title="Exercise C — Sort the food items into the correct columns"
          titleMy="လေ့ကျင့်ခန်း C — အစားအစာများကို သက်ဆိုင်ရာ ကော်လံများတွင် ခွဲပါ"
          instructions={lesson.bonusQuestions[0].question}
          instructionsMy={lesson.bonusQuestions[0].translation}
          enableStructure={false}
          items={[
            {
              id: lesson.bonusQuestions[0].id,
              text: lesson.bonusQuestions[0].question,
              translation: lesson.bonusQuestions[0].translation,
              answer: lesson.bonusQuestions[0].answer,
            },
          ]}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------ Writing (8E) ----------------------------- */

function WritingView8() {
  const lesson = getUnit8Lesson("8E") as any;
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">8E · Writing</span>
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
