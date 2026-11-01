import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Msg = { id: string; sender_id: string; sender_name: string; is_teacher: boolean; body: string; created_at: string };
type Student = { student_id: string; display_name: string; full_name: string | null };

export function useChatUnread(cid: string) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const load = useCallback(async () => {
    const { data } = await supabase.rpc("class_chat_unread", { _cid: cid });
    const m: Record<string, number> = {};
    for (const r of (data as { thread: string; unread: number }[]) ?? []) m[r.thread] = r.unread;
    setCounts(m);
  }, [cid]);
  useEffect(() => {
    void load();
    const ch = supabase
      .channel(`chat-unread-${cid}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "class_messages", filter: `classroom_id=eq.${cid}` }, () => void load())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [cid, load]);
  return { counts, reload: load };
}

function dayLabel(d: Date) {
  const today = new Date(); const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: d.getFullYear() === today.getFullYear() ? undefined : "numeric" });
}

export function ChatThread({ cid, peer, teacher, onRead }: { cid: string; peer: string | null; teacher: boolean; onRead?: () => void }) {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [me, setMe] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const thread = peer ?? "group";

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("class_chat", { _cid: cid, _peer: peer as string });
    if (error) toast.error(error.message);
    setMsgs((data as Msg[]) ?? []);
    await supabase.rpc("class_chat_mark_read", { _cid: cid, _thread: thread });
    onRead?.();
  }, [cid, peer, thread, onRead]);

  useEffect(() => {
    setMsgs(null);
    void load();
    void supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
    const ch = supabase
      .channel(`chat-${cid}-${thread}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "class_messages", filter: `classroom_id=eq.${cid}` }, () => void load())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [cid, thread, load]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs]);

  const send = async () => {
    const t = body.trim();
    if (!t) return;
    setBusy(true);
    const { error } = await supabase.rpc("class_chat_send", { _cid: cid, _peer: peer as string, _body: t });
    setBusy(false);
    if (error) return toast.error(error.message);
    setBody("");
    void load();
  };
  const remove = async (id: string) => {
    if (!confirm("ဤ Message ကို ဖျက်မှာလား?")) return;
    const { error } = await supabase.from("class_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  };

  let lastDay = "";
  return (
    <div className="flex flex-col rounded-lg border border-border bg-muted/30">
      {peer && (
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-1.5 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" /> ဆရာနှင့် ကျောင်းသား နှစ်ဦးတည်းသာ မြင်ရပါသည်
        </div>
      )}
      <div className="max-h-[28rem] min-h-64 space-y-1.5 overflow-y-auto p-3">
        {msgs === null ? (
          <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin" /></div>
        ) : msgs.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No messages yet. Say hello 👋</p>
        ) : msgs.map((m) => {
          const d = new Date(m.created_at);
          const label = dayLabel(d);
          const showDay = label !== lastDay; lastDay = label;
          const mine = m.sender_id === me;
          const canDelete = mine || (teacher && !peer);
          return (
            <div key={m.id}>
              {showDay && <div className="my-2 flex justify-center"><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{label}</span></div>}
              <div className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card border border-border"}`}>
                  {!mine && (
                    <div className="mb-0.5 text-[11px] font-semibold">
                      {m.sender_name}{m.is_teacher && <span className="ml-1 rounded bg-accent px-1 text-[10px] text-accent-foreground">ဆရာ</span>}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <div className={`mt-0.5 flex items-center justify-end gap-1.5 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    {canDelete && (
                      <button aria-label="Delete message" onClick={() => remove(m.id)} className="opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 border-t border-border p-2">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={1} maxLength={4000}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
          placeholder="Message…" className="flex-1 resize-none rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
        <button onClick={send} disabled={busy || !body.trim()} aria-label="Send"
          className="rounded-md bg-primary px-3 text-primary-foreground disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function PrivateInbox({ cid, counts, onRead }: { cid: string; counts: Record<string, number>; onRead: () => void }) {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => {
    void supabase.rpc("classroom_roster_named", { _cid: cid }).then(({ data }) => setStudents((data as Student[]) ?? []));
  }, [cid]);
  if (!students) return <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin" /></div>;
  if (students.length === 0) return <p className="text-xs text-muted-foreground">No students yet.</p>;
  const selName = (() => { const s = students.find((x) => x.student_id === sel); return s?.display_name || s?.full_name || "Student"; })();
  return (
    <div className="grid gap-3 md:grid-cols-[240px_1fr]">
      <ul className={`${sel ? "hidden md:block" : "block"} max-h-[28rem] space-y-1 overflow-y-auto rounded-lg border border-border p-1`}>
        {students.map((s) => {
          const n = counts[s.student_id] ?? 0;
          const name = s.display_name || s.full_name || "Student";
          return (
            <li key={s.student_id}>
              <button onClick={() => setSel(s.student_id)}
                className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm md:py-1.5 ${sel === s.student_id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-foreground md:hidden">{name.charAt(0).toUpperCase()}</span>
                <span className="min-w-0 flex-1 truncate">{name}</span>
                {n > 0 && <span className="shrink-0 rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">{n}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {sel ? (
        <div className="min-w-0">
          <button onClick={() => setSel(null)} className="mb-2 inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted md:hidden">
            ← Back <span className="truncate text-muted-foreground">· {selName}</span>
          </button>
          <ChatThread cid={cid} peer={sel} teacher onRead={onRead} />
        </div>
      ) : <p className="hidden self-center text-center text-xs text-muted-foreground md:block">Choose a student to chat privately.</p>}
    </div>
  );
}
