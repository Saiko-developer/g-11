import { RequireSignIn } from "@/components/RequireSignIn";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  Loader2,
  Maximize2,
  Mic,
  Minimize2,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import tutorLogo from "@/assets/tutor-logo.png";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EXAM_UPLOAD_MESSAGE, fileToDataUrl, onExamUpload } from "@/lib/examUpload";


/**
 * SYLLABUS CURRICULUM EXPLORER ONLY — Saya Owl chatbox.
 * /tutor keeps using the original SayaOwl component, untouched.
 *  1. Draggable by its header, plus a fullscreen/minimize toggle.
 *  2. Microphone: getUserMedia + MediaRecorder → /api/transcribe
 *     (auto-detects Burmese, English and mixed code-switched speech).
 *  3. Sends the visible text of the active unit section as hidden context.
 */

/** Grabs the visible text of whichever unit section is on screen right now. */
function readActiveSectionText(): string | null {
  const el = document.querySelector("[data-saya-home-section]");
  const text = el?.textContent?.replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.length > 12000 ? `${text.slice(0, 12000)}…` : text;
}

type SayaOwlHomeProps = {
  /** Human-readable description of the lesson the student is practising. */
  lessonContext: string;
};

type Attachment = { name: string; mediaType: string; url: string };

const PANEL_W = 380;
const PANEL_H = 560;

