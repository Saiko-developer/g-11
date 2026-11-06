import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { GradeSwitcher } from "@/components/grade11/GradeSwitcher";
import { GRADE11_PART1 } from "@/data/grade11/part1";

export const Route = createFileRoute("/grade-11/")({
  head: () => ({
    meta: [
      { title: "Grade 11 English — Sayar Owl Academy" },
      { name: "description", content: "Grade 11 Myanmar new-syllabus English lessons: reading, vocabulary, grammar, speaking and writing with Sayar Owl." },
      { property: "og:title", content: "Grade 11 English — Sayar Owl Academy" },
      { property: "og:description", content: "Interactive Grade 11 English units with Myanmar explanations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Grade11Home,
});

function Grade11Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <GradeSwitcher current={11} />
        <h1 className="mt-4 text-3xl font-bold">Grade 11 English</h1>
        <p className="mt-1 text-muted-foreground">သင်ရိုးသစ် — Part 1 (Unit 1–4, Review 1, Poem 1)</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {GRADE11_PART1.map((u) => (
            <Link key={u.id} to="/grade-11/$unit" params={{ unit: u.id }}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary">{u.no}</span>
                <span className={`rounded-full px-2 py-0.5 ${u.ready ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {u.ready ? "✅ လေ့လာနိုင်ပါပြီ" : "🔜 မကြာမီ"}
                </span>
              </div>
              <div className="mt-2 font-semibold">{u.title}</div>
              <div className="text-sm text-muted-foreground">{u.mmTitle}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
