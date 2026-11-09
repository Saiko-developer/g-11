export type PopupVoiceStage = "transcription" | "speech";
export class Grade11PopupVoiceError extends Error {
  constructor(
    public stage: PopupVoiceStage,
    public kind: "http" | "network" | "timeout" | "configuration" | "invalid_response",
    public status?: number,
  ) {
    super(`Grade 11 ${stage}: ${kind}${status ? ` (${status})` : ""}`);
  }
}
/** One bounded retry only for explicit transient failures; never retry auth/credit/config errors. */
export async function grade11PopupVoiceRequest<T>(
  stage: PopupVoiceStage,
  input: RequestInfo | URL,
  init: RequestInit,
  decode: (response: Response) => Promise<T>,
  timeoutMs = 45000,
): Promise<T> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  init.signal?.addEventListener("abort", cancel, { once: true });
  if (init.signal?.aborted) controller.abort();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      (async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          if (controller.signal.aborted) throw new Grade11PopupVoiceError(stage, "timeout");
          let response: Response;
          try {
            response = await fetch(input, { ...init, signal: controller.signal });
          } catch {
            throw new Grade11PopupVoiceError(
              stage,
              controller.signal.aborted ? "timeout" : "network",
            );
          }
          if (response.ok) {
            try {
              return await decode(response);
            } catch (error) {
              if (error instanceof Grade11PopupVoiceError) throw error;
              throw new Grade11PopupVoiceError(
                stage,
                controller.signal.aborted ? "timeout" : "invalid_response",
              );
            }
          }
          const detail = await response.text().catch(() => "");
          if (detail.includes("invalid_transcription_response"))
            throw new Grade11PopupVoiceError(stage, "invalid_response", response.status);
          if (detail.includes("Missing LOVABLE_API_KEY"))
            throw new Grade11PopupVoiceError(stage, "configuration", response.status);
          const retryAfter = Number(response.headers?.get("Retry-After") ?? 0);
          if (attempt === 0 && [429, 502, 503, 504].includes(response.status) && retryAfter <= 3) {
            await new Promise<void>((resolve) => {
              if (controller.signal.aborted) {
                resolve();
                return;
              }
              const abort = () => {
                clearTimeout(delay);
                resolve();
              };
              const delay = setTimeout(
                () => {
                  controller.signal.removeEventListener("abort", abort);
                  resolve();
                },
                Math.max(700, retryAfter * 1000),
              );
              controller.signal.addEventListener("abort", abort, { once: true });
            });
            continue;
          }
          throw new Grade11PopupVoiceError(stage, "http", response.status);
        }
        throw new Grade11PopupVoiceError(stage, "network");
      })(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Grade11PopupVoiceError(stage, "timeout"));
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
    init.signal?.removeEventListener("abort", cancel);
  }
}
export function grade11PopupVoiceMessage(error: unknown, stage: PopupVoiceStage): string {
  const failure =
    error instanceof Grade11PopupVoiceError ? error : new Grade11PopupVoiceError(stage, "network");
  const service =
    stage === "transcription" ? "အသံကို စာသားပြောင်းသည့်စနစ်" : "အဖြေကို အသံထုတ်သည့်စနစ်";
  if (failure.status === 401 || failure.status === 403)
    return "အသံဝန်ဆောင်မှုအတွက် Login session ကို စစ်ဆေးမရပါ။ အကောင့်ပြန်ဝင်ပြီး စမ်းပါ။";
  if (failure.kind === "configuration" || failure.status === 402)
    return `${service} ကို ယာယီအသုံးမပြုနိုင်ပါ။ ဆရာထံ အကြောင်းကြားပါ။${failure.status ? ` (${failure.status})` : ""}`;
  if (failure.status === 429)
    return `${service} မှ တောင်းဆိုမှုများနေကြောင်း ပြန်လာပါသည်။ ခဏစောင့်ပြီး ပြန်စမ်းပါ။ (429)`;
  if (failure.kind === "timeout")
    return `${service} မှ အချိန်မီ တုံ့ပြန်မှုမရပါ။ ပြန်စမ်းနိုင်ပါတယ်။`;
  if (failure.kind === "invalid_response")
    return `${service} မှ အသုံးပြုနိုင်သည့်အဖြေ မရပါ။ ပြန်စမ်းနိုင်ပါတယ်။`;
  return `${service} ကို ချိတ်ဆက်မရပါ။ ပြန်စမ်းနိုင်ပါတယ်။${failure.status ? ` (${failure.status})` : ""}`;
}
