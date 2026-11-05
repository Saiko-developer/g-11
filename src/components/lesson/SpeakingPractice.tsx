import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Mic, Phone, PhoneOff, Play, Square } from "lucide-react";
import { toast } from "sonner";
import type { ListeningScript } from "@/data/listeningScripts";
import { useSpeechSynthesis } from "@/hooks/use-voice";
import { useWhisperRecognition } from "@/hooks/use-whisper";
import { scoreShadowing, type WordMark } from "@/lib/shadowing-score";
import { getSyllabusUnit } from "@/lib/localData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ShadowingTrack } from "@/components/lesson/ShadowingTrack";
import { signInWithGoogle } from "@/components/RequireSignIn";

type Props = { unit: number; src: string; script: ListeningScript; original?: React.ReactNode };

/** Speaking: original textbook player first, plus shadowing + hands-free AI role-play tabs. */
export function SpeakingPractice({ unit, src, script, original }: Props) {
  const [mode, setMode] = useState<"lesson" | "shadow" | "roleplay">(original ? "lesson" : "shadow");
  const tabs = [
    ...(original ? ([["lesson", "📖 သင်ခန်းစာ"]] as const) : []),
    ["shadow", "🎯 လိုက်ဆို"],
    ["roleplay", "💬 AI စကားပြော"],
  ] as const;
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("grid gap-1 border-b border-border bg-muted/40 p-1", original ? "grid-cols-3" : "grid-cols-2")}>
        {tabs.map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={cn(
              "rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm",
              mode === k ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <div className={mode === "lesson" ? "" : "p-4"}>
        {mode === "lesson" ? original : mode === "shadow" ? <Shadowing src={src} script={script} /> : <RolePlay unit={unit} />}
      </div>
    </section>
  );
}

/* ------------------------------ Mode A ------------------------------ */

function Shadowing({ src, script }: { src: string; script: ListeningScript }) {
  return <ShadowingTrack src={src} script={script} />;
}

/* ------------------------------ Mode B ------------------------------ */

type Turn = { role: "ai" | "student"; text: string; my?: string; tip?: string };
const EMOTIONS: Record<string, string> = {
  happy: "😊 Happy",
  excited: "🤩 Excited",
  curious: "🤔 Curious",
  encouraging: "💪 Encouraging",
  calm: "😌 Calm",
};

type Phase = "idle" | "thinking" | "speaking" | "listening" | "summary";

async function callRoleplay(body: object) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch("/api/roleplay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 401) toast.error("AI Role-Play သုံးရန် အရင် Login ဝင်ပါ။");
    else if (res.status === 429) toast.error("ဒီ Unit အတွက် ယနေ့ AI စကားပြောခွင့် ၂ ကြိမ် ပြည့်သွားပါပြီ။ တခြား Unit မှာ ဆက်လေ့ကျင့်နိုင်ပါတယ်။");
    else if (res.status === 402) toast.error("AI Credit ကုန်သွားပါပြီ။ Credit ဝယ်ယူပြီး ပြန်စမ်းပါ။");
    else if (res.status === 410) toast.error("စကားပြောချိန် ကုန်သွားပါပြီ။ အသစ် ပြန်စပါ။");
    throw new Error(String(res.status));
  }
  return res.json();
}

