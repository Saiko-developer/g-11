import { RequireSignIn } from "@/components/RequireSignIn";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, PhoneOff, Volume2, X } from "lucide-react";
import { toast } from "sonner";

import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import tutorLogo from "@/assets/tutor-logo.png";
import { Button } from "@/components/ui/button";
import { EXAM_UPLOAD_MESSAGE, fileToDataUrl, onExamUpload } from "@/lib/examUpload";
import { takeSpeakableChunks } from "@/lib/voice-sentences";

/**
 * Voice-only Sayar Owl popup. Students talk in Burmese/English; Sayar Owl
 * answers out loud in Burmese, sentence by sentence. Typed chat lives on /tutor.
 */

function readActiveSectionText(): string | null {
  const el = document.querySelector("[data-saya-home-section]");
  const text = el?.textContent?.replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.length > 12000 ? `${text.slice(0, 12000)}…` : text;
}

type SayaOwlHomeProps = { lessonContext: string };
type Attachment = { name: string; mediaType: string; url: string };
type Phase = "idle" | "listening" | "thinking" | "speaking" | "muted";

const FIRST_CHUNK = 40;
const NEXT_CHUNK = 200;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** One TTS request at a time, with backoff on 429/5xx so the voice isn't silently dropped. */
async function fetchSpeech(text: string): Promise<{ text: string; url: string | null }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (r.ok) return { text, url: URL.createObjectURL(await r.blob()) };
      if (r.status !== 429 && r.status < 500) break;
      const retryAfter = Number(r.headers.get("Retry-After"));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : 1500 * 2 ** attempt + Math.random() * 400);
    } catch {
      await sleep(1000 * 2 ** attempt);
    }
  }
  return { text, url: null };
}

