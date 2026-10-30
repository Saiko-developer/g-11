import { createOpenAI } from "@ai-sdk/openai";

export const DEFAULT_LOVABLE_CHAT_MODEL = "google/gemini-3-flash-preview";

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

export function getLovableChatModel(setting = "LOVABLE_CHAT_MODEL") {
  const modelId = process.env[setting]?.trim() || DEFAULT_LOVABLE_CHAT_MODEL;
  return createLovableGatewayClient().chat(modelId);
}