function SayaOwlHomeInner({ lessonContext }: SayaOwlHomeProps) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  // Drag state — offset from the default bottom-right anchor.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat-home", fetch: tutorFetch }));
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (err) => console.error("[saya-owl-home]", err),
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  /* ---------------------------- dragging ---------------------------- */
  const onDragPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (fullscreen) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    setPos({ x: rect.left, y: rect.top });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const rect = panelRef.current?.getBoundingClientRect();
    const w = rect?.width ?? PANEL_W;
    const h = rect?.height ?? PANEL_H;
    const x = Math.min(Math.max(0, e.clientX - d.dx), Math.max(0, window.innerWidth - w));
    const y = Math.min(Math.max(0, e.clientY - d.dy), Math.max(0, window.innerHeight - h));
    setPos({ x, y });
  };

  const endDrag = (e: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  /* ------------------------------ chat ------------------------------ */
  const send = (text: string, file?: Attachment | null) => {
    const value = text.trim();
    if (!value || busy) return;
    const attached = file ?? attachment;
    setInput("");
    setAttachment(null);
    void sendMessage(
      {
        text: value,
        ...(attached
          ? {
              files: [
                {
                  type: "file" as const,
                  mediaType: attached.mediaType,
                  filename: attached.name,
                  url: attached.url,
                },
              ],
            }
          : {}),
      },
      {
        body: {
          mode: "text",
          lessonContext,
          sectionContent: readActiveSectionText(),
          hasUpload: Boolean(attached),
        },
      },
    );
  };

  const sendRef = useRef(send);
  sendRef.current = send;

  /* --------------------- exam paper upload bridge -------------------- */
  useEffect(
    () =>
      onExamUpload(async (file) => {
        setOpen(true);
        try {
          const url = await fileToDataUrl(file);
          const next: Attachment = {
            name: file.name,
            mediaType: file.type || "application/octet-stream",
            url,
          };
          setAttachment(next);
          if (!/^image\//.test(next.mediaType) && next.mediaType !== "application/pdf") {
            toast.warning("ဓာတ်ပုံ (JPG/PNG) သို့မဟုတ် PDF ဖိုင်က အကောင်းဆုံး ဖတ်နိုင်ပါတယ်", {
              description: "ဤဖိုင်အမျိုးအစားကို ဆရာ မဖတ်နိုင်ရင် ဓာတ်ပုံရိုက်ပြီး ပြန်တင်ပါ။",
            });
          }
          setTimeout(() => sendRef.current(EXAM_UPLOAD_MESSAGE, next), 50);
        } catch (err) {
          console.error("[saya-owl-home] upload failed", err);
          toast.error("ဖိုင် ဖတ်၍ မရပါ", { description: "ဖိုင်ကို ပြန်ရွေးကြည့်ပါ။" });
        }
      }),
    [],
  );


  /* ------------------------- microphone ----------------------------- */
  const cleanupRecorder = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRef.current = null;
    chunksRef.current = [];
  }, []);

  const transcribeToText = useCallback(async (blob: Blob): Promise<string | null> => {
    if (blob.size < 2048) {
      toast.error("အသံ မကြားရပါ", { description: "ခဏလေး ပြောပြီးမှ ရပ်ပါ။" });
      return null;
    }
    setTranscribing(true);
    try {
      const form = new FormData();
      form.append("file", blob, "recording.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!res.ok) throw new Error(`transcribe ${res.status}`);
      const data = (await res.json()) as { text?: string };
      const text = (data.text ?? "").trim();
      if (!text) {
        toast.error("စကားလုံး မဖတ်နိုင်ပါ", { description: "ပြန်ပြီး ပြောကြည့်ပါ။" });
        return null;
      }
      return text;
    } catch (err) {
      console.error("[saya-owl-home] transcription failed", err);
      toast.error("အသံမှ စာသား ပြောင်း၍ မရပါ", {
        description: "ခဏနေ ပြန်ကြိုးစားပါ သို့မဟုတ် စာရိုက်၍ မေးပါ။",
      });
      return null;
    } finally {
      setTranscribing(false);
    }
  }, []);

  const transcribe = useCallback(
    async (blob: Blob) => {
      const text = await transcribeToText(blob);
      if (text) setInput((prev) => (prev ? `${prev} ${text}` : text));
    },
    [transcribeToText],
  );

  const stopRecording = useCallback(() => {
    try {
      mediaRef.current?.stop();
    } catch {
      cleanupRecorder();
      setRecording(false);
    }
  }, [cleanupRecorder]);

  const startRecording = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("မိုက်ခရိုဖုန်း မရနိုင်ပါ", {
        description: "ဒီ browser က အသံဖမ်းခြင်းကို မထောက်ပံ့ပါ။",
      });
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch (err) {
      const name = (err as { name?: string })?.name;
      toast.error("မိုက်ခရိုဖုန်း ခွင့်ပြုချက် မရပါ", {
        description:
          name === "NotAllowedError"
            ? "Browser ရဲ့ address bar မှာ microphone ကို Allow လုပ်ပေးပါ။"
            : "မိုက်ခရိုဖုန်း ချိတ်ဆက်ထားမှု ကို စစ်ဆေးပါ။",
      });
      return;
    }
    streamRef.current = stream;
    const mimeType = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ].find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      cleanupRecorder();
      setRecording(false);
      void transcribe(blob);
    };
    recorder.onerror = () => {
      cleanupRecorder();
      setRecording(false);
      toast.error("အသံဖမ်းခြင်း မအောင်မြင်ပါ");
    };
    mediaRef.current = recorder;
    recorder.start();
    setRecording(true);
  }, [cleanupRecorder, transcribe]);

  const toggleMic = () => {
    if (recording) stopRecording();
    else void startRecording();
  };

  useEffect(() => {
    // Stop recording if the panel closes mid-capture.
    if (!open && mediaRef.current) stopRecording();
  }, [open, stopRecording]);

  useEffect(() => () => cleanupRecorder(), [cleanupRecorder]);

  const quickPrompts = [
    "ဒီသင်ခန်းစာကို အသေးစိတ် ရှင်းပြပေးပါဆရာ",
    "လေ့ကျင့်ခန်းထဲက မေးခွန်းတစ်ခုကို ကူညီပေးပါ",
    "အဖြေ ဘာကြောင့် မှန်တယ်ဆိုတာ ရှင်းပြပေးပါ",
  ];

  const panelStyle =
    !fullscreen && pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined;

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Saya Owl tutor"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-primary/30 bg-card py-2 pl-2 pr-4 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <img src={tutorLogo} alt="" className="h-9 w-9 rounded-full object-cover" />
        <span className="text-sm font-semibold">{open ? "Close" : "Ask Saya Owl"}</span>
      </button>

      {open && (
        <aside
          ref={panelRef}
          style={panelStyle}
          className={
            fullscreen
              ? "fixed inset-0 z-50 flex flex-col overflow-hidden border border-border bg-card shadow-2xl"
              : "fixed bottom-20 right-5 z-50 flex h-[min(70vh,560px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          }
        >
          <header
            onPointerDown={onDragPointerDown}
            onPointerMove={onDragPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`flex select-none items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3 ${
              fullscreen ? "" : "cursor-grab active:cursor-grabbing"
            }`}
          >
            <img src={tutorLogo} alt="" className="h-8 w-8 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Saya Owl</p>
              <p className="truncate text-[11px] text-muted-foreground">{lessonContext}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreen((v) => !v)}
              aria-label={fullscreen ? "Exit full screen" : "Expand to full screen"}
              title={fullscreen ? "ချုံ့ရန်" : "မျက်နှာပြင် အပြည့် ဖွင့်ရန်"}
            >
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="rounded-xl bg-secondary/60 p-3 text-sm">
                <p className="font-medium">မင်္ဂလာပါ ကျောင်းသား 🦉</p>
                <p className="mt-1 text-muted-foreground">
                  ဆရာ ဘေးနားမှာပဲ ရှိနေပါတယ်။ သင် ကြည့်နေတဲ့ သင်ခန်းစာပိုင်း (Listening,
                  Reading, Speaking, Writing, Vocabulary, Grammar) ကို ဆရာ မြင်နေပါတယ်။
                  မေးခွန်းနံပါတ် ပြောလိုက်ရုံနဲ့ အဆင့်လိုက် အသေးစိတ် ရှင်းပြပေးပါမယ်။
                </p>
              </div>
            )}
            {messages.map((m) => {
              const body = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const fileNames = m.parts
                .filter((p) => p.type === "file")
                .map((p) => (p as { filename?: string }).filename ?? "attachment");
              if (fileNames.length > 0 && m.role === "user") {
                return (
                  <div key={m.id} className="ml-auto max-w-[85%] space-y-1">
                    {fileNames.map((n) => (
                      <p
                        key={n}
                        className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground"
                      >
                        <FileText className="h-3.5 w-3.5" /> {n}
                      </p>
                    ))}
                    {body && (
                      <div className="rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                        {body}
                      </div>
                    )}
                  </div>
                );
              }
              if (!body) return null;
              return (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[92%] rounded-2xl rounded-bl-sm bg-secondary/70 px-3 py-2 text-sm"
                  }
                >
                  {m.role === "assistant" ? <MessageResponse>{body}</MessageResponse> : body}
                </div>
              );
            })}
            {busy && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" /> Saya Owl is
                thinking…
              </p>
            )}
          </div>

          <div className="border-t border-border p-3">
            {(recording || transcribing) && (
              <p className="mb-2 flex items-center gap-2 text-[11px] font-medium text-destructive">
                {recording ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
                    </span>
                    အသံ ဖမ်းယူနေပါတယ်… ပြီးရင် ခလုတ်ကို ပြန်နှိပ်ပါ
                  </>
                ) : (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> စာသားအဖြစ် ပြောင်းနေပါတယ်…
                  </span>
                )}
              </p>
            )}
            {attachment && (
              <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-[11px]">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  aria-label="Remove attachment"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={busy}
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] transition hover:border-primary/40 hover:bg-secondary disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mb-2"><TutorQuotaBar compact /></div>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder={recording ? "နားထောင်နေပါတယ်… ပြောလိုက်ပါ" : "Ask Saya Owl…"}
                className="max-h-28 min-h-9 resize-none text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant={recording ? "destructive" : "outline"}
                onClick={toggleMic}
                disabled={busy || transcribing}
                className={recording ? "animate-pulse ring-2 ring-destructive/50" : undefined}
                aria-label={recording ? "Stop voice input" : "Start voice input"}
                title={
                  recording
                    ? "ရပ်ရန် နှိပ်ပါ"
                    : "အသံဖြင့် မေးရန် နှိပ်ပါ — မြန်မာ/အင်္ဂလိပ် နှစ်မျိုးလုံး ရပါတယ်"
                }
              >
                {transcribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : recording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button type="submit" size="icon" disabled={busy || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </aside>
      )}
    </>
  );
}

export function SayaOwlHome(props: SayaOwlHomeProps) {
  return <RequireSignIn><SayaOwlHomeInner {...props} /></RequireSignIn>;
}