function SayaOwlHomeInner({ lessonContext }: SayaOwlHomeProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [heardSpeech, setHeardSpeech] = useState(false);
  const [studentLine, setStudentLine] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat-home", fetch: tutorFetch }));
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (err) => {
      console.error("[saya-owl-voice]", err);
      toast.error("ဆရာ ခဏ မဖြေနိုင်ပါ", { description: "ခဏနေ ပြန်မေးကြည့်ပါ။" });
    },
  });

  const activeRef = useRef(false);
  const mutedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const vadRef = useRef<{ ctx: AudioContext; timer: number } | null>(null);
  const textQueueRef = useRef<string[]>([]);
  const nextFetchRef = useRef<Promise<{ text: string; url: string | null }> | null>(null);
  const speakingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceFailedRef = useRef(false);
  const turnRef = useRef({ active: false, offset: 0, done: false, userCount: 0 });

  /* ----------------------------- speaking ----------------------------- */
  const playUrl = (url: string) =>
    new Promise<void>((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      const done = () => {
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) audioRef.current = null;
        resolve();
      };
      audio.onended = done;
      audio.onerror = done;
      audio.onpause = () => { if (!activeRef.current) done(); };
      audio.play().catch(done);
    });

  const maybeFinishTurn = () => {
    const t = turnRef.current;
    if (!activeRef.current || speakingRef.current) return;
    if (t.active && t.done && textQueueRef.current.length === 0 && !nextFetchRef.current) {
      t.active = false;
      if (voiceFailedRef.current) {
        toast.error("ဆရာ့အသံ ခဏ မထွက်နိုင်ပါ", { description: "အသံစနစ် အလုပ်များနေပါတယ်။ ခဏနေ ပြန်မေးပါ။" });
      }
      listenRef.current();
    }
  };

  const pump = async () => {
    if (speakingRef.current) return;
    speakingRef.current = true;
    try {
      while (activeRef.current && (nextFetchRef.current || textQueueRef.current.length)) {
        const pending = nextFetchRef.current ?? fetchSpeech(textQueueRef.current.shift()!);
        nextFetchRef.current = null;
        const { text, url } = await pending;
        // Prefetch only one sentence ahead to stay inside the rate limit.
        if (textQueueRef.current.length) nextFetchRef.current = fetchSpeech(textQueueRef.current.shift()!);
        if (!activeRef.current) break;
        setSubtitle(text.replace(/[*#>`_]/g, ""));
        if (!url) { voiceFailedRef.current = true; continue; }
        setPhase("speaking");
        await playUrl(url);
      }
    } finally {
      speakingRef.current = false;
    }
    maybeFinishTurn();
  };

  const enqueueSpeech = (text: string) => {
    textQueueRef.current.push(text);
    void pump();
  };

  /* ----------------------------- listening ---------------------------- */
  const stopVad = () => {
    if (!vadRef.current) return;
    window.clearInterval(vadRef.current.timer);
    void vadRef.current.ctx.close().catch(() => {});
    vadRef.current = null;
  };

  const releaseMic = () => {
    stopVad();
    try { if (recorderRef.current?.state === "recording") recorderRef.current.stop(); } catch { /* ignore */ }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const transcribe = async (blob: Blob): Promise<string | null> => {
    if (blob.size < 2048) return null;
    try {
      const form = new FormData();
      form.append("file", blob, "recording.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!res.ok) throw new Error(`transcribe ${res.status}`);
      const data = (await res.json()) as { text?: string };
      return (data.text ?? "").trim() || null;
    } catch (err) {
      console.error("[saya-owl-voice] transcription failed", err);
      toast.error("အသံကို နားမလည်နိုင်ပါ", { description: "ပြန်ပြောကြည့်ပါ။" });
      return null;
    }
  };

  const sendTurn = (text: string, file?: Attachment) => {
    voiceFailedRef.current = false;
    textQueueRef.current = [];
    turnRef.current = { active: true, offset: 0, done: false, userCount: -1 };
    setPhase("thinking");
    setSubtitle("");
    void sendMessage(
      {
        text,
        ...(file ? { files: [{ type: "file" as const, mediaType: file.mediaType, filename: file.name, url: file.url }] } : {}),
      },
      { body: { mode: "voice", lessonContext, sectionContent: readActiveSectionText(), hasUpload: Boolean(file) } },
    );
  };

  const listenOnce = async () => {
    if (!activeRef.current || mutedRef.current) return;
    setPhase("listening");
    setHeardSpeech(false);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      toast.error("မိုက်ခရိုဖုန်း ခွင့်ပြုချက် မရပါ", { description: "Browser ရဲ့ address bar မှာ microphone ကို Allow လုပ်ပေးပါ။" });
      endCallRef.current();
      return;
    }
    if (!activeRef.current || mutedRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
    streamRef.current = stream;
    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((t) =>
      MediaRecorder.isTypeSupported(t),
    );
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;
    const chunks: Blob[] = [];
    let spoke = false;
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = async () => {
      stopVad();
      stream.getTracks().forEach((t) => t.stop());
      if (streamRef.current === stream) streamRef.current = null;
      if (recorderRef.current === recorder) recorderRef.current = null;
      if (!activeRef.current || mutedRef.current) return;
      if (!spoke) { listenRef.current(); return; }
      setPhase("thinking");
      const text = await transcribe(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
      if (!activeRef.current) return;
      if (!text) { listenRef.current(); return; }
      setStudentLine(text);
      sendTurn(text);
    };
    recorder.start();

    // Voice activity detection: stop ~1.2s after the student stops talking.
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const startedAt = Date.now();
    let lastVoice = Date.now();
    const timer = window.setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += ((v - 128) / 128) ** 2;
      const rms = Math.sqrt(sum / data.length);
      const now = Date.now();
      if (rms > 0.035) {
        lastVoice = now;
        if (!spoke) { spoke = true; setHeardSpeech(true); }
      }
      if ((spoke && now - lastVoice > 1200) || now - startedAt > 45000 || (!spoke && now - startedAt > 20000)) {
        if (recorder.state === "recording") recorder.stop();
      }
    }, 100);
    vadRef.current = { ctx, timer };
  };
  const listenRef = useRef<() => void>(() => {});
  listenRef.current = () => void listenOnce();

  /* ------------------------------ call ------------------------------- */
  const endCall = () => {
    activeRef.current = false;
    mutedRef.current = false;
    turnRef.current.active = false;
    releaseMic();
    audioRef.current?.pause();
    audioRef.current = null;
    textQueueRef.current = [];
    nextFetchRef.current = null;
    setPhase("idle");
    setSubtitle("");
    setStudentLine("");
  };
  const endCallRef = useRef(endCall);
  endCallRef.current = endCall;

  const startCall = () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error("ဒီ browser က အသံဖြင့် စကားပြောခြင်းကို မထောက်ပံ့ပါ");
      return false;
    }
    activeRef.current = true;
    mutedRef.current = false;
    return true;
  };

  const openCall = () => {
    setOpen(true);
    if (startCall()) void listenOnce();
  };

  const closeCall = () => {
    endCall();
    setOpen(false);
  };

  const toggleMute = () => {
    if (mutedRef.current) {
      mutedRef.current = false;
      if (!turnRef.current.active && !speakingRef.current) void listenOnce();
      else setPhase(speakingRef.current ? "speaking" : "thinking");
    } else {
      mutedRef.current = true;
      releaseMic();
      setPhase("muted");
    }
  };

  // Exam paper upload from the home page: Sayar Owl explains it out loud.
  useEffect(
    () =>
      onExamUpload(async (file) => {
        try {
          const url = await fileToDataUrl(file);
          setOpen(true);
          if (!startCall()) return;
          releaseMic();
          setStudentLine(`📄 ${file.name}`);
          sendTurn(EXAM_UPLOAD_MESSAGE, { name: file.name, mediaType: file.type || "application/octet-stream", url });
        } catch {
          toast.error("ဖိုင် ဖတ်၍ မရပါ", { description: "ဖိုင်ကို ပြန်ရွေးကြည့်ပါ။" });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Turn the streaming reply into speech sentence by sentence.
  useEffect(() => {
    const t = turnRef.current;
    if (!activeRef.current || !t.active || t.done) return;
    const last = messages[messages.length - 1];
    if (t.userCount === -1) {
      if (last?.role === "user") t.userCount = messages.length;
      return;
    }
    if (status === "error") { t.done = true; maybeFinishTurn(); return; }
    if (!last || last.role !== "assistant" || messages.length <= t.userCount) return;
    const body = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    const final = status === "ready";
    const { chunks, next } = takeSpeakableChunks(body, t.offset, final, t.offset === 0 ? FIRST_CHUNK : NEXT_CHUNK);
    t.offset = next;
    chunks.forEach(enqueueSpeech);
    if (final) { t.done = true; maybeFinishTurn(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status]);

  useEffect(() => () => endCallRef.current(), []);

  const statusLabel: Record<Phase, string> = {
    idle: "ခလုတ်နှိပ်ပြီး ဆရာနဲ့ စကားပြောပါ",
    listening: heardSpeech ? "ကြားနေပါတယ်… ပြောပြီးရင် ခဏ ရပ်လိုက်ပါ" : "နားထောင်နေပါတယ်… မေးလိုက်ပါ",
    thinking: "ဆရာ စဉ်းစားနေပါတယ်…",
    speaking: "ဆရာ ရှင်းပြနေပါတယ်…",
    muted: "မိုက် ပိတ်ထားပါတယ်",
  };
  const ring =
    phase === "listening" ? "ring-primary" : phase === "speaking" ? "ring-accent" : phase === "thinking" ? "ring-secondary" : "ring-border";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openCall}
          aria-label="Talk to Sayar Owl"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary py-2 pl-2 pr-5 text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <img src={tutorLogo} alt="" className="h-10 w-10 rounded-full bg-card object-cover" />
          <Mic className="h-4 w-4" />
          <span className="text-sm font-semibold">ဆရာနှင့် စကားပြောမည်</span>
        </button>
      )}

      {open && (
        <aside className="fixed bottom-5 right-5 z-50 flex w-[min(94vw,360px)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between px-5 pt-4">
            <div>
              <p className="text-sm font-semibold">Sayar Owl</p>
              <p className="text-[11px] text-muted-foreground">အသံဖြင့် မေးပါ · မြန်မာ / English</p>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCall} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="flex flex-col items-center px-6 pb-4 pt-6 text-center">
            <div className="relative">
              {(phase === "listening" || phase === "speaking") && (
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              )}
              <img
                src={tutorLogo}
                alt="Sayar Owl"
                className={`relative h-28 w-28 rounded-full bg-secondary object-cover ring-4 ring-offset-4 ring-offset-card transition ${ring}`}
              />
            </div>

            <div className="mt-5 flex h-6 items-end gap-1" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full bg-primary transition-all ${
                    phase === "speaking" || (phase === "listening" && heardSpeech) ? "animate-pulse" : "opacity-30"
                  }`}
                  style={{ height: phase === "speaking" || heardSpeech ? `${8 + ((i * 7) % 16)}px` : "6px", animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm font-medium">
              {phase === "thinking" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {phase === "speaking" && <Volume2 className="h-4 w-4 text-primary" />}
              {statusLabel[phase]}
            </p>

            {studentLine && (
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">သင်: “{studentLine}”</p>
            )}
            {subtitle && (
              <p className="mt-2 line-clamp-3 rounded-xl bg-secondary/60 px-3 py-2 text-sm leading-relaxed">{subtitle}</p>
            )}
          </div>

          <div className="px-5"><TutorQuotaBar compact /></div>

          <div className="flex items-center justify-center gap-6 px-5 py-5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="h-12 w-12 rounded-full"
              aria-label={phase === "muted" ? "Unmute" : "Mute"}
            >
              {phase === "muted" ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={closeCall}
              className="h-14 w-14 rounded-full"
              aria-label="End conversation"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </aside>
      )}
    </>
  );
}

export function SayaOwlHome(props: SayaOwlHomeProps) {
  return <RequireSignIn><SayaOwlHomeInner {...props} /></RequireSignIn>;
}
