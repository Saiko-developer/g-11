import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/SiteHeader";
import { RequireSignIn } from "@/components/RequireSignIn";
import { PaperEditor } from "@/components/PaperEditor";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SYLLABUS, type SyllabusUnit } from "@/data/syllabus";
import { ALL_SECTION_IDS, SECTION_SPECS, examTotals, type SectionId } from "@/lib/examBlueprint";
import type { MockExamPaper } from "@/lib/mockExam";

export const Route = createFileRoute("/class-exam/new")({
  head: () => {
    const title = "Create Class Exam — Sayar Owl Academy";
    const description = "Teachers generate, review and publish an exam paper to their classroom with a timer and due date.";
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
  validateSearch: (s: Record<string, unknown>): { cid?: string } => ({ cid: typeof s.cid === "string" ? s.cid : undefined }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <RequireSignIn>
          <NewClassExam />
        </RequireSignIn>
      </main>
    </div>
  ),
});

const UNITS = SYLLABUS.filter((n): n is SyllabusUnit => n.type === "unit");
const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const chip = (on: boolean) =>
  `rounded-lg border px-3 py-2 text-sm font-medium ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`;

function NewClassExam() {
  const navigate = useNavigate();
  const { cid } = Route.useSearch();
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [classId, setClassId] = useState(cid ?? "");
  const [title, setTitle] = useState("");
  const [units, setUnits] = useState<number[]>([1]);
  const [sections, setSections] = useState<SectionId[]>([...ALL_SECTION_IDS]);
  const [count, setCount] = useState<5 | 10>(10);
  const totals = useMemo(() => examTotals({ sections, count }), [sections, count]);
  const [duration, setDuration] = useState(totals.minutes);
  const [due, setDue] = useState("");
  const [note, setNote] = useState("");
  const [paper, setPaper] = useState<MockExamPaper | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setDuration(totals.minutes), [totals.minutes]);
  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("classrooms").select("id,name").eq("teacher_id", u.user?.id ?? "").order("created_at");
      setClasses(data ?? []);
      if (!cid && data?.[0]) setClassId(data[0].id);
    })();
  }, [cid]);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const generate = async () => {
    if (!units.length || !sections.length) return toast.error("Unit နှင့် Section ရွေးပါ");
    setBusy(true);
    setPaper(null);
    try {
      const nodes = UNITS.filter((u) => units.includes(u.number));
      const unitTitle = units.length > 1 ? `Units ${units.join(", ")} Combined Exam` : (nodes[0]?.title ?? `Unit ${units[0]}`);
      const topics = nodes.map((n) => `Unit ${n.number} (${n.title}) — ${n.skills.map((s) => `${s.label}: ${s.detail}`).join("; ")}`).join(" || ");
      const res = await fetch("/api/mock-exam", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token ?? ""}` },
        body: JSON.stringify({ unit: units[0], unitTitle, topics, fresh: true, units, sections, count }),
      });
      const raw = (await res.json()) as { paper?: MockExamPaper; error?: string };
      if (!res.ok || !raw.paper) throw new Error(raw.error ?? "Could not generate the paper");
      setPaper(raw.paper);
      if (!title) setTitle(raw.paper.title);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!paper || !classId) return toast.error("အတန်း ရွေးပါ");
    setBusy(true);
    const { error } = await supabase.from("classroom_assignments").insert({
      classroom_id: classId,
      title: title.trim() || paper.title,
      kind: "class_exam",
      unit: units[0],
      instructions: note.trim(),
      due_at: due ? new Date(due).toISOString() : null,
      duration_minutes: Math.max(5, duration),
      paper_data: paper as never,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("အတန်းသို့ စာမေးပွဲ ပို့ပြီးပါပြီ");
    void navigate({ to: "/classrooms" });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Classroom Exam
        </p>
        <h1 className="text-2xl font-bold">အတန်းအတွက် စာမေးပွဲ ဖန်တီးမည်</h1>
      </div>

      <section className="grid gap-3 rounded-2xl border border-border bg-card p-5">
        <label className="text-sm">အတန်း
          <select className={`${input} mt-1`} value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.length === 0 && <option value="">အတန်း မရှိသေးပါ</option>}
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <div>
          <p className="mb-2 text-sm">Units</p>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
            {UNITS.map((u) => (
              <button key={u.number} type="button" className={chip(units.includes(u.number))}
                onClick={() => setUnits((l) => toggle(l, u.number).sort((a, b) => a - b))}>Unit {u.number}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            Sections · I–III မေးခွန်း:
            {[5, 10].map((n) => <button key={n} type="button" className={chip(count === n)} onClick={() => setCount(n as 5 | 10)}>{n}</button>)}
          </div>
          <div className="flex flex-wrap gap-2">
            {SECTION_SPECS.map((s) => (
              <button key={s.id} type="button" title={s.label} className={chip(sections.includes(s.id))}
                onClick={() => setSections((l) => ALL_SECTION_IDS.filter((x) => (x === s.id ? !l.includes(x) : l.includes(x))))}>
                {s.id}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{totals.marks} မှတ်</p>
        </div>
        <Button onClick={generate} disabled={busy}>
          {busy && !paper ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate & Preview
        </Button>
      </section>

      {paper && (
        <>
          <section className="grid gap-3 rounded-2xl border border-primary/40 bg-card p-5">
            <h2 className="font-bold">အတန်းသို့ ပို့ရန် အချက်အလက်</h2>
            <input className={input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">ဖြေဆိုချိန် (မိနစ်)
                <input type="number" min={5} className={`${input} mt-1`} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </label>
              <label className="text-sm">ရက်ချိန်း (Due date)
                <input type="datetime-local" className={`${input} mt-1`} value={due} onChange={(e) => setDue(e.target.value)} />
              </label>
            </div>
            <textarea className={input} rows={2} placeholder="ညွှန်ကြားချက်" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button onClick={publish} disabled={busy || !classId}><Send className="h-4 w-4" /> Confirm & Publish to Class</Button>
          </section>
          <p className="text-sm text-muted-foreground">အောက်တွင် မေးခွန်းများကို ပြင်ဆင်/ဖျက်နိုင်ပါသည်။</p>
          <PaperEditor paper={paper} onChange={setPaper} />
        </>
      )}
    </div>
  );
}
