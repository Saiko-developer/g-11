import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { signInWithGoogle } from "@/components/RequireSignIn";
import { listStudents, setStudentStatus, deleteStudent, setAdminRole, setTeacherRole, updateTutorWallet } from "@/lib/admin.functions";
import { useAuth } from "@/components/AuthGate";
import { StudentProgress } from "@/components/StudentProgress";
import { AdminTopups } from "@/components/Topup";
import { AdminTeacherRequests } from "@/components/TeacherRequest";
import { Button } from "@/components/ui/button";
import { AdminAiStatus } from "@/components/AdminAiStatus";
import { AdminSupportInbox, AdminAnnouncements } from "@/components/Support";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Student Accounts | Sayar Owl Academy" },
      { name: "description", content: "Manage student accounts: suspend, reactivate or delete." },
      { property: "og:title", content: "Admin — Sayar Owl Academy" },
      { property: "og:description", content: "Teacher dashboard for managing student accounts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { access, session, signOut, ready } = useAuth();
  if (!ready || (session && !access)) return <main className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading…</main>;
  if (!session) return <AdminLogin />;
  if (!access?.is_admin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-foreground">
        <p>Admin only. (သင်သည် Admin မဟုတ်ပါ)</p>
        <div className="flex gap-2">
          <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Back</Link>
          <button onClick={signOut} className="rounded-lg border border-input px-4 py-2 text-sm">Sign out</button>
        </div>
      </main>
    );
  }
  return <Dashboard myId={session.user.id} onSignOut={signOut} />;
}

