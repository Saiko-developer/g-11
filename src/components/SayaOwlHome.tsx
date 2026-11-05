import { RequireSignIn } from "@/components/RequireSignIn";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, FileText, Maximize2, MessageCircle, Mic, Minimize2, Minus, Plus, Send, Volume2, VolumeX, X } from "lucide-react";
import { useAuth } from "@/components/AuthGate";
import { toast } from "sonner";

import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import { SayaOwlAvatar } from "@/components/SayaOwlAvatar";
import { useDraggable } from "@/hooks/useDraggable";
import { fileToDataUrl, onExamUpload } from "@/lib/examUpload";
import { cleanForSpeech, takeSpeakableChunks } from "@/lib/voice-sentences";

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

type SayaOwlHomeProps = { lessonContext: string; paperOnly?: boolean };
type Attachment = { name: string; mediaType: string; url: string };
type Phase = "idle" | "listening" | "thinking" | "speaking" | "muted";
type NativeRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } } }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

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

function SayaOwlHomeInner({ lessonContext, paperOnly = false }: SayaOwlHomeProps) {
  const drag = useDraggable("sayaowl-pos");
  // Exam-paper mode: the student asks first (text or voice); replies in Burmese, voice optional.
  const [paper, setPaper] = useState<Attachment | null>(null);
  const unsentPaperRef = useRef<Attachment | null>(null);
  const paperModeRef = useRef(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const voiceOnRef = useRef(false);
  const [draft, setDraft] = useState("");
  const [full, setFull] = useState(false);
  const [tab, setTab] = useState<"paper" | "chat">("chat");
  const [zoom, setZoom] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [heardSpeech, setHeardSpeech] = useState(false);
  const [studentLine, setStudentLine] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat-home", fetch: tutorFetch }));
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onError: (err) => {
      console.error("[saya-owl-voice]", err);
      toast.error("ဆရာ ခဏ မဖြေနိုင်ပါ", { description: "ခဏနေ ပြန်မေးကြည့်ပါ။" });
    },
  });

  const activeRef = useRef(false);
  const nativeRecRef = useRef<NativeRec | null>(null);
  const nativeFailedRef = useRef(false);
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
      if (paperModeRef.current) { setPhase("idle"); return; }
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

  const enqueueSpeech = (raw: string) => {
    const text = cleanForSpeech(raw);
    if (!text) return;
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
    try { nativeRecRef.current?.abort(); } catch { /* ignore */ }
    nativeRecRef.current = null;
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

  const sendTurn = (text: string, fileArg?: Attachment) => {
    const file = fileArg ?? unsentPaperRef.current ?? undefined;
    unsentPaperRef.current = null;
    const mode = paperModeRef.current && !voiceOnRef.current ? "text" : "voice";
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
      { body: { mode, paperVoice: paperModeRef.current && voiceOnRef.current, lessonContext, sectionContent: readActiveSectionText(), hasUpload: Boolean(file) } },
    );
  };

  const listenOnce = async () => {
    if (!activeRef.current || mutedRef.current) return;
    setPhase("listening");
    setHeardSpeech(false);

    // Preferred path: the browser's native Burmese recognizer (same as /tutor).
    const w = window as unknown as { SpeechRecognition?: new () => NativeRec; webkitSpeechRecognition?: new () => NativeRec };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    // Native browser recognition duplicates words on mobile and is weak for
    // Burmese — always use Whisper transcription (recorder path below).
    const PREFER_NATIVE = false as boolean;
    if (PREFER_NATIVE && Ctor && !nativeFailedRef.current) {
      const rec = new Ctor();
      rec.lang = "my-MM";
      rec.continuous = true;
      rec.interimResults = true;
      nativeRecRef.current = rec;
      let finalText = "";
      let interim = "";
      let silence: number | undefined;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(silence);
        try { rec.stop(); } catch { /* ignore */ }
      };
      const startedAt = Date.now();
      const idle = window.setTimeout(() => { if (!finalText && !interim) finish(); }, 20000);
      rec.onresult = (e) => {
        interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalText += (finalText ? " " : "") + r[0].transcript.trim();
          else interim += r[0].transcript;
        }
        setHeardSpeech(true);
        setStudentLine((finalText + " " + interim).trim());
        window.clearTimeout(silence);
        silence = window.setTimeout(finish, SILENCE_MS);
        if (Date.now() - startedAt > 45000) finish();
      };
      rec.onerror = (e) => {
        const err = (e as { error?: string }).error;
        if (err === "not-allowed" || err === "service-not-allowed" || err === "language-not-supported") {
          nativeFailedRef.current = true;
        }
      };
      rec.onend = () => {
        window.clearTimeout(idle);
        window.clearTimeout(silence);
        if (nativeRecRef.current === rec) nativeRecRef.current = null;
        if (!activeRef.current || mutedRef.current) return;
        const text = (finalText + " " + interim).trim();
        if (!text) { relisten(); return; }
        setStudentLine(text);
        fillerDoneRef.current = playFiller();
        sendTurn(text);
      };
      try { rec.start(); return; } catch { nativeFailedRef.current = true; nativeRecRef.current = null; }
    }
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
      if (!spoke) { relisten(); return; }
      setPhase("thinking");
      fillerDoneRef.current = playFiller();
      const text = await transcribe(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
      if (!activeRef.current) return;
      if (!text) { relisten(); return; }
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
  const relisten = () => (paperModeRef.current ? setPhase("idle") : listenRef.current());
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
    paperModeRef.current = false;
    unsentPaperRef.current = null;
    setPaper(null);
    setDraft("");
  };

  /* --------------------------- exam paper ---------------------------- */
  const busy = status === "submitted" || status === "streaming" || phase === "thinking";
  const askByText = () => {
    const q = draft.trim();
    if (!q || busy) return;
    releaseMic();
    activeRef.current = true;
    mutedRef.current = false;
    setStudentLine(q);
    setDraft("");
    sendTurn(q);
  };
  const askByVoice = () => {
    if (phase === "listening") { releaseMic(); setPhase("idle"); return; }
    if (busy) return;
    if (!startCall()) return;
    stopSpeaking();
    void listenOnce();
  };
  const stopSpeaking = () => {
    textQueueRef.current = [];
    nextFetchRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
  };
  const toggleVoice = () => {
    const next = !voiceOnRef.current;
    voiceOnRef.current = next;
    setVoiceOn(next);
    if (!next) { stopSpeaking(); if (phase === "speaking") setPhase("idle"); }
  };
  const openInTutor = () => {
    if (paper?.mediaType.startsWith("image/")) {
      try { sessionStorage.setItem("saya-owl:tutor-photo", paper.url); } catch { /* too large */ }
    }
    closeCall();
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
          if (!paperOnly) return;
          const url = await fileToDataUrl(file);
          endCallRef.current();
          const a = { name: file.name, mediaType: file.type || "application/octet-stream", url };
          setMessages([]);
          unsentPaperRef.current = a;
          paperModeRef.current = true;
          activeRef.current = true;
          prepareFillers();
          setPaper(a);
          setDraft("");
          setOpen(true);
          setPhase("idle");
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
    const body = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("").split("@@")[0];
    const final = status === "ready";
    const { chunks, next } = takeSpeakableChunks(body, t.offset, final, t.offset === 0 ? FIRST_CHUNK : NEXT_CHUNK);
    t.offset = next;
    if (!paperModeRef.current || voiceOnRef.current) chunks.forEach(enqueueSpeech);
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

  if (paperOnly) {
    if (!open || !paper) return null;
    const reply = [...messages].reverse().find((m) => m.role === "assistant");
    const rawReply = (reply?.parts ?? []).map((p) => (p.type === "text" ? p.text : "")).join("").replace(/[*#`]/g, "").trim();
    const [detailPart, notePart] = rawReply.split("@@NOTE@@");
    const replyText = detailPart.replace(/@+$/, "").trim();
    const noteLines = (notePart ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
    const qLine = noteLines.find((l) => l.startsWith("အမေး"));
    const aLine = noteLines.find((l) => l.startsWith("အဖြေ"));
    const bullets = noteLines.filter((l) => l !== qLine && l !== aLine).map((l) => l.replace(/^[•\-]\s*/, ""));
    const hasNote = Boolean(notePart && (qLine || aLine || bullets.length));
    const asked = messages.some((m) => m.role === "user");
    const isImage = paper.mediaType.startsWith("image/");

    const replyView = !asked ? (
      <p className="rounded-2xl bg-primary/10 px-3 py-2 leading-relaxed">
        မေးခွန်းလွှာ ရောက်ပါပြီ ကျောင်းသား။ ဘယ်မေးခွန်း သို့မဟုတ် ဘယ်နေရာကို ရှင်းပြပေးရမလဲ — စာရိုက်ပြီး ဖြစ်စေ၊ 🎙️ အသံဖြင့် ဖြစ်စေ (မြန်မာ/English) မေးလိုက်ပါနော်။
      </p>
    ) : (
      <>
        {studentLine && <p className="ml-auto max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground">{studentLine}</p>}
        {hasNote ? (
          <div className="space-y-2">
            <div className="rounded-2xl border border-border bg-primary/10 px-3 py-2">
              <p className="mb-1 text-xs font-semibold text-primary">🎯 မေးခွန်းနှင့် အဖြေ</p>
              {qLine && <p className="leading-relaxed">{qLine}</p>}
              {aLine && <p className="font-semibold leading-relaxed">{aLine}</p>}
            </div>
            {bullets.length > 0 && (
              <div className="rounded-2xl border border-border bg-secondary px-3 py-2">
                <p className="mb-1 text-xs font-semibold">💡 အဓိက မှတ်သားရန်</p>
                <ul className="list-disc space-y-1 pl-4 leading-relaxed">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            )}
            <button type="button" onClick={() => setShowDetail((v) => !v)} aria-expanded={showDetail} className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-secondary">
              📖 အသေးစိတ် ရှင်းလင်းချက် အပြည့်အစုံ
              <ChevronDown className={`h-4 w-4 transition ${showDetail ? "rotate-180" : ""}`} />
            </button>
            {showDetail && <p className="whitespace-pre-wrap rounded-2xl bg-secondary px-3 py-2 leading-relaxed">{replyText}</p>}
          </div>
        ) : voiceOn && busy ? (
          <p className="rounded-2xl bg-secondary px-3 py-2 text-muted-foreground">ဆရာ အသံဖြင့် ရှင်းပြနေပါတယ် 🔊…</p>
        ) : voiceOn && phase === "speaking" && notePart === undefined ? (
          <p className="rounded-2xl bg-secondary px-3 py-2 text-muted-foreground">ဆရာ အသံဖြင့် ရှင်းပြနေပါတယ် 🔊…</p>
        ) : (
          <p className="whitespace-pre-wrap rounded-2xl bg-secondary px-3 py-2 leading-relaxed">{replyText || "ဆရာ စဉ်းစားနေပါတယ်…"}</p>
        )}
      </>
    );

    const paperView = (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 text-xs">
          <span className="truncate font-medium">{paper.name}</span>
          {isImage && (
            <div className="flex items-center gap-1">
              <button type="button" aria-label="ချုံ့မည်" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"><Minus className="h-4 w-4" /></button>
              <button type="button" onClick={() => setZoom(1)} className="h-9 rounded-lg border border-border px-2 hover:bg-secondary">{Math.round(zoom * 100)}%</button>
              <button type="button" aria-label="ချဲ့မည်" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"><Plus className="h-4 w-4" /></button>
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-muted p-2">
          {isImage ? (
            <img src={paper.url} alt="Uploaded exam paper" style={{ width: `${zoom * 100}%`, maxWidth: "none" }} className="mx-auto block rounded" />
          ) : (
            <iframe src={paper.url} title={paper.name} className="h-full w-full rounded bg-background" />
          )}
        </div>
        <button type="button" onClick={() => setTab("chat")} className="flex items-center justify-center gap-1.5 border-t border-border py-3 text-sm font-medium text-primary lg:hidden">
          <MessageCircle className="h-4 w-4" /> မေးခွန်းတွေ့ပြီလား? ဆရာ့ကို မေးလိုက်ပါ →
        </button>
      </div>
    );

    const chatView = (
      <div className="flex h-full min-h-0 flex-col">
        <div className="px-3 pt-2"><TutorQuotaBar lowOnly /></div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm">
          {!full && (
            <button type="button" onClick={() => { setFull(true); setTab("paper"); }} className="flex w-full items-center gap-2 rounded-lg bg-secondary px-2.5 py-2 text-left">
              {isImage ? <img src={paper.url} alt="Uploaded exam paper" className="h-12 w-12 rounded object-cover" /> : <FileText className="h-6 w-6 text-primary" />}
              <span className="truncate text-xs font-medium">{paper.name}</span>
            </button>
          )}
          {replyView}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); askByText(); }} className="flex items-end gap-2 border-t border-border p-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askByText(); } }}
            rows={1}
            placeholder="မေးခွန်း ရိုက်ထည့်ပါ…"
            className="min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-base sm:text-sm"
          />
          <button type="button" onClick={askByVoice} aria-label="အသံဖြင့် မေးမည်" aria-pressed={phase === "listening"} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border ${phase === "listening" ? "bg-destructive text-destructive-foreground" : "hover:bg-secondary"}`}>
            <Mic className="h-5 w-5" />
          </button>
          <button type="submit" disabled={!draft.trim() || busy} aria-label="ပို့မည်" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50">
            <Send className="h-5 w-5" />
          </button>
        </form>
        <Link to="/tutor" onClick={openInTutor} className="flex items-center justify-center gap-1.5 border-t border-border py-2 text-xs font-medium text-primary hover:bg-secondary">
          <ExternalLink className="h-3.5 w-3.5" /> Tutor စာမျက်နှာတွင် ဆက်မေးမည်
        </Link>
      </div>
    );

    return (
      <div className={full ? "fixed inset-0 z-[60] flex flex-col bg-card text-card-foreground" : "fixed inset-x-2 bottom-2 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4"} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className={full ? "flex h-full min-h-0 w-full flex-col" : "flex h-[min(70vh,34rem)] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl sm:w-[24rem]"}>
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <SayaOwlAvatar state={phase} size={36} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">ဆရာဇီးကွက်</p>
              <p className="truncate text-xs text-muted-foreground">{busy ? "ဆရာ စဉ်းစားနေပါတယ်…" : phase === "listening" ? (heardSpeech ? "ကြားနေပါတယ်…" : "နားထောင်နေပါတယ်… မေးလိုက်ပါ") : phase === "speaking" ? "ဆရာ ရှင်းပြနေပါတယ်…" : "မေးခွန်းလွှာ လေ့လာရေး"}</p>
            </div>
            <button type="button" onClick={toggleVoice} aria-pressed={voiceOn} aria-label={voiceOn ? "အသံ ပိတ်မည်" : "အသံ ဖွင့်မည်"} className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-2.5 text-xs font-medium hover:bg-secondary">
              {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {voiceOn ? "အသံ" : "စာသား"}
            </button>
            <button type="button" onClick={() => setFull((f) => !f)} aria-label={full ? "ပြန့်ကျဉ်းမည်" : "မျက်နှာပြင်အပြည့်"} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
              {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => { setFull(false); closeCall(); }} aria-label="ပိတ်မည်" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
          {full ? (
            <>
              <div className="grid grid-cols-2 gap-1 border-b border-border p-1.5 lg:hidden">
                <button type="button" onClick={() => setTab("paper")} aria-pressed={tab === "paper"} className={`min-h-11 rounded-lg text-sm font-medium ${tab === "paper" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>📄 မေးခွန်းလွှာ</button>
                <button type="button" onClick={() => setTab("chat")} aria-pressed={tab === "chat"} className={`min-h-11 rounded-lg text-sm font-medium ${tab === "chat" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>💬 ဆရာ့ကိုမေးမည်</button>
              </div>
              <div className="flex min-h-0 flex-1">
                <div className={`${tab === "paper" ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex lg:border-r lg:border-border`}>{paperView}</div>
                <div className={`${tab === "chat" ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex`}>{chatView}</div>
              </div>
            </>
          ) : (
            chatView
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={drag.ref} className="fixed bottom-20 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 md:bottom-4" style={{ paddingBottom: "env(safe-area-inset-bottom)", ...drag.style }}>
      {open && <TutorQuotaBar lowOnly />}
      {open && (subtitle || phase !== "idle") && (
        <p className="line-clamp-2 max-w-[260px] rounded-2xl bg-card/95 px-3 py-1.5 text-xs leading-relaxed text-foreground shadow-md">
          {phase === "speaking" && subtitle
            ? subtitle
            : phase === "thinking" && studentLine
              ? `ကြားလိုက်ရတာ: “${studentLine}”`
              : statusLabel[phase]}
        </p>
      )}
      <div className="relative cursor-grab active:cursor-grabbing" {...drag.handleProps}>
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

/** Home Page exam-paper pop-up: hidden until a paper is uploaded. */
export function SayaOwlPaper() {
  const { session } = useAuth();
  if (!session) return null;
  return <SayaOwlHomeInner paperOnly lessonContext="Grade 10 English — student's own uploaded exam paper (revision)" />;
}

export function SayaOwlHome(props: SayaOwlHomeProps) {
  return <RequireSignIn><SayaOwlHomeInner {...props} /></RequireSignIn>;
}
