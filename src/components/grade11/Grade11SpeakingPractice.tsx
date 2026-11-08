import { getGrade11Captions, GRADE11_TRANSCRIPTS } from "@/lib/grade11Captions";
import tracks from "@/data/grade11/listeningAudio.json";
import { useGrade11CaptionClock } from "./useGrade11CaptionClock";
import { Grade11CaptionText } from "./Grade11CaptionText";
import { Grade11RequireSignIn as RequireSignIn } from "./Grade11RequireSignIn";
import { Grade11RolePlay } from "./Grade11RolePlay";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GRADE11_SPEAKING_LINES, type Grade11SpeakingLine } from "@/data/grade11/speakingPractice";
import { grade11SpeakingMatch } from "@/lib/grade11SpeakingScore";
import { useSpeechRecognition } from "@/hooks/use-voice";

type PracticeState = { drafts: Record<string, string>; completed: string[] };
type PracticeLine = Grade11SpeakingLine & { start?: number; end?: number };
const EMPTY_LINES: PracticeLine[] = [];
const RECORDING_LINES: Record<number, PracticeLine[]> = Object.fromEntries(
  Object.entries(GRADE11_TRANSCRIPTS).map(([unit, transcript]) => [
    unit,
    transcript.cues.map((cue) => ({
      id: cue.id,
      en: cue.en,
      my: cue.my ?? "",
      page: 0,
      start: cue.start,
      end: cue.end,
    })),
  ]),
);
const emptyState = (): PracticeState => ({ drafts: {}, completed: [] });

/** Grade 11 only. Existing lesson controls and Grade 10 endpoints keep their behavior. */
export function Grade11SpeakingPractice({ unit, children }: { unit: number; children: ReactNode }) {
  const [mode, setMode] = useState<"lesson" | "practice" | "roleplay">("lesson");
  return (
    <div className="mt-5 space-y-5">
      <nav
        aria-label="Grade 11 speaking modes"
        className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-3"
      >
        <Button
          type="button"
          variant={mode === "lesson" ? "default" : "outline"}
          aria-pressed={mode === "lesson"}
          onClick={() => setMode("lesson")}
        >
          📖 သင်ခန်းစာ
        </Button>
        <Button
          type="button"
          variant={mode === "practice" ? "default" : "outline"}
          aria-pressed={mode === "practice"}
          onClick={() => setMode("practice")}
        >
          🎯 လိုက်ဆို
        </Button>
        <Button
          type="button"
          variant={mode === "roleplay" ? "default" : "outline"}
          aria-pressed={mode === "roleplay"}
          onClick={() => setMode("roleplay")}
        >
          💬 AI စကားပြော
        </Button>
      </nav>
      {mode === "lesson" && <div>{children}</div>}
      {mode === "practice" && <ShadowingModes key={unit} unit={unit} />}
      {mode === "roleplay" && (
        <RequireSignIn>
          <Grade11RolePlay key={unit} unit={unit} />
        </RequireSignIn>
      )}
    </div>
  );
}

function ShadowingModes({ unit }: { unit: number }) {
  const [source, setSource] = useState<"recording" | "textbook">("recording");
  return (
    <div className="space-y-3">
      <nav aria-label="Shadowing source" className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={source === "recording" ? "default" : "outline"}
          aria-pressed={source === "recording"}
          onClick={() => setSource("recording")}
        >
          🎧 မူရင်းအသံ
        </Button>
        <Button
          type="button"
          variant={source === "textbook" ? "default" : "outline"}
          aria-pressed={source === "textbook"}
          onClick={() => setSource("textbook")}
        >
          📖 စာအုပ်စကားရပ်
        </Button>
      </nav>
      <PracticePanel key={`${unit}:${source}`} unit={unit} recorded={source === "recording"} />
    </div>
  );
}

