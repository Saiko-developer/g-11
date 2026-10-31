import { RequireSignIn } from "@/components/RequireSignIn";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import { SayaOwlAvatar } from "@/components/SayaOwlAvatar";
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

const FIRST_CHUNK = 30;
const SILENCE_MS = 2000;
/** Short Burmese acknowledgements played instantly while the real answer is prepared. */
const FILLERS = ["ဟုတ်ကဲ့ပါ… ဆရာ ကြည့်ပေးမယ်နော်။", "ကောင်းပြီ… သေချာ ရှင်းပြမယ်နော်။", "အေးပါ… ခဏလေး စဉ်းစားလိုက်ဦးမယ်။"];
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
  const fillerUrlsRef = useRef<Promise<string | null>[]>([]);
  const fillerIdxRef = useRef(0);
  const fillerDoneRef = useRef<Promise<void>>(Promise.resolve());

  const prepareFillers = () => {
    if (fillerUrlsRef.current.length) return;
    // Sequential to stay inside the rate limit.
    let chain: Promise<unknown> = Promise.resolve();
    fillerUrlsRef.current = FILLERS.map((t) => {
      const p = chain.then(() => fetchSpeech(t)).then((r) => r.url);
      chain = p;
      return p;
    });
  };

  const playFiller = async () => {
    const list = fillerUrlsRef.current;
    if (!list.length) return;
    const url = await Promise.race([list[fillerIdxRef.current++ % list.length], sleep(300).then(() => null)]);
    if (!url || !activeRef.current) return;
    await new Promise<void>((resolve) => {
      const a = new Audio(url);
      audioRef.current = a;
      const done = () => { if (audioRef.current === a) audioRef.current = null; resolve(); };
      a.onended = done; a.onerror = done;
      a.play().catch(done);
    });
  };

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
        await fillerDoneRef.current;
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
      fillerDoneRef.current = playFiller();
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
      if ((spoke && now - lastVoice > SILENCE_MS) || now - startedAt > 45000 || (!spoke && now - startedAt > 20000)) {
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
    prepareFillers();
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

  const tapOwl = () => {
    if (phase === "speaking") {
      // Interrupt Sayar Owl and let the student speak.
      textQueueRef.current = [];
      nextFetchRef.current = null;
      turnRef.current.active = false;
      audioRef.current?.pause();
      audioRef.current = null;
      setTimeout(() => void listenOnce(), 150);
      return;
    }
    toggleMute();
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
    idle: "ဆရာနဲ့ စကားပြောရန် နှိပ်ပါ",
    listening: heardSpeech ? "ကြားနေပါတယ်…" : "နားထောင်နေပါတယ်… မေးလိုက်ပါ",
    thinking: "ဆရာ စဉ်းစားနေပါတယ်…",
    speaking: "ဆရာ ရှင်းပြနေပါတယ်… (နှိပ်ပြီး ရပ်နိုင်)",
    muted: "ခဏရပ်ထားပါတယ် — နှိပ်ပြီး ပြန်စပါ",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {open && <TutorQuotaBar lowOnly />}
      {open && (subtitle || phase !== "idle") && (
        <p className="line-clamp-2 max-w-[260px] rounded-2xl bg-card/95 px-3 py-1.5 text-xs leading-relaxed text-foreground shadow-md">
          {phase === "speaking" && subtitle ? subtitle : statusLabel[phase]}
        </p>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={open ? tapOwl : openCall}
          aria-label={open ? statusLabel[phase] : "Talk to Sayar Owl"}
          className="rounded-full transition active:scale-95"
        >
          <SayaOwlAvatar state={open ? phase : "idle"} size={open ? 64 : 56} />
        </button>
        {open && (
          <button
            type="button"
            onClick={closeCall}
            aria-label="End conversation"
            className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground shadow"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SayaOwlHome(props: SayaOwlHomeProps) {
  return <RequireSignIn><SayaOwlHomeInner {...props} /></RequireSignIn>;
}
