import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { SyncedListeningPlayer } from "@/components/lesson/SyncedListeningPlayer";
import { SpeakingPractice } from "@/components/lesson/SpeakingPractice";
import { LISTENING_SCRIPTS } from "@/data/listeningScripts";

type LessonAudioPlayerProps = {
  /** Recorded track for the lesson, when one has been uploaded. */
  src?: string | null;
  /** Fallback script — spoken by the model voice when no recording exists. */
  script: string;
  label: string;
  hint?: string;
  /** Unit number — enables the live sentence-by-sentence script when available. */
  unit?: number;
};

/**
 * Clean audio player used by the Listening / Speaking workspaces.
 * Plays the stored track when available, otherwise synthesises a model
 * pronunciation track from the transcript.
 */
export function LessonAudioPlayer({ src, script, label, hint, unit }: LessonAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const synced = unit ? LISTENING_SCRIPTS[unit] : undefined;
  if (src && synced) {
    if (label === "Model pronunciation" && unit) {
      return (
        <SpeakingPractice unit={unit} src={src} script={synced} />
      );
    }
    return <SyncedListeningPlayer src={src} script={synced} label={label} hint={hint} />;
  }

  if (src) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <Volume2 className="h-3.5 w-3.5" /> {label}
        </div>
        <audio controls preload="none" className="w-full" src={src}>
          Your browser does not support audio playback.
        </audio>
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  }

  const toggle = async () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (audioRef.current && urlRef.current) {
      void audioRef.current.play();
      setPlaying(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script.slice(0, 2500), speed: 1 }),
      });
      if (!res.ok) throw new Error(await res.text());
      const url = URL.createObjectURL(await res.blob());
      urlRef.current = url;
      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      audioRef.current = audio;
      await audio.play();
      setPlaying(true);
    } catch (err) {
      console.error("[lesson-audio]", err);
      toast.error("Couldn't load the audio right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        <Volume2 className="h-3.5 w-3.5" /> {label}
      </div>
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={loading}
        className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-left transition hover:bg-primary/15 disabled:opacity-60"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">
            {playing ? "Playing model pronunciation…" : "Play model pronunciation"}
          </span>
          <span className="block text-xs text-muted-foreground">
            {hint ?? "နမူနာ အသံထွက်ကို နားထောင်ပြီး လိုက်ဆိုကြည့်ပါ။"}
          </span>
        </span>
      </button>
    </div>
  );
}
