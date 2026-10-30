import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

function fmtDue(d: string | null) {
  if (!d) return "ရက်ချိန်း မသတ်မှတ်ပါ";
  return new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
const overdue = (d: string | null) => !!d && new Date(d).getTime() < Date.now();

export function ClassAssignments({ cid, teacher }: { cid: string; teacher: boolean }) {
  const [list, setList] = useState<Assignment[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("mock_exam");
  const [unit, setUnit] = useState(1);
  const [due, setDue] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

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

  const create = async () => {
    const t = title.trim() || `Unit ${unit} ${kind === "mock_exam" ? "Mock Exam" : "Practice"}`;
    setBusy(true);
    const { error } = await supabase.from("classroom_assignments").insert({
      classroom_id: cid,
      title: t,
      kind,
      unit,
      instructions: note.trim(),
      due_at: due ? new Date(due).toISOString() : null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Assignment ပေးပြီးပါပြီ");
    setTitle(""); setNote(""); setDue(""); setShowForm(false);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("ဤ Assignment ကို ဖျက်မှာလား?")) return;
    const { error } = await supabase.from("classroom_assignments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold">
          <ClipboardList className="h-4 w-4" /> Assignments
        </h4>
        {teacher && (
          <button className={ghost} onClick={() => setShowForm((s) => !s)}>
            <Plus className="h-3.5 w-3.5" /> Assign
          </button>
        )}
      </div>

      {teacher && showForm && (
        <div className="mb-3 grid gap-2 rounded-lg bg-muted/50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <select className={input} value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="mock_exam">Mock Exam</option>
              <option value="practice">Unit Practice</option>
            </select>
            <select className={input} value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
              ))}
            </select>
          </div>
          <input className={input} placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="text-xs text-muted-foreground">
            Due date (ရက်ချိန်း)
            <input type="datetime-local" className={`${input} mt-1`} value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
          <textarea className={input} rows={2} placeholder="Instructions (ညွှန်ကြားချက်)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className={btn} disabled={busy} onClick={create}>Assign to class</button>
        </div>
      )}

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
                    {a.kind === "mock_exam" ? "📝 Mock Exam" : "✏️ Practice"} · Unit {a.unit}
                  </div>
                  <div className={`text-xs ${overdue(a.due_at) ? "text-destructive" : "text-muted-foreground"}`}>
                    ⏰ {fmtDue(a.due_at)} {overdue(a.due_at) && "(ကျော်လွန်)"}
                  </div>
                  {a.instructions && <p className="mt-1 whitespace-pre-wrap text-xs">{a.instructions}</p>}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {a.kind === "mock_exam" ? (
                    <Link to="/mock-exam/$unit" params={{ unit: String(a.unit) }} className={ghost}>
                      {teacher ? "Open" : "Start Exam"}
                    </Link>
                  ) : (
                    <Link to="/practice/$unit" params={{ unit: String(a.unit) }} className={ghost}>
                      {teacher ? "Open" : "Practice Now"}
                    </Link>
                  )}
                  {teacher && (
                    <button className={ghost} onClick={() => remove(a.id)} aria-label="Delete assignment">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
