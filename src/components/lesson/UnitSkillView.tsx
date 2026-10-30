import { SyncedVideoPlayer } from "@/components/lesson/SyncedVideoPlayer";
import { UNIT1_VIDEO_SUBTITLES } from "@/data/unit1VideoSubtitles";
/**
 * Renders one unit + skill using the REAL textbook data in src/data, with the
 * exact same presentation the dedicated Lesson Page uses (shared ExerciseKit).
 */
import { useState } from "react";
import { BookOpen, Languages, ListChecks, Play } from "lucide-react";

import { LessonAudioPlayer } from "@/components/LessonAudioPlayer";
import {
  AnswerTryBox,
  ExerciseGroup,
  OwlBadge,
  ParagraphBlock,
  ToggleReveal,
  VocabCard,
} from "@/components/lesson/ExerciseKit";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import { GrammarScriptView } from "@/components/lesson/GrammarScriptView";
import { Unit2SkillView } from "@/components/lesson/Unit2SkillView";
import { Unit3SkillView } from "@/components/lesson/Unit3SkillView";
import { Unit4SkillView } from "@/components/lesson/Unit4SkillView";
import { Unit5SkillView } from "@/components/lesson/Unit5SkillView";
import { Unit6SkillView } from "@/components/lesson/Unit6SkillView";
import { Unit7SkillView } from "@/components/lesson/Unit7SkillView";
import { Unit8SkillView } from "@/components/lesson/Unit8SkillView";
import { Unit9SkillView } from "@/components/lesson/Unit9SkillView";
import { Unit10SkillView } from "@/components/lesson/Unit10SkillView";
import { Unit11SkillView } from "@/components/lesson/Unit11SkillView";
import { Unit12SkillView } from "@/components/lesson/Unit12SkillView";

import { UNIT1_GRAMMAR } from "@/data/grammar/unit1";
import { listeningSpeakingTranslations1to6 } from "@/data/listeningSpeakingTranslations1to6";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurriculum } from "@/hooks/use-curriculum";
import { getLocalLesson, getSyllabusUnit, getUnitAudio } from "@/lib/localData";
import type { PracticeSkill } from "@/lib/practice";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function UnitSkillView({ unit, skill }: { unit: number; skill: PracticeSkill }) {
  // Unit 2 has its own fully sandboxed data + view.
  if (unit === 2) return <Unit2SkillView skill={skill} />;
  // Unit 3 likewise reads only from textbookUnit3.json + unit3Supplement.ts.
  if (unit === 3) return <Unit3SkillView skill={skill} />;
  if (unit === 4) return <Unit4SkillView skill={skill} />;
  if (unit === 5) return <Unit5SkillView skill={skill} />;
  if (unit === 6) return <Unit6SkillView skill={skill} />;
  // Unit 7 reads only from textbookUnit7.json + unit7Supplement.ts + grammar/unit7.ts.
  if (unit === 7) return <Unit7SkillView skill={skill} />;
  // Unit 8 reads only from textbookUnit8.json + unit8Supplement.ts + grammar/unit8.ts.
  if (unit === 8) return <Unit8SkillView skill={skill} />;
  // Unit 9 reads only from textbookUnit9.json + unit9Supplement.ts + grammar/unit9.ts.
  if (unit === 9) return <Unit9SkillView skill={skill} />;
  // Unit 10 reads only from textbookUnit10.json + unit10Supplement.ts + grammar/unit10.ts.
  if (unit === 10) return <Unit10SkillView skill={skill} />;
  // Unit 11 reads only from textbookUnit11.json + unit11Supplement.ts + grammar/unit11.ts.
  if (unit === 11) return <Unit11SkillView skill={skill} />;
  // Unit 12 reads only from textbookUnit12.json + unit12Supplement.ts + grammar/unit12.ts.
  if (unit === 12) return <Unit12SkillView skill={skill} />;



  const supported = unit === 1;

  if (!supported) return <UnitPlaceholder unit={unit} skill={skill} />;


  if (skill === "reading") return <ReadingView />;
  if (skill === "vocabulary") return <VocabularyView />;
  if (skill === "grammar") return <GrammarView />;
  if (skill === "listening" || skill === "speaking")
    return <ListeningSpeakingView unit={unit} skill={skill} />;
  return <WritingView />;
}

/* ------------------------------ Reading (1A) ----------------------------- */

