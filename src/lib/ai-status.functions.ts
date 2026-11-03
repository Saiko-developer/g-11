import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Check = { ok: boolean; message: string; ms: number };

async function timed(fn: () => Promise<string>): Promise<Check> {
  const t = Date.now();
  try {
    const message = await fn();
    return { ok: true, message, ms: Date.now() - t };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message.slice(0, 200) : String(e), ms: Date.now() - t };
  }
}

/** Admin-only: ping Lovable AI and the Gemini backup key separately. */
export const checkAiStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { generateText } = await import("ai");
    const { createLovableGatewayClient, DEFAULT_LOVABLE_CHAT_MODEL, DEFAULT_GEMINI_FALLBACK_MODEL } = await import("./ai-gateway.server");
    const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
    const prompt = "Reply with just: OK";

    const lovable = await timed(async () => {
      const r = await generateText({ model: createLovableGatewayClient().chat(DEFAULT_LOVABLE_CHAT_MODEL), prompt });
      return r.text.trim();
    });
    const gemini = await timed(async () => {
      const key = process.env.GEMINI_API_KEY?.trim();
      if (!key) throw new Error("GEMINI_API_KEY not set");
      const model = process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_GEMINI_FALLBACK_MODEL;
      const r = await generateText({ model: createGoogleGenerativeAI({ apiKey: key })(model), prompt });
      return r.text.trim();
    });
    return { lovable, gemini, checkedAt: new Date().toISOString() };
  });
