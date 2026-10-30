import { RequireSignIn } from "@/components/RequireSignIn";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Camera, Home, Languages, Lightbulb, Loader2, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";
import { compressImageToDataUrl } from "@/lib/compress-image";

import { TutorQuotaBar, tutorFetch } from "@/components/TutorQuotaBar";
import tutorLogo from "@/assets/tutor-logo.png";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-voice";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { TutorHistory } from "@/components/TutorHistory";

type TutorSearch = { lesson?: string; category?: string; chat?: string };

export const Route = createFileRoute("/tutor")({
  validateSearch: (search: Record<string, unknown>): TutorSearch => ({
    lesson: typeof search.lesson === "string" ? search.lesson : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    chat: typeof search.chat === "string" ? search.chat : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sayar Owl — English Tutor for Grade 10 Myanmar Students" },
      {
        name: "description",
        content:
          "A patient AI English teacher for Grade 10 students in Myanmar. Get grammar explanations, sentence breakdowns, and Myanmar translations.",
      },
      { property: "og:title", content: "Sayar Owl — English Tutor for Grade 10 Myanmar Students" },
      {
        property: "og:description",
        content:
          "Ask any English question. Sayar Owl explains grammar, structure, and the 'why' — with Myanmar translation when it helps.",
      },
    ],
  }),
  component: () => <RequireSignIn><TutorPage /></RequireSignIn>,
});

const STARTERS = [
  {
    icon: BookOpen,
    titleKey: "starter.explain.title",
    prompt: "Can you explain this sentence to me? \"If I had studied harder, I would have passed the exam.\"",
  },
  {
    icon: Lightbulb,
    titleKey: "starter.grammar.title",
    prompt: "Please explain the difference between Present Perfect and Past Simple with simple examples.",
  },
  {
    icon: Languages,
    titleKey: "starter.mm.title",
    prompt: "What does \"despite\" mean? Please give me the Myanmar meaning and 2 example sentences.",
  },
];

function makeTitle(messages: UIMessage[]) {
  const first = messages.find((m) => m.role === "user");
  const text = first?.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim() ?? "";
  const clean = text.replace(/\s+/g, " ");
  return clean ? (clean.length > 60 ? clean.slice(0, 60) + "…" : clean) : "ဓာတ်ပုံမေးခွန်း";
}

function TutorPage() {
  const { chat } = Route.useSearch();
  const navigate = Route.useNavigate();
  // id of the chat the mounted window owns (created in-place → no remount)
  const ownedIdRef = useRef<string | undefined>(chat);
  const [windowKey, setWindowKey] = useState(0);
  const [loaded, setLoaded] = useState<{ id?: string; messages: UIMessage[] } | null>(
    chat ? null : { messages: [] },
  );
  const [historyTick, setHistoryTick] = useState(0);

  useEffect(() => {
    if (chat === ownedIdRef.current && loaded) return;
    ownedIdRef.current = chat;
    if (!chat) {
      setLoaded({ messages: [] });
      setWindowKey((k) => k + 1);
      return;
    }
    let cancelled = false;
    setLoaded(null);
    supabase
      .from("tutor_chats")
      .select("id,messages")
      .eq("id", chat)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("[history] load", error);
        if (!data) {
          ownedIdRef.current = undefined;
          void navigate({ search: {}, replace: true });
          return;
        }
        setLoaded({ id: data.id, messages: (data.messages as unknown as UIMessage[]) ?? [] });
        setWindowKey((k) => k + 1);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const onCreated = useCallback(
    (id: string) => {
      ownedIdRef.current = id;
      setHistoryTick((n) => n + 1);
      void navigate({ search: (prev: TutorSearch) => ({ ...prev, lesson: undefined, category: undefined, chat: id }), replace: true });
    },
    [navigate],
  );

  const history = (
    <TutorHistory
      activeId={chat}
      refreshKey={historyTick}
      onSelect={(id) => void navigate({ search: { chat: id } })}
      onNew={() => void navigate({ search: {} })}
    />
  );

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.985_0.01_95)]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <Index
      key={windowKey}
      chatId={loaded.id}
      initialMessages={loaded.messages}
      onCreated={onCreated}
      onSaved={() => setHistoryTick((n) => n + 1)}
      historyButton={history}
    />
  );
}

