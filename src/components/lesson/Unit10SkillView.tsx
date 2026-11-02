/**
 * Renders Unit 10 (Food Safety) skills using the REAL textbook data in
 * `src/data/textbookUnit10.json` + `src/data/unit10Supplement.ts` +
 * `src/data/grammar/unit10.ts`, reusing the shared ExerciseKit presentation.
 * Fully sandboxed: nothing here reads or changes other units' data.
 */
import { GrammarVideos } from "@/components/lesson/GrammarVideos";
import { useState } from "react";
import { BookOpen, Languages, ListChecks } from "lucide-react";

import { LessonAudioPlayer } from "@/components/LessonAudioPlayer";
import {
  AnswerTryBox,
  ExerciseGroup,
  OwlBadge,
  ToggleReveal,
  VocabCard,
} from "@/components/lesson/ExerciseKit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { UNIT10_GRAMMAR } from "@/data/grammar/unit10";
import unit10 from "@/data/textbookUnit10.json";
import {
  dialogue10D,
  dialogueOptions10D,
  grammar10C,
  listening10D_advantages,
  listening10D_disadvantages,
  pairPracticeModel10D,
  usefulPhrases10D,
  partA10C_translations,
  partB10C_translations,
  preReading10A_translations,
  readingPassage10A_translations,
  vocab10B,
  vocabularyMatchAnswers10B,
  vocabularyMeanings10B,
  vocabularySentenceTranslations10B,
} from "@/data/unit10Supplement";
import { getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const UNIT10 = unit10 as any;

const readingQuestion10ATranslations: Record<number, string> = {
  1: "သက်ရှိများမှာ မည်သည့်အရာများနည်း။",
  2: "သင်နေ့စဉ်နီးပါး စားသုံးသော အစားအစာသုံးမျိုးကို ဖော်ပြပါ။",
  3: "လတ်ဆတ်သော သစ်သီးများနှင့် ဟင်းသီးဟင်းရွက်များသည် ကျွန်ုပ်တို့အတွက် ဘာကြောင့် ကောင်းသနည်း။",
  4: "မျှတသော အစားအသောက်ဆိုသည်မှာ အဘယ်နည်း။",
  5: "အစားအစာများကို မှားယွင်းစွာ တွဲဖက်စားသုံးလျှင် ကျွန်ုပ်တို့တွင် ဘာဖြစ်နိုင်သနည်း။",
  6: "စာပိုဒ်တွင် ဖော်ပြထားသော ထိန်းသိမ်းထားသည့် အစားအစာ ဥပမာများမှာ မည်သည့်အရာများနည်း။",
  7: "မည်သည့်အသီးအနှံနှင့် ဟင်းသီးဟင်းရွက်များကို စားသုံးသင့်သနည်း။",
  8: "အစားအသောက်နှင့် ဆေးဝါးကွပ်ကဲရေးဌာန (FDA) သည် မည်သည့်အရာအတွက် တာဝန်ရှိသနည်း။",
};
const readingBonus10ATranslations: Record<number, string> = {
  1: "ကျွန်ုပ်တို့သည် အစားအစာကို ဘာအတွက် လိုအပ်သနည်း။",
  2: "စာကြောင်း ၁၀ ရှိ မျဉ်းသားထားသော 'those' ဆိုသည့်စကားလုံးသည် မည်သည့်အရာများကို ရည်ညွှန်းသနည်း။",
  3: "မျှတသော အစားအသောက် စားသုံးခြင်း၏ အကျိုးကျေးဇူးမှာ အဘယ်နည်း။",
  4: "အစားအစာနှင့် ဓာတ်မတည့်လျှင် ကျွန်ုပ်တို့တွင် ဘာဖြစ်နိုင်သနည်း။",
  5: "စည်သွတ်ငါး၊ အသားနှင့် အရသာထည့်ထားသော သစ်သီးဖျော်ရည်များသည် ကျွန်ုပ်တို့၏ ကျန်းမာရေးကို ဘာကြောင့် ထိခိုက်စေနိုင်သနည်း။",
  6: "စာကြောင်း ၃၀ ရှိ မျဉ်းသားထားသော 'which' ဆိုသည့်စကားလုံးသည် မည်သည့်အရာကို ရည်ညွှန်းသနည်း။",
  7: "လယ်သမားများသည် ဓာတ်မြေဩဇာနှင့် ပိုးသတ်ဆေးများကို ဘာကြောင့် အသုံးပြုသည်ဟု သင်ထင်သနည်း။",
  8: "အစားအစာကို မည်သို့ ကိုင်တွယ်သင့်သနည်း။",
  9: "မြန်မာနိုင်ငံတွင် အစားအသောက်နှင့် ဆေးဝါးကွပ်ကဲရေးဌာန (FDA) လုပ်ဆောင်သည့်အရာ ဥပမာတစ်ခုကို ဖော်ပြပါ။",
  10: "သင်သည် မျှတသော အစားအသောက်ကို စားသုံးနေသည်ဟု ထင်ပါသလား။ ဘာကြောင့် ထင်သနည်း၊ သို့မဟုတ် ဘာကြောင့် မထင်သနည်း။",
};

function getUnit10Lesson(code: string) {
  return (UNIT10.lessons ?? []).find((l: any) => l?.code === code) ?? null;
}

export function Unit10SkillView({ skill }: { skill: PracticeSkill }) {
  if (skill === "reading") return <ReadingView10 />;
  if (skill === "vocabulary") return <VocabularyView10 />;
  if (skill === "grammar") return <GrammarView10 />;
  if (skill === "listening" || skill === "speaking")
    return <ListeningSpeakingView10 skill={skill} />;
  return <WritingView10 />;
}

/* ------------------------------ Reading (10A) ---------------------------- */

function ReadingView10() {
  const lesson = getUnit10Lesson("10A") as any;
  const [showMy, setShowMy] = useState(false);
  const paragraphs = Object.entries(readingPassage10A_translations);
  const preReading = Object.entries(preReading10A_translations);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">10A · Reading</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>

        <Button
          size="sm"
          variant={showMy ? "default" : "outline"}
          className="mt-3 gap-1.5"
          onClick={() => setShowMy((v) => !v)}
        >
          <Languages className="h-3.5 w-3.5" />
          {showMy ? "Hide Burmese" : "Show Burmese explanation"}
        </Button>

        <p className="mt-4 text-sm leading-relaxed">{lesson?.intro}</p>
        {showMy ? (
          <div className="mt-4 space-y-3">
            {paragraphs.map(([id, text]) => (
              <p
                key={id}
                className="rounded-xl border border-border bg-background p-3 text-sm leading-relaxed"
              >
                <span className="mr-1 font-bold text-primary">{id}.</span>
                {text}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">{lesson?.introMy}</p>
        )}
      </section>

      <section className="space-y-5">
        <OwlBadge>
          <p className="font-semibold">မင်္ဂလာပါ! ဆရာ ဇီးကွက်ပါ 🦉</p>
          <p>
            အစားအသောက် ဘေးကင်းလုံခြုံမှု စာပိုဒ်ကို ဖတ်ပြီး မေးခွန်းတွေကို ဖြေကြည့်ပါ။{" "}
            <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
          </p>
        </OwlBadge>

        {preReading.length ? (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Pre-reading
            </div>
            <ol className="mt-3 space-y-2">
              {preReading.map(([id, text]) => (
                <li key={id} className="rounded-xl border border-border bg-background p-3">
                  <p className="text-sm leading-relaxed">
                    {id}. {text}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {lesson?.questions?.length ? (
          <ExerciseGroup
            title="Exercise A — Comprehension questions"
            titleMy="လေ့ကျင့်ခန်း A — နားလည်မှု မေးခွန်းများ"
            instructions={lesson.intro}
            instructionsMy="အစားအသောက် ဘေးကင်းလုံခြုံမှုအကြောင်း စာပိုဒ်ကို ဖတ်ပြီး မေးခွန်းများကို ဖြေပါ။"
            placeholder="Type your answer…"
            items={lesson.questions.map((q: any) => ({
              id: q.id,
              text: q.question,
              translation: readingQuestion10ATranslations[q.id] ?? "",
              answer: q.suggested_answer ?? "",
            }))}
          />
        ) : null}

        {lesson?.bonusQuestions?.length ? (
          <ExerciseGroup
            title="Exercise B — Further questions"
            titleMy="လေ့ကျင့်ခန်း B — ထပ်ဆောင်း မေးခွန်းများ"
            instructions="Answer in full sentences."
            instructionsMy="မေးခွန်းတစ်ခုစီကို ဝါကျပြည့်ဖြင့် ဖြေပါ။"
            placeholder="Type your answer…"
            items={lesson.bonusQuestions.map((q: any) => ({
              id: q.id,
              text: q.question,
              translation: readingBonus10ATranslations[q.id] ?? "",
              answer: q.answer ?? "",
            }))}
          />
        ) : null}
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (10B) --------------------------- */

function VocabularyView10() {
  const lesson = getUnit10Lesson("10B") as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">10B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>
          {lesson?.introMy} <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး
          ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Word guide · အသံထွက်နှင့် အဓိပ္ပာယ်
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {vocab10B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>
      </section>

      {lesson?.questions?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Exercise A — Match the words
          </div>
          <h3 className="mt-1 text-base font-semibold">လေ့ကျင့်ခန်း A — စကားလုံးနှင့် အဓိပ္ပာယ်ကို တွဲဖက်ပါ</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Match the words (1–10) in Column A with their meanings (a–j) in Column B.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ကော်လံ A ရှိ စကားလုံးများ (၁–၁၀) ကို ကော်လံ B ရှိ ၎င်းတို့၏ အဓိပ္ပာယ်များ (a–j) နှင့် တွဲဖက်ပါ။
          </p>

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <p className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-wider text-primary">Column A · Words</p>
              <ol className="mt-3 space-y-3">
                {lesson.questions.map((q: any) => (
                  <li key={q.id} className="rounded-lg border border-border bg-background p-3">
                    <p className="text-sm font-semibold"><span className="mr-2 text-primary">{q.id}.</span>{q.question}</p>
                    <AnswerTryBox
                      correct={vocabularyMatchAnswers10B[q.id] ?? q.suggested_answer ?? ""}
                      placeholder="Type the matching letter…"
                    />
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-wider text-primary">Column B · Meanings</p>
              <ol className="mt-3 space-y-2">
                {vocabularyMeanings10B.map((item) => (
                  <li key={item.key} className="grid grid-cols-[1.75rem_1fr] gap-2 rounded-lg border border-border bg-background p-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">{item.key}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-relaxed">{item.meaning}</p>
                      <p className="mt-1 border-t border-border pt-1 text-xs leading-relaxed text-muted-foreground">{item.meaningMy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {lesson?.bonusQuestions?.length ? (
        <ExerciseGroup
          title="Exercise B — Complete the sentences"
          titleMy="လေ့ကျင့်ခန်း B — ကွက်လပ်များ ဖြည့်စွက်ပါ"
          instructions="Complete the sentences with the appropriate words."
          enableStructure={false}
          placeholder="Type the missing words…"
          items={lesson.bonusQuestions.map((q: any) => ({
            id: q.id,
            text: q.question,
            translation: vocabularySentenceTranslations10B[q.id] ?? "",
            answer: q.answer ?? "",
          }))}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------ Grammar (10C) ---------------------------- */

function GrammarView10() {
  const lesson = getUnit10Lesson("10C") as any;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">10C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
      </header>

      <GrammarScriptView grammar={UNIT10_GRAMMAR} />
      <GrammarVideos unit={10} />

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> ဂရမ်မာ ရှင်းလင်းချက်
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>{grammar10C.whatMy}</p>
          <p>{grammar10C.whenMy}</p>
          <p>{grammar10C.whyMy}</p>
        </div>
        {grammar10C.examples?.length ? (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              📋 ဥပမာများ (Examples)
            </summary>
            <ul className="mt-2 space-y-1.5 text-sm">
              {grammar10C.examples.map((ex) => (
                <li key={ex.en}>
                  {ex.en} <span className="text-muted-foreground">— {ex.phrase}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      {lesson?.questions?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise A — Combine with 'not only … but also'"
          titleMy="လေ့ကျင့်ခန်း A — 'not only … but also' ဖြင့် ပေါင်းစပ်ပါ"
          instructions={lesson.intro}
          enableStructure={false}
          placeholder="Type the combined sentence…"
          items={lesson.questions.map((q: any) => ({
            id: q.id,
            text: q.question,
            translation: partA10C_translations[q.id] ?? "",
            answer: q.suggested_answer ?? "",
          }))}
        />
      ) : null}

      {lesson?.bonusQuestions?.length ? (
        <ExerciseGroup grammarPractice
          title="Exercise B — Rewrite with 'The more …, the more …'"
          titleMy="လေ့ကျင့်ခန်း B — 'The more …, the more …' ဖြင့် ပြန်ရေးပါ"
          instructions="Rewrite the sentences using correlative comparatives."
          enableStructure={false}
          placeholder="Type the rewritten sentences…"
          items={lesson.bonusQuestions.map((q: any) => ({
            id: q.id,
            text: q.question,
            translation: partB10C_translations[q.id] ?? "",
            answer: q.answer ?? "",
          }))}
        />
      ) : null}
    </div>
  );
}

/* ----------------------- Listening / Speaking (10D) ---------------------- */

function ListeningSpeakingView10({ skill }: { skill: PracticeSkill }) {
  const lesson = getUnit10Lesson("10D") as any;
  const audio = getUnitAudio(10);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            10D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.intro}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={10}
        src={audio}
        script={lesson?.intro ?? ""}
        label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
        hint={
          skill === "speaking"
            ? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
            : "နားထောင်ပြီး ကွက်လပ်တွေကို ဖြည့်ပါ။"
        }
      />

      {skill === "listening" ? (
        <>
          <ExerciseGroup
            title="Exercise A1 — Advantages of pre-packaged food"
            titleMy="လေ့ကျင့်ခန်း A1 — ကြိုတင်ထုပ်ပိုးထားသော အစားအစာ၏ အားသာချက်များ"
            instructions="Listen to 'Artificial Additives to Avoid' and fill in each blank in the Advantages column."
            instructionsMy="'Artificial Additives to Avoid' အသံဖိုင်ကို နားထောင်ပြီး အားသာချက်ကော်လံရှိ ကွက်လပ်တစ်ခုစီကို ဖြည့်ပါ။"
            enableStructure={false}
            placeholder="Type the missing word…"
            items={listening10D_advantages.map((r) => ({
              id: r.id,
              text: r.text,
              translation: r.my,
              answer: r.answer,
            }))}
          />
          <ExerciseGroup
            title="Exercise A2 — Disadvantages of pre-packaged food"
            titleMy="လေ့ကျင့်ခန်း A2 — ကြိုတင်ထုပ်ပိုးထားသော အစားအစာ၏ အားနည်းချက်များ"
            instructions="Now fill in each blank in the Disadvantages column."
            instructionsMy="ယခု အားနည်းချက်ကော်လံရှိ ကွက်လပ်တစ်ခုစီကို ဖြည့်ပါ။"
            enableStructure={false}
            placeholder="Type the missing word…"
            items={listening10D_disadvantages.map((r) => ({
              id: r.id,
              text: r.text,
              translation: r.my,
              answer: r.answer,
            }))}
          />
        </>
      ) : null}

      {skill === "speaking" ? (
        <>
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Exercise B — Complete the dialogue
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Asking for information on the fruits you have — ပေးထားသော အသုံးအနှုန်း (a–f) များဖြင့်
              ကွက်လပ်များကို ဖြည့်ပါ။
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dialogueOptions10D.map((o) => (
                <li
                  key={o.key}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm"
                >
                  ({o.key}) {o.text}
                </li>
              ))}
            </ul>

            <ol className="mt-4 space-y-3">
              {dialogue10D.map((line, i) => (
                <li key={i} className="rounded-xl border border-border bg-background p-3">
                  <p className="text-sm font-medium leading-relaxed">
                    <span className="mr-1 font-bold text-primary">{line.speaker}:</span>
                    {line.blank ? (
                      <>
                        {line.before}
                        <span className="mx-1 rounded bg-primary/10 px-2 py-0.5 font-semibold">
                          ({line.blank}) ________
                        </span>
                        {line.after}
                      </>
                    ) : (
                      line.text
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{line.my}</p>
                  {line.blank ? (
                    <div className="mt-2">
                      <AnswerTryBox
                        correct={line.answer ?? ""}
                        placeholder="Type the expression…"
                      />
                      <ToggleReveal label="Show answer" tone="emerald">
                        ({line.blank}) {line.answer} — option ({line.optionKey})
                      </ToggleReveal>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Exercise C — Pair practice
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              In pairs, practise substituting the dialogue with your favourite snack, using the
              useful language phrases below. — အဖော်နှင့်အတူ မိမိနှစ်သက်ရာ သရေစာဖြင့် အစားထိုး၍
              လေ့ကျင့်ပါ။
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Asking for information
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  {usefulPhrases10D.asking.map((p) => (
                    <li key={p.en}>
                      <span className="font-medium">{p.en}</span>
                      <span className="block text-xs text-muted-foreground">{p.my}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Asking for opinions
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  {usefulPhrases10D.opinions.map((p) => (
                    <li key={p.en}>
                      <span className="font-medium">{p.en}</span>
                      <span className="block text-xs text-muted-foreground">{p.my}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ToggleReveal label="Show a model substitution dialogue" tone="emerald">
              {pairPracticeModel10D}
            </ToggleReveal>
          </section>
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------ Writing (10E) ---------------------------- */

function WritingView10() {
  const lesson = getUnit10Lesson("10E") as any;
  const [draft, setDraft] = useState("");
  const model =
    lesson?.questions?.find((q: any) => q.suggested_answer?.length > 200)?.suggested_answer ??
    lesson?.questions?.[1]?.suggested_answer ??
    "";

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">10E · Writing</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.intro}</OwlBadge>
      </header>

      {lesson?.questions?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Writing tasks
          </div>
          <ol className="mt-3 space-y-3">
            {lesson.questions.map((q: any) => (
              <li key={q.id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium leading-relaxed">
                  {q.id}. {q.question}
                </p>
                <ToggleReveal label="Show model answer" tone="emerald">
                  {q.suggested_answer}
                </ToggleReveal>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Draft your complaint letter
        </div>
        <p className="mt-2 text-sm leading-relaxed">{lesson?.introMy}</p>
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
          rows={12}
          placeholder="Start writing here… ဒီနေရာမှာ စရေးပါ။"
          className="mt-4 text-sm leading-relaxed"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {draft.trim() ? draft.trim().split(/\s+/).length : 0} words
        </p>
        {model ? (
          <ToggleReveal label="Show model letter" tone="emerald">
            {model}
          </ToggleReveal>
        ) : null}
      </section>
    </div>
  );
}
