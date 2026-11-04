import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Mic, Phone, PhoneOff, Play, Square } from "lucide-react";
import { toast } from "sonner";
import type { ListeningScript } from "@/data/listeningScripts";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-voice";
import { scoreShadowing, type WordMark } from "@/lib/shadowing-score";
import { getSyllabusUnit } from "@/lib/localData";
import { cn } from "@/lib/utils";

type Props = { unit: number; src: string; script: ListeningScript };

/** Dedicated Speaking practice: sentence shadowing + hands-free AI role-play. */
export function SpeakingPractice({ unit, src, script }: Props) {
  const [mode, setMode] = useState<"shadow" | "roleplay">("shadow");
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-2 gap-1 border-b border-border bg-muted/40 p-1">
        {(
          [
            ["shadow", "🎯 လိုက်ဆို လေ့ကျင့်"],
            ["roleplay", "💬 AI နဲ့ စကားပြော"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              mode === k ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="p-4">
        {mode === "shadow" ? <Shadowing src={src} script={script} /> : <RolePlay unit={unit} />}
      </div>
    </section>
  );
}

/* ------------------------------ Mode A ------------------------------ */

function Shadowing({ src, script }: { src: string; script: ListeningScript }) {
  const lines = script.lines.filter((l) => l.en.split(/\s+/).length >= 3);
  const [idx, setIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [spoken, setSpoken] = useState("");
  const [interim, setInterim] = useState("");
  const [result, setResult] = useState<{ marks: WordMark[]; percent: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAt = useRef<number | null>(null);
  const bufRef = useRef("");
  const line = lines[idx];

  const finish = () => {
    const text = bufRef.current.trim();
    setInterim("");
    if (!text) return;
    setSpoken(text);
    setResult(scoreShadowing(line.en, text));
  };
  const rec = useSpeechRecognition({
    lang: "en-US",
    silenceMs: 2000,
    onFinal: (t) => {
      bufRef.current += ` ${t}`;
      setInterim(bufRef.current.trim());
    },
    onInterim: (t) => setInterim(`${bufRef.current} ${t}`.trim()),
    onSilence: finish,
  });

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const tick = () => {
      if (stopAt.current !== null && a.currentTime >= stopAt.current) {
        a.pause();
        stopAt.current = null;
      }
    };
    a.addEventListener("timeupdate", tick);
    return () => {
      a.removeEventListener("timeupdate", tick);
      a.pause();
    };
  }, []);

  const playModel = () => {
    const a = audioRef.current;
    if (!a || !line) return;
    rec.stop();
    a.playbackRate = rate;
    a.currentTime = line.start;
    stopAt.current = line.end;
    void a.play();
  };
  const record = () => {
    if (rec.listening) {
      rec.stop();
      finish();
      return;
    }
    audioRef.current?.pause();
    bufRef.current = "";
    setResult(null);
    setSpoken("");
    rec.start();
  };
  const go = (d: number) => {
    rec.stop();
    setResult(null);
    setSpoken("");
    setInterim("");
    setIdx((i) => Math.min(lines.length - 1, Math.max(0, i + d)));
  };

  if (!line) return null;
  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>စာကြောင်း {idx + 1} / {lines.length}</span>
        <div className="flex gap-1">
          {[0.75, 1].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              className={cn(
                "rounded-full border px-2.5 py-1",
                rate === r ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              {r === 0.75 ? "🐢 0.75x" : "1x"}
            </button>
          ))}
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / lines.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-primary/10 p-4">
        <p className="text-lg font-bold leading-snug text-foreground">{line.en}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{line.my}</p>
        <button
          type="button"
          onClick={playModel}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold text-primary shadow-sm"
        >
          <Play className="h-4 w-4" /> နမူနာ နားထောင်ရန်
        </button>
      </div>

      {!rec.supported ? (
        <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          ဒီ browser မှာ အသံဖမ်းလို့ မရပါ။ Chrome ဖြင့် ဖွင့်ကြည့်ပါ။
        </p>
      ) : (
        <button
          type="button"
          onClick={record}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-bold transition",
            rec.listening ? "animate-pulse bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          {rec.listening ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          {rec.listening ? "ပြောပြီးရင် နှိပ်ပါ (သို့) ခဏရပ်ပါ" : "နှိပ်ပြီး လိုက်ဆိုပါ"}
        </button>
      )}
      {rec.listening && interim && <p className="text-center text-sm italic text-muted-foreground">“{interim}”</p>}

      {result && (
        <div className="space-y-2 rounded-2xl border border-border p-4">
          <p className="text-base font-bold">
            {result.percent}% ·{" "}
            {result.percent >= 85 ? "⭐ အလွန်ကောင်းပါတယ်" : result.percent >= 60 ? "👍 ကောင်းပါတယ်" : "💪 ထပ်ကြိုးစားကြည့်ပါ"}
          </p>
          <p className="flex flex-wrap gap-1.5 text-base">
            {result.marks.map((m, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-md px-1.5 py-0.5 font-medium",
                  m.status === "ok" && "bg-primary/15 text-primary",
                  m.status === "close" && "bg-accent text-accent-foreground",
                  m.status === "missed" && "bg-muted text-muted-foreground line-through",
                )}
              >
                {m.word}
              </span>
            ))}
          </p>
          <p className="text-xs text-muted-foreground">သင်ပြောတာ: “{spoken}”</p>
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" disabled={idx === 0} onClick={() => go(-1)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-semibold disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> ရှေ့
        </button>
        <button type="button" disabled={idx === lines.length - 1} onClick={() => go(1)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-semibold disabled:opacity-40">
          နောက်တစ်ကြောင်း <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Mode B ------------------------------ */

type Turn = { role: "ai" | "student"; text: string; my?: string; tip?: string };
type Phase = "idle" | "thinking" | "speaking" | "listening" | "summary";

async function callRoleplay(body: object) {
  const res = await fetch("/api/roleplay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(String(res.status));
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

  const send = async () => {
    const text = bufRef.current.trim();
    bufRef.current = "";
    setHeard("");
    if (!activeRef.current) return;
    if (!text) {
      rec.start();
      return;
    }
    const next = [...turnsRef.current, { role: "student" as const, text }];
    turnsRef.current = next;
    setTurns(next);
    await aiTurn(next);
  };

  const rec = useSpeechRecognition({
    lang: "en-US",
    silenceMs: 1800,
    onFinal: (t) => {
      bufRef.current += ` ${t}`;
      setHeard(bufRef.current.trim());
    },
    onInterim: (t) => setHeard(`${bufRef.current} ${t}`.trim()),
    onSilence: () => void send(),
  });

  const aiTurn = async (history: Turn[]) => {
    set("thinking");
    try {
      const r = await callRoleplay({ unit, unitTitle, turns: history.map(({ role, text }) => ({ role, text })) });
      if (!activeRef.current) return;
      if (r.scenario) setScenario({ partner: r.partner ?? "Partner", en: r.scenario, my: r.scenarioMy ?? "" });
      const withTip = [...history];
      if (r.tip && withTip.length) withTip[withTip.length - 1] = { ...withTip[withTip.length - 1], tip: r.tip };
      const next = [...withTip, { role: "ai" as const, text: r.reply, my: r.replyMy }];
      turnsRef.current = next;
      setTurns(next);
      setHints(Array.isArray(r.hints) ? r.hints.slice(0, 3) : []);
      sawSpeech.current = false;
      set("speaking");
      void tts.speak(r.reply, { speed: 1 });
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

  return (
    <div className="space-y-4">
      {!live && phase !== "summary" && (
        <div className="rounded-2xl bg-primary/10 p-4 text-sm leading-relaxed">
          <p className="font-semibold text-foreground">Unit {unit} · {unitTitle}</p>
          <p className="mt-1 text-muted-foreground">
            AI က ဒီ Unit နဲ့ ဆိုင်တဲ့ အခြေအနေတစ်ခု ဖန်တီးပြီး သင်နဲ့ အပြန်အလှန် စကားပြောပါမယ်။ "စတင်မည်" ကို တစ်ခါနှိပ်ရုံပါပဲ — AI ပြောပြီးတာနဲ့ မိုက် အလိုလို ပွင့်ပြီး သင်ပြောပြီး ခဏရပ်ရင် AI ဆက်ဖြေပါမယ်။
          </p>
        </div>
      )}

      {scenario && (
        <div className="rounded-2xl border border-border p-3 text-sm">
          <p className="font-semibold">🎭 {scenario.en}</p>
          {scenario.my && <p className="mt-1 text-muted-foreground">{scenario.my}</p>}
        </div>
      )}

      {turns.length > 0 && (
        <div ref={listRef} className="max-h-[50vh] space-y-2 overflow-y-auto">
          {turns.map((t, i) => (
            <div key={i} className={cn("flex", t.role === "student" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2",
                  t.role === "student" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                )}
              >
                <p className="text-[11px] font-semibold opacity-70">{t.role === "ai" ? scenario?.partner ?? "AI" : "You"}</p>
                <p className="text-base font-medium leading-snug">{t.text}</p>
                {t.my && <p className="mt-1 text-xs opacity-80">{t.my}</p>}
                {t.tip && <p className="mt-1.5 rounded-lg bg-card/90 px-2 py-1 text-xs text-foreground">💡 {t.tip}</p>}
              </div>
            </div>
          ))}
          {phase === "listening" && heard && (
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl border border-dashed border-primary px-3 py-2 text-sm italic">{heard}</p>
            </div>
          )}
        </div>
      )}

      {live && (
        <>
          <p className={cn("text-center text-sm font-semibold", phase === "listening" ? "text-primary" : "text-muted-foreground")}>
            {phase === "thinking" && <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />}
            {status[phase]}
          </p>
          {phase === "listening" && hints.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">💡 ဒီလို ပြောကြည့်လို့ရပါတယ်</p>
              {hints.map((h) => (
                <p key={h} className="rounded-xl bg-muted px-3 py-2 text-sm">{h}</p>
              ))}
            </div>
          )}
        </>
      )}

      {phase === "summary" && (
        <div className="space-y-2 rounded-2xl border border-border p-4 text-sm">
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

      {live ? (
        <button
          type="button"
          onClick={() => void stop()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-4 text-base font-bold text-destructive-foreground"
        >
          <PhoneOff className="h-5 w-5" /> ရပ်မည်
        </button>
      ) : (
        <button
          type="button"
          onClick={start}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground"
        >
          <Phone className="h-5 w-5" /> {phase === "summary" ? "အသစ် ပြန်စမည်" : "စတင်မည်"}
        </button>
      )}
    </div>
  );
}
