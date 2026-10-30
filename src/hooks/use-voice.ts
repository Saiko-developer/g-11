import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Minimal Web Speech API types (not in lib.dom for all TS configs)
type SpeechRecognitionResult = {
  0: { transcript: string };
  isFinal: boolean;
};
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResult };
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(opts: {
  lang?: string;
  silenceMs?: number;
  onFinal: (text: string) => void;
  onInterim?: (text: string) => void;
  onSilence?: () => void;
}) {
  const { lang, silenceMs = 2500, onFinal, onInterim, onSilence } = opts;
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFinalRef = useRef(onFinal);
  const onInterimRef = useRef(onInterim);
  const onSilenceRef = useRef(onSilence);
  onFinalRef.current = onFinal;
  onInterimRef.current = onInterim;
  onSilenceRef.current = onSilence;

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const armSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      try {
        recRef.current?.stop();
      } catch {
        // ignore
      }
      onSilenceRef.current?.();
    }, silenceMs);
  }, [silenceMs, clearSilenceTimer]);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    if (recRef.current) {
      try {
        recRef.current.abort();
      } catch {
        // ignore
      }
    }
    const rec = new Ctor();
    rec.lang = lang ?? "my-MM";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      if (interimText && onInterimRef.current) onInterimRef.current(interimText);
      if (finalText) onFinalRef.current(finalText.trim());
      armSilenceTimer();
    };
    rec.onerror = () => {
      clearSilenceTimer();
      setListening(false);
    };
    rec.onend = () => {
      clearSilenceTimer();
      setListening(false);
    };
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
      armSilenceTimer();
    } catch {
      setListening(false);
    }
  }, [lang, armSilenceTimer, clearSilenceTimer]);

  const stop = useCallback(() => {
    clearSilenceTimer();
    try {
      recRef.current?.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, [clearSilenceTimer]);


  useEffect(() => () => stop(), [stop]);

  return { listening, supported, start, stop };
}

// Cloud TTS via /api/tts (Lovable AI Gateway → Gemini TTS, natural Burmese).
// Native window.speechSynthesis does not support Burmese in most browsers,
// so we always route audio through the multilingual cloud model.
export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && typeof Audio !== "undefined");
  }, []);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        // ignore
      }
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    reqIdRef.current += 1; // invalidate any in-flight request
    cleanup();
    setSpeaking(false);
  }, [cleanup]);

  const speak = useCallback(
    async (
      text: string,
      opts?: { lang?: string; speed?: number; onStart?: () => void },
    ) => {
      if (typeof window === "undefined") return;

      // Strip markdown/table noise while keeping Burmese + English characters.
      const cleaned = text
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\|/g, " ")
        .replace(/[*_`#>]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
      if (!cleaned) return;

      let payload = cleaned;
      if (opts?.lang) {
        const BURMESE = /[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/;
        const wantBurmese = opts.lang === "my-MM" || opts.lang.startsWith("my");
        const parts: string[] = [];
        let buf = "";
        let bufIsBurmese: boolean | null = null;
        for (const ch of cleaned) {
          const isB = BURMESE.test(ch);
          if (bufIsBurmese === null) bufIsBurmese = isB;
          if (isB !== bufIsBurmese) {
            if (bufIsBurmese === wantBurmese && buf.trim()) parts.push(buf.trim());
            buf = ch;
            bufIsBurmese = isB;
          } else {
            buf += ch;
          }
        }
        if (bufIsBurmese === wantBurmese && buf.trim()) parts.push(buf.trim());
        payload = parts.join(" ").trim();
      }
      if (!payload) {
        // Nothing to actually speak — still fire onStart so UI can proceed.
        opts?.onStart?.();
        return;
      }

      stop();
      const myId = ++reqIdRef.current;
      setSpeaking(true);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: payload,
            voice: "alloy",
            speed: opts?.speed ?? 1.1,
          }),
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          throw new Error(`TTS ${res.status}${detail ? `: ${detail}` : ""}`);
        }
        const blob = await res.blob();
        if (myId !== reqIdRef.current) return;
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        let started = false;
        const fireStart = () => {
          if (started) return;
          started = true;
          if (myId === reqIdRef.current) opts?.onStart?.();
        };
        audio.onplaying = fireStart;
        audio.onended = () => {
          if (myId === reqIdRef.current) {
            setSpeaking(false);
            cleanup();
          }
        };
        audio.onerror = () => {
          if (myId === reqIdRef.current) {
            fireStart(); // reveal UI even if audio fails
            setSpeaking(false);
            cleanup();
          }
        };
        await audio.play();
        fireStart();
      } catch (err) {
        console.error("[tts] failed", err);
        const msg = err instanceof Error ? err.message : String(err);
        if (/TTS 402/.test(msg)) {
          toast.error("အသံဖန်တီးမှု ခဏ ရပ်နားထားပါသည်", {
            description: "AI credits ကုန်ဆုံးနေပါသည်။ ထပ်မံဖြည့်ပြီးမှ အသံပြန်ရပါမည်။",
            duration: 8000,
          });
        } else if (/TTS 4\d\d|TTS 5\d\d/.test(msg)) {
          toast.error("အသံ ဖွင့်၍ မရပါ", {
            description: "ခဏနေ ပြန်ကြိုးစားကြည့်ပါ။",
          });
        }
        if (myId === reqIdRef.current) {
          opts?.onStart?.(); // don't block UI on TTS failure
          setSpeaking(false);
          cleanup();
        }
      }
    },
    [cleanup, stop],
  );

  useEffect(() => () => stop(), [stop]);

  return { speak, stop, speaking, supported };
}
