import { useEffect, useRef, useState } from "react";
import type { SubtitleLine } from "@/data/unit1VideoSubtitles";

type YTPlayer = { getCurrentTime: () => number; seekTo: (s: number, a: boolean) => void; playVideo: () => void; destroy: () => void };

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiPromise;
}

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export function SyncedVideoPlayer({ youtubeId, title, subtitles, burmeseOnly = false }: { youtubeId: string; title: string; subtitles: SubtitleLine[]; burmeseOnly?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [time, setTime] = useState(0);
  const [showEnState, setShowEn] = useState(true);
  const showEn = showEnState && !burmeseOnly;
  const [showScript, setShowScript] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, cc_load_policy: 0 },
      });
      timer = setInterval(() => {
        const p = playerRef.current;
        if (p && typeof p.getCurrentTime === "function") setTime(p.getCurrentTime() || 0);
      }, 250);
    });
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [youtubeId]);

  // Delay so subtitles land as words are heard; hold each line through the full gap until the next starts.
  const SUBTITLE_DELAY = 0.5;
  const LAST_HOLD = 5;
  const t = time - SUBTITLE_DELAY;
  let activeIdx = -1;
  for (let i = 0; i < subtitles.length; i++) {
    if (t >= subtitles[i].start) activeIdx = i;
    else break;
  }
  if (activeIdx === subtitles.length - 1 && activeIdx >= 0 && t >= subtitles[activeIdx].end + LAST_HOLD) activeIdx = -1;
  const active = activeIdx >= 0 ? subtitles[activeIdx] : null;

  const seek = (s: number) => {
    playerRef.current?.seekTo(s, true);
    playerRef.current?.playVideo();
    setTime(s);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted [&_iframe]:h-full [&_iframe]:w-full">
        <div ref={hostRef} title={title} />
      </div>

      <div className="min-h-[5.5rem] rounded-xl border border-primary/40 bg-primary/5 p-4 text-center" aria-live="polite">
        {active ? (
          <>
            <p className="text-base font-semibold leading-relaxed text-foreground">{active.my}</p>
            {showEn && <p className="mt-1 text-sm text-muted-foreground">{active.en}</p>}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">▶ ဗီဒီယိုကို ဖွင့်လိုက်ရင် မြန်မာ စာတန်းထိုး ဒီမှာ ပေါ်လာပါမယ်။</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!burmeseOnly && (
          <button type="button" onClick={() => setShowEn((v) => !v)} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent">
            {showEn ? "English ဖျောက်မယ်" : "English ပြမယ်"}
          </button>
        )}
        <button type="button" onClick={() => setShowScript((v) => !v)} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent">
          {showScript ? "စာသားအပြည့် ပိတ်မယ်" : "📜 စာသားအပြည့် ကြည့်မယ်"}
        </button>
      </div>

      {showScript && (
        <ol className="max-h-80 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2">
          {subtitles.map((l, i) => (
            <li key={l.start}>
              <button
                type="button"
                onClick={() => seek(l.start)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${i === activeIdx ? "bg-primary/15 ring-1 ring-primary" : "hover:bg-accent"}`}
              >
                <span className="mr-2 font-mono text-xs text-primary">{fmt(l.start)}</span>
                <span className="font-medium">{l.my}</span>
                {showEn && <span className="block pl-10 text-xs text-muted-foreground">{l.en}</span>}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
