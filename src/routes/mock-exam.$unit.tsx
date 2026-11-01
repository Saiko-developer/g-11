import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  FileCheck2,
  FileDown,
  Loader2,
  Lock,
  Pencil,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { PaperSubmission } from "@/components/PaperSubmission";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogle } from "@/components/RequireSignIn";
import type { ExamQuota } from "@/routes/api/mock-exam";
import { SYLLABUS, type SyllabusUnit } from "@/data/syllabus";
import { downloadAnswerKey, downloadExamPaper, type DownloadFormat } from "@/lib/examPrint";
import { PaperEditor } from "@/components/PaperEditor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FORMATS: { f: DownloadFormat; label: string }[] = [
  { f: "pdf", label: "PDF (.pdf)" },
  { f: "doc", label: "Word (.doc)" },
  { f: "png", label: "Image (.png)" },
  { f: "jpeg", label: "Image (.jpg)" },
];
import type { ExamSection, MockExamPaper } from "@/lib/mockExam";
import { normalizeConfig } from "@/lib/examBlueprint";

export const Route = createFileRoute("/mock-exam/$unit")({
  head: ({ params }) => {
    const title = `Unit ${params.unit} Mock Exam — Sayar Owl Academy`;
    const description = `A full Grade 10 English mock exam paper for Unit ${params.unit}, written by Sayar Owl in the Myanmar matriculation format: nine sections, 95 marks, with a built-in timer.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  validateSearch: (s: Record<string, unknown>): { units?: string; sections?: string; count?: number } => ({
    units: typeof s.units === "string" ? s.units : typeof s.units === "number" ? String(s.units) : undefined,
    sections: typeof s.sections === "string" ? s.sections : undefined,
    count: Number(s.count) === 5 ? 5 : Number(s.count) === 10 ? 10 : undefined,
  }),
  component: MockExamPage,
});

function useUnitMeta(units: number[]) {
  return useMemo(() => {
    const nodes = units
      .map((u) => SYLLABUS.find((n): n is SyllabusUnit => n.type === "unit" && n.number === u))
      .filter((n): n is SyllabusUnit => !!n);
    const title =
      units.length > 1
        ? `Units ${units.join(", ")} Combined Exam`
        : (nodes[0]?.title ?? `Unit ${units[0]}`);
    const topics = nodes
      .map((n) => `Unit ${n.number} (${n.title}) — ${n.skills.map((s) => `${s.label}: ${s.detail}`).join("; ")}`)
      .join(" || ");
    return { title, topics };
  }, [units.join(",")]);
}

function MockExamPage() {
  const { unit } = Route.useParams();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const unitNumber = Number(unit);
  const config = useMemo(
    () => normalizeConfig({ units: search.units, sections: search.sections, count: search.count }, unitNumber),
    [search.units, search.sections, search.count, unitNumber],
  );
  const unitLabel = config.units.length > 1 ? `Units ${config.units.join(", ")}` : `Unit ${config.units[0]}`;
  const meta = useUnitMeta(config.units);

  const [paper, setPaper] = useState<MockExamPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [editing, setEditing] = useState(false);
  const [quota, setQuota] = useState<ExamQuota | null>(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  const generate = useMemo(
    () => async (fresh = false) => {
      setLoading(true);
      setError(null);
      setPaper(null);
      setShowAnswers(false);
      try {
        const res = await fetch("/api/mock-exam", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token ?? ""}`,
          },
          body: JSON.stringify({ unit: config.units[0], unitTitle: meta.title, topics: meta.topics, fresh, units: config.units, sections: config.sections, count: config.count }),
        });
        setNeedsSignIn(res.status === 401);
        const raw = (await res.json()) as { paper?: MockExamPaper; quota?: ExamQuota; error?: string };
        if (raw.quota) setQuota(raw.quota);
        if (!res.ok || !raw.paper) throw new Error(raw.error ?? "Could not generate the exam paper");
        const data = raw.paper;
        setPaper(data);
        setSeconds((data.durationMinutes ?? 120) * 60);
        setRunning(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [config, meta.title, meta.topics],
  );

  useEffect(() => {
    void generate();
  }, [generate]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);

  const limitReached = !!quota && quota.limit >= 0 && quota.used >= quota.limit && (quota.extra ?? 0) <= 0;

  // Students: answer key download unlocks 30 min after the paper was generated;
  // on-screen answers unlock only after they submit their paper for grading.
  const isStaff = !!quota && (quota.limit < 0 || quota.role === "teacher" || quota.role === "admin");
  const storeKey = paper ? `mockexam:${unitNumber}:${paper.title}` : null;
  const [genAt, setGenAt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!storeKey) return;
    let t = Number(localStorage.getItem(`${storeKey}:at`));
    if (!t) {
      t = Date.now();
      localStorage.setItem(`${storeKey}:at`, String(t));
    }
    setGenAt(t);
    setSubmitted(localStorage.getItem(`${storeKey}:done`) === "1");
  }, [storeKey]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const markSubmitted = () => {
    setSubmitted(true);
    if (storeKey) localStorage.setItem(`${storeKey}:done`, "1");
  };
  const remainingMs = genAt ? Math.max(0, genAt + 30 * 60 * 1000 - now) : 30 * 60 * 1000;
  const keyUnlocked = isStaff || remainingMs === 0;
  const keyWait = `${String(Math.floor(remainingMs / 60000)).padStart(2, "0")}:${String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0")}`;
  const canShowAnswers = isStaff || submitted;

  const clock = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(
    Math.floor((seconds % 3600) / 60),
  ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <button
          type="button"
          onClick={() => void navigate({ to: "/exam-builder" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Exam Builder
        </button>

        <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {unitLabel} · Sayar Owl exam
            </p>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {paper?.title ?? meta.title}
            </h1>
            {paper && (
              <p className="mt-1 text-sm text-muted-foreground">
                {paper.sections.length} sections · {paper.totalMarks} marks ·{" "}
                {paper.durationMinutes} minutes
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-sm ${
                seconds === 0 && paper ? "border-destructive text-destructive" : "border-border"
              }`}
            >
              <Clock className="h-4 w-4" /> {clock}
            </span>
            <Button variant="outline" size="sm" onClick={() => setRunning((r) => !r)} disabled={!paper}>
              {running ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => void generate(true)} disabled={loading || limitReached}>
              <RefreshCw className="h-4 w-4" /> New paper
            </Button>
            {quota && (
              <span className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground">
                {quota.limit < 0
                  ? "Admin · အကန့်အသတ်မရှိ"
                  : `${quota.role === "teacher" ? "ဆရာ" : "ကျောင်းသား"} · ယနေ့ အခမဲ့ ကျန် ${Math.max(0, quota.limit - quota.used)}/${quota.limit} ကြိမ်${(quota as { extra?: number }).extra ? ` · Extra ${(quota as { extra?: number }).extra}` : ""}`}
              </span>
            )}
            {isStaff && paper && (
              <Button variant={editing ? "default" : "outline"} size="sm" onClick={() => setEditing((v) => !v)}>
                <Pencil className="h-4 w-4" /> {editing ? "ပြင်ပြီးပါပြီ" : "Edit Paper"}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" disabled={!paper}>
                  <FileDown className="h-4 w-4" /> Download Paper
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {FORMATS.map(({ f, label }) => (
                  <DropdownMenuItem key={f} onSelect={() => paper && downloadExamPaper(paper, f)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                  disabled={!paper || !keyUnlocked}
                  title={keyUnlocked ? undefined : "မေးခွန်းထုတ်ပြီး မိနစ် ၃၀ ပြည့်မှ ဒေါင်းလုဒ်ရပါမည်"}
                >
                  {keyUnlocked ? <FileCheck2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Download Answer Key
                  {!keyUnlocked && paper && <span className="font-mono text-xs">({keyWait})</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {FORMATS.map(({ f, label }) => (
                  <DropdownMenuItem key={f} onSelect={() => paper && keyUnlocked && downloadAnswerKey(paper, f)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            Sayar Owl is writing your {unitLabel} exam paper ({config.sections.length} section
            {config.sections.length > 1 ? "s" : ""}). This can take up to a minute.
          </div>
        )}

        {error && needsSignIn && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center text-sm">
            <p className="font-semibold">စာမေးပွဲဖြေရန် အရင် Sign in ဝင်ပါ</p>
            <p className="mt-1 text-muted-foreground">Please sign in to generate your mock exam paper.</p>
            <Button className="mt-3" size="sm" onClick={() => void signInWithGoogle(window.location.href)}>
              Google ဖြင့် ဝင်ရန်
            </Button>
          </div>
        )}

        {error && !needsSignIn && (
          <div className="mt-8 rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm">
            <p className="font-semibold">Could not generate the paper.</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
            <Button className="mt-3" size="sm" onClick={() => void generate()} disabled={limitReached}>
              Try again
            </Button>
          </div>
        )}

        {paper && (
          <>
            <PaperSubmission paper={paper} unit={unitNumber} onGraded={markSubmitted} />
            <div className="mt-6 flex justify-end">
              {canShowAnswers ? (
                <Button variant="ghost" size="sm" onClick={() => setShowAnswers((v) => !v)}>
                  {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showAnswers ? "Hide answer key" : "Show answer key"}
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" /> အဖြေလွှာ တင်ပြီး စစ်ဆေးပြီးမှ အဖြေကြည့်နိုင်ပါမည်
                </span>
              )}
            </div>
            {editing && isStaff ? (
              <PaperEditor paper={paper} onChange={setPaper} />
            ) : (
              <div className="mt-2 space-y-6">
                {paper.sections.map((section) => (
                  <SectionCard key={section.id} section={section} showAnswers={showAnswers} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Answer({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

export function SectionCard({ section, showAnswers }: { section: ExamSection; showAnswers: boolean }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-3">
        <h2 className="text-base font-bold tracking-tight">
          <span className="mr-2 text-primary">Section {section.id}.</span>
          {section.title}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {section.marks} marks
        </span>
      </header>
      <p className="mb-4 text-sm italic text-muted-foreground">{section.instructions}</p>
      <SectionBody section={section} showAnswers={showAnswers} />
    </section>
  );
}

function SectionBody({ section, showAnswers }: { section: ExamSection; showAnswers: boolean }) {
  switch (section.type) {
    case "fill":
      return (
        <ol className="space-y-2 text-sm">
          {section.items.map((i) => (
            <li key={i.number}>
              {i.number}. {i.sentence}
              {i.hint && <span className="text-muted-foreground"> ({i.hint}…)</span>}
              <Answer show={showAnswers}>{i.answer}</Answer>
            </li>
          ))}
        </ol>
      );
    case "mcq":
      return (
        <ol className="space-y-3 text-sm">
          {section.items.map((i) => (
            <li key={i.number}>
              <p>
                {i.number}. {i.sentence}
                <Answer show={showAnswers}>{i.answer}</Answer>
              </p>
              <p className="mt-1 flex flex-wrap gap-4 text-muted-foreground">
                {i.options.map((o) => (
                  <span key={o.label}>
                    ({o.label}) {o.text}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      );
    case "transformation":
      return (
        <ol className="space-y-2 text-sm">
          {section.items.map((i) => (
            <li key={i.number}>
              {i.number}. {i.sentence}{" "}
              <span className="font-medium text-primary">[{i.instruction}]</span>
              <Answer show={showAnswers}>{i.answer}</Answer>
            </li>
          ))}
        </ol>
      );
    case "poetry":
      return (
        <div className="space-y-4 text-sm">
          <p className="font-semibold">{section.poemTitle}</p>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Part A (5 marks)
            </p>
            <ol className="space-y-1.5 whitespace-pre-line">
              {section.partA.map((i) => (
                <li key={i.number}>
                  {i.number}. {i.sentence}
                  <Answer show={showAnswers}>{i.answer}</Answer>
                </li>
              ))}
            </ol>
          </div>
          <QaList title="Part B (5 marks)" items={section.partB} showAnswers={showAnswers} />
        </div>
      );
    case "passage":
      return (
        <div className="space-y-4 text-sm">
          <p className="rounded-xl bg-secondary/50 p-4 leading-relaxed">{section.passage}</p>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Part A (5 marks)
            </p>
            <ol className="space-y-1.5">
              {section.partA.map((i) => (
                <li key={i.number}>
                  {i.number}. {i.sentence}
                  <Answer show={showAnswers}>{i.answer}</Answer>
                </li>
              ))}
            </ol>
          </div>
          <QaList title="Part B (5 marks)" items={section.partB} showAnswers={showAnswers} />
        </div>
      );
    case "passage_extended":
      return (
        <div className="space-y-4 text-sm">
          <p className="rounded-xl bg-secondary/50 p-4 leading-relaxed">{section.passage}</p>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Part A (5 marks) — match each definition with a boldfaced word
            </p>
            <ol className="space-y-1.5">
              {section.definitions.map((d) => (
                <li key={d.number}>
                  {d.number}. {d.definition}
                  <Answer show={showAnswers}>{d.answer}</Answer>
                </li>
              ))}
            </ol>
          </div>
          <QaList title="Part B (10 marks)" items={section.partB} showAnswers={showAnswers} />
        </div>
      );
    case "functional":
      return (
        <div className="space-y-4 text-sm">
          <Bank title="Word bank" words={section.wordBank} />
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Part A (5 marks)
            </p>
            <ol className="space-y-1.5">
              {section.dialogue.map((t) => (
                <li key={t.number}>
                  <span className="font-medium">{t.speaker}:</span> {t.text}
                  {t.answer && <Answer show={showAnswers}>{t.answer}</Answer>}
                </li>
              ))}
            </ol>
          </div>
          <Bank title="Phrase bank" words={section.phraseBank} />
          <QaList title="Part B (5 marks)" items={section.matches} showAnswers={showAnswers} />
        </div>
      );
    case "writing":
      return (
        <div className="space-y-2 text-sm">
          <ol className="space-y-2">
            {section.prompts.map((p, i) => (
              <li key={i} className="rounded-lg bg-secondary/50 p-3">
                ({String.fromCharCode(97 + i)}) {p}
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground">Maximum {section.maxWords} words.</p>
        </div>
      );
    default:
      return null;
  }
}

function Bank({ title, words }: { title: string; words: string[] }) {
  return (
    <div className="rounded-xl border border-dashed border-primary/40 p-3">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{title}</p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        {words.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </p>
    </div>
  );
}

function QaList({
  title,
  items,
  showAnswers,
}: {
  title: string;
  items: { number: number; question: string; answer: string }[];
  showAnswers: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">{title}</p>
      <ol className="space-y-2">
        {items.map((q) => (
          <li key={q.number}>
            {q.number}. {q.question}
            {showAnswers && (
              <span className="mt-0.5 flex items-start gap-1.5 text-xs text-primary">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                {q.answer}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
