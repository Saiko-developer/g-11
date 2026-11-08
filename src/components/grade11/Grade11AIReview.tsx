import { grade11ApiFetch } from "@/lib/grade11ApiFetch";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthGate";
import { signInToGrade11 } from "@/lib/grade11SignIn";

/** Reuses the existing authenticated Grade 11 checking route; no provider/billing changes. */
export function Grade11AIReview({
  question,
  instructions,
  context,
  answer,
  writing = false,
  checkLabel = "Check Answer with AI",
}: {
  question: string;
  instructions: string;
  context: string;
  answer: string;
  writing?: boolean;
  checkLabel?: string;
}) {
  const { session, ready = true } = useAuth();
  const [busy, setBusy] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState("");
  const [result, setResult] = useState<{ answer: string; text: string; error?: boolean } | null>(
    null,
  );
  const requestRef = useRef<AbortController | null>(null);
  const version = useRef(0);
  useEffect(
    () => () => {
      version.current++;
      requestRef.current?.abort();
    },
    [answer, question],
  );
  const check = async () => {
    if (!session) {
      const login = await signInToGrade11();
      if (login.error) setResult({ answer, text: login.error.message, error: true });
      return;
    }
    if (answer.length > 12000) {
      setResult({ answer, text: "စာသားကို အက္ခရာ ၁၂၀၀၀ အောက် လျှော့ပါ။", error: true });
      return;
    }
    const id = ++version.current;
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;
    setBusy(true);
    setCheckingAnswer(answer);
    setResult(null);
    try {
      const response = await grade11ApiFetch("/api/g11-check", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "check",
          taskType: writing ? "writing" : "exercise",
          question,
          instructions,
          context,
          studentAnswer: answer,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          response.status === 401
            ? "AI စစ်ဆေးရန် Login ပြန်ဝင်ပါ။"
            : response.status === 402
              ? "AI credit မလုံလောက်ပါ။"
              : response.status === 429
                ? "ခဏစောင့်ပြီး ပြန်စမ်းပါ။"
                : "AI စစ်ဆေးမှု မအောင်မြင်ပါ။ ထပ်စမ်းနိုင်ပါတယ်။",
        );
      if (id !== version.current) return;
      setResult({
        answer,
        text:
          typeof data.feedback === "string" && data.feedback.trim()
            ? data.feedback
            : "အကြံပြုချက် မရပါ။ ထပ်စမ်းနိုင်ပါတယ်။",
      });
    } catch (error) {
      if (id === version.current && !controller.signal.aborted)
        setResult({
          answer,
          text: error instanceof Error ? error.message : "စစ်ဆေးမရပါ။",
          error: true,
        });
    } finally {
      if (id === version.current) setBusy(false);
    }
  };
  return (
    <div className="mt-4 space-y-3 border-t border-border pt-3">
      <Button
        type="button"
        variant="outline"
        disabled={
          !ready ||
          (busy && checkingAnswer === answer && !requestRef.current?.signal.aborted) ||
          !answer.trim()
        }
        onClick={() => void check()}
      >
        {!ready
          ? "အကောင့် စစ်ဆေးနေသည်…"
          : busy && checkingAnswer === answer && !requestRef.current?.signal.aborted
            ? "စစ်ဆေးနေသည်…"
            : session || checkLabel === "Check Answer"
              ? checkLabel
              : "Login to check with AI"}
      </Button>
      {result?.answer === answer && (
        <div
          role={result.error ? "alert" : "status"}
          className="rounded-xl bg-primary/5 p-3 text-sm leading-relaxed whitespace-pre-line"
          lang="my"
        >
          {result.text}
        </div>
      )}
    </div>
  );
}
