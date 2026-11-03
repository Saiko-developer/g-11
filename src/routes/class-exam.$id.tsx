import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, FileCheck2, FileDown, Loader2, Lock, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/SiteHeader";
import { RequireSignIn } from "@/components/RequireSignIn";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { downloadExamPaper, type DownloadFormat } from "@/lib/examPrint";
import { AnswerKeyDialog } from "@/components/AnswerKeyDialog";
import type { MockExamPaper } from "@/lib/mockExam";
import { SectionCard } from "@/routes/mock-exam.$unit";
import { ClassExamSubmissions } from "@/components/ClassExamSubmissions";
import { UploadedPaperFiles } from "@/components/UploadedPaperFiles";
import { isUploadedPaper } from "@/lib/uploaded-paper";
import { ResultView } from "@/components/PaperSubmission";
import type { GradeResult } from "@/routes/api/grade-exam";

export const Route = createFileRoute("/class-exam/$id")({
  head: () => {
    const title = "Class Exam — Sayar Owl Academy";
    const description = "Sit your teacher's classroom exam with a timer and submit your answer paper.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <RequireSignIn>
          <ExamHall />
        </RequireSignIn>
      </main>
    </div>
  ),
});

type Exam = {
  id: string; title: string; instructions: string; due_at: string | null; duration_minutes: number;
  staff: boolean; started_at: string | null; submitted_at: string | null; key_unlocked: boolean; paper: MockExamPaper;
};

const FORMATS: { f: DownloadFormat; label: string }[] = [
  { f: "pdf", label: "PDF (.pdf)" }, { f: "doc", label: "Word (.doc)" }, { f: "png", label: "Image (.png)" }, { f: "jpeg", label: "Image (.jpg)" },
];

async function compress(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    const context = c.getContext("2d");
    if (!context) throw new Error("Could not prepare answer photo.");
    context.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res, reject) => c.toBlob((b) => b ? res(b) : reject(new Error("Could not prepare photo.")), "image/jpeg", 0.7));
  } finally { URL.revokeObjectURL(url); }
}