function ReadingView() {
  const { unit, supplement } = useCurriculum();
  const {
    partA1A_translations,
    partA1A_breakdowns,
    partB1A_translations,
    partB1A_breakdowns,
    partC1A_translations,
  } = supplement;
  const data = unit.sections[0] as any;
  const passage = data.reading_passage;
  const comp = data.comprehension;
  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1A · Reading</span>
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
          title="Exercise A — Fill in the blanks"
          titleMy="လေ့ကျင့်ခန်း A — ကွက်လပ်များ ဖြည့်ပါ"
          instructions={comp.part_A.instructions}
          items={comp.part_A.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.text,
            translation: partA1A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partA1A_breakdowns[e.question_number],
          }))}
        />

        <ExerciseGroup
          title="Exercise B — Short answers"
          titleMy="လေ့ကျင့်ခန်း B — အတိုချုံး အဖြေများ"
          instructions={comp.part_B.instructions}
          items={comp.part_B.exercises.map((e: any) => ({
            id: e.question_number,
            text: e.question,
            translation: partB1A_translations[e.question_number] ?? "",
            answer: e.answer,
            breakdown: partB1A_breakdowns[e.question_number],
          }))}
        />

        <ExerciseGroup
          title="Exercise C — Function of each utterance"
          titleMy="လေ့ကျင့်ခန်း C — စကားလုံးတစ်ခုစီ၏ လုပ်ဆောင်ချက်"
          instructions={comp.part_C.instructions}
          items={comp.part_C.exercises.map((e: any) => ({
            id: e.question_number,
            text: `"${e.utterance}"`,
            translation: partC1A_translations[e.question_number] ?? "",
            answer: e.function,
          }))}
        />
      </section>
    </div>
  );
}

/* ---------------------------- Vocabulary (1B) ---------------------------- */

