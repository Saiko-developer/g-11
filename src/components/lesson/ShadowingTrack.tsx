import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Mic, Pause, Play, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import type { ListeningLine, ListeningScript } from "@/data/listeningScripts";
import { useSpeechRecognition } from "@/hooks/use-voice";
import { scoreShadowing, type WordMark } from "@/lib/shadowing-score";
import { cn } from "@/lib/utils";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/** Keep only real sentences worth repeating — drop unit titles, headings and name tags. */
export function practiceLines(lines: ListeningLine[]) {
  return lines
    .map((l, i) => ({ ...l, i }))
    .filter((l) => {
      const t = l.en.trim();
      const words = t.split(/\s+/).length;
      if (/^(unit|tip number)\b/i.test(t)) return false;
      if (/^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\.\s/i.test(t)) return false;
      if (words < 4) return false;
      return true;
    });
}

type Result = { marks: WordMark[]; percent: number; spoken: string };

export function ShadowingTrack({ src, script }: { src: string; script: ListeningScript }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAt = useRef<number | null>(null);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const bufRef = useRef("");
  const recIdx = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [showMy, setShowMy] = useState(true);
  const [singleIdx, setSingleIdx] = useState<number | null>(null);
  const [recording, setRecording] = useState<number | null>(null);
  const [interim, setInterim] = useState("");
  const [results, setResults] = useState<Record<number, Result>>({});

  const all = script.lines;
  const items = useMemo(() => practiceLines(all), [all]);
  const active = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < all.length; i++) if (time >= all[i].start + 0.3) idx = i;
    return idx;
  }, [time, all]);
  const current = active >= 0 ? all[active] : null;

  const finish = () => {
    const i = recIdx.current;
    const text = bufRef.current.trim();
    setInterim("");
    setRecording(null);
    recIdx.current = null;
    if (i === null || !text) return;
    setResults((r) => ({ ...r, [i]: { ...scoreShadowing(all[i].en, text), spoken: text } }));
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
    let raf = 0;
    const tick = () => {
      setTime(a.currentTime);
      if (stopAt.current !== null && a.currentTime >= stopAt.current) {
        a.pause();
        stopAt.current = null;
      }
      raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      setSingleIdx(null);
      cancelAnimationFrame(raf);
      setTime(a.currentTime);
    };
    const onMeta = () => setDuration(a.duration);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    a.addEventListener("loadedmetadata", onMeta);
    return () => {
      cancelAnimationFrame(raf);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
      a.removeEventListener("loadedmetadata", onMeta);
      a.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  // Follow the live sentence in the list while the full track plays.
  useEffect(() => {
    if (!playing || singleIdx !== null) return;
    rowRefs.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active, playing, singleIdx]);

  const safePlay = (a: HTMLAudioElement) =>
    a.play().catch((err) => {
      console.error("[shadowing-audio]", err);
      toast.error("အသံဖွင့်လို့ မရပါ။ ထပ်စမ်းကြည့်ပါ။");
    });

  const toggleAll = () => {
    const a = audioRef.current;
    if (!a) return;
    if (recording !== null) rec.stop();
    stopAt.current = null;
    setSingleIdx(null);
    if (a.paused) void safePlay(a);
    else a.pause();
  };

  const playOne = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (singleIdx === i && !a.paused) {
      a.pause();
      return;
    }
    if (recording !== null) rec.stop();
    a.playbackRate = rate;
    a.currentTime = all[i].start;
    setTime(all[i].start);
    stopAt.current = all[i].end;
    void safePlay(a).then(() => setSingleIdx(i));
  };

  const recordOne = (i: number) => {
    if (recording === i) {
      rec.stop();
      finish();
      return;
    }
    if (recording !== null) rec.stop();
    audioRef.current?.pause();
    bufRef.current = "";
    recIdx.current = i;
    setRecording(i);
    setInterim("");
    setResults((r) => {
      const n = { ...r };
      delete n[i];
      return n;
    });
    rec.start();
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Main track + live sentence */}
      <div className="sticky top-16 z-20 space-y-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <Volume2 className="h-3.5 w-3.5" /> Model audio track
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAll}
            aria-label={playing && singleIdx === null ? "Pause" : "Play"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
          >
            {playing && singleIdx === null ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = v;
                setTime(v);
              }}
              className="w-full accent-[hsl(var(--primary))]"
              aria-label="Seek"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[0.75, 1].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                rate === r ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
              )}
            >
              {r === 0.75 ? "🐢 0.75x" : "1x ပုံမှန်"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowMy((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold"
          >
            {showMy ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showMy ? "မြန်မာပြန် ဝှက်မယ်" : "မြန်မာပြန် ပြမယ်"}
          </button>
        </div>
        <div className="rounded-xl bg-primary/10 px-3 py-2.5">
          {current && playing ? (
            <>
              <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                {current.speaker === "Narrator" ? "အခု ပြောနေတာ" : current.speaker}
              </div>
              <p className="text-base font-bold leading-snug text-foreground md:text-lg">{current.en}</p>
              {showMy && <p className="mt-1 text-sm leading-relaxed text-primary">{current.my}</p>}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              ▶ နှိပ်ပြီး တစ်ပုဒ်လုံး နားထောင်ပါ။ အောက်က စာကြောင်းတစ်ကြောင်းချင်းကို 🎤 နှိပ်ပြီး လိုက်ဆိုနိုင်ပါတယ်။
            </p>
          )}
        </div>
      </div>

      {/* Sentence list */}
      <p className="text-xs font-semibold text-muted-foreground">📋 လိုက်ဆိုရန် စာကြောင်း {items.length} ကြောင်း</p>
      {!rec.supported && (
        <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          ဒီ browser မှာ အသံဖမ်းလို့ မရပါ။ Chrome ဖြင့် ဖွင့်ကြည့်ပါ။ နားထောင်တာကတော့ ရပါတယ်။
        </p>
      )}
      <div className="space-y-2">
        {items.map((l, n) => {
          const live = playing && l.i === active;
          const res = results[l.i];
          const isRec = recording === l.i;
          return (
            <div
              key={l.i}
              ref={(el) => {
                rowRefs.current[l.i] = el;
              }}
              className={cn(
                "rounded-xl border p-3 transition",
                live ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card",
              )}
            >
              <div className="flex gap-2">
                <span className="mt-0.5 text-xs font-bold text-muted-foreground">{n + 1}.</span>
                <div className="min-w-0 flex-1">
                  {script.multiSpeaker && l.speaker !== "Narrator" && (
                    <span className="text-xs font-semibold text-primary">🗣️ {l.speaker}</span>
                  )}
                  <p className={cn("leading-snug", live ? "font-bold text-foreground" : "font-medium")}>{l.en}</p>
                  {showMy && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{l.my}</p>}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 pl-5">
                <button
                  type="button"
                  onClick={() => playOne(l.i)}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {singleIdx === l.i && playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {singleIdx === l.i && playing ? "ရပ်" : "နားထောင်"}
                </button>
                {rec.supported && (
                  <button
                    type="button"
                    onClick={() => recordOne(l.i)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold",
                      isRec ? "animate-pulse bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground",
                    )}
                  >
                    {isRec ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    {isRec ? "ပြောပြီးရင် နှိပ်ပါ" : "လိုက်ဆို"}
                  </button>
                )}
              </div>
              {isRec && interim && <p className="mt-2 pl-5 text-sm italic text-muted-foreground">“{interim}”</p>}
              {res && (
                <div className="mt-2 space-y-1.5 border-t border-border pt-2 pl-5">
                  <p className="text-sm font-bold">
                    {res.percent}% ·{" "}
                    {res.percent >= 85 ? "⭐ အလွန်ကောင်းပါတယ်" : res.percent >= 60 ? "👍 ကောင်းပါတယ်" : "💪 ထပ်ကြိုးစားကြည့်ပါ"}
                  </p>
                  <p className="flex flex-wrap gap-1 text-sm">
                    {res.marks.map((m, k) => (
                      <span
                        key={k}
                        className={cn(
                          "rounded px-1.5 py-0.5 font-medium",
                          m.status === "ok" && "bg-primary/15 text-primary",
                          m.status === "close" && "bg-accent text-accent-foreground",
                          m.status === "missed" && "bg-muted text-muted-foreground line-through",
                        )}
                      >
                        {m.word}
                      </span>
                    ))}
                  </p>
                  <p className="text-xs text-muted-foreground">သင်ပြောတာ: “{res.spoken}”</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
