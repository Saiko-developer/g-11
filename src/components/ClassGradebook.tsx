import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Viewer, type Row } from "@/components/ClassExamSubmissions";
import type { MockExamPaper } from "@/lib/mockExam";

type Student = { student_id: string; display_name: string; email: string | null; full_name: string | null };
type Exam = { id: string; title: string };
type Status = "graded" | "review" | "progress" | "none";
type Draft = { status: string; score?: number; total?: number };
type Phase = "ready" | "going" | "done" | "none";

const ghost = "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted";

export function statusOf(r: Pick<Row, "graded_at" | "submitted_at" | "started_at"> | undefined): Status {
  if (!r) return "none";
  if (r.graded_at) return "graded";
  if (r.submitted_at) return "review";
  if (r.started_at) return "progress";
  return "none";
}

export function ClassGradebook({ cid, onChange }: { cid: string; onChange: () => void }) {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [rows, setRows] = useState<Record<string, Record<string, Row>>>({});
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "going" | "done" | "none">("all");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [open, setOpen] = useState<{ exam: Exam; sid: string } | null>(null);

  const load = useCallback(async () => {
    const [{ data: st }, { data: ex }] = await Promise.all([
      supabase.rpc("classroom_roster_named", { _cid: cid }),
      supabase.from("classroom_assignments").select("id,title").eq("classroom_id", cid).eq("kind", "class_exam").order("created_at"),
    ]);
    const list = (ex as Exam[]) ?? [];
    const rosters = await Promise.all(list.map((e) => supabase.rpc("class_exam_roster", { _aid: e.id })));
    const map: Record<string, Record<string, Row>> = {};
    rosters.forEach((res, i) => {
      for (const r of (res.data as unknown as Row[]) ?? []) (map[r.student_id] ??= {})[list[i].id] = r;
    });
    const ids = Object.values(map).flatMap((m) => Object.values(m)).filter((r) => r.submitted_at && !r.graded_at && r.attempt_id).map((r) => r.attempt_id!);
    const dm: Record<string, Draft> = {};
    if (ids.length) {
      const { data } = await supabase.from("class_exam_ai_drafts").select("attempt_id,status,result").in("attempt_id", ids);
      for (const d of data ?? []) {
        const res = d.result as { score?: number; totalMarks?: number } | null;
        dm[d.attempt_id] = { status: d.status, score: res?.score, total: res?.totalMarks };
      }
    }
    setDrafts(dm);
    setExams(list);
    setRows(map);
    setStudents((st as Student[]) ?? []);
  }, [cid]);
  useEffect(() => void load(), [load]);

  const phaseOf = useCallback((r: Row | undefined): Phase => {
    const st = statusOf(r);
    if (st === "graded") return "done";
    if (st === "review") return drafts[r!.attempt_id ?? ""]?.status === "done" ? "ready" : "going";
    if (st === "progress") return "going";
    return "none";
  }, [drafts]);
  const has = useCallback((sid: string, p: Phase) => exams.some((e) => phaseOf(rows[sid]?.[e.id]) === p), [exams, rows, phaseOf]);
  const counts = useMemo(() => {
    const l = students ?? [];
    return { ready: l.filter((s) => has(s.student_id, "ready")).length, going: l.filter((s) => has(s.student_id, "going")).length,
      done: l.filter((s) => exams.length > 0 && exams.every((e) => phaseOf(rows[s.student_id]?.[e.id]) === "done")).length,
      none: l.filter((s) => has(s.student_id, "none")).length };
  }, [students, exams, rows, has, phaseOf]);

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

  if (!students) return <p className="text-xs text-muted-foreground">Loading…</p>;
  if (!students.length) return <p className="text-xs text-muted-foreground">ကျောင်းသား မရှိသေးပါ။ Class Code ကို ပေးပြီး ဖိတ်ပါ။</p>;

  const term = q.trim().toLowerCase();
  const shown = students.filter((s) =>
    (filter === "all" || (filter === "done"
      ? exams.length > 0 && exams.every((e) => phaseOf(rows[s.student_id]?.[e.id]) === "done")
      : has(s.student_id, filter)))
    && (!term || [s.display_name, s.full_name, s.email].some((v) => v?.toLowerCase().includes(term))),
  );
  const chips: [typeof filter, string][] = [["all", `အားလုံး (${students.length})`], ["ready", `🟢 AI Ready (${counts.ready})`], ["going", `⏳ စစ်နေဆဲ (${counts.going})`], ["done", `✅ ပြီးစီး (${counts.done})`], ["none", `⚪ မတင်သေး (${counts.none})`]];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ကျောင်းသား ရှာရန်…"
            className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm" />
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k}
            className={`rounded-full border px-2.5 py-1 text-xs ${filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>{label}</button>
        ))}
      </div>
      {counts.ready > 0 && (
        <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
          🔔 AI စစ်ပြီး Confirm & Send ရန် ကျောင်းသား {counts.ready} ဦး ရှိပါသည်
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {students.length} students • {exams.length} class exams • 🤖 {counts.ready} AI ready • ⏳ {counts.going} on-going
      </p>

      <ul className="space-y-2">
        {shown.map((s, i) => {
          const mine = rows[s.student_id] ?? {};
          const done = exams.filter((e) => mine[e.id]?.submitted_at).length;
          const graded = exams.map((e) => mine[e.id]).filter((r) => r?.graded_at && r.total_marks);
          const avg = graded.length
            ? Math.round((graded.reduce((t, r) => t + Number(r!.score ?? 0) / Number(r!.total_marks), 0) / graded.length) * 100)
            : null;
          return (
            <li key={s.student_id} className="rounded-lg border border-border p-2.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{i + 1}. {s.display_name || s.full_name || "(no name)"}</div>
                  <div className="truncate text-xs text-muted-foreground">✉️ {s.email}</div>
                  {exams.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {done}/{exams.length} submitted{avg !== null && ` • Average ${avg}%`}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button className={ghost} onClick={() => rename(s)} aria-label="Edit name"><Pencil className="h-3.5 w-3.5" /></button>
                  <button className={ghost} onClick={() => kick(s.student_id)} aria-label="Remove student"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              {exams.length > 0 && (
                <ul className="mt-2 space-y-1 border-t border-border pt-2">
                  {exams.map((e) => {
                    const r = mine[e.id];
                    const st = statusOf(r);
                    const ph = phaseOf(r);
                    const d = r?.attempt_id ? drafts[r.attempt_id] : undefined;
                    const go = () => setOpen({ exam: e, sid: s.student_id });
                    return (
                      <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5 text-xs">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">📄 {e.title}</span>
                          <span className="text-muted-foreground">
                            {ph === "ready" && `🟢 🤖 AI Ready${d?.score != null ? ` (ရမှတ်: ${d.score}/${d.total ?? "—"})` : ""}`}
                            {ph === "done" && `✅ Finish (ရမှတ်: ${r!.score}/${r!.total_marks} — ပို့ပြီး)`}
                            {ph === "going" && (st === "progress" ? "✍️ ဖြေဆိုနေဆဲ" : d?.status === "failed" || d?.status === "error" ? "📝 AI မအောင်မြင် — ဆရာစစ်ရန်" : "⏳ AI စစ်ဆေးနေဆဲ…")}
                            {ph === "none" && "⚪ Unfinish (အဖြေလွှာ မတင်သေးပါ)"}
                          </span>
                        </span>
                        {ph === "ready" && <button onClick={go} className="rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground hover:opacity-90">Confirm & Send ➔</button>}
                        {ph === "done" && <button onClick={go} className="rounded-full border border-border px-2.5 py-1 hover:bg-muted">အဖြေလွှာ ကြည့်</button>}
                        {ph === "going" && st === "review" && <button onClick={go} className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground hover:opacity-80">📝 Grade Now</button>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
        {shown.length === 0 && <li className="text-xs text-muted-foreground">မတွေ့ပါ။</li>}
      </ul>

      {open && rows[open.sid]?.[open.exam.id] && (
        <GradeDialog exam={open.exam} row={rows[open.sid][open.exam.id]} onClose={() => setOpen(null)}
          onSaved={async () => { await load(); setOpen(null); }} />
      )}
    </div>
  );
}

function GradeDialog({ exam, row, onClose, onSaved }: { exam: Exam; row: Row; onClose: () => void; onSaved: () => Promise<void> }) {
  const [paper, setPaper] = useState<MockExamPaper | null>(null);
  useEffect(() => {
    void supabase.rpc("class_exam_open", { _aid: exam.id }).then(({ data, error }) => {
      if (error) return toast.error(error.message);
      setPaper((data as unknown as { paper: MockExamPaper }).paper);
    });
  }, [exam.id]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-2 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-background p-3 shadow-xl sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-bold">📝 {row.display_name || "Student"} — {exam.title}</h3>
          <button onClick={onClose} className={ghost} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {paper ? <Viewer row={row} paper={paper} onSaved={onSaved} /> : <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />}
      </div>
    </div>
  );
}
