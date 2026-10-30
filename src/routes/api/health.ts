import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({ server: { handlers: { GET: async () => {
  try {
    const supabaseAdmin: any = (await import("@/integrations/supabase/client.server")).supabaseAdmin;
    const { error } = await supabaseAdmin.from("exam_uploads").select("id", { head: true, count: "exact" }).limit(1);
    if (error) throw error;
    return Response.json({ status: "ok" });
  } catch { return Response.json({ status: "unavailable" }, { status: 503 }); }
} } } });