function Index({
  chatId,
  initialMessages,
  onCreated,
  onSaved,
  historyButton,
}: {
  chatId?: string;
  initialMessages: UIMessage[];
  onCreated: (id: string) => void;
  onSaved: () => void;
  historyButton: React.ReactNode;
}) {
  const { t } = useI18n();
  const { lesson: lessonParam, category } = Route.useSearch();
  const lesson = chatId ? undefined : lessonParam;
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat", fetch: tutorFetch }));
  const { messages, sendMessage, status, error, clearError, regenerate } = useChat({
    transport,
    messages: initialMessages,
    onError: (err) => console.error("[chat]", err),
  });

  // Auto-save the conversation to the student's history after each reply.
  const savedIdRef = useRef<string | undefined>(chatId);
  const lastSavedLenRef = useRef(initialMessages.length);
  const savingRef = useRef(false);
  useEffect(() => {
    if (status !== "ready" && status !== "error") return;
    if (messages.length === 0 || messages.length === lastSavedLenRef.current) return;
    if (savingRef.current) return;
    savingRef.current = true;
    const snapshot = messages;
    const run = async () => {
      if (savedIdRef.current) {
        const { error: e } = await supabase
          .from("tutor_chats")
          .update({ messages: snapshot as unknown as Json, updated_at: new Date().toISOString() })
          .eq("id", savedIdRef.current);
        if (e) throw e;
        onSaved();
      } else {
        const { data, error: e } = await supabase
          .from("tutor_chats")
          .insert({ title: makeTitle(snapshot), messages: snapshot as unknown as Json })
          .select("id")
          .single();
        if (e) throw e;
        savedIdRef.current = data.id;
        onCreated(data.id);
      }
      lastSavedLenRef.current = snapshot.length;
    };
    run()
      .catch((e) => console.error("[history] save failed", e))
      .finally(() => {
        savingRef.current = false;
      });
  }, [status, messages, onCreated, onSaved]);

  // Revealed state for restored messages: show immediately.
  useEffect(() => {
    if (initialMessages.length) {
      setRevealedIds(new Set(initialMessages.map((m) => m.id)));
      spokenIdRef.current = initialMessages[initialMessages.length - 1]?.id ?? null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [voiceMode, setVoiceMode] = useState(false);
  const lessonExplanationRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported } = useSpeechSynthesis();

  const finalBufferRef = useRef("");
  const micUsedRef = useRef(false);
  const autoSubmitRef = useRef(false);

  const submitFromBuffer = useCallback(() => {
    const text = (textareaRef.current?.value ?? finalBufferRef.current).trim();
    if (!text) return;
    if (status === "submitted" || status === "streaming") return;
    lessonExplanationRef.current = false;
    micUsedRef.current = false;
    finalBufferRef.current = "";
    if (textareaRef.current) textareaRef.current.value = "";
    void sendMessage({ text }, { body: { mode: "voice" } });
  }, [sendMessage, status]);

  const recognition = useSpeechRecognition({
    silenceMs: 2500,
    onFinal: (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      micUsedRef.current = true;
      finalBufferRef.current = (finalBufferRef.current
        ? finalBufferRef.current + " "
        : "") + trimmed;
      if (textareaRef.current) {
        textareaRef.current.value = finalBufferRef.current;
        textareaRef.current.focus();
      }
    },
    onInterim: (text) => {
      if (!textareaRef.current) return;
      micUsedRef.current = true;
      const base = finalBufferRef.current;
      textareaRef.current.value = base ? `${base} ${text}` : text;
    },
    onSilence: () => {
      // Silence threshold hit — auto-submit whatever the student said.
      autoSubmitRef.current = true;
      // Give the recognizer a tick to flush any pending final result.
      setTimeout(() => {
        if (!autoSubmitRef.current) return;
        autoSubmitRef.current = false;
        submitFromBuffer();
      }, 250);
    },
  });

  const toggleMic = () => {
    if (recognition.listening) {
      recognition.stop();
    } else {
      stopSpeaking();
      // Force voice mode on so the reply plays back automatically.
      setVoiceMode(true);
      finalBufferRef.current = textareaRef.current?.value.trim() ?? "";
      recognition.start();
    }
  };


  // Parse <voice_only>...</voice_only> and <ui_display>...</ui_display> blocks.
  // If neither tag exists, treat the whole text as ui_display (and, in voice mode, as spoken).
  const parseVoiceReply = (raw: string) => {
    const voiceMatch = raw.match(/<voice_only>([\s\S]*?)<\/voice_only>/i);
    const uiMatch = raw.match(/<ui_display>([\s\S]*?)<\/ui_display>/i);
    if (!voiceMatch && !uiMatch) return { voice: raw.trim(), ui: raw.trim() };
    return {
      voice: (voiceMatch?.[1] ?? uiMatch?.[1] ?? "").trim(),
      ui: (uiMatch?.[1] ?? voiceMatch?.[1] ?? "").trim(),
    };
  };

  // Voice-first: when voice mode is on, hide the assistant's Short Note
  // until the spoken audio actually starts playing.
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const revealId = useCallback((id: string) => {
    setRevealedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Auto-speak the assistant's reply when voice mode is on and streaming finishes
  const spokenIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenIdRef.current === last.id) return;
    const raw = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    if (!raw) return;
    spokenIdRef.current = last.id;

    if (!voiceMode || !ttsSupported) {
      revealId(last.id); // no audio → show text immediately
      return;
    }
    const { voice } = parseVoiceReply(raw);
    if (!voice) {
      revealId(last.id);
      return;
    }
    const onStart = () => revealId(last.id);
    if (lessonExplanationRef.current) {
      void speak(voice, { lang: "my-MM", speed: 1.1, onStart });
    } else {
      void speak(voice, { speed: 1.1, onStart });
    }
  }, [voiceMode, ttsSupported, status, messages, speak, revealId]);


  // Auto-send an explanation request when a lesson is selected from /lessons
  const autoSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!lesson) return;
    if (autoSentRef.current === lesson) return;
    if (messages.length > 0) return;
    autoSentRef.current = lesson;
    setVoiceMode(true); // auto-enable voice when arriving from a lesson
    lessonExplanationRef.current = true; // mark as lesson explanation so only Burmese is spoken
    const prompt = `Please explain the lesson "${lesson}"${category ? ` (${category})` : ""} for a Grade 10 student in Myanmar.

Please teach this as a spoken lesson — natural conversational voice, short sentences, warm Burmese explanation mixed with the key English terms. Do not use tables, diagrams, bullet points, brackets, or grammar tags. End with a short spoken practice question.`;
    void sendMessage({ text: prompt }, { body: { mode: "voice" } });
  }, [lesson, category, messages.length, sendMessage]);

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const onPickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoBusy(true);
    try {
      setPhoto(await compressImageToDataUrl(file));
    } catch (err) {
      console.error("[photo]", err);
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleSubmit = (message: PromptInputMessage) => {
    let text = message.text?.trim() ?? "";
    if ((!text && !photo) || status === "submitted" || status === "streaming") return;
    if (!text) text = "ဒီပုံထဲက မေးခွန်းကို ရှင်းပြပေးပါဆရာ";
    clearError();
    lessonExplanationRef.current = false;
    const isVoiceInput = micUsedRef.current || voiceMode;
    micUsedRef.current = false;
    finalBufferRef.current = "";
    const files = photo ? [{ type: "file" as const, mediaType: "image/jpeg", url: photo }] : undefined;
    setPhoto(null);
    void sendMessage({ text, files }, { body: { mode: isVoiceInput ? "voice" : "text" } });
  };

  const handleStarter = (prompt: string) => {
    if (status === "submitted" || status === "streaming") return;
    clearError();
    lessonExplanationRef.current = false;
    micUsedRef.current = false;
    void sendMessage({ text: prompt }, { body: { mode: voiceMode ? "voice" : "text" } });
  };


  const isLoading = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const showThinking = status === "submitted" || (status === "streaming" && lastMessage?.role !== "assistant");
  const toggleVoiceMode = () => {
    setVoiceMode((v) => {
      if (v) {
        stopSpeaking();
        lessonExplanationRef.current = false;
      }
      return !v;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.985_0.01_95)]">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <img
            src={tutorLogo}
            alt="Sayar Owl mascot"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold leading-tight">Sayar Owl</h1>
            <p className="truncate text-xs text-muted-foreground">{t("tutor.subtitle")}</p>
          </div>
          {historyButton}
          <Button asChild type="button" variant="outline" size="sm" title="Back to Home">
            <Link to="/">
              <Home className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        <Conversation className="flex-1">
          <ConversationContent className="px-0">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <img
                    src={tutorLogo}
                    alt=""
                    width={96}
                    height={96}
                    className="h-24 w-24"
                  />
                }
                title={t("tutor.greet.title")}
                description={t("tutor.greet.desc")}
              >
                <div className="mt-6 grid w-full gap-2 sm:grid-cols-3">
                  {STARTERS.map((s) => (
                    <button
                      key={s.titleKey}
                      onClick={() => handleStarter(s.prompt)}
                      className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left transition hover:border-foreground/30 hover:shadow-sm"
                    >
                      <s.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="text-sm font-medium">{t(s.titleKey)}</span>
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        {s.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              <div className="space-y-2 py-4">
                {messages.map((m: UIMessage) => {
                  const raw = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  const text = m.role === "assistant" ? parseVoiceReply(raw).ui : raw;
                  const isAssistant = m.role === "assistant";
                  // Voice-first: for assistant messages in voice mode, hide the
                  // Short Note until the audio actually starts playing.
                  const hideForVoice =
                    isAssistant && voiceMode && ttsSupported && !revealedIds.has(m.id);

                  return (
                    <Message from={m.role} key={m.id}>
                      {m.role === "user" ? (
                        <MessageContent>
                          {m.parts.map((p, i) =>
                            p.type === "file" && p.mediaType?.startsWith("image/") ? (
                              <img key={i} src={p.url} alt="Uploaded question" className="mb-2 max-h-64 w-auto rounded-lg object-contain" />
                            ) : null,
                          )}
                          {text}
                        </MessageContent>
                      ) : (
                        <MessageContent className="bg-transparent px-0 py-0">
                          {hideForVoice ? (
                            <Shimmer>{speaking ? "🔊 Listen..." : t("tutor.thinking")}</Shimmer>
                          ) : (
                            <MessageResponse>{text}</MessageResponse>
                          )}
                        </MessageContent>
                      )}
                    </Message>
                  );
                })}
                {error && (
                  <div
                    role="alert"
                    className="mx-auto max-w-xl rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
                  >
                    <p className="font-medium">{t("tutor.error.title")}</p>
                    <p className="mt-1 text-muted-foreground">
                      {error.message.includes("Missing LOVABLE_API_KEY")
                        ? t("tutor.error.gatewayKey")
                        : error.message.includes("မေးခွင့်") || error.message.includes("Login")
                          ? error.message
                          : t("tutor.error.generic")}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        clearError();
                        void regenerate();
                      }}
                    >
                      {t("tutor.error.retry")}
                    </Button>
                  </div>
                )}
                {showThinking && (
                  <Message from="assistant">
                    <MessageContent className="bg-transparent px-0 py-0">
                      <Shimmer>{t("tutor.thinking")}</Shimmer>
                    </MessageContent>
                  </Message>
                )}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="sticky bottom-0 bg-gradient-to-t from-[oklch(0.985_0.01_95)] via-[oklch(0.985_0.01_95)] to-transparent pb-4 pt-2">
          <div className="mb-2"><TutorQuotaBar /></div>
          {photo && (
            <div className="mb-2 flex items-center gap-2">
              <div className="relative">
                <img src={photo} alt="Photo to send" className="h-20 w-auto rounded-lg border border-border object-contain" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">မေးခွန်း တွဲရေးပြီး ပို့နိုင်ပါတယ်</span>
            </div>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              ref={textareaRef}
              placeholder={t("tutor.placeholder")}
              autoFocus
            />
            <PromptInputFooter className="justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoBusy || isLoading}
                  title="Add a photo of your question"
                  aria-label="Add photo"
                >
                  {photoBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
                {recognition.supported && (
                  <Button
                    type="button"
                    variant={recognition.listening ? "default" : "outline"}
                    size="icon-sm"
                    onClick={toggleMic}
                    aria-pressed={recognition.listening}
                    title={recognition.listening ? "Stop listening" : "Speak your question"}
                    className={recognition.listening ? "animate-pulse" : ""}
                  >
                    {recognition.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                {recognition.listening && (
                  <span className="text-xs text-muted-foreground">
                    {t("tutor.listening")}
                  </span>
                )}
                <Button
                  type="button"
                  variant={voiceMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleVoiceMode}
                  aria-pressed={voiceMode}
                  disabled={!ttsSupported}
                  title={
                    !ttsSupported
                      ? "Voice not supported in this browser"
                      : voiceMode
                        ? "Voice on — replies read aloud"
                        : "Turn on voice replies"
                  }
                >
                  {voiceMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="ml-1 hidden sm:inline">{voiceMode ? t("tutor.voiceOn") : t("tutor.voice")}</span>
                </Button>
                {speaking && (
                  <Button type="button" variant="ghost" size="icon-sm" onClick={stopSpeaking} title="Stop speaking" aria-label="Stop speaking">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <PromptInputSubmit status={status} disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {t("tutor.footer")}
          </p>
        </div>
      </main>
    </div>
  );
}