function VocabularyView() {
  const { unit, supplement } = useCurriculum();
  const { vocab1B, partB1B_translations } = supplement;
  const data = unit.sections[1] as any;
  const partA = data.part_A;
  const partB = data.part_B;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1B · Vocabulary</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
        <OwlBadge>
          ဒီအပိုင်းမှာ နိုင်ငံ၊ နိုင်ငံသား၊ ဘာသာစကား ဝေါဟာရတွေကို လေ့လာပါမယ်။{" "}
          <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab1B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            📋 Reference Table (Exercise A — Countries / Nationalities / Languages)
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary">
                <tr>
                  {partA.headers.map((h: any) => (
                    <th key={h} className="px-2 py-1.5 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partA.table_data.map((r: any) => (
                  <tr key={r.country} className="border-b border-border">
                    <td className="px-2 py-1.5">{r.country}</td>
                    <td className="px-2 py-1.5">{r.nationality}</td>
                    <td className="px-2 py-1.5">{r.language}</td>
                    <td className="px-2 py-1.5">{r.adjective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise B — Rewrite each sentence
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{partB.instructions}</p>
        <ol className="mt-4 space-y-4">
          {partB.exercises.map((q: any) => (
            <li key={q.question_number} className="rounded-xl border border-border bg-background p-3">
              <div className="flex gap-2">
                <span className="text-sm font-bold text-primary">{q.question_number}.</span>
                <p className="text-sm font-medium leading-relaxed">{q.text}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ToggleReveal label="Show Translation" icon={Languages}>
                  {partB1B_translations[q.question_number] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                </ToggleReveal>
              </div>
              <AnswerTryBox correct={q.answer} placeholder="Fill in the missing word…" />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ------------------------------ Grammar (1C) ----------------------------- */

function GrammarView() {
  const { unit, supplement } = useCurriculum();
  const { grammar1C, partA1C_translations, partB1C_translations } = supplement;
  const data =
    (unit.sections as any[]).find((s) => /1c/i.test(s?.lesson ?? "")) ?? (unit.sections[2] as any);
  const partA = data?.part_A;
  const partB = data?.part_B;


  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1C · Grammar</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h2>
      </header>

      <GrammarScriptView grammar={UNIT1_GRAMMAR} />

      {grammar1C.youtubeId && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Play className="h-3.5 w-3.5" /> Video — {grammar1C.youtubeTitle}
          </div>
          <SyncedVideoPlayer youtubeId={grammar1C.youtubeId} title={grammar1C.youtubeTitle ?? "Video"} subtitles={UNIT1_VIDEO_SUBTITLES} />
          <p className="mt-2 text-xs italic text-muted-foreground">📝 {grammar1C.subtitleNoteMy}</p>
        </section>
      )}

      {partA?.exercises?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Exercise A — Spot the noun in apposition
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{partA.instructions}</p>
          <ol className="mt-4 space-y-4">
            {partA.exercises.map((q: any) => (
              <li
                key={q.question_number}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex gap-2">
                  <span className="text-sm font-bold text-primary">{q.question_number}.</span>
                  <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleReveal label="Translate" icon={Languages}>
                    {partA1C_translations[q.question_number] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                </div>
                <AnswerTryBox
                  question={q.text}
                  instructions={partA.instructions}
                  correct={(q.apposition_phrases ?? q.apposition_pharses ?? []).join(" ; ")}
                  placeholder="Type the noun-in-apposition phrase…"
                />
              </li>
            ))}
          </ol>
          <GrammarExerciseGenerator
            title="Exercise A — Spot the noun in apposition"
            instructions={partA.instructions}
            samples={partA.exercises.map((q: any) => ({ text: q.text, answer: (q.apposition_phrases ?? q.apposition_pharses ?? []).join(" ; ") }))}
            placeholder="Type the noun-in-apposition phrase…"
          />
        </section>
      ) : null}

      {partB?.exercises?.length ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ListChecks className="h-3.5 w-3.5" /> Exercise B — Combine using nouns in apposition
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{partB.instructions}</p>
          <ol className="mt-4 space-y-4">
            {partB.exercises.map((q: any) => (
              <li
                key={q.question_number}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex gap-2">
                  <span className="text-sm font-bold text-primary">{q.question_number}.</span>
                  <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleReveal label="Translate" icon={Languages}>
                    {partB1C_translations[q.question_number] ?? "မြန်မာ ဘာသာပြန် မရရှိနိုင်ပါ။"}
                  </ToggleReveal>
                </div>
                <AnswerTryBox
                  question={q.text}
                  instructions={partB.instructions}
                  correct={[q.correct_answer, q.alternative_answer]
                    .filter(Boolean)
                    .join(" ; ")}
                  placeholder="Type the combined sentence…"
                />
              </li>
            ))}
          </ol>
          <GrammarExerciseGenerator
            title="Exercise B — Combine using nouns in apposition"
            instructions={partB.instructions}
            samples={partB.exercises.map((q: any) => ({ text: q.text, answer: q.correct_answer }))}
            placeholder="Type the combined sentence…"
          />
        </section>
      ) : null}

    </div>
  );
}

/* ------------------------ Listening / Speaking (1D) ----------------------- */

function ListeningSpeakingView({ unit, skill }: { unit: number; skill: PracticeSkill }) {
  const lesson = getLocalLesson("1D");
  const audio = getUnitAudio(unit);
  const translations = listeningSpeakingTranslations1to6[1];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">
            1D · {skill === "speaking" ? "Speaking" : "Listening"}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{lesson?.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson?.titleMy}</p>
        <OwlBadge>{lesson?.introMy}</OwlBadge>
      </header>

      <LessonAudioPlayer
        unit={unit}
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
        title={skill === "speaking" ? "Exercises D–E — Interview and report" : "Exercises A–C — Listening activities"}
        titleMy={
          skill === "speaking"
            ? "လေ့ကျင့်ခန်း — အသံထွက် လေ့ကျင့်ပါ"
            : "လေ့ကျင့်ခန်း A — ကွက်လပ်များ ဖြည့်ပါ"
        }
        instructions={lesson?.intro ?? ""}
        instructionsMy={
          skill === "speaking"
            ? translations.speakingInstructionsMy
            : translations.listeningInstructionsMy
        }
        enableStructure={false}
        items={(skill === "speaking"
          ? (lesson?.bonusQuestions ?? lesson?.questions ?? [])
          : (lesson?.questions ?? [])
        ).map((q: any) => ({
          id: q.id,
          text: q.question,
          translation:
            q.translation ??
            (skill === "speaking" ? translations.speaking : translations.listening)[q.id] ??
            "",
          answer: q.suggested_answer ?? q.answer,
        }))}
      />
    </div>
  );
}

/* ------------------------------ Writing (1E) ----------------------------- */

function WritingView() {
  const lesson = getLocalLesson("1E");
  const task = lesson?.questions?.[0];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1E · Writing</span>
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
        {lesson?.bonusQuestions && lesson.bonusQuestions.length > 0 && (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {lesson.bonusQuestions.map((q) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
        )}
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

/* ------------------------------- Fallback -------------------------------- */

function UnitPlaceholder({ unit, skill }: { unit: number; skill: PracticeSkill }) {
  const syllabus = getSyllabusUnit(unit);
  const detail = syllabus?.skills.find((s) => s.kind === skill);
  const audio = getUnitAudio(unit);

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Unit {unit}
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-tight">{syllabus?.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {detail?.label} — {detail?.detail}
        </p>
      </header>

      {(skill === "listening" || skill === "speaking") && audio && (
        <LessonAudioPlayer
        unit={unit}
          src={audio}
          script={syllabus?.title ?? ""}
          label={skill === "speaking" ? "Model pronunciation" : "Listening track"}
          hint="နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"
        />
      )}

      <OwlBadge>
        ဒီယူနစ်အတွက် စာသားလေ့ကျင့်ခန်းများကို ထည့်သွင်းနေဆဲ ဖြစ်ပါတယ်။ အောက်ဘက်ရှိ ဆရာ ဇီးကွက်ကို
        မေးခွန်းမေးနိုင်ပါတယ်။
      </OwlBadge>
    </div>
  );
}
