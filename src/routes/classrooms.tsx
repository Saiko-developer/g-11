import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Copy, Plus, Users, LogOut, Trash2, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/components/AuthGate";
import { supabase } from "@/integrations/supabase/client";
import { ClassAssignments } from "@/components/ClassAssignments";
import { ClassFeed } from "@/components/ClassFeed";
import { ClassGradebook } from "@/components/ClassGradebook";
import { ChatThread, PrivateInbox, useChatUnread } from "@/components/ClassChat";

function ClassTabs({ cid, teacher, onChange }: { cid: string; teacher: boolean; onChange?: () => void }) {
  const [me, setMe] = useState<string | null>(null);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); }, []);
  const { counts, reload } = useChatUnread(cid);
  const groupN = counts.group ?? 0;
  const privN = teacher
    ? Object.entries(counts).reduce((s, [k, v]) => (k === "group" ? s : s + v), 0)
    : (me ? counts[me] ?? 0 : 0);
  const tabs: [string, string, number][] = teacher
    ? [["feed", "💬 Feed", 0], ["group", "👥 Group Chat", groupN], ["private", "🔒 Private Chat", privN], ["assign", "📋 Assignments", 0], ["grades", "🎓 Students & Grades", 0]]
    : [["feed", "💬 Feed", 0], ["group", "👥 Group Chat", groupN], ["private", "🔒 Chat with Teacher", privN], ["assign", "📋 Assignments", 0]];
  const [tab, setTab] = useState<string>("assign");
  return (
    <div className="mt-3 border-t border-border pt-3">
      <div role="tablist" className="mb-3 flex flex-wrap gap-1">
        {tabs.map(([k, label, n]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`relative rounded-md px-2.5 py-1.5 text-xs font-medium ${tab === k ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}>
            {label}
            {n > 0 && <span className="ml-1 rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">{n}</span>}
          </button>
        ))}
      </div>
      {tab === "feed" && <ClassFeed cid={cid} teacher={teacher} />}
      {tab === "group" && <ChatThread cid={cid} peer={null} teacher={teacher} onRead={reload} />}
      {tab === "private" && (teacher
        ? <PrivateInbox cid={cid} counts={counts} onRead={reload} />
        : me && <ChatThread cid={cid} peer={me} teacher={false} onRead={reload} />)}
      {tab === "assign" && <ClassAssignments cid={cid} teacher={teacher} />}
      {tab === "grades" && teacher && <ClassGradebook cid={cid} onChange={onChange ?? (() => {})} />}
    </div>
  );
}

export const Route = createFileRoute("/classrooms")({
  head: () => ({
    meta: [
      { title: "Classrooms | Sayar Owl Academy" },
      { name: "description", content: "Teachers create classes with a class code; students join with the code." },
      { property: "og:title", content: "Classrooms — Sayar Owl Academy" },
      { property: "og:description", content: "Create a class or join your teacher's class with a code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClassroomsPage,
});

type Room = { id: string; name: string; subject: string; code: string; created_at: string; count: number };
type Joined = { id: string; name: string; subject: string; code: string; teacher_name: string | null; joined_at: string };
type Student = { student_id: string; display_name: string; email: string | null; full_name: string | null; joined_at: string };

const card = "rounded-xl border border-border bg-card p-4 shadow-sm";
const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const btn = "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60";
const ghost = "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted";

function ClassroomsPage() {
  const { session, ready } = useAuth();
  const [isTeacher, setIsTeacher] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) return;
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .then(({ data }) => setIsTeacher(!!data?.some((r) => r.role === "teacher" || r.role === "admin")));
  }, [session]);

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold">Classrooms</h1>
        {!ready ? null : !session ? (
          <p className="text-sm text-muted-foreground">Sign in first.</p>
        ) : isTeacher === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : isTeacher ? (
          <TeacherView />
        ) : (
          <StudentView />
        )}
      </main>
    </div>
  );
}

function TeacherView() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("classrooms")
      .select("id,name,subject,code,created_at,classroom_members(count)")
      .eq("teacher_id", u.user?.id ?? "")
      .order("created_at", { ascending: false });
    setRooms(
      (data ?? []).map((r: any) => ({ ...r, count: r.classroom_members?.[0]?.count ?? 0 })),
    );
  }, []);
  useEffect(() => void load(), [load]);

  const create = async () => {
    if (!name.trim()) return toast.error("အတန်းအမည် ထည့်ပါ");
    setBusy(true);
    const { error } = await supabase.rpc("create_classroom", { _name: name.trim(), _subject: subject.trim() });
    setBusy(false);
    if (error) return toast.error(error.message);
    setName("");
    setSubject("");
    toast.success("အတန်းအသစ် ဖွင့်ပြီးပါပြီ");
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("ဤအတန်းကို ဖျက်မှာ သေချာပါသလား?")) return;
    const { error } = await supabase.from("classrooms").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  };

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">👩‍🏫 ဆရာ — အတန်းဖွင့်ပြီး Class Code ကို ကျောင်းသားများထံ ပေးပါ။</p>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button className={btn} onClick={() => setCreateOpen(!createOpen)}>
          <Plus className="h-4 w-4" /> Create Class
        </button>
        <MyNameCard />
      </div>
      {createOpen && (
      <div className={`${card} mb-6`}>
        <h2 className="mb-3 font-semibold">+ Create Class</h2>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className={input} placeholder="Class name (e.g. Grade 10-A)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={input} placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <button className={btn} disabled={busy} onClick={async () => { await create(); }}>
            <Plus className="h-4 w-4" /> Create
          </button>
        </div>
      </div>
      )}
      {rooms.length === 0 ? (
        <p className="text-sm text-muted-foreground">အတန်း မရှိသေးပါ။</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rooms.map((r) => (
            <div key={r.id} className={card}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  {r.subject && <p className="text-xs text-muted-foreground">{r.subject}</p>}
                </div>
                <button className={ghost} onClick={() => remove(r.id)} aria-label="Delete class">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm font-semibold">{r.code}</code>
                <button
                  className={ghost}
                  onClick={() => {
                    void navigator.clipboard.writeText(r.code);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              <button className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(open === r.id ? null : r.id)}>
                <Users className="h-4 w-4" /> {r.count} students
                {open === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {open === r.id && <Roster cid={r.id} onChange={load} />}
              <ClassTabs cid={r.id} teacher onChange={load} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Roster({ cid, onChange }: { cid: string; onChange: () => void }) {
  const [list, setList] = useState<Student[] | null>(null);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc("classroom_roster_named", { _cid: cid });
    setList((data as Student[]) ?? []);
  }, [cid]);
  useEffect(() => void load(), [load]);
  const kick = async (sid: string) => {
    if (!confirm("ဤကျောင်းသားကို အတန်းမှ ဖယ်မှာလား?")) return;
    const { error } = await supabase.from("classroom_members").delete().eq("classroom_id", cid).eq("student_id", sid);
    if (error) return toast.error(error.message);
    void load();
    onChange();
  };
  const rename = async (s: Student) => {
    const n = prompt("ကျောင်းသားအမည် / ခုံအမှတ်", s.display_name || s.full_name || "");
    if (n === null) return;
    const { error } = await supabase.rpc("set_member_name", { _cid: cid, _sid: s.student_id, _name: n });
    if (error) return toast.error(error.message);
    void load();
  };
  if (!list) return <p className="mt-2 text-xs text-muted-foreground">Loading…</p>;
  if (!list.length) return <p className="mt-2 text-xs text-muted-foreground">ကျောင်းသား မရှိသေးပါ။</p>;
  return (
    <ul className="mt-2 divide-y divide-border text-sm">
      {list.map((s, i) => (
        <li key={s.student_id} className="flex items-center justify-between gap-2 py-1.5">
          <div className="min-w-0">
            <div className="truncate font-medium">{i + 1}. {s.display_name || s.full_name || "(no name)"}</div>
            <div className="truncate text-xs text-muted-foreground">✉️ {s.email}</div>
          </div>
          <div className="flex shrink-0 gap-1">
            <button className={ghost} onClick={() => rename(s)} aria-label="Edit name">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button className={ghost} onClick={() => kick(s.student_id)} aria-label="Remove student">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MyNameCard() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    void supabase.rpc("my_name").then(({ data }) => setName((data as string) ?? ""));
  }, []);
  const save = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("set_my_name", { _name: name });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("အမည် သိမ်းပြီးပါပြီ");
  };
  if (!editing) {
    return (
      <button className={ghost} onClick={() => setEditing(true)}>
        <Pencil className="h-3.5 w-3.5" /> Teacher name: <b>{name || "(not set)"}</b>
      </button>
    );
  }
  return (
    <div className={`${card} mb-4`}>
      <h2 className="mb-1 font-semibold">Teacher name</h2>
      <p className="mb-3 text-xs text-muted-foreground">ကျောင်းသားများ မြင်ရမည့် ဆရာအမည် (ဥပမာ Tr. Daw Hla)</p>
      <div className="flex gap-2">
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tr. ..." />
        <button className={btn} disabled={busy} onClick={async () => { await save(); setEditing(false); }}>Save</button>
        <button className={ghost} onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  );
}

function StudentView() {
  const [classes, setClasses] = useState<Joined[]>([]);
  const [code, setCode] = useState("");
  const [sname, setSname] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc("my_classes");
    setClasses((data as Joined[]) ?? []);
  }, []);
  useEffect(() => {
    void load();
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    void supabase.rpc("my_name").then(({ data }) => data && setSname((s) => s || (data as string)));
  }, [load]);

  const join = async () => {
    if (!code.trim()) return toast.error("Class Code ထည့်ပါ");
    if (sname.trim().length < 2) return toast.error("ကျောင်းသားအမည် ထည့်ပါ");
    setBusy(true);
    const { error } = await supabase.rpc("join_classroom_named", { _code: code.trim().toUpperCase(), _name: sname.trim() });
    setBusy(false);
    if (error) return toast.error(error.message.includes("not found") ? "Class Code မှားနေပါသည်" : error.message);
    setCode("");
    toast.success("အတန်းထဲ ဝင်ရောက်ပြီးပါပြီ");
    void load();
  };
  const leave = async (id: string) => {
    if (!confirm("ဤအတန်းမှ ထွက်မှာလား?")) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("classroom_members").delete().eq("classroom_id", id).eq("student_id", u.user?.id ?? "");
    if (error) return toast.error(error.message);
    void load();
  };

  const showJoin = joinOpen || classes.length === 0;
  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">ဆရာပေးသော Class Code ဖြင့် အတန်းထဲ ဝင်ပါ။</p>
      {!showJoin ? (
        <button className={`${btn} mb-6`} onClick={() => setJoinOpen(true)}>
          <Plus className="h-4 w-4" /> Join Another Class
        </button>
      ) : (
      <div className={`${card} mb-6`}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Join Class</h2>
          {classes.length > 0 && <button className={ghost} onClick={() => setJoinOpen(false)}>Close</button>}
        </div>
        <div className="grid gap-2">
          <p className="text-xs text-muted-foreground">Signed in as: <span className="font-medium text-foreground">{email}</span></p>
          <input className={`${input} font-mono uppercase`} placeholder="Class Code (OWL-XXXX)" value={code} onChange={(e) => setCode(e.target.value)} />
          <input className={input} placeholder="Student name / Roll no (e.g. Mg Phyo - Roll 01)" value={sname} onChange={(e) => setSname(e.target.value)} onKeyDown={(e) => e.key === "Enter" && join()} />
          <button className={btn} disabled={busy} onClick={join}>Join Class</button>
        </div>
      </div>
      )}
      <h2 className="mb-3 font-semibold">My Classes</h2>
      {classes.length === 0 ? (
        <p className="text-sm text-muted-foreground">အတန်း မဝင်ရသေးပါ။</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {classes.map((c) => (
            <div key={c.id} className={card}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  {c.subject && <p className="text-xs text-muted-foreground">{c.subject}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">👩‍🏫 {c.teacher_name || "Teacher"}</p>
                </div>
                <button className={ghost} onClick={() => leave(c.id)}>
                  <LogOut className="h-3.5 w-3.5" /> Leave
                </button>
              </div>
              <ClassTabs cid={c.id} teacher={false} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
