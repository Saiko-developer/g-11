import { createFileRoute } from "@tanstack/react-router";
import { handleGrade11Check } from "@/lib/grade11Check.server";

export const Route = createFileRoute("/api/g11-check")({
  server: { handlers: { POST: ({ request }) => handleGrade11Check(request) } },
});
