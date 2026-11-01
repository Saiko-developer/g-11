import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import type { ListeningScript } from "@/data/listeningScripts";
import { cn } from "@/lib/utils";

type Props = { src: string; script: ListeningScript; label: string; hint?: string };

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * Listening player that lights up the sentence being spoken right now.
 * Multi-speaker scripts render as chat bubbles; single narrators as a teleprompter.
 */
export function SyncedListeningPlayer({ src, script, label, hint }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stopAtRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [showMy, setShowMy] = useState(true);

  const lines = script.lines;
  const active = useMemo(() => {
    let idx = -1;
    // Delay highlights slightly so they land as the words are heard, not before.
    const SUBTITLE_DELAY = 0.4;
    for (let i = 0; i < lines.length; i++) if (time >= lines[i].start + SUBTITLE_DELAY) idx = i;
    return idx;
  }, [time, lines]);

  // Assign each non-narrator speaker a side + colour.
  const speakers = useMemo(
    () => Array.from(new Set(lines.map((l) => l.speaker).filter((s) => s !== "Narrator"))),
    [lines],
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    let raf = 0;
    const tick = () => {
      setTime(a.currentTime);
      if (stopAtRef.current !== null && a.currentTime >= stopAtRef.current) {
        a.pause();
        stopAtRef.current = null;
      }
      raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
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

  // Keep the live sentence centred inside the script box.
  useEffect(() => {
    const box = listRef.current;
    const el = lineRefs.current[active];
    if (!box || !el || !playing) return;
    box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: "smooth" });
  }, [active, playing]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    stopAtRef.current = null;
    if (a.paused) void a.play();
    else a.pause();
  };

  const playLine = (i: number, once: boolean) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = lines[i].start;
    setTime(lines[i].start);
    stopAtRef.current = once ? lines[i].end : null;
    void a.play();
  };

  const current = active >= 0 ? lines[active] : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Controls */}
      <div className="sticky top-0 z-10 space-y-3 border-b border-border bg-card p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <Volume2 className="h-3.5 w-3.5" /> {label}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition hover:opacity-90"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
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
        <div className="flex flex-wrap items-center gap-2">
          {[0.75, 1].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                rate === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {r === 0.75 ? "🐢 နှေးနှေး 0.75x" : "ပုံမှန် 1x"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowMy((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
          >
            {showMy ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showMy ? "မြန်မာပြန် ဝှက်မယ်" : "မြန်မာပြန် ပြမယ်"}
          </button>
        </div>
        {/* Live now-speaking strip */}
        <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm">
          {current ? (
            <>
              <span className="mr-2 inline-flex items-center gap-1 font-semibold text-primary">
                <span className={cn("inline-block h-2 w-2 rounded-full bg-primary", playing && "animate-pulse")} />
                {current.speaker === "Narrator" ? "ပြောနေသူ" : current.speaker}
              </span>
              <span className="text-foreground">{current.en}</span>
            </>
          ) : (
            <span className="text-muted-foreground">▶ ကို နှိပ်ပြီး နားထောင်ပါ။ ပြောနေတဲ့ စာကြောင်းကို အရောင်လင်းပြီး ပြပေးပါမယ်။</span>
          )}
        </div>
      </div>

      {/* Script */}
      <div ref={listRef} className="relative max-h-[60vh] space-y-3 overflow-y-auto p-4">
        {lines.map((l, i) => {
          const isActive = i === active;
          const isPast = active >= 0 && i < active;
          const sideIdx = speakers.indexOf(l.speaker);
          const isNarrator = !script.multiSpeaker || sideIdx < 0;
          const right = script.multiSpeaker && sideIdx % 2 === 1;
          return (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={cn(
                "flex",
                isNarrator ? "justify-center" : right ? "justify-end" : "justify-start",
              )}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => playLine(i, false)}
                onKeyDown={(e) => e.key === "Enter" && playLine(i, false)}
                className={cn(
                  "cursor-pointer rounded-2xl border p-3 text-left transition-all duration-300",
                  isNarrator ? "w-full" : "max-w-[88%]",
                  isActive
                    ? "scale-[1.01] border-primary bg-primary/10 shadow-md ring-2 ring-primary/40"
                    : right
                      ? "border-border bg-secondary"
                      : "border-border bg-background",
                  isPast && "opacity-55",
                  !isActive && !isPast && active >= 0 && "opacity-80",
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold">
                  <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>
                    {script.multiSpeaker && !isNarrator ? `🗣️ ${l.speaker}` : fmt(l.start)}
                    {isActive && playing && " · 🔊 ပြောနေပြီ"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playLine(i, true);
                    }}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Repeat this sentence"
                  >
                    <RotateCcw className="h-3 w-3" /> ထပ်နားထောင်
                  </button>
                </div>
                <p className={cn("leading-relaxed", isActive ? "text-base font-semibold text-foreground" : "text-sm text-foreground")}>
                  {l.en}
                </p>
                {showMy && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{l.my}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {hint && <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{hint} စာကြောင်းကို နှိပ်ရင် အဲဒီနေရာကနေ ပြန်ဖွင့်ပေးပါမယ်။</p>}
    </div>
  );
}
