import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { StudentProgress } from "@/components/StudentProgress";
import { useAuth } from "@/components/AuthGate";
import { TeacherRequestCard } from "@/components/TeacherRequest";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress | Sayar Owl Academy" },
      { name: "description", content: "See all your practice results and mock exam scores in one place." },
      { property: "og:title", content: "My Progress — Sayar Owl Academy" },
      { property: "og:description", content: "Your Grade 10 English practice and mock exam history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { session } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold">My Progress</h1>
        <p className="mb-4 text-sm text-muted-foreground">{session?.user.email}</p>
        <Link to="/classrooms" className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
          🏫 Classrooms — အတန်းဖွင့်ရန် / Class Code ဖြင့် ဝင်ရန်
        </Link>
        {session && <TeacherRequestCard userId={session.user.id} />}
        {session ? <StudentProgress userId={session.user.id} /> : <p>Sign in first.</p>}
      </main>
    </div>
  );
}
