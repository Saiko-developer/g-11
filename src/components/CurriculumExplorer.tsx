import { useState } from "react";
import { Link } from "@tanstack/react-router";


import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Headphones,
  ListChecks,
  MessageSquare,
  PenLine,
  SpellCheck,
  Sparkles,
  Type,
} from "lucide-react";

import { PracticeWorkspace } from "@/components/PracticeWorkspace";
import { SayaOwlHome } from "@/components/SayaOwlHome";
import { Poem1View } from "@/components/lesson/Poem1View";
import { Poem2View } from "@/components/lesson/Poem2View";
import { Poem3View } from "@/components/lesson/Poem3View";
import { Poem4View } from "@/components/lesson/Poem4View";
import { Review1View } from "@/components/lesson/Review1View";
import { Review2View } from "@/components/lesson/Review2View";
import { Review3View } from "@/components/lesson/Review3View";
import { Review4View } from "@/components/lesson/Review4View";

import { SYLLABUS, type SkillKind, type SyllabusSkill } from "@/data/syllabus";
import type { PracticeSkill } from "@/lib/practice";


const SKILL_ICONS: Record<SkillKind, typeof BookOpen> = {
  listening: Headphones,
  reading: BookOpen,
  speaking: MessageSquare,
  writing: PenLine,
  vocabulary: SpellCheck,
  grammar: Type,
};

const GROUPS: { title: string; hint: string; kinds: SkillKind[] }[] = [
  { title: "Receptive Skills", hint: "Take language in", kinds: ["listening", "reading"] },
  { title: "Productive Skills", hint: "Put language out", kinds: ["speaking", "writing"] },
  {
    title: "Knowledge about Language",
    hint: "Build the system",
    kinds: ["vocabulary", "grammar"],
  },
];

type Selection = { unit: number; skill: PracticeSkill };
type ExtraView = "review1" | "review2" | "review3" | "review4" | "poem3" | "poem2" | "poem1" | "poem4";

