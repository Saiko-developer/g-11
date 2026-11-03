import { RequireSignIn } from "@/components/RequireSignIn";
import { useEffect, useState } from "react";
import { Camera, History, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { MockExamPaper } from "@/lib/mockExam";
import type { GradeItem, GradeResult } from "@/routes/api/grade-exam";
import { PhotoGallery } from "@/components/PhotoGallery";
import { WritingEvalCards } from "@/components/WritingEvalCards";

/** Shrink a photo in the browser so uploads stay small on mobile data. */
async function compressImage(file: File, maxSide = 1600, quality = 0.7): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Could not read photo"));
      i.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Row = { id: string; created_at: string; score: number | null; total_marks: number | null; paper_title: string | null; result: GradeResult; image_paths: string[] | null };

function PaperSubmissionInner({ paper, unit, onGraded }: { paper: MockExamPaper; unit: number; onGraded?: () => void }) {
  const [pages, setPages] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const openHistory = async (h: Row) => {
    setResult(h.result);
    const paths = h.image_paths ?? [];
    if (!paths.length) return setPhotos([]);
    const { data } = await supabase.storage.from("exam-photos").createSignedUrls(paths, 3600);
    setPhotos((data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]);
  };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [history, setHistory] = useState<Row[]>([]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("exam_submissions")
      .select("id, created_at, score, total_marks, paper_title, result, image_paths")
      .eq("unit", unit)
      .order("created_at", { ascending: false })
      .limit(10);
    setHistory((data as unknown as Row[]) ?? []);
  };
  useEffect(() => {
    void loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    try {
      const next = await Promise.all(Array.from(files).map((f) => compressImage(f)));
      setPages((p) => [...p, ...next].slice(0, 6));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read photo");
    }
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const { data: s } = await supabase.auth.getSession();
      const res = await fetch("/api/grade-exam", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${s.session?.access_token ?? ""}` },
        body: JSON.stringify({ paper, images: pages }),
      });
      const data = (await res.json()) as GradeResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Marking failed");
      setResult(data);
      onGraded?.();
      setPhotos(pages);
      const uid = s.session?.user.id;
      const stamp = Date.now();
      const image_paths: string[] = [];
      if (uid) {
        for (let i = 0; i < pages.length; i++) {
          const blob = await (await fetch(pages[i])).blob();
          const path = `${uid}/unit${unit}-${stamp}-p${i + 1}.jpg`;
          const { error: upErr } = await supabase.storage.from("exam-photos").upload(path, blob, { contentType: "image/jpeg" });
          if (!upErr) image_paths.push(path);
        }
      }
      await supabase.from("exam_submissions").insert({
        unit,
        paper_title: paper.title,
        score: data.score,
        total_marks: data.totalMarks,
        result: data as never,
        page_count: pages.length,
        image_paths,
      });
      setPages([]);
      void loadHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Marking failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border-2 border-primary/30 bg-card p-5">
      <h2 className="text-lg font-bold">စာရွက်ပေါ် ရေးဖြေပြီး ဓာတ်ပုံတင်ရန်</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Download Paper ဖြင့် မေးခွန်းလွှာ ယူပါ → စာရွက်ပေါ် ရေးဖြေပါ → စာမျက်နှာတစ်ခုချင်း ဓာတ်ပုံရိုက်တင်ပါ (အများဆုံး ၆ ပုံ)။ ဆရာအိုင့်က အမှတ်ပေးပြီး အကြံပြုပေးပါမယ်။
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm sm:flex-none font-medium text-primary-foreground">
          <Camera className="h-4 w-4" /> ဓာတ်ပုံရိုက်ရန်
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
        </label>
        <label className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-input px-3 py-2 text-sm sm:flex-none font-medium">
          <Upload className="h-4 w-4" /> Gallery မှ ရွေးရန်
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
        </label>
      </div>

      {pages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {pages.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt={`Page ${i + 1}`} className="aspect-[3/4] w-full rounded-md border border-border object-cover" />
              <span className="absolute left-1 top-1 rounded bg-background/90 px-1 text-xs">{i + 1}</span>
              <button type="button" aria-label="Remove page" onClick={() => setPages((p) => p.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded bg-background/90 p-1.5">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button className="mt-4" onClick={() => void submit()} disabled={busy || pages.length === 0}>
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> ဆရာအိုင် စစ်ဆေးနေပါတယ်…</> : "ဆရာအိုင့်ကို စစ်ခိုင်းမယ်"}
      </Button>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {result && photos.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">တင်ခဲ့သော လက်ရေးဓာတ်ပုံများ</p>
          <PhotoGallery photos={photos} />
        </div>
      )}
      {result && <ResultView r={result} />}

      {history.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><History className="h-4 w-4" /> ယခင် ဖြေဆိုမှု မှတ်တမ်း</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {history.map((h) => (
              <li key={h.id}>
                <button type="button" className="w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => void openHistory(h)}>
                  {new Date(h.created_at).toLocaleString()} — <b>{h.score ?? "?"} / {h.total_marks ?? "?"}</b>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function ResultView({ r: raw, score, total }: { r: GradeResult | null | undefined; score?: number | null; total?: number | null }) {
  const r = (raw ?? {}) as Partial<GradeResult> & { mistakes?: GradeResult["mistakes"] };
  const s = r.score ?? score;
  const t = r.totalMarks ?? total;
  const empty = !r.overallFeedback && !r.sections?.length && !r.mistakes?.length && !r.writingFeedback;
  return (
    <div className="mt-6 space-y-4 rounded-xl bg-muted/40 p-4 text-sm">
      <p className="text-2xl font-bold text-primary">{s ?? "—"} / {t ?? "—"}</p>
      {r.overallFeedback && <p>{r.overallFeedback}</p>}
      {empty && <p className="text-muted-foreground">ဤမှတ်တမ်းအတွက် ဆရာအိုင်၏ အသေးစိတ် စစ်ဆေးချက် မရှိပါ။</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {r.sections?.map((s) => (
          <div key={s.id} className="rounded-md border border-border bg-card p-2">
            <b>Section {s.id}</b> — {s.score}/{s.marks}
            <p className="text-muted-foreground">{s.feedback}</p>
          </div>
        ))}
      </div>
      {r.items && r.items.length > 0 && <ItemsBreakdown items={r.items} />}
      {!r.items?.length && r.mistakes && r.mistakes.length > 0 && (
        <div>
          <h4 className="font-semibold">အမှားပြင်ဆင်ချက်များ</h4>
          <ul className="mt-1 space-y-2">
            {r.mistakes!.map((m, i) => (
              <li key={i} className="rounded-md border border-border bg-card p-2">
                <p><b>{m.question}</b></p>
                <p className="text-destructive">✗ {m.studentAnswer}</p>
                <p className="text-primary">✓ {m.correctAnswer}</p>
                <p className="text-muted-foreground">{m.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {r.writing && r.writing.length > 0 && <WritingEvalCards evals={r.writing} />}
      {r.writingFeedback && <div><h4 className="font-semibold">Writing အကြံပြုချက်</h4><p>{r.writingFeedback}</p></div>}
      {r.unreadable && <p className="text-muted-foreground">⚠ {r.unreadable}</p>}
    </div>
  );
}

export function PaperSubmission(props: { paper: MockExamPaper; unit: number; onGraded?: () => void }) {
  return <RequireSignIn><PaperSubmissionInner {...props} /></RequireSignIn>;
}

type Filter = "all" | "wrong" | "correct";

function ItemsBreakdown({ items }: { items: GradeItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts = {
    all: items.length,
    wrong: items.filter((i) => i.status !== "correct").length,
    correct: items.filter((i) => i.status === "correct").length,
  };
  const shown = items.filter((i) =>
    filter === "all" ? true : filter === "correct" ? i.status === "correct" : i.status !== "correct",
  );
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: `အားလုံး (${counts.all})` },
    { id: "wrong", label: `အမှား / တစ်ဝက် (${counts.wrong})` },
    { id: "correct", label: `အမှန် (${counts.correct})` },
  ];
  const style = {
    correct: { box: "border-primary/40", mark: "✓", text: "text-primary", label: "မှန်" },
    partial: { box: "border-accent", mark: "½", text: "text-accent-foreground", label: "တစ်ဝက်" },
    wrong: { box: "border-destructive/50", mark: "✗", text: "text-destructive", label: "မှား" },
  } as const;
  return (
    <div>
      <h4 className="font-semibold">မေးခွန်းတစ်ခုချင်း စစ်ဆေးချက်</h4>
      <div className="mt-2 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button key={t.id} size="sm" variant={filter === t.id ? "default" : "outline"} onClick={() => setFilter(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {shown.map((m, i) => {
          const s = style[m.status] ?? style.wrong;
          return (
            <li key={i} className={`rounded-md border-2 bg-card p-3 ${s.box}`}>
              <div className="flex items-start justify-between gap-2">
                <p><b>Section {m.section} · {m.number}.</b> {m.question}</p>
                <span className={`shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-bold ${s.text}`}>
                  {s.mark} {s.label} · {m.awarded}/{m.marks}
                </span>
              </div>
              <p className="mt-1"><span className="text-muted-foreground">သင့်အဖြေ: </span><span className={s.text}>{m.studentAnswer}</span></p>
              {m.status !== "correct" && (
                <p><span className="text-muted-foreground">အဖြေမှန်: </span><span className="text-primary">{m.correctAnswer}</span></p>
              )}
              {m.explanation && <p className="mt-1 text-muted-foreground">{m.explanation}</p>}
            </li>
          );
        })}
        {shown.length === 0 && <p className="text-muted-foreground">ဤအမျိုးအစားတွင် မေးခွန်း မရှိပါ။</p>}
      </ul>
    </div>
  );
}
