import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Grade11UnitPage } from "@/components/grade11/Grade11UnitPage";
import { getGrade11Lesson } from "@/lib/grade11Navigation";

export const Route = createFileRoute("/grade-11/$unit_/$skill")({
  loader: ({ params }) => {
    const lesson = getGrade11Lesson(params.unit, params.skill);
    if (!lesson) throw notFound();
    return lesson;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Grade 11 Unit ${loaderData.unit} · ${loaderData.skill} · ${loaderData.title} — Sayar Owl`
          : "Grade 11 — Sayar Owl",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      Lesson not found.{" "}
      <Link to="/grade-11" className="text-primary underline">
        Back to Grade 11
      </Link>
    </div>
  ),
  component: SkillPage,
});

function SkillPage() {
  const lesson = Route.useLoaderData();
  return (
    <Grade11UnitPage
      unitNumber={lesson.unit}
      title={lesson.title}
      mmTitle={lesson.mmTitle}
      skill={lesson.skill}
    />
  );
}
