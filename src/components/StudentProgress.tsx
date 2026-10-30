import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { supabase } from "@/integrations/supabase/client";
import { ResultView } from "@/components/PaperSubmission";
import type { GradeResult } from "@/routes/api/grade-exam";

type Exam = {
  id: string;
  unit: number;
  created_at: string;
  score: number | null;
  total_marks: number | null;
  paper_title: string | null;
  result: GradeResult;
  image_paths: string[] | null;
};
type Attempt = { unit: number; skill: string; correct: boolean };

/** Shows one student's paper exams (with photos) and practice summary. Works for the student or an admin (RLS allows both). */
export function StudentProgress({ userId }: { userId: string }) {
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [e, a] = await Promise.all([
        supabase
          .from("exam_submissions")
          .select("id, unit, created_at, score, total_marks, paper_title, result, image_paths")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase.from("practice_attempts").select("unit, skill, correct").eq("user_id", userId),
      ]);
      if (!alive) return;
      setExams((e.data as unknown as Exam[]) ?? []);
      setAttempts((a.data as Attempt[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  const toggle = async (x: Exam) => {
    if (open === x.id) return setOpen(null);
    setOpen(x.id);
    setPhotos([]);
    const paths = x.image_paths ?? [];
    if (!paths.length) return;
    const { data } = await supabase.storage.from("exam-photos").createSignedUrls(paths, 3600);
    setPhotos((data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]);
  };

  const remove = async (x: Exam) => {
    if (!confirm("ဤစာမေးပွဲမှတ်တမ်းကို ဖျက်မှာ သေချာပါသလား?")) return;
    const { error } = await supabase.from("exam_submissions").delete().eq("id", x.id);
    if (error) return alert(error.message);
    if (x.image_paths?.length) await supabase.storage.from("exam-photos").remove(x.image_paths);
    setExams((e) => (e ?? []).filter((y) => y.id !== x.id));
    if (open === x.id) setOpen(null);
  };

  if (!exams) return <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>;

  // practice summary per unit
  const byUnit = new Map<number, { total: number; correct: number; skills: Set<string> }>();
  for (const a of attempts) {
    const u = byUnit.get(a.unit) ?? { total: 0, correct: 0, skills: new Set() };
    u.total++;
    if (a.correct) u.correct++;
    u.skills.add(a.skill);
    byUnit.set(a.unit, u);
  }
  const units = [...byUnit.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 font-semibold">လေ့ကျင့်ခန်း မှတ်တမ်း (Practice)</h3>
        {units.length === 0 ? (
          <p className="text-sm text-muted-foreground">လေ့ကျင့်ခန်း မဖြေရသေးပါ။</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {units.map(([u, s]) => (
              <div key={u} className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="font-semibold">Unit {u}</p>
                <p className="text-muted-foreground">{s.correct}/{s.total} မှန်</p>
                <p className="text-xs text-muted-foreground">{[...s.skills].join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <ClassExamHistory userId={userId} />


      <section>
        <h3 className="mb-2 font-semibold">Mock Exam ရလဒ်များ ({exams.length})</h3>
        {exams.length === 0 ? (
          <p className="text-sm text-muted-foreground">စာရွက်ဖြေဆိုမှု မရှိသေးပါ။</p>
        ) : (
          <ul className="space-y-2">
            {exams.map((x) => (
              <li key={x.id} className="rounded-lg border border-border bg-card">
                <div className="flex items-center">
                  <button onClick={() => toggle(x)} className="flex min-h-12 flex-1 items-center justify-between gap-3 px-3 py-2 text-left text-sm">
                    <span>
                      <b>Unit {x.unit}</b> · {new Date(x.created_at).toLocaleString()}
                      <span className="ml-2 text-muted-foreground">{x.image_paths?.length ?? 0} photo(s)</span>
                    </span>
                    <span className="flex items-center gap-2 font-bold text-primary">
                      {x.score ?? "—"} / {x.total_marks ?? "—"}
                      <ChevronDown className={`h-4 w-4 transition-transform ${open === x.id ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  <button type="button" aria-label="Delete exam" onClick={() => void remove(x)} className="p-3 text-destructive hover:bg-muted">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {open === x.id && (
                  <div className="border-t border-border p-3">
                    {photos.length > 0 && <div className="mb-3"><PhotoGallery photos={photos} /></div>}
                    <ResultView r={x.result} score={x.score} total={x.total_marks} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type ClassRow = {
  id: string; assignment_id: string; submitted_at: string | null; graded_at: string | null;
  score: number | null; total_marks: number | null; teacher_feedback: string; result: GradeResult | null;
  classroom_assignments: { title: string; classrooms: { name: string } | null } | null;
};

/** Student's classroom exam history; result details only appear after the teacher confirms grading. */
function ClassExamHistory({ userId }: { userId: string }) {
  const [rows, setRows] = useState<ClassRow[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    void supabase.from("class_exam_attempts")
      .select("id, assignment_id, submitted_at, graded_at, score, total_marks, teacher_feedback, result, classroom_assignments(title, classrooms(name))")
      .eq("student_id", userId).not("submitted_at", "is", null)
      .order("submitted_at", { ascending: false })
      .then(({ data }) => setRows((data as unknown as ClassRow[]) ?? []));
  }, [userId]);
  if (!rows) return null;
  return (
    <section>
      <h3 className="mb-2 font-semibold">🏫 Classroom Exam ရလဒ်များ ({rows.length})</h3>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">အတန်းစာမေးပွဲ မဖြေရသေးပါ။</p> : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-border bg-card">
              <button onClick={() => setOpen(open === r.id ? null : r.id)} disabled={!r.graded_at}
                className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm">
                <span>
                  <b>{r.classroom_assignments?.title ?? "Class Exam"}</b>
                  <span className="ml-2 text-muted-foreground">{r.classroom_assignments?.classrooms?.name} · {new Date(r.submitted_at!).toLocaleString()}</span>
                </span>
                {r.graded_at ? (
                  <span className="flex items-center gap-2 font-bold text-primary">
                    {r.score ?? "—"} / {r.total_marks ?? "—"}
                    <ChevronDown className={`h-4 w-4 transition-transform ${open === r.id ? "rotate-180" : ""}`} />
                  </span>
                ) : <span className="text-muted-foreground">⏳ စစ်ဆေးနေဆဲ</span>}
              </button>
              {open === r.id && r.graded_at && (
                <div className="border-t border-border p-3 text-sm">
                  {r.teacher_feedback && <p className="whitespace-pre-wrap">{r.teacher_feedback}</p>}
                  <ResultView r={r.result} score={r.score} total={r.total_marks} />
                  <Link to="/class-exam/$id" params={{ id: r.assignment_id }} className="mt-2 inline-block text-primary underline">စာမေးပွဲ စာမျက်နှာ ဖွင့်ရန်</Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
