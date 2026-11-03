import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModelV3 } from "@ai-sdk/provider";

export const DEFAULT_LOVABLE_CHAT_MODEL = "google/gemini-3-flash-preview";
/** Model used on the direct Google Gemini fallback (own GEMINI_API_KEY). */
export const DEFAULT_GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";

/** Create a server-only OpenAI-compatible client for Lovable's AI Gateway. */
export function createLovableGatewayClient() {
  const key = process.env.LOVABLE_API_KEY?.trim();
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  return createOpenAI({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

function geminiFallbackModel(): LanguageModelV3 | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const modelId = process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_GEMINI_FALLBACK_MODEL;
  return createGoogleGenerativeAI({ apiKey: key })(modelId);
}

/**
 * Lovable AI Gateway first; if the call fails before streaming starts
 * (credits out 402, rate limit, outage), retry once on the user's own Gemini key.
 */
export function withGeminiFallback(primary: LanguageModelV3): LanguageModelV3 {
  const fallback = geminiFallbackModel();
  if (!fallback) return primary;
  const warn = (e: unknown) =>
    console.warn("[ai] Lovable gateway failed, using Gemini fallback:", e instanceof Error ? e.message : e);
  return {
    specificationVersion: "v3",
    provider: primary.provider,
    modelId: primary.modelId,
    supportedUrls: primary.supportedUrls,
    async doGenerate(options) {
      try { return await primary.doGenerate(options); }
      catch (e) { warn(e); return fallback.doGenerate(options); }
    },
    async doStream(options) {
      try { return await primary.doStream(options); }
      catch (e) { warn(e); return fallback.doStream(options); }
    },
  };
}

/** Chat model with automatic Gemini fallback. */
export function getChatModel(modelId: string): LanguageModelV3 {
  return withGeminiFallback(createLovableGatewayClient().chat(modelId) as LanguageModelV3);
}

export function getLovableChatModel(setting = "LOVABLE_CHAT_MODEL") {
  const modelId = process.env[setting]?.trim() || DEFAULT_LOVABLE_CHAT_MODEL;
  return getChatModel(modelId);
}