function Dashboard({ myId, onSignOut }: { myId: string; onSignOut: () => void }) {
  const qc = useQueryClient();
  const list = useServerFn(listStudents);
  const setStatus = useServerFn(setStudentStatus);
  const del = useServerFn(deleteStudent);
  const setRole = useServerFn(setAdminRole);
  const setTeacher = useServerFn(setTeacherRole);
  const tutor = useServerFn(updateTutorWallet);
  const [busy, setBusy] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const { data = [], isLoading, error } = useQuery({ queryKey: ["students"], queryFn: () => list() });

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    try { await fn(); await qc.invalidateQueries({ queryKey: ["students"] }); }
    catch (e) { alert((e as Error).message); }
    finally { setBusy(null); }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Students ({data.length})</h1>
            <p className="text-sm text-muted-foreground">Suspend, reactivate or delete student accounts.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="rounded-lg border border-input px-3 py-2 text-sm">Home</Link>
            <button onClick={onSignOut} className="rounded-lg border border-input px-3 py-2 text-sm">Sign out</button>
          </div>
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        <AdminAiStatus />
        <AdminSupportInbox emails={Object.fromEntries(data.map((s) => [s.id, s.full_name || s.email || s.id]))} />
        <AdminAnnouncements />
        <AdminTeacherRequests
          emails={Object.fromEntries(data.map((s) => [s.id, s.email ?? s.id]))}
          onChanged={() => qc.invalidateQueries({ queryKey: ["students"] })}
        />
        <AdminTopups
          emails={Object.fromEntries(data.map((s) => [s.id, s.email ?? s.id]))}
          onChanged={() => qc.invalidateQueries({ queryKey: ["students"] })}
        />
        {data.some((s) => s.scholarship === "pending") && (
          <div className="mb-6 rounded-xl border border-primary/40 bg-primary/5 p-4">
            <h2 className="mb-2 font-semibold">🎓 ပညာသင်ဆု လျှောက်ထားသူများ</h2>
            {data.filter((s) => s.scholarship === "pending").map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-2 border-t border-border py-2 text-sm">
                <span className="flex-1">{s.full_name || s.email} {s.scholarship_note && <span className="text-muted-foreground">— {s.scholarship_note}</span>}</span>
                <button disabled={busy === s.id} onClick={() => run(s.id, () => tutor({ data: { id: s.id, scholarship: "approved" } }))} className="rounded-lg bg-primary px-3 py-1 text-primary-foreground">Approve</button>
                <button disabled={busy === s.id} onClick={() => run(s.id, () => tutor({ data: { id: s.id, scholarship: "rejected" } }))} className="rounded-lg border border-input px-3 py-1">Reject</button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {data.map((s) => {
            const me = s.id === myId;
            const suspended = s.status === "suspended";
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
                <div className="flex w-full items-start gap-3">
                  {s.avatar_url ? <img src={s.avatar_url} alt="" className="h-11 w-11 shrink-0 rounded-full" /> : <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">{(s.full_name || s.email || "?").charAt(0).toUpperCase()}</div>}
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold leading-tight">{s.full_name || "—"}</p>
                    <p className="break-all text-sm text-muted-foreground">{s.email}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {me && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-foreground">You</span>}
                      {s.is_main_admin ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">Main Admin</span> : s.is_admin && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">Admin</span>}
                      {s.is_teacher && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground">Teacher</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${suspended ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {suspended ? `Suspended${s.suspended_until ? " until " + new Date(s.suspended_until).toLocaleDateString() : ""}` : "Active"}
                  </span>
                </div>
                <div className="w-full space-y-1 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <p className="whitespace-nowrap">🕒 Last seen: {new Date(s.last_seen_at).toLocaleString()}</p>
                  {s.is_admin || s.is_main_admin ? (
                    <p>👑 Admin · အကန့်အသတ်မရှိ (Unlimited)</p>
                  ) : (
                    <>
                      <p>💬 Sayar Owl: today {s.tutor_used_today}/{s.is_teacher ? 10 : 20} · bonus {s.tutor_bonus}{s.scholarship === "approved" && " · 🎓 unlimited"}</p>
                      <p>📝 Exam: today {s.exam_used_today}/{s.is_teacher ? 4 : 2} · bonus {s.exam_bonus}</p>
                    </>
                  )}
                </div>
                <button disabled={busy === s.id} onClick={() => { const n = Number(prompt("အကြိမ် ဘယ်လောက် ထည့်မလဲ?", "50")); if (n) run(s.id, () => tutor({ data: { id: s.id, addBonus: n } })); }} className="rounded-lg border border-input px-3 py-1.5 text-sm">+ Tutor Questions</button>
                <button disabled={busy === s.id} onClick={() => { const n = Number(prompt("စာမေးပွဲထုတ်ခွင့် ဘယ်နှစ်စုံ ထည့်မလဲ?", "5")); if (n) run(s.id, () => tutor({ data: { id: s.id, addExam: n } })); }} className="rounded-lg border border-input px-3 py-1.5 text-sm">+ Exam Credits</button>
                {s.scholarship === "approved" && <button disabled={busy === s.id} onClick={() => run(s.id, () => tutor({ data: { id: s.id, scholarship: "none" } }))} className="rounded-lg border border-input px-3 py-1.5 text-sm">End scholarship</button>}
                <button onClick={() => setViewing(viewing === s.id ? null : s.id)} className="rounded-lg border border-primary px-3 py-1.5 text-sm text-primary">{viewing === s.id ? "Hide Progress" : "View Progress"}</button>
                {!me && !s.is_main_admin && (
                  <div className="flex flex-wrap gap-2">
                    {suspended ? (
                      <button disabled={busy === s.id} onClick={() => run(s.id, () => setStatus({ data: { id: s.id, status: "active" } }))} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">Activate</button>
                    ) : (
                      <>
                        <button disabled={busy === s.id} onClick={() => run(s.id, () => setStatus({ data: { id: s.id, status: "suspended", days: 7 } }))} className="rounded-lg border border-input px-3 py-1.5 text-sm">Suspend 7 days</button>
                        <button disabled={busy === s.id} onClick={() => run(s.id, () => setStatus({ data: { id: s.id, status: "suspended" } }))} className="rounded-lg border border-input px-3 py-1.5 text-sm">Suspend</button>
                      </>
                    )}
                    <button disabled={busy === s.id} onClick={() => run(s.id, () => setRole({ data: { id: s.id, admin: !s.is_admin } }))} className="rounded-lg border border-input px-3 py-1.5 text-sm">{s.is_admin ? "Remove Admin" : "Make Admin"}</button>
                    {!s.is_admin && <button disabled={busy === s.id} onClick={() => run(s.id, () => setTeacher({ data: { id: s.id, teacher: !s.is_teacher } }))} className="rounded-lg border border-input px-3 py-1.5 text-sm">{s.is_teacher ? "Remove Teacher" : "Make Teacher"}</button>}
                    <button disabled={busy === s.id} onClick={() => confirm(`Delete ${s.email}? This cannot be undone.`) && run(s.id, () => del({ data: { id: s.id } }))} className="rounded-lg bg-destructive px-3 py-1.5 text-sm text-destructive-foreground">Delete</button>
                  </div>
                )}
                {viewing === s.id && (
                  <div className="w-full border-t border-border pt-4">
                    <StudentProgress userId={s.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function AdminLogin() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const go = async () => {
    setBusy(true);
    setMsg(null);
    localStorage.setItem("postLoginRedirect", "/admin");
    try {
      const r = await signInWithGoogle();
      if (r.error) {
        setMsg(r.error.message);
        localStorage.removeItem("postLoginRedirect");
        setBusy(false);
        return;
      }
      if (r.redirected) return;
      localStorage.removeItem("postLoginRedirect");
      setBusy(false);
    } catch {
      setMsg("Login မအောင်မြင်ပါ။ ထပ်စမ်းပါ။");
      setBusy(false);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-7 text-center shadow-sm">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <p className="text-sm text-muted-foreground">Google အကောင့်ရွေးသည့်နေရာတွင် Admin Gmail ကို ရွေးပါ (သို့) "Use another account" ကိုနှိပ်ပြီး ရိုက်ထည့်ပါ။</p>
        <Button onClick={go} disabled={busy} className="w-full">
          {busy ? "Google ဝင်းဒိုး ဖွင့်နေသည်…" : "Sign in with Google"}
        </Button>
        {msg && <p className="text-sm text-destructive">{msg}</p>}
        <Link to="/" className="block text-xs text-muted-foreground underline">Home သို့ ပြန်သွားရန်</Link>
      </div>
    </main>
  );
}
