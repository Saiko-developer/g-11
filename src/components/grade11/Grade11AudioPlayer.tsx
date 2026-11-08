import { getGrade11Captions } from "@/lib/grade11Captions";
import { useGrade11CaptionClock } from "./useGrade11CaptionClock";
import { Grade11CaptionText } from "./Grade11CaptionText";
import { useEffect, useRef, useState } from "react";
import tracks from "@/data/grade11/listeningAudio.json";

/** User-supplied full tracks; deliberately independent of Grade 10 audio and paid TTS. */
export function Grade11AudioPlayer({
  unit,
  reference = false,
}: {
  unit: number;
  reference?: boolean;
}) {
  const track = tracks.find((item) => item.unit === unit);
  return track ? <TrackPlayer key={track.src} track={track} reference={reference} /> : null;
}

function TrackPlayer({ track, reference }: { track: (typeof tracks)[number]; reference: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const cues = getGrade11Captions(track.unit);
  const stopAt = useRef<number | null>(null);
  const active = useGrade11CaptionClock(audioRef, cues, stopAt);
  const current = cues[active.cueIndex];
  const [playError, setPlayError] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = transcriptRef.current;
    const line = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (box && line && !audioRef.current?.paused)
      box.scrollTo?.({
        top: line.offsetTop - box.clientHeight / 2 + line.clientHeight / 2,
        behavior: "smooth",
      });
  }, [active.cueIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // SSR may finish loading metadata before React attaches event handlers.
      if (!audio.getAttribute("src")) audio.src = track.src;
      setReady(audio.readyState >= 1);
    }
    return () => {
      // Stop playback and release downloads when leaving the unit, skill or speaking tab.
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, [track.src]);

  function seek(seconds: number) {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) {
      stopAt.current = null;
      audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    }
  }

  return (
    <section
      aria-label={`Grade 11 Unit ${track.unit} original audio`}
      className="my-5 min-w-0 space-y-3 rounded-2xl border border-primary/30 bg-card p-4"
    >
      <h2 className="font-semibold">🎧 Unit {track.unit} · Listening audio</h2>
      <p lang="my" className="text-sm text-muted-foreground">
        {reference
          ? "ပေးထားသော Listening အသံဖိုင်ကို စာတန်းနှင့်အတူ နားထောင်နိုင်ပါသည်။ စာအုပ်၏ Speaking စကားရပ်များနှင့် သီးခြားဖြစ်ပါသည်။"
          : "ပေးထားသော မူရင်းအသံဖိုင်ကို နားထောင်ပြီး စာအုပ်လေ့ကျင့်ခန်းများ ဖြေကြည့်ပါ။"}
      </p>
      <audio
        ref={audioRef}
        src={track.src}
        controls
        preload="metadata"
        aria-label={`Unit ${track.unit} listening track`}
        className="block w-full min-w-0"
        onLoadedMetadata={() => {
          setReady(true);
          setFailed(false);
        }}
        onError={() => {
          setFailed(true);
          setReady(false);
        }}
        onRateChange={() => {
          if (audioRef.current) setSpeed(audioRef.current.playbackRate);
        }}
      />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          disabled={!ready}
          onClick={() => seek(-10)}
          className="rounded-lg border border-border px-3 py-2 disabled:opacity-40"
        >
          −10s
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => seek(10)}
          className="rounded-lg border border-border px-3 py-2 disabled:opacity-40"
        >
          +10s
        </button>
        <label className="flex items-center gap-2">
          <span lang="my">အမြန်နှုန်း</span>
          <select
            aria-label="Audio playback speed"
            value={speed}
            onChange={(event) => {
              const rate = Number(event.target.value);
              setSpeed(rate);
              if (audioRef.current) audioRef.current.playbackRate = rate;
            }}
            className="rounded-lg border border-border bg-background px-2 py-2"
          >
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </label>
        <a
          href={track.src}
          download={`grade11-unit${track.unit}.mp3`}
          className="rounded-lg px-3 py-2 text-primary underline"
        >
          MP3 ရယူမည်
        </a>
      </div>
      {cues.length > 0 && (
        <div className="space-y-3 border-t border-border pt-3">
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              aria-pressed={showCaptions}
              className="text-primary underline"
              onClick={() => setShowCaptions((old) => !old)}
            >
              {showCaptions ? "CC စာတန်း ပိတ်မည်" : "CC စာတန်း ပြမည်"}
            </button>
            <a
              href={`/grade11/captions/unit${track.unit}.vtt`}
              download
              className="text-primary underline"
            >
              VTT စာတန်း ရယူမည်
            </a>
          </div>
          <p lang="my" className="text-xs text-muted-foreground">
            မူရင်း MP3 မှ စက်ဖြင့်အသံဖော်ထားသော အင်္ဂလိပ်စာတန်း ဖြစ်၍ စာလုံးနှင့် အချိန်ကိုက်မှုတွင်
            အမှားအယွင်း ရှိနိုင်ပါသည်။
          </p>
          {showCaptions && (
            <div
              role="region"
              aria-label="Live audio subtitles"
              className="min-h-24 rounded-xl border border-primary/30 bg-primary/5 p-4"
            >
              {current ? (
                <Grade11CaptionText cue={current} wordIndex={active.wordIndex} />
              ) : (
                <p lang="my" className="text-sm text-muted-foreground">
                  အသံဖွင့်ပြီး ပြောနေသောစာကြောင်းကို ဒီနေရာတွင် ကြည့်နိုင်ပါသည်။
                </p>
              )}
              {current?.my && (
                <p lang="my" className="mt-2 text-sm">
                  {current.my}
                </p>
              )}
            </div>
          )}
          <details>
            <summary className="cursor-pointer text-sm font-medium text-primary">
              စာတန်းအပြည့် / တစ်ကြောင်းချင်း နားထောင်မည်
            </summary>
            <div ref={transcriptRef} className="relative mt-3 max-h-72 space-y-2 overflow-y-auto">
              {cues.map((cue, index) => (
                <button
                  key={cue.id}
                  type="button"
                  disabled={!ready}
                  aria-current={index === active.cueIndex ? "true" : undefined}
                  className={`block w-full rounded-xl border p-3 text-left text-sm disabled:opacity-50 ${index === active.cueIndex ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={async () => {
                    const audio = audioRef.current;
                    if (!audio) return;
                    setPlayError("");
                    stopAt.current = cue.end;
                    audio.currentTime = cue.start;
                    try {
                      await audio.play();
                    } catch {
                      stopAt.current = null;
                      setPlayError("အသံဖွင့်မရပါ။ ထပ်နှိပ်၍ စမ်းပါ။");
                    }
                  }}
                >
                  {cue.en}
                </button>
              ))}
            </div>
          </details>
          {playError && (
            <p role="alert" lang="my" className="text-sm">
              {playError}
            </p>
          )}
        </div>
      )}
      {failed && (
        <div role="alert" lang="my" className="space-y-2 text-sm">
          <p>
            အသံဖိုင် ဖွင့်မရပါ။ အင်တာနက်ချိတ်ဆက်မှု စစ်ပြီး ပြန်ဖွင့်ပါ၊ သို့မဟုတ် MP3 ကို ရယူပါ။
          </p>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-2"
            onClick={() => {
              setFailed(false);
              audioRef.current?.load();
            }}
          >
            ပြန်ဖွင့်မည်
          </button>
        </div>
      )}
    </section>
  );
}
