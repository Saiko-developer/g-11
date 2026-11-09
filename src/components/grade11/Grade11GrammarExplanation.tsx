import { useEffect, useRef, useState } from "react";
import { BookOpen, Loader2, Mic, Pause, Play } from "lucide-react";
import type { GrammarOralSegment } from "@/data/grammar/types";
import { GRADE11_ORAL_GRAMMAR } from "@/lib/grade11GrammarOral";
import { sanitizeForSpeech } from "@/lib/sanitizeSpeech";
import { Button } from "@/components/ui/button";
import { Grade11RequireSignIn } from "./Grade11RequireSignIn";

function FocusSentence({ text, focus = [] }: { text: string; focus?: string[] }) {
  if (!focus.length) return <>{text}</>;
  const escaped = [...focus]
    .sort((a, b) => b.length - a.length)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return (
    <>
      {text.split(new RegExp(`(${escaped.join("|")})`, "g")).map((part, index) =>
        focus.includes(part) ? (
          <mark key={index} className="rounded bg-primary/15 px-0.5 font-semibold text-primary">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Grade 11 only. Neither Grade 10 nor the approved Unit 1 player is modified. */
export function Grade11GrammarExplanation({ unit }: { unit: number }) {
  const grammar = GRADE11_ORAL_GRAMMAR[unit];
  const [open, setOpen] = useState<{ id: string; mode: "text" | "oral" } | null>(null);
  if (!grammar) return null;
  return (
    <div className="space-y-5" aria-label={`Grade 11 Unit ${unit} grammar explanations`}>
      {grammar.sections.map((section) => (
        <section
          key={section.id}
          className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <h3 className="text-lg font-bold">{section.titleEn}</h3>
          <p lang="my" className="mt-1 text-sm text-muted-foreground">
            {section.titleMy}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["text", "oral"] as const).map((mode) => (
              <Button
                key={mode}
                type="button"
                size="sm"
                variant={open?.id === section.id && open.mode === mode ? "default" : "outline"}
                aria-pressed={open?.id === section.id && open.mode === mode}
                onClick={() =>
                  setOpen(
                    open?.id === section.id && open.mode === mode ? null : { id: section.id, mode },
                  )
                }
              >
                {mode === "text" ? (
                  <BookOpen className="mr-1.5 h-4 w-4" />
                ) : (
                  <Mic className="mr-1.5 h-4 w-4" />
                )}
                {mode === "text" ? "Text Explanation" : "Oral Explanation"}
              </Button>
            ))}
          </div>
          {open?.id === section.id && open.mode === "text" && (
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p className="text-xs font-semibold text-primary">⚡ အနှစ်ချုပ် (Quick Card)</p>
              {[...section.text.whatMy, ...section.text.whyMy].map((text, index) => (
                <p key={index} lang="my">
                  {text}
                </p>
              ))}
              <p className="break-words rounded-lg bg-primary/5 p-3 font-semibold text-primary">
                {section.text.formulas[0]?.formula}
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                {section.text.goldenRulesMy.map((rule, index) => (
                  <li key={index} lang="my">
                    {rule}
                  </li>
                ))}
              </ol>
              {section.text.formulas.map((example, index) => (
                <div key={index} className="rounded-xl border border-border p-3">
                  <p lang="en" className="font-medium">
                    {example.exampleEn}
                  </p>
                  <p lang="my" className="mt-1 text-muted-foreground">
                    {example.exampleMy}
                  </p>
                </div>
              ))}
              {section.text.transformation.beforeEn.length > 0 &&
                section.text.transformation.afterEn !==
                  section.text.transformation.beforeEn.join(" ") && (
                  <details className="rounded-xl border border-border p-3">
                    <summary className="cursor-pointer font-medium">
                      ဝါကျပြောင်းနည်း ထပ်ကြည့်မယ်
                    </summary>
                    {section.text.transformation.beforeEn.map((text, index) => (
                      <p key={index} lang="en" className="mt-2">
                        {text}
                      </p>
                    ))}
                    <p lang="en" className="mt-2 font-semibold text-primary">
                      {section.text.transformation.afterEn}
                    </p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5">
                      {section.text.transformation.stepsMy.map((text, index) => (
                        <li key={index}>{text}</li>
                      ))}
                    </ol>
                  </details>
                )}
            </div>
          )}
          {open?.id === section.id && open.mode === "oral" && (
            <Grade11RequireSignIn>
              <Grade11OralPlayer
                key={section.id}
                segments={section.oral.segments!}
                formula={section.oral.note.formula}
              />
            </Grade11RequireSignIn>
          )}
        </section>
      ))}
    </div>
  );
}

function chunks(text: string): string[] {
  const sentences = sanitizeForSpeech(text).match(/[^။.!?]+[။.!?]*|[။.!?]+/g) ?? [];
  const output: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current.length + sentence.length > 900 && current) {
      output.push(current.trim());
      current = "";
    }
    if (sentence.length > 900) {
      for (let offset = 0; offset < sentence.length; offset += 900)
        output.push(sentence.slice(offset, offset + 900).trim());
    } else current += sentence;
  }
  if (current.trim()) output.push(current.trim());
  return output.filter(Boolean);
}

async function fetchClip(text: string, signal: AbortSignal): Promise<Blob> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener("abort", cancel, { once: true });
  if (signal.aborted) controller.abort();
  let expired = false;
  const timer = setTimeout(() => {
    expired = true;
    controller.abort();
  }, 30000);
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ text, voice: "sarah", speed: 1.0 }),
    });
    if (!response.ok) throw new Error(`TTS ${response.status}`);
    return await response.blob();
  } catch (error) {
    if (expired) throw new Error("Voice request timed out");
    throw error;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", cancel);
  }
}