export function CurriculumExplorer() {
  const [openUnit, setOpenUnit] = useState<number | null>(1);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [extra, setExtra] = useState<ExtraView | null>(null);

  // Active selection state — the grid is replaced by the split-screen workspace.
  if (selection) {
    return (
      <PracticeWorkspace
        unit={String(selection.unit)}
        skill={selection.skill}
        onBack={() => setSelection(null)}
        backLabel="Back to lessons"
        chatVariant="home"
      />
    );
  }

  if (extra) {
const title =
      extra === "review1"
        ? "Review 1"
        : extra === "review2"
          ? "Review 2"
          : extra === "review3"
          ? "Review 3"
          : extra === "review4"
          ? "Review 4"
          : extra === "poem3"
          ? "Poem 3 — Song"
          : extra === "poem2"
            ? "Poem 2 — The Blind Boy"
            : extra === "poem4"
              ? "Poem 4 — What Is Pink?"
              : "Poem 1 — Daffodils";

    return (
      <div>
        <button
          type="button"
          onClick={() => setExtra(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lessons
        </button>

        <header className="mt-4 flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
{extra === "review1" || extra === "review2" || extra === "review3" ? (
              <ListChecks className="h-5 w-5" />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
{extra === "review1"
                ? "Units 1–3 revision"
                : extra === "review2"
                  ? "Units 4–6 revision"
                  : extra === "review3"
                    ? "Units 7–9 revision"
                    : extra === "review4"
                    ? "Units 10–12 revision"
                    : "Poetry"}
            </p>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
          </div>
        </header>

        <div className="mt-5" data-saya-home-section>
{extra === "review1" ? (
            <Review1View />
          ) : extra === "review2" ? (
            <Review2View />
          ) : extra === "review3" ? (
            <Review3View />
          ) : extra === "review4" ? (
            <Review4View />
          ) : extra === "poem3" ? (
            <Poem3View />
          ) : extra === "poem2" ? (
            <Poem2View />
          ) : extra === "poem4" ? (
            <Poem4View />
          ) : (
            <Poem1View />
          )}
        </div>


        <SayaOwlHome
lessonContext={
            extra === "review1"
              ? "Grade 10 English — Review 1 (Units 1–3 revision)"
              : extra === "review2"
                ? "Grade 10 English — Review 2 (Units 4–6 revision)"
                : extra === "review3"
                ? "Grade 10 English — Review 3 (Units 7–9 revision)"
                : extra === "review4"
                ? "Grade 10 English — Review 4 (Units 10–12 revision)"
                : extra === "poem3"
                ? "Grade 10 English — Poem 3: Song (Christina Rossetti)"
                : extra === "poem2"
                  ? "Grade 10 English — Poem 2: The Blind Boy (Colley Cibber)"
                  : extra === "poem4"
                    ? "Grade 10 English — Poem 4: What Is Pink? (Christina Rossetti)"
                    : "Grade 10 English — Poem 1: Daffodils (William Wordsworth)"
          }
        />

      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link
        to="/exam-builder"
        className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/5 px-5 py-4 transition hover:bg-primary/10"
      >
        <span className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-bold">Exam Builder with Sayar Owl</span>
            <span className="block text-xs text-muted-foreground">
              Unit များကို ပေါင်းပြီး စိတ်ကြိုက် စာမေးပွဲ ထုတ်ပါ — အပြည့် (၉၅ မှတ်) သို့မဟုတ် အပိုင်းရွေး
            </span>
          </span>
        </span>
        <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Open</span>
      </Link>
      {SYLLABUS.map((node) => {
if (node.type === "banner") {
          const reviewTarget: ExtraView | null =
            node.id === "r1"
              ? "review1"
              : node.id === "r2"
                ? "review2"
                : node.id === "r3"
                  ? "review3"
                  : node.id === "r4"
                    ? "review4"
                    : null;
          const poemTarget: ExtraView | null =
            node.id === "r1" ? "poem1" : node.id === "r2" ? "poem2" : node.id === "r3" ? "poem3" : node.id === "r4" ? "poem4" : null;
          return (
            <div
              key={node.id}
              className="flex items-center gap-3 rounded-xl border border-dashed border-accent/60 bg-accent/15 px-4 py-2.5"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-accent-foreground" />
{reviewTarget ? (
                <button
                  type="button"
                  onClick={() => setExtra(reviewTarget)}
                  className="cursor-pointer text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground underline-offset-4 hover:underline"
                >
                  {node.review}
                </button>
              ) : (
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground">
                  {node.review}
                </span>
              )}
              <span className="h-px flex-1 bg-accent/50" />
              {poemTarget ? (
                <button
                  type="button"
                  onClick={() => setExtra(poemTarget)}
                  className="cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground underline-offset-4 hover:underline"
                >
                  {node.poem}
                </button>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                  {node.poem}
                </span>
              )}

            </div>
          );
        }


        const isOpen = openUnit === node.number;
        return (
          <div
            key={node.number}
            className={`overflow-hidden rounded-2xl border bg-card transition ${
              isOpen ? "border-primary/40 shadow-md" : "border-border hover:border-primary/30"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenUnit(isOpen ? null : node.number)}
              className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${
                  isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}
              >
                {node.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Unit {node.number}
                </span>
                <span className="block truncate text-base font-semibold tracking-tight">
                  {node.title}
                </span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">

                <div className="grid gap-4 px-5 py-5 md:grid-cols-3">

                  {GROUPS.map((group) => (
                    <div key={group.title}>
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        {group.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{group.hint}</div>
                      <div className="mt-3 space-y-2">
                        {group.kinds.map((kind) => {
                          const skill = node.skills.find((s) => s.kind === kind) as SyllabusSkill;
                          const Icon = SKILL_ICONS[kind];
                          return (
                            <button
                              key={kind}
                              type="button"
                              onClick={() =>
                                setSelection({ unit: node.number, skill: kind as PracticeSkill })
                              }
                              className="group flex w-full cursor-pointer items-start gap-3 rounded-xl border border-primary/40 bg-primary/5 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:shadow-md"
                            >
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-xs font-semibold">{skill.label}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {skill.detail}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
