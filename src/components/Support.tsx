import { useCallback, useEffect, useState } from "react";
import { Megaphone, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthGate";
import { useOnline } from "@/components/Offline";
import { toast } from "sonner";

type Msg = { id: string; user_id: string; from_admin: boolean; body: string; read_by_user: boolean; read_by_admin: boolean; created_at: string };
type Ann = { id: string; title: string; body: string; active: boolean; created_at: string };

/** Hand-drawn style help/feedback SVG icon. */
export function HelpIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" />
      <path d="M9.6 7.8a2.4 2.4 0 0 1 4.7.6c0 1.6-2.3 2-2.3 3.3" />
      <circle cx="12" cy="13.6" r=".6" fill="currentColor" />
    </svg>
  );
}

/** Unread admin replies for the signed-in user. */
export function useSupportUnread(userId?: string) {
  const [n, setN] = useState(0);
  const load = useCallback(async () => {
    if (!userId) return;
    const { count } = await supabase.from("support_messages").select("id", { count: "exact", head: true })
      .eq("user_id", userId).eq("from_admin", true).eq("read_by_user", false);
    setN(count ?? 0);
  }, [userId]);
  useEffect(() => { void load(); }, [load]);
  return { unread: n, reload: load };
}

/** User-side Help & Feedback thread with the admin. */
export function SupportThread({ userId, onRead }: { userId: string; onRead?: () => void }) {
  const online = useOnline();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.from("support_messages").select("*").eq("user_id", userId).order("created_at");
    setMsgs((data as Msg[]) ?? []);
    if ((data as Msg[] | null)?.some((m) => m.from_admin && !m.read_by_user)) {
      await supabase.from("support_messages").update({ read_by_user: true }).eq("user_id", userId).eq("from_admin", true).eq("read_by_user", false);
      onRead?.();
    }
  }, [userId, onRead]);
  useEffect(() => { void load(); }, [load]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    const { error } = await supabase.from("support_messages").insert({ user_id: userId, body: body.slice(0, 2000), from_admin: false, read_by_admin: false, read_by_user: true });
    setBusy(false);
    if (error) return toast.error(error.message);
    setText("");
    toast.success("Admin ထံ ပို့ပြီးပါပြီ");
    void load();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">မေးခွန်း၊ အခက်အခဲ၊ အကြံပြုချက်များကို Admin ထံ ပေးပို့နိုင်ပါသည်။</p>
      <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-border bg-muted/30 p-3">
        {msgs.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">စာတို မရှိသေးပါ</p>}
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from_admin ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from_admin ? "bg-card border border-border" : "bg-primary text-primary-foreground"}`}>
              <div className="mb-0.5 text-[10px] opacity-70">{m.from_admin ? "👑 Admin" : "သင်"} · {new Date(m.created_at).toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{m.body}</div>
            </div>
          </div>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={3}
        placeholder="အကူအညီလိုအပ်သည်များကို ရေးသားပေးပါ..."
        className="w-full rounded-xl border border-input bg-background p-3 text-sm" />
      <button onClick={send} disabled={busy || !text.trim() || !online}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
        <Send className="h-4 w-4" /> {online ? (busy ? "ပို့နေသည်…" : "ပေးပို့မည်") : "အင်တာနက် လိုအပ်ပါသည်"}
      </button>
    </div>
  );
}

/** Banner showing active admin announcements (dismissable per announcement). */
export function AnnouncementBanner() {
  const { session } = useAuth();
  const [items, setItems] = useState<Ann[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  useEffect(() => {
    try { setHidden(JSON.parse(localStorage.getItem("ann-hidden") || "[]")); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (!session) { setItems([]); return; }
    void supabase.from("announcements").select("*").eq("active", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setItems((data as Ann[]) ?? []));
  }, [session]);
  const shown = items.filter((a) => !hidden.includes(a.id));
  if (!shown.length) return null;
  const hide = (id: string) => { const h = [...hidden, id]; setHidden(h); localStorage.setItem("ann-hidden", JSON.stringify(h)); };
  return (
    <div className="space-y-px">
      {shown.map((a) => (
        <div key={a.id} className="flex items-start gap-2 bg-primary px-4 py-2 text-sm text-primary-foreground">
          <Megaphone className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1"><b>{a.title}</b> — <span className="whitespace-pre-wrap">{a.body}</span></div>
          <button aria-label="Dismiss" onClick={() => hide(a.id)} className="rounded p-0.5 hover:bg-primary-foreground/20"><X className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

/** Admin: inbox grouped by user + reply. */
export function AdminSupportInbox({ emails }: { emails: Record<string, string> }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const load = useCallback(async () => {
    const { data } = await supabase.from("support_messages").select("*").order("created_at").limit(1000);
    setMsgs((data as Msg[]) ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const byUser = new Map<string, Msg[]>();
  msgs.forEach((m) => byUser.set(m.user_id, [...(byUser.get(m.user_id) ?? []), m]));
  const threads = [...byUser.entries()].sort((a, b) => b[1][b[1].length - 1].created_at.localeCompare(a[1][a[1].length - 1].created_at));
  const unreadTotal = msgs.filter((m) => !m.from_admin && !m.read_by_admin).length;

  const openThread = async (uid: string) => {
    setOpen(open === uid ? null : uid); setReply("");
    if ((byUser.get(uid) ?? []).some((m) => !m.from_admin && !m.read_by_admin)) {
      await supabase.from("support_messages").update({ read_by_admin: true }).eq("user_id", uid).eq("from_admin", false);
      void load();
    }
  };
  const send = async (uid: string) => {
    const body = reply.trim(); if (!body) return;
    const { error } = await supabase.from("support_messages").insert({ user_id: uid, body: body.slice(0, 2000), from_admin: true, read_by_admin: true, read_by_user: false });
    if (error) return toast.error(error.message);
    setReply(""); toast.success("ပြန်စာ ပို့ပြီးပါပြီ"); void load();
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 font-semibold"><HelpIcon /> Help & Feedback Inbox
        {unreadTotal > 0 && <span className="rounded-full bg-destructive px-2 text-xs text-destructive-foreground">{unreadTotal} အသစ်</span>}</h2>
      {threads.length === 0 && <p className="text-sm text-muted-foreground">စာတို မရှိသေးပါ</p>}
      <div className="divide-y divide-border">
        {threads.map(([uid, list]) => {
          const last = list[list.length - 1];
          const unread = list.some((m) => !m.from_admin && !m.read_by_admin);
          return (
            <div key={uid} className="py-2">
              <button onClick={() => openThread(uid)} className="flex w-full items-center gap-2 text-left text-sm">
                {unread && <span className="h-2 w-2 rounded-full bg-destructive" />}
                <span className="font-medium">{emails[uid] ?? uid.slice(0, 8)}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">— {last.from_admin ? "↳ " : ""}{last.body}</span>
                <span className="text-xs text-muted-foreground">{new Date(last.created_at).toLocaleDateString()}</span>
              </button>
              {open === uid && (
                <div className="mt-2 space-y-2 rounded-lg bg-muted/40 p-3">
                  {list.map((m) => (
                    <div key={m.id} className="text-sm"><b>{m.from_admin ? "👑 Admin" : "👤 User"}:</b> <span className="whitespace-pre-wrap">{m.body}</span>
                      <span className="ml-2 text-[10px] text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span></div>
                  ))}
                  <div className="flex gap-2">
                    <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="ပြန်စာ ရေးပါ..." className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
                    <button onClick={() => send(uid)} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">ပြန်စာပို့</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Admin: write / toggle / delete announcements. */
export function AdminAnnouncements() {
  const [items, setItems] = useState<Ann[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const load = useCallback(async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data as Ann[]) ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const add = async () => {
    if (!title.trim() || !body.trim()) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("announcements").insert({ title: title.trim(), body: body.trim(), active: true, created_by: u.user?.id });
    if (error) return toast.error(error.message);
    setTitle(""); setBody(""); toast.success("ကြေညာချက် ထုတ်ပြီးပါပြီ"); void load();
  };
  const toggle = async (a: Ann) => { await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id); void load(); };
  const remove = async (a: Ann) => { if (confirm("ဖျက်မှာ သေချာပါသလား?")) { await supabase.from("announcements").delete().eq("id", a.id); void load(); } };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 font-semibold"><Megaphone className="h-5 w-5" /> ကြေညာချက်များ (Announcements)</h2>
      <div className="space-y-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ခေါင်းစဉ်" maxLength={120} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="အကြောင်းအရာ" maxLength={1000} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <button onClick={add} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">ကြေညာချက် ထုတ်မည်</button>
      </div>
      <div className="mt-3 divide-y divide-border">
        {items.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
            <span className={`rounded-full px-2 text-xs ${a.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{a.active ? "ပြသနေသည်" : "ပိတ်ထား"}</span>
            <span className="min-w-0 flex-1 truncate"><b>{a.title}</b> — {a.body}</span>
            <button onClick={() => toggle(a)} className="rounded-lg border border-input px-2 py-1 text-xs">{a.active ? "ပိတ်မည်" : "ဖွင့်မည်"}</button>
            <button onClick={() => remove(a)} className="rounded-lg border border-destructive px-2 py-1 text-xs text-destructive">ဖျက်မည်</button>
          </div>
        ))}
      </div>
    </div>
  );
}
