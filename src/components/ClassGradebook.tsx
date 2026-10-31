import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Viewer, type Row } from "@/components/ClassExamSubmissions";
import type { MockExamPaper } from "@/lib/mockExam";

type Student = { student_id: string; display_name: string; email: string | null; full_name: string | null };
type Exam = { id: string; title: string };
type Status = "graded" | "review" | "progress" | "none";

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
  const [onlyReview, setOnlyReview] = useState(false);
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
    setExams(list);
    setRows(map);
    setStudents((st as Student[]) ?? []);
  }, [cid]);
  useEffect(() => void load(), [load]);

  const needReview = useMemo(
    () => (students ?? []).filter((s) => exams.some((e) => statusOf(rows[s.student_id]?.[e.id]) === "review")),
    [students, exams, rows],
  );

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
  const shown = (onlyReview ? needReview : students).filter(
    (s) => !term || [s.display_name, s.full_name, s.email].some((v) => v?.toLowerCase().includes(term)),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ကျောင်းသား ရှာရန်…"
            className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm" />
        </label>
        <div className="flex overflow-hidden rounded-md border border-border text-xs">
          <button onClick={() => setOnlyReview(false)} className={`px-2.5 py-2 ${!onlyReview ? "bg-muted font-semibold" : ""}`}>All ({students.length})</button>
          <button onClick={() => setOnlyReview(true)} className={`px-2.5 py-2 ${onlyReview ? "bg-muted font-semibold" : ""}`}>စစ်ရန်ကျန် ({needReview.length})</button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {students.length} students • {exams.length} class exams • {needReview.length} students waiting for grading
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
                    return (
                      <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="min-w-0 flex-1 truncate">📄 {e.title}</span>
                        {st === "graded" && (
                          <button onClick={() => setOpen({ exam: e, sid: s.student_id })} className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary hover:opacity-80">
                            🟢 {r!.score} / {r!.total_marks}
                          </button>
                        )}
                        {st === "review" && (
                          <button onClick={() => setOpen({ exam: e, sid: s.student_id })} className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground hover:opacity-80">
                            🟡 Uploaded · 📝 Grade Now
                          </button>
                        )}
                        {st === "progress" && <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">✍️ ဖြေဆိုနေဆဲ</span>}
                        {st === "none" && <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">⚪ Not submitted</span>}
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
      <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background p-3 shadow-xl sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-bold">📝 {row.display_name || "Student"} — {exam.title}</h3>
          <button onClick={onClose} className={ghost} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {paper ? <Viewer row={row} paper={paper} onSaved={onSaved} /> : <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />}
      </div>
    </div>
  );
}