function PracticePanel({ unit, recorded = false }: { unit: number; recorded?: boolean }) {
  const lines: PracticeLine[] =
    (recorded ? RECORDING_LINES[unit] : GRADE11_SPEAKING_LINES[unit]) ?? EMPTY_LINES;
  const audioRef = useRef<HTMLAudioElement>(null);
  const stopAt = useRef<number | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const cues = getGrade11Captions(recorded ? unit : -1);
  const active = useGrade11CaptionClock(audioRef, cues, stopAt);
  const track = tracks.find((item) => item.unit === unit);
  const [index, setIndex] = useState(0);
  const line = lines[index];
  const [state, setState] = useState<PracticeState>(emptyState);
  const stateRef = useRef<PracticeState>(emptyState());
  const [loaded, setLoaded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showMy, setShowMy] = useState(true);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("");
  const playId = useRef(0);
  const recordingId = useRef<string | null>(null);
  const buffer = useRef("");
  const interim = useRef("");
  const storageKey = recorded
    ? `grade11:speaking:${unit}:recording:v1`
    : `grade11:speaking:${unit}:shadow:v1`;

  const persist = (next: PracticeState) => {
    stateRef.current = next;
    setState(next);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* In-memory fallback. */
    }
  };
  useEffect(() => {
    const playback = playId;
    const audio = audioRef.current;
    if (audio) {
      if (!audio.getAttribute("src") && track) audio.src = track.src;
      setAudioReady(audio.readyState >= 1);
    }
    const restored = emptyState();
    try {
      const data: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "{}");
      if (data && typeof data === "object") {
        const raw = data as Partial<PracticeState>;
        if (raw.drafts && typeof raw.drafts === "object" && !Array.isArray(raw.drafts))
          restored.drafts = Object.fromEntries(
            Object.entries(raw.drafts).filter(
              ([id, value]) => lines.some((item) => item.id === id) && typeof value === "string",
            ),
          );
        if (Array.isArray(raw.completed))
          restored.completed = [
            ...new Set(
              raw.completed.filter(
                (id): id is string =>
                  typeof id === "string" && Boolean(restored.drafts[id]?.trim()),
              ),
            ),
          ];
      }
    } catch {
      /* Storage is optional. */
    }
    stateRef.current = restored;
    setState(restored);
    setLoaded(true);
    setVoiceAvailable(
      typeof window.speechSynthesis !== "undefined" &&
        typeof window.SpeechSynthesisUtterance !== "undefined",
    );
    return () => {
      playback.current++;
      recordingId.current = null;
      window.speechSynthesis?.cancel();
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, [storageKey, lines, track]);

  const finishRecording = () => {
    const id = recordingId.current;
    if (!id) return;
    recordingId.current = null;
    setRecording(false);
    const spoken = `${buffer.current} ${interim.current}`.trim();
    if (!spoken) {
      setMessage("အသံမှ စာသားမရသေးပါ။ ထပ်ပြောကြည့်ပါ သို့မဟုတ် အောက်တွင် ရေးမှတ်နိုင်ပါသည်။");
      return;
    }
    const current = stateRef.current;
    persist({
      drafts: { ...current.drafts, [id]: spoken },
      completed: [...new Set([...current.completed, id])],
    });
  };
  const recognition = useSpeechRecognition({
    lang: "en-US",
    silenceMs: 2000,
    onFinal: (text) => {
      if (!recordingId.current) return;
      buffer.current = `${buffer.current} ${text}`.trim();
      interim.current = "";
      const current = stateRef.current;
      persist({
        drafts: { ...current.drafts, [recordingId.current]: buffer.current },
        completed: current.completed.filter((id) => id !== recordingId.current),
      });
    },
    onInterim: (text) => {
      if (!recordingId.current) return;
      interim.current = text;
      const current = stateRef.current;
      persist({
        drafts: { ...current.drafts, [recordingId.current]: `${buffer.current} ${text}`.trim() },
        completed: current.completed.filter((id) => id !== recordingId.current),
      });
    },
    onSilence: finishRecording,
  });
  useEffect(() => {
    if (recording && !recognition.listening) finishRecording();
  }, [recording, recognition.listening]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopModel = () => {
    playId.current++;
    window.speechSynthesis?.cancel();
    stopAt.current = null;
    audioRef.current?.pause();
    setPlaying(false);
  };
  const play = () => {
    if (!line || (!recorded && !voiceAvailable)) return;
    recognition.stop();
    finishRecording();
    stopModel();
    setMessage("");
    const id = ++playId.current;
    if (recorded && audioRef.current && line.start !== undefined && line.end !== undefined) {
      const audio = audioRef.current;
      stopAt.current = line.end;
      audio.currentTime = line.start;
      audio.playbackRate = speed;
      void audio.play().catch(() => {
        if (id !== playId.current) return;
        stopAt.current = null;
        setPlaying(false);
        setMessage("မူရင်းအသံဖိုင် ဖွင့်မရပါ။ ထပ်စမ်းနိုင်ပါသည်။");
      });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(line.en);
    utterance.lang = "en-US";
    utterance.rate = speed;
    const voice = window.speechSynthesis
      .getVoices()
      .find((item) => item.lang.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (id === playId.current) setPlaying(false);
    };
    utterance.onerror = (event) => {
      if (id !== playId.current) return;
      setPlaying(false);
      if (!["canceled", "interrupted"].includes(event.error))
        setMessage("စက်အသံ ဖွင့်မရပါ။ Browser ၏ အင်္ဂလိပ်အသံ ရရှိမှုကို စစ်ပါ။");
    };
    setPlaying(true);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setPlaying(false);
      setMessage("စက်အသံ ဖွင့်မရပါ။ စာကြောင်းကို ဖတ်၍ လေ့ကျင့်နိုင်ပါသည်။");
    }
  };
  const select = (next: number) => {
    recognition.stop();
    finishRecording();
    stopModel();
    setMessage("");
    setIndex(next);
  };
  const record = () => {
    if (!line || !recognition.supported) return;
    stopModel();
    setMessage("");
    buffer.current = "";
    interim.current = "";
    recordingId.current = line.id;
    recognition.start();
    setRecording(true);
  };
  if (!line) return <p lang="my">ဤအပိုင်းအတွက် လေ့ကျင့်စာကြောင်း မရှိသေးပါ။</p>;
  const value = state.drafts[line.id] ?? "";
  const result = state.completed.includes(line.id) ? grade11SpeakingMatch(line.en, value) : null;
  const update = (value: string) =>
    persist({
      drafts: { ...stateRef.current.drafts, [line.id]: value },
      completed: stateRef.current.completed.filter((id) => id !== line.id),
    });
  return (
    <section
      aria-label="Grade 11 shadowing practice"
      className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <header className="space-y-2">
        <h2 className="font-semibold">Grade 11 · Unit {unit} · လိုက်ဆိုလေ့ကျင့်ခြင်း</h2>
        <p lang="my" className="text-sm text-muted-foreground">
          {recorded
            ? "ပေးထားသော Listening MP3 မှ တစ်ကြောင်းချင်း နားထောင်ပြီး လိုက်ဆိုပါ။ စာတန်းနှင့် အချိန်ကိုက်မှုကို စက်ဖြင့် ထုတ်ထားသဖြင့် အမှားအယွင်း ရှိနိုင်ပါသည်။"
            : "မူရင်းစာအုပ်ပါ စကားရပ်နှင့် မေးခွန်းများကို လေ့ကျင့်ပါ။ နားထောင်ရန်အသံသည် browser ၏ စက်အသံဖြစ်ပြီး မူရင်းအသံဖိုင် မဟုတ်ပါ။"}
        </p>
        <p lang="my" className="text-sm text-muted-foreground">
          ရာခိုင်နှုန်းသည် ကြားရသောစာသားနှင့် ကိုက်ညီမှုကိုသာ ဖော်ပြသည်။ အသံထွက်၊ လေယူလေသိမ်း
          အကဲဖြတ်အမှတ် မဟုတ်ပါ။
        </p>
        <p className="text-sm font-medium">
          လေ့ကျင့်ပြီး {state.completed.length} / {lines.length}
        </p>
      </header>
      {recorded && track && (
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          aria-label={`Unit ${unit} original shadowing audio`}
          onLoadedMetadata={() => setAudioReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setAudioReady(false);
            setMessage("အသံဖိုင် ဖွင့်မရပါ။ အင်တာနက်ကို စစ်ပြီး ပြန်ဝင်ကြည့်ပါ။");
          }}
        />
      )}
      <fieldset disabled={!loaded} className="min-w-0 space-y-4">
        <legend className="sr-only">လိုက်ဆိုရန်စာကြောင်းများ</legend>
        <div
          aria-label="Practice sentences"
          className="flex max-h-44 flex-col gap-2 overflow-y-auto rounded-xl border border-border p-2"
        >
          {lines.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={i === index}
              disabled={recording}
              onClick={() => select(i)}
              className={`rounded-lg border p-3 text-left text-sm ${i === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <span lang="en">
                {i + 1}. {item.en}
              </span>
              {state.completed.includes(item.id) && (
                <span aria-label="Completed" className="ml-2 text-primary">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="space-y-3 rounded-xl bg-muted/40 p-4">
          {recorded && cues[index] ? (
            <Grade11CaptionText
              cue={cues[index]}
              wordIndex={active.cueIndex === index ? active.wordIndex : -1}
            />
          ) : (
            <p lang="en" className="text-lg font-semibold leading-relaxed">
              {line.en}
            </p>
          )}
          {showMy && line.my && (
            <p lang="my" className="text-sm leading-relaxed text-muted-foreground">
              {line.my}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {recorded
              ? `MP3 · ${line.start?.toFixed(1)}–${line.end?.toFixed(1)}s`
              : `Textbook page ${line.page - 5}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {line.my && (
            <Button type="button" variant="outline" onClick={() => setShowMy((old) => !old)}>
              {showMy ? "မြန်မာပြန် ဝှက်မယ်" : "မြန်မာပြန် ပြမယ်"}
            </Button>
          )}
          {[0.75, 1].map((rate) => (
            <Button
              key={rate}
              type="button"
              variant={speed === rate ? "default" : "outline"}
              disabled={playing || recording}
              aria-pressed={speed === rate}
              onClick={() => setSpeed(rate)}
            >
              {rate}x
            </Button>
          ))}
          <Button
            type="button"
            disabled={recorded ? !audioReady : !voiceAvailable}
            onClick={playing ? stopModel : play}
          >
            {playing ? "အသံရပ်မည်" : recorded ? "မူရင်းအသံ နားထောင်မည်" : "စက်အသံ နားထောင်မည်"}
          </Button>
        </div>
        {!recorded && !voiceAvailable && (
          <p lang="my" className="text-sm text-muted-foreground">
            ဤ browser တွင် စက်အသံ မရနိုင်ပါ။ စာကြောင်းကို ဖတ်၍ လေ့ကျင့်နိုင်ပါသည်။
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!recognition.supported}
            onClick={
              recording
                ? () => {
                    recognition.stop();
                    finishRecording();
                  }
                : record
            }
          >
            {recording ? "ပြောပြီးပြီ — ရပ်မည်" : "🎤 လိုက်ဆိုမည်"}
          </Button>
        </div>
        {!recognition.supported && (
          <p lang="my" className="text-sm text-muted-foreground">
            ဤ browser တွင် အသံမှ စာသားပြောင်းခြင်း မရနိုင်ပါ။ Chrome ဖြင့် စမ်းပါ သို့မဟုတ်
            ပြောခဲ့သောစာသားကို အောက်တွင် ရေးမှတ်ပါ။
          </p>
        )}
        <label className="block text-sm font-medium" htmlFor={`grade11-speaking-${unit}-heard`}>
          ပြောခဲ့သောစာသား / ကိုယ်တိုင်ရေးမှတ်ခြင်း
        </label>
        <Textarea
          id={`grade11-speaking-${unit}-heard`}
          maxLength={2000}
          rows={3}
          disabled={recording}
          value={value}
          onChange={(event) => update(event.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!value.trim() || recording}
          onClick={() =>
            persist({
              ...stateRef.current,
              completed: [...new Set([...stateRef.current.completed, line.id])],
            })
          }
        >
          စာသားကိုက်ညီမှု စစ်မည်
        </Button>
        {result && (
          <div
            role="status"
            aria-label="Text match result"
            className="space-y-3 rounded-xl border border-primary/30 p-3"
          >
            <p lang="my" className="font-semibold">
              စာသားကိုက်ညီမှု {result.percent}%
            </p>
            <p lang="en" className="flex flex-wrap gap-1">
              {result.words.map((word, i) => (
                <span
                  key={i}
                  className={`rounded px-2 py-1 ${word.matched ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground line-through"}`}
                >
                  {word.word}
                </span>
              ))}
            </p>
          </div>
        )}
        {message && (
          <p role="alert" lang="my" className="text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </fieldset>
    </section>
  );
}
