import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { GradeSwitcher } from "@/components/grade11/GradeSwitcher";
import { Grade11CurriculumExplorer } from "@/components/grade11/Grade11CurriculumExplorer";

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
        <p className="mt-1 text-muted-foreground">Syllabus Curriculum Explorer — သင်ရိုးသစ် Unit 1–12</p>
        <div className="mt-6">
          <Grade11CurriculumExplorer />
        </div>
      </main>
    </div>
  );
}
