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
          ? "နားထောင်လေ့ကျင့်ရန် ပေးထားသော အသံဖိုင်အပြည့်အစုံ ဖြစ်ပါသည်။ Speaking စာကြောင်းတစ်ကြောင်းချင်းနှင့် အချိန်ကိုက် ချိတ်ထားခြင်း မရှိပါ။"
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
