import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Loader2, Plus, Trash2, Upload, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { validatePaperFile } from "@/lib/uploaded-paper";
import { supabase } from "@/integrations/supabase/client";

type Assignment = {
  id: string;
  title: string;
  kind: string;
  unit: number;
  instructions: string;
  due_at: string | null;
  created_at: string;
};

const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60";
const ghost = "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted";

const ACCEPT = ".pdf,.doc,.docx,image/jpeg,image/png";
const MAX_FILES = 10;

function fmtDue(d: string | null) {
  if (!d) return "ရက်ချိန်း မသတ်မှတ်ပါ";
  return new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
const overdue = (d: string | null) => !!d && new Date(d).getTime() < Date.now();

export function ClassAssignments({ cid, teacher }: { cid: string; teacher: boolean }) {
  const [list, setList] = useState<Assignment[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("classroom_assignments")
      .select("id,title,kind,unit,instructions,due_at,created_at")
      .eq("classroom_id", cid)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setList((data as Assignment[]) ?? []);
  }, [cid]);
  useEffect(() => void load(), [load]);

  type Mine = { submitted_at: string | null; graded_at: string | null; score: number | null; total_marks: number | null };
  const [mine, setMine] = useState<Record<string, Mine>>({});
  useEffect(() => {
    if (teacher || !list?.length) return;
    const ids = list.filter((a) => a.kind === "class_exam").map((a) => a.id);
    if (!ids.length) return;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("class_exam_attempts")
        .select("assignment_id, submitted_at, graded_at, score, total_marks")
        .in("assignment_id", ids).eq("student_id", u.user.id);
      const m: Record<string, Mine> = {};
      for (const r of data ?? []) m[r.assignment_id] = r as Mine;
      setMine(m);
    })();
  }, [list, teacher]);

  const remove = async (id: string) => {
    if (!confirm("ဤ Assignment ကို ဖျက်မှာလား?")) return;
    const { error } = await supabase.from("classroom_assignments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold">
          <ClipboardList className="h-4 w-4" /> Assignments
        </h4>
        {teacher && (
          <div className="flex flex-wrap gap-1.5">
            <Link to="/class-exam/new" search={{ cid }} className={ghost}>
              <Plus className="h-3.5 w-3.5" /> Create Class Exam
            </Link>
            <Button className={ghost} onClick={() => setShowForm((s) => !s)}>
              <Upload className="h-3.5 w-3.5" /> Upload My Paper
            </Button>
          </div>
        )}
      </div>

      {teacher && showForm && <UploadPaperForm cid={cid} onDone={() => { setShowForm(false); void load(); }} />}

      {!list ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-xs text-muted-foreground">Assignment မရှိသေးပါ။</p>
      ) : (
        <ul className="grid gap-2">
          {list.map((a) => (
            <li key={a.id} className="rounded-lg border border-border p-2.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.kind === "class_exam" ? (a.unit === 0 ? "📎 Teacher's Paper" : `🏫 Class Exam · Unit ${a.unit}`) : a.kind === "mock_exam" ? `📝 Mock Exam · Unit ${a.unit}` : `✏️ Practice · Unit ${a.unit}`}
                  </div>
                  <div className={`text-xs ${overdue(a.due_at) ? "text-destructive" : "text-muted-foreground"}`}>
                    ⏰ {fmtDue(a.due_at)} {overdue(a.due_at) && "(ကျော်လွန်)"}
                  </div>
                  {a.instructions && <p className="mt-1 whitespace-pre-wrap text-xs">{a.instructions}</p>}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {a.kind === "class_exam" ? (
                    <Link to="/class-exam/$id" params={{ id: a.id }} className={ghost}>
                      {teacher ? "Open" : (() => {
                        const m = mine[a.id];
                        if (m?.graded_at) return `✅ ${m.score ?? "—"} / ${m.total_marks ?? "—"} · အဖြေလွှာ ကြည့်ရန်`;
                        if (m?.submitted_at) return "⏳ စစ်ဆေးနေဆဲ";
                        return "Start Exam";
                      })()}
                    </Link>
                  ) : a.kind === "mock_exam" ? (
                    <Link to="/mock-exam/$unit" params={{ unit: String(a.unit) }} className={ghost}>
                      {teacher ? "Open" : "Start Exam"}
                    </Link>
                  ) : (
                    <Link to="/practice/$unit" params={{ unit: String(a.unit) }} className={ghost}>
                      {teacher ? "Open" : "Practice Now"}
                    </Link>
                  )}
                  {teacher && (
                    <Button className={ghost} onClick={() => remove(a.id)} aria-label="Delete assignment">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              {teacher && a.kind === "class_exam" && <ExamProgress aid={a.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type RosterRow = { student_id: string; display_name: string; started_at: string | null; submitted_at: string | null; graded_at: string | null; score: number | null; total_marks: number | null };

/** Teacher-only: who has finished / not finished this class exam. */
function ExamProgress({ aid }: { aid: string }) {
  const [rows, setRows] = useState<RosterRow[] | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    void supabase.rpc("class_exam_roster", { _aid: aid }).then(({ data }) => setRows((data as unknown as RosterRow[]) ?? []));
  }, [aid]);
  if (!rows) return null;
  const done = rows.filter((r) => r.submitted_at);
  const graded = done.filter((r) => r.graded_at);
  const pending = done.filter((r) => !r.graded_at);
  const notDone = rows.filter((r) => !r.submitted_at);
  const pct = rows.length ? Math.round((done.length / rows.length) * 100) : 0;
  return (
    <div className="mt-2 rounded-md bg-muted/50 p-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span>📊 <b>{done.length} / {rows.length}</b> ဦး ဖြေဆိုပြီး · <span className="text-destructive">{notDone.length} ဦး မဖြေရသေး</span></span>
        <Button className={ghost} onClick={() => setOpen((o) => !o)}><Users className="h-3.5 w-3.5" /> {open ? "ပိတ်ရန်" : "ကျောင်းသားစာရင်း"}</Button>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      {open && (
        <div className="mt-2 grid gap-2 text-xs">
          <Group title={`✅ စစ်ပြီး (${graded.length})`} rows={graded} render={(r) => `${r.score ?? "—"} / ${r.total_marks ?? "—"}`} />
          <Group title={`⏳ တင်ပြီး — စစ်ရန်ကျန် (${pending.length})`} rows={pending} render={(r) => new Date(r.submitted_at ?? "").toLocaleString()} />
          <Group title={`⚠️ မဖြေရသေး (${notDone.length})`} rows={notDone} render={(r) => (r.started_at ? "ဖြေဆိုနေဆဲ" : "မစရသေး")} danger />
          {(graded.length + pending.length) > 0 && (
            <Link to="/class-exam/$id" params={{ id: aid }} className={`${ghost} justify-self-start`}>Open submissions to grade →</Link>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ title, rows, render, danger }: { title: string; rows: RosterRow[]; render: (r: RosterRow) => string; danger?: boolean }) {
  return (
    <div>
      <p className={`font-semibold ${danger ? "text-destructive" : ""}`}>{title}</p>
      {rows.length === 0 ? <p className="text-muted-foreground">—</p> : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.student_id} className="flex justify-between gap-2 py-1">
              <span className="truncate">{r.display_name || "(no name)"}</span>
              <span className="shrink-0 text-muted-foreground">{render(r)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Teacher uploads their own exam paper (PDF / Word / JPEG / PNG) and sends it to the class. */
function UploadPaperForm({ cid, onDone }: { cid: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [keys, setKeys] = useState<File[]>([]);
  const [marks, setMarks] = useState("50");
  const [duration, setDuration] = useState("60");
  const [due, setDue] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const publish = async () => {
    if (!title.trim()) return toast.error("စာမေးပွဲ ခေါင်းစဉ် ထည့်ပါ");
    if (!files.length) return toast.error("မေးခွန်းစာရွက် ဖိုင် တင်ပါ");
    const total = Number(marks), mins = Number(duration);
    if (!(total > 0)) return toast.error("စုစုပေါင်း အမှတ် ထည့်ပါ");
    if (!(mins > 0)) return toast.error("ဖြေဆိုချိန် ထည့်ပါ");
    setBusy(true);
    try {
      for (const file of [...files, ...keys]) validatePaperFile(file);
      const uploaded: { path: string; name: string; type: string }[] = [];
      for (const f of files) {
        const safe = f.name.replace(/[^\w.-]+/g, "_");
        const path = `${cid}/${crypto.randomUUID()}-${safe}`;
        const { error } = await supabase.storage.from("class-papers").upload(path, f, { contentType: f.type || undefined });
        if (error) throw error;
        uploaded.push({ path, name: f.name, type: f.type });
      }
      const { data: assignment, error } = await supabase.from("classroom_assignments").insert({
        classroom_id: cid,
        title: title.trim(),
        kind: "class_exam",
        unit: 0,
        instructions: note.trim(),
        due_at: due ? new Date(due).toISOString() : null,
        duration_minutes: Math.round(mins),
        paper_data: { kind: "upload", title: title.trim(), totalMarks: total, sections: [], files: uploaded },
      }).select("id").single();
      if (error) throw error;
      if (keys.length && assignment) {
        try {
          const keyFiles = [];
          for (const file of keys) {
            const path = `${cid}/keys/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
            const { error: uploadError } = await supabase.storage.from("class-papers").upload(path, file, { contentType: file.type || undefined });
            if (uploadError) throw uploadError;
            keyFiles.push({ path, name: file.name, type: file.type });
          }
          const { error: keyError } = await supabase.from("class_exam_marking_guides").insert({ assignment_id: assignment.id, files: keyFiles });
          if (keyError) throw keyError;
        } catch (failure) {
          await supabase.from("classroom_assignments").delete().eq("id", assignment.id);
          throw failure;
        }
      }
      toast.success("စာမေးပွဲ အတန်းဆီ ပို့ပြီးပါပြီ");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="mb-3 grid gap-2 rounded-lg bg-muted/50 p-3">
      <p className="text-xs font-semibold">📎 ကိုယ်ပိုင် မေးခွန်းစာရွက် တင်ရန် (PDF, Word, JPEG, PNG)</p>
      <input className={input} placeholder="Exam title (e.g. Midterm English)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="inline-flex cursor-pointer items-center gap-2 justify-self-start rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
        <Upload className="h-4 w-4" /> ဖိုင် ရွေးမည်
        <input type="file" accept={ACCEPT} multiple className="hidden"
          onChange={(e) => { const l = Array.from(e.target.files ?? []); setFiles((f) => [...f, ...l].slice(0, MAX_FILES)); e.target.value = ""; }} />
      </label>
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs">
              {f.name}
              <Button aria-label="Remove file" onClick={() => setFiles((l) => l.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button>
            </li>
          ))}
        </ul>
      )}
      <label className="text-xs font-medium">Private answer key / marking guide (optional)
        <input aria-label="Private marking guide" type="file" accept={ACCEPT} multiple className={`${input} mt-1`} onChange={(e) => setKeys(Array.from(e.target.files ?? []).slice(0, MAX_FILES))} />
      </label>
      {keys.length > 0 && <p className="break-words text-xs text-muted-foreground">{keys.map((file) => file.name).join(", ")}</p>}
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-muted-foreground">Total marks
          <input type="number" min={1} className={`${input} mt-1`} value={marks} onChange={(e) => setMarks(e.target.value)} />
        </label>
        <label className="text-xs text-muted-foreground">Duration (minutes)
          <input type="number" min={1} className={`${input} mt-1`} value={duration} onChange={(e) => setDuration(e.target.value)} />
        </label>
      </div>
      <label className="text-xs text-muted-foreground">Due date (ရက်ချိန်း)
        <input type="datetime-local" className={`${input} mt-1`} value={due} onChange={(e) => setDue(e.target.value)} />
      </label>
      <textarea className={input} rows={2} placeholder="Instructions (ညွှန်ကြားချက်)" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button className={btn} disabled={busy} onClick={publish}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send to Class
      </Button>
    </div>
  );
}