function RolePlay({ unit }: { unit: number }) {
  const unitTitle = getSyllabusUnit(unit)?.title ?? "";
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [scenario, setScenario] = useState<{ partner: string; en: string; my: string } | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [emotion, setEmotion] = useState("happy");
  const [heard, setHeard] = useState("");
  const [summary, setSummary] = useState<{ feedbackMy: string } | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const sessionRef = useRef("");
  const endingRef = useRef(false);
  const activeRef = useRef(false);
  const phaseRef = useRef<Phase>("idle");
  const turnsRef = useRef<Turn[]>([]);
  const bufRef = useRef("");
  const sawSpeech = useRef(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const tts = useSpeechSynthesis();

  const set = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const interimRef = useRef("");
  const send = async () => {
    if (phaseRef.current !== "listening") return;
    const text = `${bufRef.current} ${interimRef.current}`.trim();
    bufRef.current = "";
    interimRef.current = "";
    setHeard("");
    if (!activeRef.current) return;
    if (!text) {
      rec.start();
      return;
    }
    rec.stop();
    const next = [...turnsRef.current, { role: "student" as const, text }];
    turnsRef.current = next;
    setTurns(next);
    await aiTurn(next);
  };

  const rec = useWhisperRecognition({
    lang: "en",
    context: "speaking",
    silenceMs: 2200,
    onFinal: (t) => {
      if (phaseRef.current !== "listening") return;
      bufRef.current += ` ${t}`;
      interimRef.current = "";
      setHeard(bufRef.current.trim());
    },
    onInterim: (t) => {
      if (phaseRef.current !== "listening") return;
      interimRef.current = t;
      setHeard(`${bufRef.current} ${t}`.trim());
    },
    onSilence: () => void send(),
  });

  const aiTurn = async (history: Turn[], goodbye = false) => {
    set("thinking");
    try {
      const r = await callRoleplay({
        unit,
        unitTitle,
        session: sessionRef.current || undefined,
        goodbye,
        turns: history.map(({ role, text }) => ({ role, text })),
      });
      if (!activeRef.current) return;
      if (typeof r.session === "string" && !sessionRef.current) {
        sessionRef.current = r.session;
        void refreshLeft();
      }
      endingRef.current = goodbye;
      if (r.scenario) setScenario({ partner: "Saya Owl", en: r.scenario, my: r.scenarioMy ?? "" });
      const withTip = [...history];
      if (r.tip && withTip.length) withTip[withTip.length - 1] = { ...withTip[withTip.length - 1], tip: r.tip };
      const next = [...withTip, { role: "ai" as const, text: r.reply, my: r.replyMy }];
      turnsRef.current = next;
      setTurns(next);
      if (typeof r.emotion === "string" && EMOTIONS[r.emotion]) setEmotion(r.emotion);
      setHints(Array.isArray(r.hints) ? r.hints.slice(0, 3) : []);
      sawSpeech.current = false;
      set("speaking");
      void tts.speak(r.reply, { speed: 1, voice: "echo", provider: "openai" });
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (!["401", "402", "429"].includes(code)) toast.error("AI ချိတ်ဆက်မရပါ။ Internet စစ်ပြီး ပြန်စမ်းပါ။");
      stop(false);
    }
  };

  // When the partner finishes talking, open the mic automatically.
  useEffect(() => {
    if (phaseRef.current !== "speaking") return;
    if (tts.speaking) {
      sawSpeech.current = true;
      return;
    }
    if (sawSpeech.current && activeRef.current) {
      if (endingRef.current) {
        void stop();
        return;
      }
      set("listening");
      bufRef.current = "";
      interimRef.current = "";
      rec.start();
    }
  }, [tts.speaking]); // eslint-disable-line react-hooks/exhaustive-deps

  // Browser may end recognition on its own; keep listening while the call is live.
  useEffect(() => {
    if (!rec.listening && phaseRef.current === "listening" && activeRef.current && !bufRef.current.trim()) {
      const t = setTimeout(() => {
        if (phaseRef.current === "listening" && activeRef.current && !rec.listening) rec.start();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [rec.listening]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, heard]);

  useEffect(() => () => {
    activeRef.current = false;
  }, []);

  const refreshLeft = async () => {
    const { data } = await supabase.rpc("speaking_unit_status" as never, { p_unit: unit } as never);
    const s = data as unknown as { used: number; limit: number; unlimited: boolean } | null;
    setLeft(s ? (s.unlimited ? -1 : Math.max(0, s.limit - s.used)) : null);
  };
  useEffect(() => {
    void refreshLeft();
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  // 15 seconds of silence while listening = the student is done; Saya Owl says goodbye.
  useEffect(() => {
    if (phase !== "listening" || heard) return;
    const t = setTimeout(() => {
      if (phaseRef.current !== "listening" || !activeRef.current || rec.isCapturing() || bufRef.current.trim() || interimRef.current.trim()) return;
      rec.stop();
      void aiTurn(turnsRef.current, true);
    }, 15000);
    return () => clearTimeout(t);
  }, [phase, heard]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = async () => {
    if (!rec.supported) {
      toast.error("ဒီ browser မှာ အသံဖမ်းလို့ မရပါ။ Chrome ဖြင့် ဖွင့်ကြည့်ပါ။");
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast.error("AI နဲ့ စကားပြောရန် Google ဖြင့် အရင် Login ဝင်ပါ။", {
        action: { label: "Login", onClick: () => void signInWithGoogle() },
      });
      return;
    }
    try {
      const s = await navigator.mediaDevices?.getUserMedia({ audio: true });
      s?.getTracks().forEach((t) => t.stop());
    } catch {
      toast.error("Microphone ခွင့်ပြုချက် မရပါ။ Browser address bar ဘေးက 🔒 ကိုနှိပ်ပြီး Microphone ကို Allow လုပ်ပါ။");
      return;
    }
    activeRef.current = true;
    sessionRef.current = "";
    endingRef.current = false;
    turnsRef.current = [];
    setTurns([]);
    setScenario(null);
    setSummary(null);
    setHints([]);
    void aiTurn([]);
  };

  const stop = async (withSummary = true) => {
    activeRef.current = false;
    rec.stop();
    tts.stop();
    setHeard("");
    const said = turnsRef.current.filter((t) => t.role === "student");
    if (!withSummary || !said.length || !sessionRef.current) {
      set("idle");
      return;
    }
    set("summary");
    try {
      setSummary(await callRoleplay({ unit, unitTitle, session: sessionRef.current, turns: turnsRef.current, finish: true }));
    } catch {
      setSummary(null);
    }
  };

  const live = phase !== "idle" && phase !== "summary";
  const status: Record<Phase, string> = {
    idle: "",
    thinking: "🤔 စဉ်းစားနေပါတယ်…",
    speaking: `🔊 ${scenario?.partner ?? "AI"} ပြောနေပါတယ်…`,
    listening: "👂 နားထောင်နေပါတယ်… အင်္ဂလိပ်လို ပြောပါ",
    summary: "",
  };

  const interrupt = () => {
    tts.stop();
    sawSpeech.current = false;
    set("listening");
    bufRef.current = "";
    interimRef.current = "";
    rec.start();
  };
  const lastAi = [...turns].reverse().find((t) => t.role === "ai");
  const caption = phase === "listening" ? heard : lastAi?.text ?? "";

  const emo = EMOTIONS[emotion] ?? EMOTIONS.happy;
  const waveState = phase === "summary" ? "idle" : phase;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card to-muted/40 shadow-sm">
      <div className="flex items-center justify-between px-5 pt-4 text-xs">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm">🦉</span>
          Saya Owl
          <span className="font-normal text-muted-foreground">· Unit {unit}</span>
        </span>
        {live ? (
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Live
          </span>
        ) : null}
      </div>

      {phase !== "summary" && (
        <div className="flex flex-col items-center px-5 pb-4 pt-6">
          <div className={cn("voice-wave", `voice-wave--${waveState}`)} data-emotion={live ? emotion : undefined} aria-hidden>
            {Array.from({ length: 7 }).map((_, i) => <span key={i} />)}
          </div>
          <p className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">
            {phase === "idle" ? "English speaking partner" : status[phase]}
          </p>
          {live && (
            <span className={cn("mt-2 rounded-full border border-border/60 bg-background/70 px-2.5 py-0.5 text-[11px] text-muted-foreground transition-opacity duration-300", phase !== "thinking" && lastAi ? "opacity-100" : "opacity-0")}>
              {emo || "\u00A0"}
            </span>
          )}

          {scenario && <p className="mt-4 max-w-md text-center text-xs text-muted-foreground">🎭 {scenario.en}{scenario.my ? ` — ${scenario.my}` : ""}</p>}

          {live && (
            <div className="mt-5 h-36 w-full max-w-lg overflow-y-auto text-center [scrollbar-width:thin]">
              <p className={cn("text-lg font-medium leading-snug text-foreground transition-colors duration-300", phase === "listening" && "italic text-muted-foreground")}>
                {caption || (phase === "listening" ? "🎤 ပြောပါ…" : "")}
              </p>
              {phase !== "listening" && lastAi?.my && <p className="mt-1 text-xs text-muted-foreground">{lastAi.my}</p>}
            </div>
          )}

          {phase === "listening" && hints.length > 0 && (
            <details className="mt-3 w-full max-w-lg text-sm">
              <summary className="cursor-pointer text-center text-xs text-muted-foreground">💡 ဘာပြောရမလဲ မသိရင် နှိပ်ပါ</summary>
              <div className="mt-2 space-y-1.5">
                {hints.map((h) => <p key={h} className="rounded-xl bg-muted px-3 py-2">{h}</p>)}
              </div>
            </details>
          )}

          {turns.length > 0 && (
            <details className="mt-3 w-full max-w-lg text-sm">
              <summary className="cursor-pointer text-center text-xs text-muted-foreground">📝 စကားပြော မှတ်တမ်း</summary>
              <div ref={listRef} className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                {turns.map((t, i) => (
                  <div key={i} className={cn("flex", t.role === "student" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-3 py-2", t.role === "student" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                      <p>{t.text}</p>
                      {t.tip && <p className="mt-1 text-xs opacity-80">💡 {t.tip}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {phase === "summary" && (
        <div className="m-4 space-y-2 rounded-2xl border border-border/60 bg-background p-4 text-sm text-foreground">
          <p className="font-bold">📋 စကားပြော အကဲဖြတ်ချက်</p>
          {!summary ? (
            <p className="text-muted-foreground"><Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> စစ်ဆေးနေပါတယ်…</p>
          ) : (
            <>
              <p>{summary.feedbackMy}</p>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 px-5 pb-6">
        {live ? (
          <>
            {phase === "speaking" && (
              <button type="button" onClick={interrupt} aria-label="ကြားဖြတ်ပြောမည်" className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted">
                <Square className="h-4 w-4" />
              </button>
            )}
            {phase === "listening" && (
              <button type="button" onClick={() => void send()} disabled={!heard} aria-label="ပို့မည်" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
                <Mic className="h-5 w-5" />
              </button>
            )}
            <button type="button" onClick={() => void stop()} aria-label="ရပ်မည်" className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition hover:opacity-90">
              <PhoneOff className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
          <button type="button" onClick={start} disabled={left === 0} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90">
            <Phone className="h-4 w-4" /> {phase === "summary" ? "အသစ် ပြန်စမည်" : "စကားပြော စတင်မည်"}
          </button>
          {left !== null && left >= 0 && (
            <p className="text-xs text-muted-foreground">
              {left > 0 ? `ဒီ Unit မှာ ယနေ့ စကားပြောခွင့် ${left}/2 ကြိမ် ကျန်ပါတယ်` : "ဒီ Unit အတွက် ယနေ့ ၂ ကြိမ် ပြည့်ပါပြီ"}
            </p>
          )}
          </div>
        )}
      </div>
    </div>
  );
}
