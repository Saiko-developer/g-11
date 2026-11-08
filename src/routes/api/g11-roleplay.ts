import { createFileRoute } from "@tanstack/react-router";
import { handleGrade11Roleplay } from "@/lib/grade11Roleplay.server";

export const Route = createFileRoute("/api/g11-roleplay")({
  server: { handlers: { POST: ({ request }) => handleGrade11Roleplay(request) } },
});
