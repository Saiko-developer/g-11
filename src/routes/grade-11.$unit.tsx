import { Grade11Unit5Lesson, Grade11Unit6Lesson } from "@/components/grade11/Grade11TravelLesson";
import { TRAVEL_PAGES } from "@/lib/grade11Travel";
import { Grade11Review1View, Grade11Poem1View } from "@/components/grade11/Grade11Revision";
import { Grade11Unit2Lesson } from "@/components/grade11/Grade11Unit2Lesson";
import { Grade11Unit4Lesson } from "@/components/grade11/Grade11Unit4Lesson";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { G11QuizBlock } from "@/components/grade11/G11Quiz";
import { getG11Unit } from "@/data/grade11/part1";
import { Grade11Unit3Lesson } from "@/components/grade11/Grade11Unit3Lesson";
import { Grade11Unit1Lesson } from "@/components/grade11/Grade11Unit1Lesson";
import { SayaOwlHome } from "@/components/SayaOwlHome";
import type { G11SkillKind } from "@/data/grade11/syllabus";

export const Route = createFileRoute("/grade-11/$unit")({
  loader: ({ params }) => {
    const unit = getG11Unit(params.unit) ?? TRAVEL_PAGES[params.unit];
    if (!unit) throw notFound();
    return { unit };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Grade 11 ${loaderData.unit.no}: ${loaderData.unit.title} — Sayar Owl` : "Grade 11 — Sayar Owl";
    const d = loaderData ? `${loaderData.unit.title} (${loaderData.unit.mmTitle}) — Grade 11 English lesson with quizzes.` : "Grade 11 English lesson.";
    return {
      meta: [
        { title: t }, { name: "description", content: d },
        { property: "og:title", content: t }, { property: "og:description", content: d },
        { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">Unit not found. <Link to="/grade-11" className="text-primary underline">Back</Link></div>
  ),
  component: UnitPage,
});

function UnitPage() {
  const { unit } = Route.useLoaderData();
  const tabs = [...(unit.reading ? ["Reading"] : []), ...unit.sections.map((s) => s.title.split(":")[0])];
  const [tab, setTab] = useState(0);
  if (["unit-1", "unit-2", "unit-3", "unit-4", "unit-5", "unit-6"].includes(unit.id)) return <SourceUnitPage key={unit.id} unitNumber={Number(unit.id.slice(5)) as 1 | 2 | 3 | 4 | 5 | 6} title={unit.title} mmTitle={unit.mmTitle} />;
  if (unit.id === "review-1" || unit.id === "poem-1") return <SourceExtraPage poem={unit.id === "poem-1"} />;
  const readingOffset = unit.reading ? 1 : 0;
  const section = tab >= readingOffset ? unit.sections[tab - readingOffset] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/grade-11" className="text-sm text-primary">← Grade 11 Units</Link>
        <p className="mt-3 text-sm font-semibold text-primary">{unit.no}</p>
        <h1 className="text-3xl font-bold">{unit.title}</h1>
        <p className="text-muted-foreground">{unit.mmTitle}</p>
        {!unit.ready && (
          <div className="mt-4 rounded-lg border border-border bg-muted p-3 text-sm">🔜 ဒီသင်ခန်းစာကို မကြာမီ အပြည့်အစုံ ထည့်သွင်းပေးပါမည်။</div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <button key={i} type="button" onClick={() => setTab(i)}
              className={`rounded-full border px-3 py-1.5 text-sm ${tab === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>
              {t}
            </button>
          ))}
        </div>
        <section className="mt-5 rounded-xl border border-border bg-card p-5">
          {!section && unit.reading && (
            <>
              <h2 className="text-xl font-semibold">{unit.reading.title}</h2>
              <div className="mt-3 space-y-3 leading-relaxed">
                {unit.reading.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <h3 className="mt-5 font-semibold">Key words</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {unit.reading.vocab.map((v) => (
                  <li key={v.word} className="rounded-md bg-muted px-3 py-2 text-sm"><b>{v.word}</b> — {v.mm}</li>
                ))}
              </ul>
              <h3 className="mt-5 font-semibold">Comprehension</h3>
              <G11QuizBlock items={unit.reading.quiz} />
            </>
          )}
          {section && (
            <>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-sm text-muted-foreground">{section.mm}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {section.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              {section.quiz && (<><h3 className="mt-5 font-semibold">Practice</h3><G11QuizBlock key={tab} items={section.quiz} /></>)}
            </>
          )}
        </section>
        <Link to="/tutor" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          🦉 ဆရာဇီးကွက်ကို မေးမည်
        </Link>
      </main>
    </div>
  );
}

const SOURCE_SKILLS: { kind: G11SkillKind; label: string }[] = [
  { kind: "reading", label: "Reading" },
  { kind: "vocabulary", label: "Vocabulary" },
  { kind: "grammar", label: "Grammar" },
  { kind: "listening", label: "Listening" },
  { kind: "speaking", label: "Speaking" },
  { kind: "writing", label: "Writing" },
];

/** Direct links use the same verified content as the curriculum explorer. */
function SourceUnitPage({ title, mmTitle, unitNumber }: { title: string; mmTitle: string; unitNumber: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const [skill, setSkill] = useState<G11SkillKind>("reading");
  const Lesson = { 1: Grade11Unit1Lesson, 2: Grade11Unit2Lesson, 3: Grade11Unit3Lesson, 4: Grade11Unit4Lesson, 5: Grade11Unit5Lesson, 6: Grade11Unit6Lesson }[unitNumber];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Link to="/grade-11" className="text-sm text-primary">← Grade 11 Units</Link>
        <p className="mt-3 text-sm font-semibold text-primary">Unit {unitNumber}</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{mmTitle}</p>
        <nav aria-label={`Unit ${unitNumber} skills`} className="mt-5 flex flex-wrap gap-2">
          {SOURCE_SKILLS.map(({ kind, label }) => (
            <button key={kind} type="button" aria-pressed={kind === skill} onClick={() => setSkill(kind)}
              className={`rounded-full border px-3 py-1.5 text-sm ${kind === skill ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>
              {label}
            </button>
          ))}
        </nav>
        <div data-saya-home-section><Lesson key={skill} kind={skill} /></div>
        <SayaOwlHome lessonContext={`Grade 11 English · Unit ${unitNumber} · ${title} · ${skill}`} />
      </main>
    </div>
  );
}

function SourceExtraPage({ poem }: { poem: boolean }) {
  const title = poem ? "Poem 1 — Bridges" : "Review 1";
  return <div className="min-h-screen bg-background text-foreground"><SiteHeader /><main className="mx-auto max-w-6xl px-4 py-6"><Link to="/grade-11" className="text-sm text-primary">← Grade 11 Units</Link><h1 className="mt-4 text-3xl font-bold">{title}</h1><div className="mt-5" data-saya-home-section>{poem ? <Grade11Poem1View /> : <Grade11Review1View />}</div><SayaOwlHome lessonContext={`Grade 11 English · ${title}`} /></main></div>;
}
