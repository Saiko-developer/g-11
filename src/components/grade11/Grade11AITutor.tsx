import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageResponse } from "@/components/ai-elements/message";
import { Grade11RequireSignIn as RequireSignIn } from "./Grade11RequireSignIn";
import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import { useWhisperRecognition } from "@/hooks/use-whisper";
import { useSpeechSynthesis } from "@/hooks/use-voice";
import { compressImageToDataUrl } from "@/lib/compress-image";
import { grade11LessonContext } from "@/lib/grade11LessonContext";
import type { G11SkillKind } from "@/data/grade11/syllabus";
import { GrammarExerciseGenerator } from "@/components/lesson/GrammarExerciseGenerator";
import { Grade11AIReview } from "./Grade11AIReview";

export function Grade11AITutor({ unit, kind }: { unit: number; kind: G11SkillKind }) {
  return (
    <section
      aria-label="Grade 11 AI learning tools"
      className="mt-6 min-w-0 rounded-2xl border border-primary/30 bg-card p-4 sm:p-5"
    >
      <h2 className="font-semibold">ဆရာဇီးကွက်နှင့် လေ့လာမည် · Unit {unit}</h2>
      <RequireSignIn>
        <Tutor key={`${unit}:${kind}`} unit={unit} kind={kind} />
      </RequireSignIn>
    </section>
  );
}
function Tutor({ unit, kind }: { unit: number; kind: G11SkillKind }) {
  const { context, questions } = useMemo(() => grade11LessonContext(unit, kind), [unit, kind]);
  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat-home", fetch: tutorFetch }),
  );
  const { messages, sendMessage, status, stop, error, clearError } = useChat({ transport });
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; name: string } | null>(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [questionId, setQuestionId] = useState(questions[0]?.id ?? "");
  const [answer, setAnswer] = useState("");
  const busy = status === "submitted" || status === "streaming";
  const tts = useSpeechSynthesis();
  const recognition = useWhisperRecognition({
    flushOnStop: true,
    context: `Grade 11 Unit ${unit} ${kind}`,
    onFinal: (text) => setDraft((old) => `${old} ${text}`.trim()),
  });
  const stopRef = useRef(stop);
  stopRef.current = stop;
  useEffect(
    () => () => {
      void stopRef.current();
    },
    [],
  );
  const send = () => {
    if (busy || uploading || recognition.listening || (!draft.trim() && !attachment)) return;
    clearError();
    recognition.stop();
    tts.stop();
    void sendMessage(
      {
        text: draft.trim() || "Please explain this textbook question.",
        ...(attachment
          ? {
              files: [
                {
                  type: "file" as const,
                  mediaType: "image/jpeg",
                  filename: attachment.name,
                  url: attachment.url,
                },
              ],
            }
          : {}),
      },
      {
        body: {
          grade: 11,
          unit,
          skill: kind,
          mode: "text",
          lessonContext: context,
          sectionContent: document
            .querySelector("[data-saya-home-section]")
            ?.textContent?.slice(0, 16000),
        },
      },
    );
    setDraft("");
    setAttachment(null);
  };
  const selected = questions.find((q) => q.id === questionId);
  return (
    <div className="mt-4 min-w-0 space-y-4">
      <TutorQuotaBar compact />
      <div
        role="log"
        aria-label="Grade 11 tutor conversation"
        aria-live="polite"
        className="max-h-[28rem] space-y-3 overflow-y-auto [overflow-wrap:anywhere]"
      >
        {messages.map((message) => {
          const text = message.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("");
          return (
            <div
              key={message.id}
              className={`rounded-xl p-3 text-sm ${message.role === "user" ? "bg-secondary" : "bg-primary/5"}`}
            >
              <p className="mb-2 text-xs font-semibold">
                {message.role === "user" ? "သင်" : "ဆရာဇီးကွက်"}
              </p>
              {message.parts
                .filter((part) => part.type === "file" && part.mediaType.startsWith("image/"))
                .map((part, index) =>
                  part.type === "file" ? (
                    <img
                      key={index}
                      src={part.url}
                      alt="မေးခွန်းဓာတ်ပုံ"
                      className="mb-2 max-h-60 max-w-full rounded-lg object-contain"
                    />
                  ) : null,
                )}
              <MessageResponse>{text}</MessageResponse>
              {message.role === "assistant" && text && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => (tts.speaking ? tts.stop() : tts.speak(text))}
                >
                  {tts.speaking ? "အသံရပ်မည်" : "အသံဖြင့် နားထောင်မည်"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p role="alert" lang="my" className="text-sm text-destructive">
          {error.message || "AI ချိတ်ဆက်မှု မအောင်မြင်ပါ။ ပြန်စမ်းနိုင်ပါတယ်။"}
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="space-y-3"
      >
        <label htmlFor={`g11-tutor-${unit}-${kind}`} className="text-sm font-medium">
          ဒီသင်ခန်းစာအကြောင်း မေးပါ
        </label>
        <Textarea
          id={`g11-tutor-${unit}-${kind}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={12000}
          rows={3}
          placeholder="မေးခွန်းနံပါတ်၊ နားမလည်တဲ့နေရာ သို့မဟုတ် ကိုယ့်အဖြေကို ရေးပါ…"
        />
        {attachment && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="min-w-0 break-all">{attachment.name}</span>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAttachment(null)}>
              ဓာတ်ပုံဖယ်မည်
            </Button>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={busy || uploading || recognition.listening || (!draft.trim() && !attachment)}
          >
            မေးမည်
          </Button>
          {busy && (
            <Button type="button" variant="outline" onClick={() => void stop()}>
              ရပ်မည်
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={!recognition.supported || busy}
            onClick={() => (recognition.listening ? recognition.stop() : recognition.start())}
          >
            {recognition.listening ? "အသံဖမ်းရပ်မည်" : "အသံဖြင့် မေးမည်"}
          </Button>
          <label className="cursor-pointer rounded-md border border-border p-2 text-sm">
            {uploading ? "ဓာတ်ပုံပြင်ဆင်နေသည်…" : "မေးခွန်းဓာတ်ပုံ ထည့်မည်"}
            <input
              aria-label="Attach textbook question photo"
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy || uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setFileError("");
                try {
                  setAttachment({ url: await compressImageToDataUrl(file), name: file.name });
                } catch {
                  setFileError("ဓာတ်ပုံ ဖတ်မရပါ။ အခြားဓာတ်ပုံဖြင့် ပြန်စမ်းပါ။");
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
        </div>
        {fileError && (
          <p role="alert" className="text-sm text-destructive">
            {fileError}
          </p>
        )}
      </form>
      {selected && kind !== "speaking" && (
        <details className="rounded-xl border border-border p-3">
          <summary className="cursor-pointer text-sm font-medium">AI ဖြင့် အဖြေစစ်မည်</summary>
          <label className="mt-3 block text-sm">
            စာအုပ်ပါ မေးခွန်းရွေးပါ
            <select
              aria-label="Textbook question for AI review"
              className="mt-2 w-full rounded-md border border-border bg-background p-2"
              value={questionId}
              onChange={(e) => {
                setQuestionId(e.target.value);
                setAnswer("");
              }}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id} · {q.question.slice(0, 110)}
                </option>
              ))}
            </select>
          </label>
          <p lang="en" className="my-3 whitespace-pre-line text-sm">
            {selected.instructions}
            <br />
            {selected.question}
          </p>
          <Textarea
            aria-label="Your answer for AI review"
            value={answer}
            maxLength={12000}
            rows={kind === "writing" ? 8 : 3}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <Grade11AIReview
            question={selected.question}
            instructions={selected.instructions}
            context={context}
            answer={answer}
            writing={kind === "writing"}
          />
          {kind === "grammar" && (
            <GrammarExerciseGenerator
              title={`Grade 11 ${unit}C ${selected.instructions.slice(0, 60)}`}
              instructions={selected.instructions}
              samples={questions
                .filter((q) => q.instructions === selected.instructions)
                .map((q) => ({ text: q.question }))}
            />
          )}
        </details>
      )}
    </div>
  );
}
