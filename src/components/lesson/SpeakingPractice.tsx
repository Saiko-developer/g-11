import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Mic, Phone, PhoneOff, Play, Square } from "lucide-react";
import { toast } from "sonner";
import type { ListeningScript } from "@/data/listeningScripts";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-voice";
import { scoreShadowing, type WordMark } from "@/lib/shadowing-score";
import { getSyllabusUnit } from "@/lib/localData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ShadowingTrack } from "@/components/lesson/ShadowingTrack";

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
    else if (res.status === 402 || res.status === 429) toast.error("ယနေ့ AI အသုံးပြုခွင့် ပြည့်သွားပါပြီ။");
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
  const [heard, setHeard] = useState("");
  const [summary, setSummary] = useState<{ summaryMy: string; good: string[]; improve: string[] } | null>(null);
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

  const rec = useSpeechRecognition({
    lang: "en-US",
    silenceMs: 2000,
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

  const aiTurn = async (history: Turn[]) => {
    set("thinking");
    try {
      const r = await callRoleplay({ unit, unitTitle, turns: history.map(({ role, text }) => ({ role, text })) });
      if (!activeRef.current) return;
      if (r.scenario) setScenario({ partner: "Saya Owl", en: r.scenario, my: r.scenarioMy ?? "" });
      const withTip = [...history];
      if (r.tip && withTip.length) withTip[withTip.length - 1] = { ...withTip[withTip.length - 1], tip: r.tip };
      const next = [...withTip, { role: "ai" as const, text: r.reply, my: r.replyMy }];
      turnsRef.current = next;
      setTurns(next);
      setHints(Array.isArray(r.hints) ? r.hints.slice(0, 3) : []);
      sawSpeech.current = false;
      set("speaking");
      void tts.speak(r.reply, { speed: 1, voice: "echo", provider: "openai" });
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      toast.error(code === "402" ? "AI credits ကုန်နေပါတယ်" : code === "429" ? "ခဏစောင့်ပြီး ပြန်စမ်းပါ" : "AI ချိတ်ဆက်မရပါ");
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

  const start = () => {
    if (!rec.supported) {
      toast.error("ဒီ browser မှာ အသံဖမ်းလို့ မရပါ။ Chrome ဖြင့် ဖွင့်ကြည့်ပါ။");
      return;
    }
    activeRef.current = true;
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
    if (!withSummary || !said.length) {
      set("idle");
      return;
    }
    set("summary");
    try {
      setSummary(await callRoleplay({ unit, unitTitle, turns: turnsRef.current, finish: true }));
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

  return (
    <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
      <div className="flex items-center justify-between px-5 pt-4 text-xs">
        <span className="font-semibold opacity-80">Unit {unit} · {unitTitle}</span>
        {live && <span className="flex items-center gap-1.5 opacity-70"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> Live</span>}
      </div>

      {phase !== "summary" && (
        <div className="flex flex-col items-center px-5 pb-6 pt-8">
          <div className={cn("voice-orb", `voice-orb--${phase}`)} aria-hidden />
          <p className="mt-6 text-lg font-semibold">Saya Owl</p>
          <p className="mt-1 min-h-[1.25rem] text-sm opacity-70">
            {phase === "idle" ? "English speaking partner" : status[phase]}
          </p>

          {scenario && <p className="mt-4 max-w-md text-center text-xs opacity-60">🎭 {scenario.en}{scenario.my ? ` — ${scenario.my}` : ""}</p>}

          {!live && (
            <p className="mt-5 max-w-md text-center text-sm leading-relaxed opacity-75">
              ဖုန်းခေါ်သလို အင်္ဂလိပ်လို စကားပြောကြမယ်။ Saya Owl ပြောပြီးတာနဲ့ မိုက် အလိုလို ပွင့်ပါမယ်။
            </p>
          )}

          {live && (
            <div className="mt-6 min-h-[4.5rem] w-full max-w-lg text-center">
              <p className={cn("text-lg font-medium leading-snug", phase === "listening" && "italic opacity-80")}>
                {caption || (phase === "listening" ? "🎤 ပြောပါ…" : "")}
              </p>
              {phase !== "listening" && lastAi?.my && <p className="mt-1 text-xs opacity-60">{lastAi.my}</p>}
            </div>
          )}

          {phase === "listening" && hints.length > 0 && (
            <details className="mt-3 w-full max-w-lg text-sm">
              <summary className="cursor-pointer text-center text-xs opacity-70">💡 ဘာပြောရမလဲ မသိရင် နှိပ်ပါ</summary>
              <div className="mt-2 space-y-1.5">
                {hints.map((h) => <p key={h} className="rounded-xl bg-background/10 px-3 py-2">{h}</p>)}
              </div>
            </details>
          )}

          {turns.length > 0 && (
            <details className="mt-3 w-full max-w-lg text-sm">
              <summary className="cursor-pointer text-center text-xs opacity-70">📝 စကားပြော မှတ်တမ်း</summary>
              <div ref={listRef} className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                {turns.map((t, i) => (
                  <div key={i} className={cn("flex", t.role === "student" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-3 py-2", t.role === "student" ? "bg-primary text-primary-foreground" : "bg-background/10")}>
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
        <div className="m-4 space-y-2 rounded-2xl bg-background p-4 text-sm text-foreground">
          <p className="font-bold">📋 စကားပြော အကဲဖြတ်ချက်</p>
          {!summary ? (
            <p className="text-muted-foreground"><Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> စစ်ဆေးနေပါတယ်…</p>
          ) : (
            <>
              <p>{summary.summaryMy}</p>
              {summary.good?.map((g) => <p key={g}>✅ {g}</p>)}
              {summary.improve?.map((g) => <p key={g}>✏️ {g}</p>)}
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-5 px-5 pb-6">
        {live ? (
          <>
            {phase === "speaking" && (
              <button type="button" onClick={interrupt} aria-label="ကြားဖြတ်ပြောမည်" className="flex h-14 w-14 items-center justify-center rounded-full bg-background/15 transition hover:bg-background/25">
                <Square className="h-5 w-5" />
              </button>
            )}
            {phase === "listening" && (
              <button type="button" onClick={() => void send()} disabled={!heard} aria-label="ပို့မည်" className="flex h-14 w-14 items-center justify-center rounded-full bg-background/15 transition hover:bg-background/25 disabled:opacity-40">
                <Mic className="h-5 w-5" />
              </button>
            )}
            <button type="button" onClick={() => void stop()} aria-label="ရပ်မည်" className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition hover:opacity-90">
              <PhoneOff className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button type="button" onClick={start} className="flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-base font-bold text-foreground transition hover:opacity-90">
            <Phone className="h-5 w-5" /> {phase === "summary" ? "အသစ် ပြန်စမည်" : "စကားပြော စတင်မည်"}
          </button>
        )}
      </div>
    </div>
  );
}
