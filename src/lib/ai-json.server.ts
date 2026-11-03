import { withTone } from "@/lib/tone-rules";
import { streamText } from "ai";
import { getChatModel, DEFAULT_LOVABLE_CHAT_MODEL } from "@/lib/ai-gateway.server";

/**
 * Uses the Lovable AI Gateway and returns parsed JSON.
 * Streaming is required on this endpoint — we consume it server-side.
 */
export async function generateJson<T>(opts: { system: string; prompt: string }): Promise<T> {
  const modelId =
    process.env.LOVABLE_JSON_MODEL?.trim() ||
    process.env.LOVABLE_CHAT_MODEL?.trim() ||
    DEFAULT_LOVABLE_CHAT_MODEL;

  const result = streamText({
    model: getChatModel(modelId),
    system: withTone`${opts.system}\n\nReply with raw JSON only. No markdown fences, no commentary.`,
    prompt: opts.prompt,
  });

  let text = "";
  const streamErrors: string[] = [];
  for await (const part of result.fullStream) {
    if (part.type === "text-delta") text += part.text;
    else if (part.type === "error")
      streamErrors.push(part.error instanceof Error ? part.error.message : String(part.error));
  }
  if (!text.trim()) {
    throw new Error(
      streamErrors.length
        ? `AI stream failed: ${streamErrors.join("; ")}`
        : "Model returned no output",
    );
  }
  return parseJson<T>(text);
}

export function parseJson<T>(text: string): T {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.search(/[[{]/);
    const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("Model did not return valid JSON");
  }
}
