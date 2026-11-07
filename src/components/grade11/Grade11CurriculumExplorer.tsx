import { Grade11Review1View, Grade11Poem1View } from "@/components/grade11/Grade11Revision";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, BookOpen, ChevronDown, Headphones, ListChecks, MessageSquare, PenLine, SpellCheck, Sparkles, Type,
} from "lucide-react";
import { Grade11TextLesson, hasGrade11Text } from "@/components/grade11/Grade11TextLesson";
import { SayaOwlHome } from "@/components/SayaOwlHome";
import { G11_SYLLABUS, pageUrl, type G11SkillKind } from "@/data/grade11/syllabus";

const SKILL_ICONS: Record<G11SkillKind, typeof BookOpen> = {
  listening: Headphones, reading: BookOpen, speaking: MessageSquare,
  writing: PenLine, vocabulary: SpellCheck, grammar: Type,
};
const GROUPS: { title: string; hint: string; kinds: G11SkillKind[] }[] = [
  { title: "Receptive Skills", hint: "Take language in", kinds: ["listening", "reading"] },
  { title: "Productive Skills", hint: "Put language out", kinds: ["speaking", "writing"] },
  { title: "Knowledge about Language", hint: "Build the system", kinds: ["vocabulary", "grammar"] },
];

type View = { extra?: "review1" | "poem1"; eyebrow: string; title: string; detail?: string; pages: number[]; list?: boolean; unit?: number; kind?: G11SkillKind };

export function Grade11CurriculumExplorer() {
  const [openUnit, setOpenUnit] = useState<number | null>(1);
  const [view, setView] = useState<View | null>(null);

  if (view) {
    return (
      <div>
        <button type="button" onClick={() => setView(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to lessons
        </button>
        <header className="mt-4 flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {view.list ? <ListChecks className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{view.eyebrow}</p>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{view.title}</h2>
            {view.detail && <p className="mt-1 text-sm text-muted-foreground">{view.detail}</p>}
          </div>
        </header>
        {view.extra ? (
          <div className="mt-5" data-saya-home-section>{view.extra === "review1" ? <Grade11Review1View /> : <Grade11Poem1View />}</div>
        ) : view.unit && view.kind && hasGrade11Text(view.unit) ? (
          <div data-saya-home-section>
            <Grade11TextLesson unit={view.unit} kind={view.kind} />
          </div>
        ) : view.pages.length > 0 ? (
          <div className="mt-5 space-y-4">
            {view.pages.map((n) => (
              <figure key={n} className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={pageUrl(n)} alt={`Grade 11 English textbook page ${n}`} loading="lazy" className="w-full" />
                <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Textbook PDF page {n}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            🔜 ဒီအပိုင်းကို ဖတ်စာအုပ် Part 2 ရရှိပြီးနောက် ထည့်သွင်းပေးပါမည်။
          </div>
        )}
        <Link to="/tutor" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          🦉 ဆရာဇီးကွက်ကို မေးမည်
        </Link>
        <SayaOwlHome lessonContext={`Grade 11 English · ${view.eyebrow} · ${view.title}`} />
        {/* SayaOwlHome reads the visible lesson text from [data-saya-home-section]. */}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link to="/exam-builder"
        className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/5 px-5 py-4 transition hover:bg-primary/10">
        <span className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-bold">Exam Builder with Sayar Owl</span>
            <span className="block text-xs text-muted-foreground">Unit များကို ပေါင်းပြီး စိတ်ကြိုက် စာမေးပွဲ ထုတ်ပါ</span>
          </span>
        </span>
        <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Open</span>
      </Link>
      {G11_SYLLABUS.map((node) => {
        if (node.type === "banner") {
          return (
            <div key={node.id} className="flex items-center gap-3 rounded-xl border border-dashed border-accent/60 bg-accent/15 px-4 py-2.5">
              <Sparkles className="h-4 w-4 shrink-0 text-accent-foreground" />
              <button type="button"
                onClick={() => setView({ eyebrow: "Revision", title: node.review, pages: node.reviewPages, list: true, extra: node.id === "r1" ? "review1" : undefined })}
                className="cursor-pointer text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground underline-offset-4 hover:underline">
                {node.review}
              </button>
              <span className="h-px flex-1 bg-accent/50" />
              <button type="button"
                onClick={() => setView({ eyebrow: "Poetry", title: node.poem, pages: node.poemPages, extra: node.id === "r1" ? "poem1" : undefined })}
                className="cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground underline-offset-4 hover:underline">
                {node.poem}
              </button>
            </div>
          );
        }
        const isOpen = openUnit === node.number;
        return (
          <div key={node.number}
            className={`overflow-hidden rounded-2xl border bg-card transition ${isOpen ? "border-primary/40 shadow-md" : "border-border hover:border-primary/30"}`}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpenUnit(isOpen ? null : node.number)}
              className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                {node.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Unit {node.number}</span>
                <span className="block truncate text-base font-semibold tracking-tight">{node.title}</span>
              </span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <div className="grid gap-4 px-5 py-5 md:grid-cols-3">
                  {GROUPS.map((group) => (
                    <div key={group.title}>
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{group.title}</div>
                      <div className="text-[11px] text-muted-foreground">{group.hint}</div>
                      <div className="mt-3 space-y-2">
                        {group.kinds.map((kind) => {
                          const skill = node.skills.find((s) => s.kind === kind)!;
                          const Icon = SKILL_ICONS[kind];
                          return (
                            <button key={kind} type="button"
                              onClick={() => setView({ eyebrow: `Unit ${node.number} · ${node.title}`, title: skill.label, detail: skill.detail, pages: skill.pages, unit: node.number, kind })}
                              className="group flex w-full cursor-pointer items-start gap-3 rounded-xl border border-primary/40 bg-primary/5 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:shadow-md">
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-xs font-semibold">{skill.label}</span>
                                <span className="block text-xs text-muted-foreground">{skill.detail}</span>
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
