import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Req = {
  id: string;
  user_id: string;
  school: string;
  subject: string;
  note: string | null;
  status: string;
  created_at: string;
};

/** Student side: ask admin for the teacher role. */
export function TeacherRequestCard({ userId }: { userId: string }) {
  const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
  const [latest, setLatest] = useState<Req | null>(null);
  const [open, setOpen] = useState(false);
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const [{ data: roles }, { data: reqs }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("teacher_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
    ]);
    setIsTeacher(!!roles?.some((r) => r.role === "teacher" || r.role === "admin"));
    setLatest((reqs?.[0] as Req) ?? null);
  };
  useEffect(() => { load(); }, [userId]);

  if (isTeacher === null || isTeacher) return null;

  const submit = async () => {
    setMsg(null);
    if (school.trim().length < 2 || subject.trim().length < 2) {
      setMsg("ကျောင်းအမည်နှင့် သင်ကြားသည့်ဘာသာ ဖြည့်ပါ။");
      return;
    }
    setBusy(true);
    const { error } = await supabase.rpc("request_teacher_role", {
      _school: school.slice(0, 120), _subject: subject.slice(0, 120), _note: note.slice(0, 500),
    });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setOpen(false);
    load();
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <h2 className="font-semibold">👩‍🏫 ဆရာအကောင့် လျှောက်ထားရန်</h2>
      {latest?.status === "pending" ? (
        <p className="mt-1 text-sm text-muted-foreground">
          ⏳ Admin စစ်ဆေးနေပါသည် (Pending Approval) — {latest.school} · {latest.subject}
        </p>
      ) : (
        <>
          {latest?.status === "rejected" && (
            <p className="mt-1 text-sm text-destructive">ယခင်လျှောက်ထားချက်ကို ပယ်ချခဲ့ပါသည်။ ထပ်မံလျှောက်ထားနိုင်ပါသည်။</p>
          )}
          {!open ? (
            <button onClick={() => setOpen(true)} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Request Teacher Role
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <input value={school} onChange={(e) => setSchool(e.target.value)} maxLength={120} placeholder="ကျောင်းအမည်" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} placeholder="သင်ကြားသည့် အတန်း / ဘာသာ" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="မှတ်ချက် (မထည့်လည်းရ)" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" rows={3} />
              {msg && <p className="text-sm text-destructive">{msg}</p>}
              <div className="flex gap-2">
                <button disabled={busy} onClick={submit} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "ပို့နေသည်…" : "Submit"}</button>
                <button onClick={() => setOpen(false)} className="rounded-lg border border-input px-4 py-2 text-sm">Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Admin side: approve / reject pending teacher requests. */
export function AdminTeacherRequests({ emails, onChanged }: { emails: Record<string, string>; onChanged: () => void }) {
  const [reqs, setReqs] = useState<Req[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const load = async () => {
    const { data } = await supabase.from("teacher_requests").select("*").eq("status", "pending").order("created_at");
    setReqs((data as Req[]) ?? []);
  };
  useEffect(() => { load(); }, []);
  if (!reqs.length) return null;

  const review = async (id: string, approve: boolean) => {
    setBusy(id);
    const { error } = await supabase.rpc("admin_review_teacher", { _id: id, _approve: approve });
    setBusy(null);
    if (error) alert(error.message);
    await load();
    onChanged();
  };

  return (
    <div className="mb-6 rounded-xl border border-primary/40 bg-primary/5 p-4">
      <h2 className="mb-2 font-semibold">👩‍🏫 ဆရာအကောင့် လျှောက်ထားသူများ ({reqs.length})</h2>
      {reqs.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center gap-2 border-t border-border py-2 text-sm">
          <div className="min-w-0 flex-1">
            <p className="font-medium">{emails[r.user_id] ?? r.user_id}</p>
            <p className="text-muted-foreground">{r.school} · {r.subject}{r.note && ` — ${r.note}`}</p>
          </div>
          <button disabled={busy === r.id} onClick={() => review(r.id, true)} className="rounded-lg bg-primary px-3 py-1 text-primary-foreground">Approve</button>
          <button disabled={busy === r.id} onClick={() => review(r.id, false)} className="rounded-lg border border-input px-3 py-1">Reject</button>
        </div>
      ))}
    </div>
  );
}
