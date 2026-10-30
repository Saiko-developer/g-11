import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practice/$unit")({
  head: ({ params }) => {
    const title = `Unit ${params.unit} English Exercises — Sayar Owl Academy`;
    const description = `Grade 10 English exercises for Unit ${params.unit}.`;
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] };
  },
  component: () => <Outlet />,
});