type ClipResult = { blob: Blob; error?: never } | { error: unknown; blob?: never };
const prepare = (text: string, signal: AbortSignal): Promise<ClipResult> =>
  fetchClip(text, signal).then(
    (blob) => ({ blob }),
    (error: unknown) => ({ error }),
  );

/** Notes advance on playback, never on request completion or a duration estimate. */
export function Grade11OralPlayer({
  segments,
  formula,
}: {
  segments: GrammarOralSegment[];
  formula: string;
}) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "playing" | "paused" | "idle" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const finishClip = useRef<(() => void) | null>(null);
  const stop = () => {
    generation.current++;
    request.current?.abort();
    audio.current?.pause();
    finishClip.current?.();
    finishClip.current = null;
    audio.current = null;
  };
  const start = async (from = 0) => {
    stop();
    const run = generation.current;
    const controller = new AbortController();
    request.current = controller;
    setError("");
    setStatus("loading");
    const queue = segments.flatMap((segment, cue) =>
      cue < from ? [] : chunks(segment.scriptMy).map((text) => ({ text, cue })),
    );
    try {
      let pending = queue.length ? prepare(queue[0].text, controller.signal) : null;
      for (let i = 0; i < queue.length; i++) {
        setStatus("loading");
        const result = await pending!;
        if (run !== generation.current) return;
        if (result.error !== undefined) throw result.error;
        pending = i + 1 < queue.length ? prepare(queue[i + 1].text, controller.signal) : null;
        await new Promise<void>((resolve, reject) => {
          const url = URL.createObjectURL(result.blob!);
          const player = new Audio(url);
          audio.current = player;
          let settled = false;
          const done = (failure?: Error) => {
            if (settled) return;
            settled = true;
            player.onended = null;
            player.onerror = null;
            URL.revokeObjectURL(url);
            if (audio.current === player) audio.current = null;
            finishClip.current = null;
            if (failure) reject(failure);
            else resolve();
          };
          finishClip.current = () => done();
          player.onended = () => done();
          player.onerror = () => done(new Error("Audio playback failed"));
          player.play().then(
            () => {
              if (run === generation.current) {
                setIndex(queue[i].cue);
                setStatus("playing");
              }
            },
            () => done(new Error("Audio playback failed")),
          );
        });
        if (run !== generation.current) return;
      }
      setStatus("idle");
    } catch (failure) {
      if (run !== generation.current) return;
      controller.abort();
      setError(
        failure instanceof Error && failure.message.includes("401")
          ? "အသံနားထောင်ရန် Login ပြန်ဝင်ပေးပါ။"
          : "အသံကို မဖွင့်နိုင်သေးပါ။ ပြန်စမ်းခလုတ်ဖြင့် ဒီအပိုင်းမှ ပြန်နားထောင်နိုင်ပါတယ်။",
      );
      setStatus("error");
    }
  };
  useEffect(() => {
    void start();
    return stop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = async () => {
    if (status === "playing" && audio.current) {
      audio.current.pause();
      setStatus("paused");
    } else if (status === "paused" && audio.current) {
      try {
        await audio.current.play();
        setStatus("playing");
      } catch {
        stop();
        setError("အသံပြန်ဖွင့်မရပါ။ ပြန်စမ်းနိုင်ပါတယ်။");
        setStatus("error");
      }
    } else await start(status === "error" ? index : 0);
  };
  const current = segments[index];
  if (!current) return null;
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-primary">🦉 အသံနဲ့အတူ လိုက်ကြည့်ရန်</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={status === "loading"}
          onClick={() => void toggle()}
          aria-label={status === "playing" ? "Pause explanation" : "Play explanation"}
        >
          {status === "loading" ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : status === "playing" ? (
            <Pause className="mr-1 h-4 w-4" />
          ) : (
            <Play className="mr-1 h-4 w-4" />
          )}
          {status === "loading"
            ? "အသံပြင်ဆင်နေသည်…"
            : status === "playing"
              ? "ခေတ္တရပ်"
              : status === "paused"
                ? "ဆက်နားထောင်"
                : status === "error"
                  ? "ပြန်စမ်း"
                  : "အစမှ ပြန်နားထောင်"}
        </Button>
      </div>
      <section
        aria-label="Current oral explanation note"
        aria-live="polite"
        aria-atomic="true"
        className="sticky top-4 z-10 space-y-3 rounded-xl border border-primary/30 bg-card p-4 shadow-sm"
      >
        <div className="flex justify-between gap-2 text-xs text-muted-foreground">
          <span>လက်ရှိရှင်းပြနေသည့်အပိုင်း</span>
          <span>
            {index + 1} / {segments.length}
          </span>
        </div>
        <h4 className="font-semibold text-primary">{current.titleMy}</h4>
        {current.sentenceEn && (
          <div className="space-y-2 rounded-lg bg-muted/40 p-3">
            <p lang="en" className="text-base font-medium leading-relaxed">
              <FocusSentence text={current.sentenceEn} focus={current.focus} />
            </p>
            <p lang="my" className="text-sm leading-relaxed text-muted-foreground">
              {current.sentenceMy}
            </p>
          </div>
        )}
        <p lang="my" className="text-sm leading-relaxed">
          💡 {current.noteMy}
        </p>
      </section>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <details className="rounded-xl border border-border p-3 text-sm">
        <summary className="cursor-pointer font-medium">မှတ်စုအပြည့်ကို ဖွင့်ကြည့်မယ်</summary>
        <p className="mt-3 break-words rounded-lg bg-primary/5 p-3 font-semibold text-primary">
          {formula}
        </p>
        <ol className="mt-3 space-y-3">
          {segments.map((segment, cue) => (
            <li key={cue} className="rounded-lg border border-border p-3">
              <p className="font-semibold">
                {cue + 1}. {segment.titleMy}
              </p>
              {segment.sentenceEn && (
                <>
                  <p lang="en" className="mt-1">
                    <FocusSentence text={segment.sentenceEn} focus={segment.focus} />
                  </p>
                  <p lang="my" className="mt-1 text-muted-foreground">
                    {segment.sentenceMy}
                  </p>
                </>
              )}
              <p lang="my" className="mt-2">
                {segment.noteMy}
              </p>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
