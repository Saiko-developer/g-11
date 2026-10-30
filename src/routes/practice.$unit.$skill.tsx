import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PracticeWorkspace } from "@/components/PracticeWorkspace";
import { SiteHeader } from "@/components/SiteHeader";
import { normalizeSkill } from "@/lib/practice";

export const Route = createFileRoute("/practice/$unit/$skill")({
  head: ({ params }) => {
    const label = params.skill.charAt(0).toUpperCase() + params.skill.slice(1);
    const title = `${label} Practice — Unit ${params.unit} | Sayar Owl Academy`;
    const description = `Interactive ${label.toLowerCase()} practice for Unit ${params.unit} of the Grade 10 Myanmar English textbook, with Saya Owl guiding you question by question.`;
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
  component: PracticePage,
});

function PracticePage() {
  const { unit, skill: rawSkill } = Route.useParams();
  const navigate = useNavigate();
  const skill = normalizeSkill(rawSkill);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {skill ? (
          <PracticeWorkspace
            unit={unit}
            skill={skill}
            onBack={() => void navigate({ to: "/" })}
            backLabel="Back to lessons"
          />
        ) : (
          <p className="text-sm text-muted-foreground">Unknown skill.</p>
        )}
      </main>
    </div>
  );
}
