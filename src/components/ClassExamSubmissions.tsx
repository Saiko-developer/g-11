import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { MockExamPaper } from "@/lib/mockExam";
import type { GradeResult } from "@/routes/api/grade-exam";

type Row = {
  student_id: string; display_name: string; attempt_id: string | null; started_at: string | null;
  submitted_at: string | null; image_paths: string[]; score: number | null; total_marks: number | null;
  result: GradeResult | null; teacher_feedback: string; graded_at: string | null;
};

async function toDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(blob); });
}

export function ClassExamSubmissions({ aid, paper }: { aid: string; paper: MockExamPaper }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [sel, setSel] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.rpc("class_exam_roster", { _aid: aid });
    if (error) return toast.error(error.message);
    setRows(data as unknown as Row[]);
  };
  useEffect(() => { void load(); }, [aid]);

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
            const status = r.graded_at ? "Graded" : r.submitted_at ? "Submitted" : r.started_at ? "In progress" : "Not started";
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

function Viewer({ row, paper, onSaved }: { row: Row; paper: MockExamPaper; onSaved: () => Promise<void> | void }) {
  const [urls, setUrls] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [grade, setGrade] = useState<GradeResult | null>(row.result);
  const [score, setScore] = useState<string>(row.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(row.teacher_feedback || row.result?.overallFeedback || "");
  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!row.image_paths.length) return;
    void supabase.storage.from("exam-photos").createSignedUrls(row.image_paths, 3600).then(({ data }) => {
      setUrls((data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]);
    });
  }, [row.image_paths]);

  if (!row.submitted_at) {
    return <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">{row.display_name} — {row.started_at ? "ဖြေဆိုနေဆဲ (မတင်သွင်းရသေးပါ)" : "စာမေးပွဲ မစရသေးပါ"}</p>;
  }

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
    let stop = false; let kicked = false;
    const tick = async () => {
      const { data } = await supabase.from("class_exam_ai_drafts").select("status, result, error").eq("attempt_id", row.attempt_id!).maybeSingle();
      if (stop) return;
      if (data?.status === "done" && data.result) { setAiBusy(false); applyDraft(data.result as unknown as GradeResult); return; }
      if (data?.status === "blocked" || (data?.status === "error" && kicked)) { setAiBusy(false); if (data.error) toast.error(data.error); return; }
      setAiBusy(true);
      if (!data || data.status === "error") { kicked = true; void callAuto(false); }
      setTimeout(() => void tick(), 5000);
    };
    void tick();
    return () => { stop = true; };
  }, [row.attempt_id]);

  const runAi = async () => {
    setAiBusy(true);
    const res = await callAuto(true);
    const { data } = await supabase.from("class_exam_ai_drafts").select("status, result, error").eq("attempt_id", row.attempt_id!).maybeSingle();
    setAiBusy(false);
    if (data?.status === "done" && data.result) { applyDraft(data.result as unknown as GradeResult); toast.success("AI က အမှတ်အကြမ်း ပေးပြီးပါပြီ — စစ်ဆေးပြီး Confirm လုပ်ပါ"); }
    else toast.error(data?.error ?? (res ? "AI marking failed" : "Network error"));
  };

  const save = async () => {
    const n = Number(score);
    if (score === "" || Number.isNaN(n)) return toast.error("အမှတ် ထည့်ပါ");
    setSaving(true);
    const total = grade?.totalMarks ?? paper.totalMarks;
    const { error } = await supabase.rpc("class_exam_grade", {
      _attempt: row.attempt_id!, _score: n, _total: total, _result: (grade ?? null) as never, _feedback: feedback,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("ကျောင်းသားဆီ ရလဒ် ပို့ပြီးပါပြီ");
    await onSaved();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
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
          </>
        ) : <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-primary" />}
      </div>

      <div className="rounded-2xl border-2 border-primary/30 bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">အမှတ်ပေးခြင်း</h3>
          <Button size="sm" variant="outline" onClick={runAi} disabled={aiBusy || !urls.length}>
            {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} Re-grade with AI
          </Button>
        </div>
        {aiBusy && <p className="mt-2 text-xs text-muted-foreground">AI အမှတ်အကြမ်း ပြင်ဆင်နေပါတယ် — အသင့်ဖြစ်တာနဲ့ ဒီမှာ အလိုအလျောက် ပေါ်လာပါမယ်…</p>}

        {grade?.items && grade.items.length > 0 && (
          <ul className="mt-3 max-h-96 space-y-2 overflow-y-auto">
            {grade.items.map((it, i) => (
              <li key={i} className="rounded-lg border border-border p-2 text-sm">
                <p className="font-medium">{it.section} {it.number}. {it.question} — <span className={it.status === "correct" ? "text-primary" : it.status === "partial" ? "text-accent-foreground" : "text-destructive"}>{it.awarded}/{it.marks}</span></p>
                <p className="text-xs text-muted-foreground">Student: {it.studentAnswer} · Key: {it.correctAnswer}</p>
                {it.explanation && <p className="text-xs">{it.explanation}</p>}
              </li>
            ))}
          </ul>
        )}
        {grade?.writingFeedback && <p className="mt-2 text-sm"><b>Writing:</b> {grade.writingFeedback}</p>}
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
  );
}
