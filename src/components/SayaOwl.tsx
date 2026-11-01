import { RequireSignIn } from "@/components/RequireSignIn";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";

import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import tutorLogo from "@/assets/tutor-logo.png";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDraggable } from "@/hooks/useDraggable";

/** Strips the <voice_only>/<ui_display> envelope so only the note is shown. */
function toDisplayText(raw: string): string {
  const ui = raw.match(/<ui_display>([\s\S]*?)(<\/ui_display>|$)/);
  if (ui?.[1]) return ui[1].trim();
  if (/<voice_only>/.test(raw)) {
    return raw.replace(/<\/?voice_only>[\s\S]*?(?=<ui_display>|$)/g, "").trim();
  }
  return raw.replace(/<\/?(voice_only|ui_display)>/g, "").trim();
}

type SayaOwlProps = {
  /** Human-readable description of the lesson the student is practising. */
  lessonContext: string;
  /** The exact question the student is working on right now, if any. */
  currentQuestion?: string | null;
};

function SayaOwlInner({ lessonContext, currentQuestion }: SayaOwlProps) {
  const drag = useDraggable("sayaowl-pos");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat", fetch: tutorFetch }));
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (err) => console.error("[saya-owl]", err),
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage(
      { text: value },
      { body: { mode: "text", lessonContext, currentQuestion: currentQuestion ?? null } },
    );
  };

  const quickPrompts = [
    "သဲလွန်စ တစ်ခုလောက် ပေးပါဆရာ",
    "ဤမေးခွန်းကို ရှင်းပြပေးပါ",
    "ကျွန်တော့်အဖြေ မှန်မမှန် စစ်ပေးပါ",
  ];

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
        <span className="text-sm font-semibold">
          {open ? "Close" : "Ask Saya Owl"}
        </span>
      </button>

      {open && (
        <aside className="fixed bottom-20 right-5 z-40 flex h-[min(70vh,560px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <header className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
            <img src={tutorLogo} alt="" className="h-8 w-8 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Saya Owl</p>
              <p className="truncate text-[11px] text-muted-foreground">{lessonContext}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="rounded-xl bg-secondary/60 p-3 text-sm">
                <p className="font-medium">မင်္ဂလာပါ ကျောင်းသား 🦉</p>
                <p className="mt-1 text-muted-foreground">
                  ဆရာ ဘေးနားမှာပဲ ရှိနေပါတယ်။ သဲလွန်စ လိုချင်တာဖြစ်ဖြစ်၊ သဒ္ဒါစည်းမျဉ်း
                  သိချင်တာဖြစ်ဖြစ်၊ အဖြေစစ်ချင်တာဖြစ်ဖြစ် လွတ်လွတ်လပ်လပ် မေးပါ။
                </p>
              </div>
            )}
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const body = m.role === "assistant" ? toDisplayText(text) : text;
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
                placeholder="Ask Saya Owl…"
                className="max-h-28 min-h-9 resize-none text-sm"
              />
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

export function SayaOwl(props: SayaOwlProps) {
  return <RequireSignIn><SayaOwlInner {...props} /></RequireSignIn>;
}