function ExamHall() {
  const { id } = Route.useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"paper" | "subs">("paper");
  const [mine, setMine] = useState<{ score: number | null; total_marks: number | null; teacher_feedback: string; graded_at: string | null; result: unknown } | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.rpc("class_exam_open", { _aid: id });
    if (error) return setErr(error.message);
    setExam(data as unknown as Exam);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      const { data: a } = await supabase.from("class_exam_attempts").select("score, total_marks, teacher_feedback, graded_at, result").eq("assignment_id", id).eq("student_id", u.user.id).maybeSingle();
      setMine(a as never);
    }
  };
  useEffect(() => { void load(); }, [id]);
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, []);

  if (err) return <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">{err}</p>;
  if (!exam) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />;

  const endAt = exam.started_at ? new Date(exam.started_at).getTime() + exam.duration_minutes * 60000 : 0;
  const left = exam.staff ? exam.duration_minutes * 60000 : Math.max(0, endAt - now);
  const timeUp = !exam.staff && left === 0;
  const halfAt = exam.started_at ? new Date(exam.started_at).getTime() + (exam.duration_minutes * 60000) / 2 : 0;
  const halfLeft = exam.staff ? 0 : Math.max(0, halfAt - now);
  const keyReady = exam.key_unlocked || timeUp || (!!exam.started_at && halfLeft === 0) || (!!exam.due_at && now > new Date(exam.due_at).getTime());
  const keyWait = `${String(Math.floor(halfLeft / 60000)).padStart(2, "0")}:${String(Math.floor((halfLeft % 60000) / 1000)).padStart(2, "0")}`;
  const clock = `${String(Math.floor(left / 3600000)).padStart(2, "0")}:${String(Math.floor((left % 3600000) / 60000)).padStart(2, "0")}:${String(Math.floor((left % 60000) / 1000)).padStart(2, "0")}`;

  const openKey = async () => {
    // Re-fetch so the server returns the paper with answers once unlocked.
    const { data, error } = await supabase.rpc("class_exam_open", { _aid: id });
    if (error) return toast.error(error.message);
    const fresh = data as unknown as Exam;
    if (!fresh.key_unlocked) return toast.error("အဖြေလွှာ မဖွင့်ရသေးပါ");
    setExam(fresh);
    setKeyOpen(true);
  };

  const submit = async () => {
    if (!files.length) return toast.error("ဓာတ်ပုံ အနည်းဆုံး ၁ ပုံ တင်ပါ");
    setBusy(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in again.");
      const uid = u.user.id;
      const paths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const path = `${uid}/class-${id}-${Date.now()}-p${i + 1}.jpg`;
        const { error } = await supabase.storage.from("exam-photos").upload(path, await compress(files[i]), { contentType: "image/jpeg" });
        if (error) throw error;
        paths.push(path);
      }
      const { error } = await supabase.rpc("class_exam_submit", { _aid: id, _paths: paths });
      if (error) throw error;
      // Start private AI draft marking for the teacher in the background (student never sees it).
      void supabase.auth.getSession().then(({ data: s }) => fetch("/api/auto-grade", {
        method: "POST", keepalive: true,
        headers: { "content-type": "application/json", authorization: `Bearer ${s.session?.access_token ?? ""}` },
        body: JSON.stringify({ assignmentId: id }),
      }).then((res) => { if (!res.ok) toast.error("Answer paper saved; AI marking is unavailable. Your teacher can review it."); }).catch(() => toast.error("Answer paper saved; AI marking could not start.")));
      setFiles([]);
      toast.success("တင်သွင်းပြီးပါပြီ");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <Link to="/classrooms" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Classrooms
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Class Exam</p>
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">
            {exam.paper.totalMarks} marks · {exam.duration_minutes} minutes
            {exam.due_at && ` · Due ${new Date(exam.due_at).toLocaleString()}`}
          </p>
          {exam.instructions && <p className="mt-2 whitespace-pre-wrap text-sm">{exam.instructions}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!exam.staff && !exam.submitted_at && (
            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-lg ${timeUp ? "border-destructive text-destructive" : "border-primary text-primary"}`}>
              <Clock className="h-5 w-5" /> {clock}
            </span>
          )}
          {!isUploadedPaper(exam.paper) && <><DropdownMenu>
            <DropdownMenuTrigger asChild><Button size="sm"><FileDown className="h-4 w-4" /> Download Paper</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {FORMATS.map(({ f, label }) => <DropdownMenuItem key={f} onSelect={() => downloadExamPaper(exam.paper, f)}>{label}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" disabled={!keyReady} onClick={() => void openKey()}
            title={keyReady ? undefined : "စာမေးပွဲချိန်၏ ထက်ဝက်ပြည့်မှ (သို့) တင်သွင်းပြီးမှ ဖွင့်ပါမည်"}>
            {keyReady ? <FileCheck2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />} View Answer Key
            {!keyReady && <span className="font-mono text-xs">({keyWait})</span>}
          </Button>
          <AnswerKeyDialog paper={keyOpen ? exam.paper : null} open={keyOpen} onOpenChange={setKeyOpen} /></>}
        </div>
      </header>

      {!exam.staff && (
        exam.submitted_at ? (
          <section className="flex items-center gap-3 rounded-2xl border-2 border-primary/40 bg-primary/5 p-5">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <div>
              <p className="font-bold">စာမေးပွဲ အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ</p>
              <p className="text-sm text-muted-foreground">{new Date(exam.submitted_at).toLocaleString()} · {mine?.graded_at ? "" : "ဆရာက စစ်ဆေးပြီး အမှတ်ထုတ်ပေးပါမည်။"}</p>
              {mine?.graded_at && (
                <div className="mt-2">
                  <p className="text-xl font-bold text-primary">ရမှတ်: {mine.score} / {mine.total_marks}</p>
                  {mine.teacher_feedback && <p className="mt-1 whitespace-pre-wrap text-sm">{mine.teacher_feedback}</p>}
                  <Button size="sm" className="mt-3" onClick={() => setShowDetail((v) => !v)}>
                    📊 {showDetail ? "အသေးစိတ် အဖြေလွှာ ပိတ်ရန်" : "အသေးစိတ် အဖြေလွှာ ကြည့်ရန်"}
                  </Button>
                  {showDetail && <ResultView r={mine.result as GradeResult} score={mine.score} total={mine.total_marks} />}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border-2 border-primary/30 bg-card p-5">
            <h2 className="font-bold">အဖြေလွှာ တင်သွင်းရန်</h2>
            <p className="mt-1 text-sm text-muted-foreground">စာရွက်ပေါ်တွင် ရေးဖြေပြီး စာမျက်နှာတစ်ခုချင်း ဓာတ်ပုံရိုက်တင်ပါ (အများဆုံး ၆ ပုံ)။</p>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
              <Upload className="h-4 w-4" /> ဓာတ်ပုံ ရွေးမည်
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { const l = Array.from(e.target.files ?? []); setFiles((f) => [...f, ...l].slice(0, 6)); e.target.value = ""; }} />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                    Page {i + 1}
                    <button aria-label="Remove page" onClick={() => setFiles((l) => l.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </li>
                ))}
              </ul>
            )}
            <Button className="mt-4" onClick={submit} disabled={busy || !files.length}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit Answer Paper
            </Button>
          </section>
        )
      )}

      {exam.staff && (
        <div className="flex gap-2 border-b border-border">
          {([["paper", "📄 Exam Paper"], ["subs", "👥 Student Submissions"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      )}
      {exam.staff && tab === "subs" ? <ClassExamSubmissions aid={exam.id} paper={exam.paper} /> : (
        <div className="space-y-6">
          {isUploadedPaper(exam.paper) ? <UploadedPaperFiles files={exam.paper.files} /> : exam.paper.sections.map((s) => <SectionCard key={s.id} section={s} showAnswers={exam.staff} />)}
        </div>
      )}
    </div>
  );
}
