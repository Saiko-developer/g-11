import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, FileUp, GraduationCap, Loader2, Type } from "lucide-react";

import { QuizRunner, type QuizQuestion } from "@/components/QuizRunner";
import { SayaOwl } from "@/components/SayaOwl";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  completedUnitIds,
  fetchGrammarLessons,
  fetchProgress,
  fetchUnits,
  saveProgress,
  type GrammarLesson,
} from "@/lib/units";

export const Route = createFileRoute("/practice/$unit/")({
  head: ({ params }) => {
    const title = `Unit ${params.unit} Practice — Sayar Owl Academy`;
    const description = `AI-guided Grade 10 English practice for Unit ${params.unit}: grammar and vocabulary exercises written by Saya Owl, with Burmese explanations for every answer.`;
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
  component: UnitPractice,
});

async function generateExercises(input: {
  topic: string;
  unitTitle: string;
  ruleMy: string | null;
}): Promise<QuizQuestion[]> {
  const res = await fetch("/api/exercises", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...input, count: 8 }),
  });
  const data = (await res.json()) as { questions?: QuizQuestion[]; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Could not generate exercises");
  return data.questions ?? [];
}

function UnitPractice() {
  const { unit } = Route.useParams();
  const navigate = useNavigate();
  const unitId = `unit-${unit}`;

  const { data: units } = useQuery({ queryKey: ["units"], queryFn: fetchUnits, staleTime: 300_000 });
  const record = units?.find((u) => u.id === unitId);

  const { data: lessons } = useQuery({
    queryKey: ["grammar-lessons", unitId],
    queryFn: () => fetchGrammarLessons(unitId),
    staleTime: 300_000,
  });

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

  const [active, setActive] = useState<GrammarLesson | null>(null);
  const [focus, setFocus] = useState<string | null>(null);

  const quiz = useMutation({
    mutationFn: (lesson: GrammarLesson) =>
      generateExercises({
        topic: lesson.topic,
        unitTitle: record?.title ?? `Unit ${unit}`,
        ruleMy: lesson.ruleMy,
      }),
  });

  const start = (lesson: GrammarLesson) => {
    setActive(lesson);
    setFocus(lesson.topic);
    quiz.mutate(lesson);
  };

  const done = completedUnitIds(progress ?? []).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to units
        </button>

        <header className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Unit {unit} practice
          </p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {record?.title ?? "Loading…"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a grammar or vocabulary focus. Saya Owl writes a fresh exercise set every time and
            explains each answer in Burmese.
          </p>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-2">
            {(lessons ?? []).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => start(l)}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition hover:border-primary ${
                  active?.id === l.id ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Type className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{l.title}</span>
                  {l.ruleMy && (
                    <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                      {l.ruleMy}
                    </span>
                  )}
                </span>
              </button>
            ))}

            <div className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              Units practised: {done}. Finish 3 units to unlock a Saya Owl monthly exam.
            </div>

            <ExamUploader />
          </aside>

          <section className="space-y-4">
            {!active && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Choose a topic on the left to start practising.
              </div>
            )}
            {active && (
              <QuizRunner
                title={active.title}
                questions={quiz.data ?? []}
                loading={quiz.isPending}
                error={quiz.error ? (quiz.error as Error).message : null}
                onRegenerate={() => quiz.mutate(active)}
                onFocusQuestion={setFocus}
                onFinish={async (score, total) => {
                  await saveProgress({
                    unitId,
                    grammarLessonId: null,
                    score,
                    total,
                  });
                  void refetchProgress();
                }}
              />
            )}
            {active?.examples && active.examples.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Examples
                </h2>
                <ul className="space-y-1.5 text-sm">
                  {active.examples.map((e, i) => (
                    <li key={i} className="rounded-lg bg-secondary/50 p-2.5">
                      {e.en}
                      {e.my && <span className="block text-muted-foreground">{e.my}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>

      <SayaOwl
        lessonContext={`Unit ${unit} — ${record?.title ?? ""}${active ? ` · ${active.title}` : ""}`}
        currentQuestion={focus}
      />
    </div>
  );
}

/** Phase 3 — students photograph or upload an outside-school exam paper. */
function ExamUploader() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.set("file", file, file.name);
      const res = await fetch("/api/exams", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setStatus("Uploaded ✅ Saya Owl will turn it into practice questions.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <GraduationCap className="h-4 w-4 text-primary" /> Outside-school exam
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Upload a photo or PDF of your school exam paper.
      </p>
      <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/50 p-3 text-xs font-medium text-primary">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileUp className="h-3.5 w-3.5" />}
        {busy ? "Uploading…" : "Choose file"}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </label>
      {status && <p className="mt-2 text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
