import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GRADE11_SPEAKING_LINES, type Grade11SpeakingLine } from "@/data/grade11/speakingPractice";
import { grade11SpeakingMatch } from "@/lib/grade11SpeakingScore";
import { useSpeechRecognition } from "@/hooks/use-voice";

type PracticeState = { drafts: Record<string, string>; completed: string[] };
const EMPTY_LINES: Grade11SpeakingLine[] = [];
const emptyState = (): PracticeState => ({ drafts: {}, completed: [] });

/** Grade 11 only. Existing lesson controls and all Grade 10/AI endpoints keep their behavior. */
export function Grade11SpeakingPractice({ unit, children }: { unit: number; children: ReactNode }) {
  const [mode, setMode] = useState<"lesson" | "practice">("lesson");
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
      </nav>
      {mode === "lesson" && <div>{children}</div>}
      {mode === "practice" && <PracticePanel key={unit} unit={unit} />}
    </div>
  );
}

function PracticePanel({ unit }: { unit: number }) {
  const lines = GRADE11_SPEAKING_LINES[unit] ?? EMPTY_LINES;
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
  const storageKey = `grade11:speaking:${unit}:shadow:v1`;

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
    };
  }, [storageKey, lines]);

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
    setPlaying(false);
  };
  const play = () => {
    if (!line || !voiceAvailable) return;
    recognition.stop();
    finishRecording();
    stopModel();
    setMessage("");
    const id = ++playId.current;
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
          မူရင်းစာအုပ်ပါ စကားရပ်နှင့် မေးခွန်းများကို လေ့ကျင့်ပါ။ နားထောင်ရန်အသံသည် browser ၏
          စက်အသံဖြစ်ပြီး မူရင်းအသံဖိုင် မဟုတ်ပါ။
        </p>
        <p lang="my" className="text-sm text-muted-foreground">
          ရာခိုင်နှုန်းသည် ကြားရသောစာသားနှင့် ကိုက်ညီမှုကိုသာ ဖော်ပြသည်။ အသံထွက်၊ လေယူလေသိမ်း
          အကဲဖြတ်အမှတ် မဟုတ်ပါ။
        </p>
        <p className="text-sm font-medium">
          လေ့ကျင့်ပြီး {state.completed.length} / {lines.length}
        </p>
      </header>
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
          <p lang="en" className="text-lg font-semibold leading-relaxed">
            {line.en}
          </p>
          {showMy && (
            <p lang="my" className="text-sm leading-relaxed text-muted-foreground">
              {line.my}
            </p>
          )}
          <p className="text-xs text-muted-foreground">Textbook page {line.page - 5}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setShowMy((old) => !old)}>
            {showMy ? "မြန်မာပြန် ဝှက်မယ်" : "မြန်မာပြန် ပြမယ်"}
          </Button>
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
          <Button type="button" disabled={!voiceAvailable} onClick={playing ? stopModel : play}>
            {playing ? "အသံရပ်မည်" : "စက်အသံ နားထောင်မည်"}
          </Button>
        </div>
        {!voiceAvailable && (
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
