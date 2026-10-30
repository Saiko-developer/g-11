import { SyncedVideoPlayer } from "@/components/lesson/SyncedVideoPlayer";
import { UNIT1_VIDEO_SUBTITLES } from "@/data/unit1VideoSubtitles";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight, Languages, ListChecks, Play } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { DataSourceNotice } from "@/components/DataSourceNotice";
import { useCurriculum } from "@/hooks/use-curriculum";
import {
  AnswerTryBox,
  ExerciseGroup,
  OwlBadge,
  ParagraphBlock,
  ToggleReveal,
  VocabCard,
} from "@/components/lesson/ExerciseKit";


type SectionId = "1a" | "1b" | "1c";

export const Route = createFileRoute("/section/$sectionId")({
  head: ({ params }) => {
    const title = `Section ${params.sectionId.toUpperCase()} — Sayar Owl Academy`;
    const description = "Grade 10 English reading, vocabulary and grammar lessons with Burmese explanations.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] };
  },
  component: SectionPage,
});

function SectionPage() {
  const { sectionId } = Route.useParams();
  const id = sectionId.toLowerCase() as SectionId;

  if (id !== "1a" && id !== "1b" && id !== "1c") {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Section not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  return <SectionShell id={id} />;
}

function SectionShell({ id }: { id: SectionId }) {
  const curriculum = useCurriculum();

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.01_95)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <DataSourceNotice curriculum={curriculum} />
        {id === "1a" && <Section1A />}
        {id === "1b" && <Section1B />}
        {id === "1c" && <Section1C />}
      </main>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* SECTION 1A — Reading + Comprehension                                */
/* ------------------------------------------------------------------ */

function Section1A() {
  const { unit, supplement } = useCurriculum();
  const {
    partA1A_translations,
    partA1A_breakdowns,
    partB1A_translations,
    partB1A_breakdowns,
    partC1A_translations,
  } = supplement;
  const data = unit.sections[0] as any; // 1A
  const passage = data.reading_passage;
  const comp = data.comprehension;

  const [showFullMy, setShowFullMy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* LEFT — Reading Passage */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1A · Reading</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h1>
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

      {/* RIGHT — Interactive Saya Owl + Exercises */}
      <section className="space-y-5">
        <OwlBadge>
          <p className="font-semibold">မင်္ဂလာပါ! ဆရာ ဇီးကွက်ပါ 🦉</p>
          <p>
            ဘယ်ဘက်က စာပိုဒ်ကို သေသေချာချာ ဖတ်ပါ။ ပြီးရင် ညာဘက်က လေ့ကျင့်ခန်း A, B, C တစ်ခုချင်း ဖြေကြည့်ပါ။ <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
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
          enableStructure={false}
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


/* ------------------------------------------------------------------ */
/* SECTION 1B — Vocabulary + Sentence Rewriting                        */
/* ------------------------------------------------------------------ */

function Section1B() {
  const { unit, supplement } = useCurriculum();
  const { vocab1B, partB1B_translations } = supplement;
  const data = unit.sections[1] as any; // 1B
  const partB = data.part_B;
  const partA = data.part_A;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1B · Vocabulary</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h1>
        <OwlBadge>
          ဒီအပိုင်းမှာ နိုင်ငံ၊ နိုင်ငံသား၊ ဘာသာစကား ဝေါဟာရတွေကို အသံထွက်နဲ့တစ်ခြင်း သုံးမည် ဖြစ်ပါတယ်။ ပြီးရင် ဝါကျတွေကို ပြန်ရေးရတဲ့ လေ့ကျင့်ခန်းကို ဖြေရမှာပါ။ <strong>အဖြေတွေကို မပြသေးပါဘူး</strong> — ကိုယ်တိုင် စဉ်းစားပြီး ကြိုးစားကြည့်ပါ။
        </OwlBadge>
      </header>

      {/* Vocabulary list */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" /> Vocabulary — Word · Pronunciation · မြန်မာ အဓိပ္ပာယ်
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocab1B.map((v) => (
            <VocabCard key={v.word} item={v} />
          ))}
        </div>

        {/* Reference table from JSON */}
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            📋 Reference Table (Exercise A — Countries / Nationalities / Languages)
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary">
                <tr>
                  {partA.headers.map((h: any) => (
                    <th key={h} className="px-2 py-1.5 text-left font-semibold">{h}</th>
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

      {/* Exercise B — rewrite sentences */}
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


/* ------------------------------------------------------------------ */
/* SECTION 1C — Grammar Focus (Nouns in Apposition)                    */
/* ------------------------------------------------------------------ */

function Section1C() {
  const { unit, supplement } = useCurriculum();
  const { grammar1C, partA1C_translations } = supplement;
  const data = unit.sections[2] as any; // 1C
  const partA = data.part_A;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">1C · Grammar</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{data.topic}</h1>
      </header>

      {/* Owl explanation */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <OwlBadge>
          <p className="font-semibold">ဆရာ ဇီးကွက်ရဲ့ ရှင်းပြချက် 🦉</p>
        </OwlBadge>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs font-semibold text-primary">📘 ဘာလဲ? (What)</p>
            <p className="mt-1">{grammar1C.whatMy}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs font-semibold text-primary">⏰ ဘယ်အချိန် သုံးလဲ? (When)</p>
            <p className="mt-1">{grammar1C.whenMy}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs font-semibold text-primary">💡 ဘာကြောင့်? (Why)</p>
            <p className="mt-1">{grammar1C.whyMy}</p>
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:bg-amber-950/30">
            <p className="text-xs font-semibold">✨ Examples</p>
            <ul className="mt-1 space-y-1">
              {grammar1C.examples.map((e, i) => (
                <li key={i} className="text-sm">
                  {e.en.split(e.apposition)[0]}
                  <mark className="rounded bg-amber-200 px-1 dark:bg-amber-700/50">{e.apposition}</mark>
                  {e.en.split(e.apposition)[1]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* YouTube video */}
      {grammar1C.youtubeId && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Play className="h-3.5 w-3.5" /> Video — {grammar1C.youtubeTitle}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Watch this video to understand appositives better:</p>
          <SyncedVideoPlayer youtubeId={grammar1C.youtubeId} title={grammar1C.youtubeTitle ?? "Video"} subtitles={UNIT1_VIDEO_SUBTITLES} />
          <p className="mt-2 text-xs italic text-muted-foreground">📝 {grammar1C.subtitleNoteMy}</p>
        </section>
      )}

      {/* Exercise A — spot apposition */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <ListChecks className="h-3.5 w-3.5" /> Exercise A — Spot the noun in apposition
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{partA.instructions}</p>

        <ol className="mt-4 space-y-4">
          {partA.exercises.map((q: any) => (
            <li key={q.question_number} className="rounded-xl border border-border bg-background p-3">
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
                correct={q.apposition_phrases.join(" ; ")}
                placeholder="Type the noun-in-apposition phrase…"
              />
            </li>
          ))}
        </ol>
      </section>

      <div className="flex justify-end">
        <Link
          to="/"
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Back to the curriculum <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
