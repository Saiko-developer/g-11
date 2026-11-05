import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { MockExamPaper } from "@/lib/mockExam";
import type { GradeResult } from "@/routes/api/grade-exam";
import { WritingEvalCards } from "@/components/WritingEvalCards";

export type Row = {
  student_id: string; display_name: string; attempt_id: string | null; started_at: string | null;
  submitted_at: string | null; image_paths: string[]; score: number | null; total_marks: number | null;
  result: GradeResult | null; teacher_feedback: string; graded_at: string | null;
};


export function ClassExamSubmissions({ aid, paper }: { aid: string; paper: MockExamPaper }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [sel, setSel] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, { status: string; score?: number; total?: number }>>({});
  const load = async () => {
    const { data, error } = await supabase.rpc("class_exam_roster", { _aid: aid });
    if (error) return toast.error(error.message);
    setRows(data as unknown as Row[]);
  };
  useEffect(() => { void load(); }, [aid]);

  // Background AI marking: read draft statuses, start missing ones one at a time, poll until all are ready.
  useEffect(() => {
    if (!rows) return;
    const pending = rows.filter((r) => r.submitted_at && r.attempt_id && !r.graded_at);
    if (!pending.length) return;
    let stop = false; let timer: ReturnType<typeof setTimeout> | undefined;
    const started = new Set<string>();
    const tick = async () => {
      const ids = pending.map((r) => r.attempt_id as string);
      const { data } = await supabase.from("class_exam_ai_drafts").select("attempt_id,status,result").in("attempt_id", ids);
      if (stop) return;
      const map: Record<string, { status: string; score?: number; total?: number }> = {};
      for (const d of data ?? []) {
        const r = d.result as unknown as GradeResult | null;
        map[d.attempt_id] = { status: d.status, score: r?.score, total: r?.totalMarks };
      }
      setDrafts(map);
      const busy = Object.values(map).some((d) => d.status === "running" || d.status === "pending");
      const next = ids.find((id) => !map[id] && !started.has(id));
      if (!busy && next) {
        started.add(next);
        map[next] = { status: "running" };
        setDrafts({ ...map });
        const { data: s } = await supabase.auth.getSession();
        await fetch("/api/auto-grade", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${s.session?.access_token ?? ""}` },
          body: JSON.stringify({ attemptId: next }),
        }).catch(() => null);
        if (!stop) void tick();
        return;
      }
      const waiting = ids.some((id) => !map[id] || map[id].status === "running" || map[id].status === "pending");
      if (waiting) timer = setTimeout(() => void tick(), 6000);
    };
    void tick();
    return () => { stop = true; if (timer) clearTimeout(timer); };
  }, [rows]);

  if (!rows) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />;
  const submitted = rows.filter((r) => r.submitted_at).length;
  const cur = rows.find((r) => r.student_id === sel) ?? null;

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-border bg-card">
        <p className="border-b border-border px-4 py-3 text-sm font-semibold">Submitted {submitted}/{rows.length}</p>
        {rows.length === 0 && <p className="p-4 text-sm text-muted-foreground">No students in this class yet.</p>}
        <ul>
          {rows.map((r) => {
            const d = r.attempt_id ? drafts[r.attempt_id] : undefined;
            const aiLabel = !d ? "🕒 AI queue" : d.status === "done" ? `🟢 AI Ready${d.score != null ? ` (${d.score}/${d.total})` : ""}` : d.status === "running" || d.status === "pending" ? "⏳ AI marking…" : "✍️ Needs marking";
            const status = r.graded_at ? "✅ Sent" : r.submitted_at ? aiLabel : r.started_at ? "In progress" : "Not started";
            const dot = r.graded_at ? "bg-primary" : r.submitted_at ? "bg-accent" : r.started_at ? "bg-secondary" : "bg-muted";
            return (
              <li key={r.student_id}>
                <button onClick={() => setSel(r.student_id)}
                  className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left text-sm hover:bg-muted ${sel === r.student_id ? "bg-muted" : ""}`}>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full border border-border ${dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.display_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {status}{r.submitted_at && ` · ${r.image_paths.length} photos`}{r.graded_at && ` · ${r.score}/${r.total_marks}`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
      <section className="min-w-0">
        {cur ? <Viewer key={cur.student_id} row={cur} paper={paper} onSaved={async () => { await load(); }} />
          : <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">ကျောင်းသားတစ်ဦးကို ရွေးပြီး အဖြေလွှာ ကြည့်ပါ။</p>}
      </section>
    </div>
  );
}

export function Viewer({ row, paper, onSaved }: { row: Row; paper: MockExamPaper; onSaved: () => Promise<void> | void }) {
  const [urls, setUrls] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [view, setView] = useState<"paper" | "marks">("paper");
  const [grade, setGrade] = useState<GradeResult | null>(row.result);
  const [score, setScore] = useState<string>(row.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(row.teacher_feedback || row.result?.overallFeedback || "");
  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!row.image_paths.length) return;
    void supabase.storage.from("exam-photos").createSignedUrls(row.image_paths, 300).then(({ data }) => {
      setUrls((data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]);
    });
  }, [row.image_paths]);


  const applyDraft = (r: GradeResult) => {
    setGrade(r); setScore(String(r.score)); setFeedback(r.overallFeedback ?? "");
  };

  const callAuto = async (force: boolean) => {
    const { data: s } = await supabase.auth.getSession();
    return fetch("/api/auto-grade", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${s.session?.access_token ?? ""}` },
      body: JSON.stringify({ attemptId: row.attempt_id, force }),
    }).catch(() => null);
  };

  // Load the AI draft prepared at submit time; start it if missing and poll while it runs.
  useEffect(() => {
    if (!row.submitted_at || !row.attempt_id || row.graded_at) return;
    let stop = false; let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      const { data } = await supabase.from("class_exam_ai_drafts").select("status, result, error").eq("attempt_id", row.attempt_id ?? "").maybeSingle();
      if (stop) return;
      if (data?.status === "done" && data.result) { setAiBusy(false); applyDraft(data.result as unknown as GradeResult); return; }
      if (data?.status === "blocked" || data?.status === "error" || data?.status === "refused") { setAiBusy(false); if (data.error) toast.error(data.error); return; }
      if (!data) { setAiBusy(false); return; }
      setAiBusy(true);
      timer = setTimeout(() => void tick(), 5000);
    };
    void tick();
    return () => { stop = true; if (timer) clearTimeout(timer); };
  }, [row.attempt_id]);

  const runAi = async () => {
    setAiBusy(true);
    const res = await callAuto(true);
    const { data } = await supabase.from("class_exam_ai_drafts").select("status, result, error").eq("attempt_id", row.attempt_id ?? "").maybeSingle();
    setAiBusy(false);
    if (data?.status === "done" && data.result) { applyDraft(data.result as unknown as GradeResult); toast.success("AI က အမှတ်အကြမ်း ပေးပြီးပါပြီ — စစ်ဆေးပြီး Confirm လုပ်ပါ"); }
    else toast.error(data?.error ?? (res ? "AI marking failed" : "Network error"));
  };

  const save = async () => {
    if (!row.attempt_id) return;
    const n = Number(score);
    if (score === "" || Number.isNaN(n)) return toast.error("အမှတ် ထည့်ပါ");
    if (n < 0 || n > (grade?.totalMarks ?? paper.totalMarks)) return toast.error("Score must be between zero and total marks.");
    setSaving(true);
    const total = grade?.totalMarks ?? paper.totalMarks;
    const { error } = await supabase.rpc("class_exam_grade", {
      _attempt: row.attempt_id ?? "", _score: n, _total: total, _result: (grade ? { ...grade, score: n, overallFeedback: feedback } : null) as never, _feedback: feedback,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("ကျောင်းသားဆီ ရလဒ် ပို့ပြီးပါပြီ");
    await onSaved();
  };

  if (!row.submitted_at) return <p className="p-6 text-sm text-muted-foreground">{row.display_name} — {row.started_at ? "In progress" : "Not started"}</p>;

  return (
    <div>
    <div className="sticky top-0 z-10 mb-3 grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1 lg:hidden" role="tablist">
      <button role="tab" aria-selected={view === "paper"} onClick={() => setView("paper")}
        className={`rounded-lg px-2 py-2 text-sm font-medium ${view === "paper" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
        📄 Answer Paper ({urls.length})
      </button>
      <button role="tab" aria-selected={view === "marks"} onClick={() => setView("marks")}
        className={`rounded-lg px-2 py-2 text-sm font-medium ${view === "marks" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
        ✍️ Marks{score !== "" ? ` (${score}/${grade?.totalMarks ?? paper.totalMarks})` : ""}
      </button>
    </div>
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className={`${view === "paper" ? "block" : "hidden"} lg:block rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-2 lg:max-h-[calc(100vh-1rem)] lg:overflow-y-auto`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-bold">{row.display_name}</p>
            <p className="text-xs text-muted-foreground">Submitted {new Date(row.submitted_at).toLocaleString()}</p>
          </div>
          {row.graded_at && <span className="inline-flex items-center gap-1 text-sm text-primary"><CheckCircle2 className="h-4 w-4" /> Sent · {row.score}/{row.total_marks}</span>}
        </div>
        {urls.length > 0 ? (
          <>
            <a href={urls[page]} target="_blank" rel="noreferrer" className="mt-3 block">
              <img src={urls[page]} alt={`Answer page ${page + 1}`} className="max-h-[70vh] w-full rounded-lg border border-border object-contain" />
            </a>
            <div className="mt-2 flex flex-wrap gap-2">
              {urls.map((u, i) => (
                <button key={u} onClick={() => setPage(i)} className={`h-16 w-12 overflow-hidden rounded border-2 ${i === page ? "border-primary" : "border-border"}`}>
                  <img src={u} alt={`Page ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {urls.length > 1 && (
              <div className="mt-2 flex items-center justify-between lg:hidden">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</Button>
                <span className="text-xs text-muted-foreground">Page {page + 1} of {urls.length}</span>
                <Button size="sm" variant="outline" disabled={page >= urls.length - 1} onClick={() => setPage(page + 1)}>Next ›</Button>
              </div>
            )}
          </>
        ) : <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-primary" />}
        <Button className="mt-3 w-full lg:hidden" variant="secondary" onClick={() => setView("marks")}>✍️ Enter scores & marks</Button>
      </div>

      <div className={`${view === "marks" ? "block" : "hidden"} lg:block rounded-2xl border-2 border-primary/30 bg-card p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">အမှတ်ပေးခြင်း</h3>
          <Button size="sm" variant="outline" onClick={runAi} disabled={aiBusy || !urls.length}>
            {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} {grade ? "Re-grade with AI" : "Grade with AI"}
          </Button>
        </div>
        {aiBusy && <p className="mt-2 text-xs text-muted-foreground">AI အမှတ်အကြမ်း ပြင်ဆင်နေပါတယ် — အသင့်ဖြစ်တာနဲ့ ဒီမှာ အလိုအလျောက် ပေါ်လာပါမယ်…</p>}

        {grade?.items && grade.items.length > 0 && (
          <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto">
            {grade.items.map((it, i) => {
              const upd = (patch: Partial<typeof it>) => {
                const items = (grade.items ?? []).map((x, j) => (j === i ? { ...x, ...patch } : x));
                const total = items.reduce((s, x) => s + (Number(x.awarded) || 0), 0);
                setGrade({ ...grade, items, score: total });
                setScore(String(total));
              };
              const cls = it.status === "correct" ? "bg-primary/15 text-primary" : it.status === "partial" ? "bg-accent text-accent-foreground" : "bg-destructive/15 text-destructive";
              return (
                <li key={i} className="rounded-lg border border-border p-2 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="flex-1 font-medium">{it.section} {it.number}. {it.question}</p>
                    <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${cls}`}>{it.status === "correct" ? "✓ Correct" : it.status === "partial" ? "~ Partial" : "✗ Wrong"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Student: {it.studentAnswer} · Key: {it.correctAnswer}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <input type="number" step="0.5" min={0} max={it.marks} value={it.awarded}
                      onChange={(e) => {
                        const v = Math.max(0, Math.min(Number(it.marks), Number(e.target.value) || 0));
                        upd({ awarded: v, status: v >= Number(it.marks) ? "correct" : v > 0 ? "partial" : "wrong" } as Partial<typeof it>);
                      }}
                      className="w-16 rounded-md border border-input bg-background px-2 py-1" />
                    <span className="text-muted-foreground">/ {it.marks} marks</span>
                  </div>
                  <textarea value={it.explanation ?? ""} onChange={(e) => upd({ explanation: e.target.value })} rows={2}
                    placeholder="ဆရာ့မှတ်ချက် / အမှားပြင်ဆင်ချက်"
                    className="mt-1 w-full rounded-md border border-input bg-background p-1.5 text-xs" />
                </li>
              );
            })}
          </ul>
        )}
        {grade?.writing && grade.writing.length > 0 && (
          <div className="mt-3">
            <WritingEvalCards evals={grade.writing} onChange={(writing) => {
              // Keep the matching writing item in sync with its rubric total.
              const items = (grade.items ?? []).map((it) => {
                const w = writing.find((x) => x.section === it.section);
                if (!w) return it;
                const v = w.score;
                return { ...it, awarded: v, status: (v >= it.marks ? "correct" : v > 0 ? "partial" : "wrong") as typeof it.status };
              });
              const total = items.length ? items.reduce((s, x) => s + (Number(x.awarded) || 0), 0) : grade.score;
              setGrade({ ...grade, writing, items, score: total });
              setScore(String(total));
            }} />
          </div>
        )}
        {grade?.writingFeedback !== undefined && grade?.writingFeedback !== null && grade.writingFeedback !== "" && (
          <label className="mt-2 block text-sm font-medium">Writing feedback
            <textarea value={grade.writingFeedback} onChange={(e) => setGrade({ ...grade, writingFeedback: e.target.value })} rows={2}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
          </label>
        )}
        {grade?.unreadable && <p className="mt-1 text-xs text-destructive">{grade.unreadable}</p>}

        <label className="mt-4 block text-sm font-medium">Score
          <div className="mt-1 flex items-center gap-2">
            <input type="number" step="0.5" value={score} onChange={(e) => setScore(e.target.value)}
              className="w-24 rounded-md border border-input bg-background px-2 py-1.5" />
            <span className="text-muted-foreground">/ {grade?.totalMarks ?? paper.totalMarks}</span>
          </div>
        </label>
        <label className="mt-3 block text-sm font-medium">Feedback to student
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4}
            className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
        </label>
        <Button className="mt-3" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Confirm & Send to Student
        </Button>
      </div>
    </div>
    </div>
  );
}
