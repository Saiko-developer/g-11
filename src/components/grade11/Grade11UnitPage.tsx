import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SayaOwlHome } from "@/components/SayaOwlHome";
import { Grade11TextLesson } from "./Grade11TextLesson";
import { GRADE11_SKILLS } from "@/lib/grade11Navigation";
import type { G11SkillKind } from "@/data/grade11/syllabus";

/** A single shell for old unit links and directly shareable skill URLs. */
export function Grade11UnitPage({
  title,
  mmTitle,
  unitNumber,
  skill = "reading",
}: {
  title: string;
  mmTitle: string;
  unitNumber: number;
  skill?: G11SkillKind;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Link to="/grade-11" className="text-sm text-primary">
          ← Grade 11 Units
        </Link>
        <p className="mt-3 text-sm font-semibold text-primary">Unit {unitNumber}</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{mmTitle}</p>
        <nav aria-label={`Unit ${unitNumber} skills`} className="mt-5 flex flex-wrap gap-2">
          {GRADE11_SKILLS.map(({ kind, label }) => (
            <Link
              key={kind}
              to="/grade-11/$unit/$skill"
              params={{ unit: String(unitNumber), skill: kind }}
              aria-current={kind === skill ? "page" : undefined}
              className={`rounded-full border px-3 py-1.5 text-sm ${kind === skill ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div data-saya-home-section>
          <Grade11TextLesson key={`${unitNumber}:${skill}`} unit={unitNumber} kind={skill} />
        </div>
        <SayaOwlHome
          lessonContext={`Grade 11 English · Unit ${unitNumber} · ${title} · ${skill}`}
        />
      </main>
    </div>
  );
}
