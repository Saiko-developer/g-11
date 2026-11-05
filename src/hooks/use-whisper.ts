import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Whisper-backed speech recognition with the same shape as useSpeechRecognition.
 * Records the mic with MediaRecorder, detects end-of-speech with a volume meter,
 * then transcribes the whole clip via /api/transcribe.
 *
 * Flow per utterance: speech detected → `silenceMs` of quiet → transcribe →
 * onFinal(text) (if any) → onSilence(). `listening` stays true until then, so
 * callers never see a gap while the clip is being transcribed.
 */
export function useWhisperRecognition(opts: {
  /** "en" | "my" — omitted lets the server use its default (Burmese + English). */
  lang?: string;
  /** Extra hint for the transcriber (e.g. "speaking"). */
  context?: string;
  silenceMs?: number;
  /** When true, a manual stop() transcribes what was recorded and calls onFinal. */
  flushOnStop?: boolean;
  onFinal: (text: string) => void;
  onInterim?: (text: string) => void;
  onSilence?: () => void;
}) {
  const { lang, context, silenceMs = 2200, flushOnStop = false } = opts;
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const cbRef = useRef(opts);
  cbRef.current = opts;

  const runRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const capturingRef = useRef(false);
  const busyRef = useRef(false);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        typeof window.MediaRecorder !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia,
    );
  }, []);

  const teardown = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    try {
      if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    } catch {
      // ignore
    }
    recRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    capturingRef.current = false;
  }, []);

  const transcribe = useCallback(
    async (blob: Blob, type: string): Promise<string> => {
      if (blob.size < 2048) return "";
      const ext = type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : "webm";
      const form = new FormData();
      form.append("file", blob, `recording.${ext}`);
      if (lang) form.append("language", lang.slice(0, 2));
      if (context) form.append("context", context);
      try {
        const res = await fetch("/api/transcribe", { method: "POST", body: form });
        if (!res.ok) throw new Error(`transcribe ${res.status}`);
        const data = (await res.json()) as { text?: string };
        return (data.text ?? "").trim();
      } catch (err) {
        console.error("[whisper] transcription failed", err);
        return "";
      }
    },
    [lang, context],
  );

  /** Stops recording and resolves with the captured clip. */
  const finishRecording = useCallback((): Promise<{ blob: Blob; type: string } | null> => {
    const rec = recRef.current;
    if (!rec || rec.state === "inactive") {
      teardown();
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      const chunks = (rec as MediaRecorder & { _chunks?: Blob[] })._chunks ?? [];
      rec.onstop = () => {
        const type = rec.mimeType || "audio/webm";
        resolve({ blob: new Blob(chunks, { type }), type });
      };
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      try {
        rec.stop();
      } catch {
        resolve(null);
      }
      // Release mic + meter after the recorder flushes.
      setTimeout(teardown, 0);
    });
  }, [teardown]);

  const start = useCallback(async () => {
    const run = ++runRef.current;
    teardown();
    busyRef.current = false;
    setListening(true);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      console.warn("[whisper] mic denied", err);
      if (run === runRef.current) setListening(false);
      return;
    }
    if (run !== runRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    streamRef.current = stream;

    const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find(
      (m) => MediaRecorder.isTypeSupported?.(m),
    );
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];
    (rec as MediaRecorder & { _chunks?: Blob[] })._chunks = chunks;
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    rec.start(250);
    recRef.current = rec;

    // Volume meter for end-of-speech detection.
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    const startedAt = Date.now();
    let noise = 0.01;
    let lastVoice = 0;
    let voicedMs = 0;

    const endUtterance = async () => {
      if (busyRef.current) return;
      busyRef.current = true;
      const clip = await finishRecording();
      const text = clip ? await transcribe(clip.blob, clip.type) : "";
      if (run !== runRef.current) return;
      busyRef.current = false;
      capturingRef.current = false;
      if (text) cbRef.current.onFinal(text);
      else cbRef.current.onInterim?.("");
      setListening(false);
      cbRef.current.onSilence?.();
    };

    timerRef.current = window.setInterval(() => {
      if (run !== runRef.current) return;
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length);
      const now = Date.now();
      // Calibrate background noise during the first 400ms.
      if (now - startedAt < 400) {
        noise = Math.max(noise, rms);
        return;
      }
      const loud = rms > Math.max(0.02, noise * 2.2);
      if (loud) {
        voicedMs += 100;
        lastVoice = now;
        if (voicedMs >= 200 && !capturingRef.current) {
          capturingRef.current = true;
          cbRef.current.onInterim?.("…");
        }
      }
      const tooLong = now - startedAt > 60000;
      if (capturingRef.current && (now - lastVoice >= silenceMs || tooLong)) void endUtterance();
    }, 100);
  }, [teardown, finishRecording, transcribe, silenceMs]);

  const stop = useCallback(() => {
    const run = ++runRef.current;
    const hadSpeech = capturingRef.current;
    if (flushOnStop && hadSpeech && recRef.current) {
      void (async () => {
        const clip = await finishRecording();
        setListening(false);
        const text = clip ? await transcribe(clip.blob, clip.type) : "";
        if (run !== runRef.current) return;
        if (text) cbRef.current.onFinal(text);
        else cbRef.current.onInterim?.("");
      })();
      return;
    }
    teardown();
    busyRef.current = false;
    setListening(false);
  }, [flushOnStop, finishRecording, transcribe, teardown]);

  /** True while the student is mid-sentence or the clip is being transcribed. */
  const isCapturing = useCallback(() => capturingRef.current || busyRef.current, []);

  useEffect(
    () => () => {
      runRef.current++;
      teardown();
    },
    [teardown],
  );

  return { listening, supported, start, stop, isCapturing };
}
