import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, FileText, Rocket, Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { RequireSignIn } from "@/components/RequireSignIn";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SYLLABUS, type SyllabusUnit } from "@/data/syllabus";
import {
  ALL_SECTION_IDS,
  SECTION_SPECS,
  examTotals,
  sectionMarks,
  type SectionId,
} from "@/lib/examBlueprint";

export const Route = createFileRoute("/exam-builder")({
  head: () => {
    const title = "Exam Builder — Sayar Owl Academy";
    const description =
      "Build your own Grade 10 English exam: combine any units, choose a full 95-mark paper or only the sections you need, and let Sayar Owl write it.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ExamBuilderPage,
});

const UNITS = SYLLABUS.filter((n): n is SyllabusUnit => n.type === "unit");

type Quota = { role: string; limit: number; used: number; extra?: number };

function ExamBuilderPage() {
  const navigate = useNavigate();
  const [units, setUnits] = useState<number[]>([]);
  const [mode, setMode] = useState<"full" | "custom">("full");
  const [sections, setSections] = useState<SectionId[]>(["I", "II", "III"]);
  const [count, setCount] = useState<5 | 10>(10);
  const [quota, setQuota] = useState<Quota | null>(null);

  useEffect(() => {
    void supabase.rpc("exam_quota").then(({ data }) => data && setQuota(data as unknown as Quota));
  }, []);

  const chosenSections = mode === "full" ? [...ALL_SECTION_IDS] : sections;
  const chosenCount: 5 | 10 = mode === "full" ? 10 : count;
  const totals = useMemo(() => examTotals({ sections: chosenSections, count: chosenCount }), [chosenSections, chosenCount]);
  const canGenerate = units.length > 0 && chosenSections.length > 0;

  const toggleUnit = (n: number) =>
    setUnits((u) => (u.includes(n) ? u.filter((x) => x !== n) : [...u, n].sort((a, b) => a - b)));
  const toggleSection = (id: SectionId) =>
    setSections((s) => (s.includes(id) ? s.filter((x) => x !== id) : ALL_SECTION_IDS.filter((x) => x === id || s.includes(x))));

  const generate = () => {
    if (!canGenerate) return;
    void navigate({
      to: "/mock-exam/$unit",
      params: { unit: String(units[0]) },
      search: { units: units.join(","), sections: chosenSections.join(","), count: chosenCount },
    });
  };

  const chip = (on: boolean) =>
    `rounded-xl border px-3 py-2 text-sm font-medium transition ${
      on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Sayar Owl
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">စိတ်ကြိုက် စာမေးပွဲ ဖန်တီးခန်း</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unit များကို ရွေးပြီး ပေါင်းစပ်ပါ၊ စာမေးပွဲအပြည့် သို့မဟုတ် လိုချင်သော အပိုင်းများကိုသာ ထုတ်ယူပါ။
        </p>
        {quota && quota.role !== "guest" && (
          <p className="mt-3 inline-block rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground">
            {quota.limit < 0
              ? "Admin · အကန့်အသတ်မရှိ"
              : `${quota.role === "teacher" ? "ဆရာ" : "ကျောင်းသား"} · ယနေ့ အခမဲ့ ကျန် ${Math.max(0, quota.limit - quota.used)}/${quota.limit} ကြိမ်${(quota as { extra?: number }).extra ? ` · Extra ${(quota as { extra?: number }).extra}` : ""}`}
          </p>
        )}

        {/* Step 1 */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-bold">အဆင့် ၁ — Unit များ ရွေးပါ</h2>
            <div className="flex gap-3 text-xs">
              <button type="button" className="text-primary hover:underline" onClick={() => setUnits(UNITS.map((u) => u.number))}>
                အားလုံးရွေး
              </button>
              <button type="button" className="text-muted-foreground hover:underline" onClick={() => setUnits([])}>
                ရှင်းမည်
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">ဥပမာ — လပတ်စာမေးပွဲအတွက် Unit 1, 2, 3 ကို ပေါင်းရွေးနိုင်ပါသည်။</p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {UNITS.map((u) => (
              <button
                key={u.number}
                type="button"
                aria-pressed={units.includes(u.number)}
                title={u.title}
                onClick={() => toggleUnit(u.number)}
                className={`min-h-11 ${chip(units.includes(u.number))}`}
              >
                Unit {u.number}
              </button>
            ))}
          </div>
          {units.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              ရွေးထားသည်: {units.map((n) => UNITS.find((u) => u.number === n)?.title ?? `Unit ${n}`).join(" · ")}
            </p>
          )}
        </section>

        {/* Step 2 */}
        <section className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-bold">အဆင့် ၂ — စာမေးပွဲ ပုံစံ ရွေးပါ</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setMode("full")} aria-pressed={mode === "full"} className={`text-left ${chip(mode === "full")} p-4`}>
              <span className="block font-semibold">စာမေးပွဲအပြည့်</span>
              <span className="block text-xs opacity-80">အပိုင်း ၉ ပိုင်း · ၉၅ မှတ် · ၂ နာရီ</span>
            </button>
            <button type="button" onClick={() => setMode("custom")} aria-pressed={mode === "custom"} className={`text-left ${chip(mode === "custom")} p-4`}>
              <span className="block font-semibold">စိတ်ကြိုက် အပိုင်းရွေး</span>
              <span className="block text-xs opacity-80">လိုချင်သော အပိုင်းနှင့် မေးခွန်းအရေအတွက်</span>
            </button>
          </div>
        </section>

        {/* Step 3 */}
        {mode === "custom" && (
          <section className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-bold">အဆင့် ၃ — အပိုင်းများ ချိန်ညှိပါ</h2>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Section I–III မေးခွန်း:</span>
              {[5, 10].map((n) => (
                <button key={n} type="button" onClick={() => setCount(n as 5 | 10)} aria-pressed={count === n} className={chip(count === n)}>
                  {n} ပုဒ်
                </button>
              ))}
            </div>
            <ul className="mt-4 divide-y divide-border">
              {SECTION_SPECS.map((s) => {
                const on = sections.includes(s.id);
                return (
                  <li key={s.id}>
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 py-2">
                      <input type="checkbox" checked={on} onChange={() => toggleSection(s.id)} className="h-5 w-5 accent-primary" />
                      <span className="flex-1 text-sm">
                        <span className="font-semibold text-primary">Section {s.id}.</span> {s.label}
                        <span className="block text-xs text-muted-foreground">{s.labelMy}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{sectionMarks(s, count)} မှတ်</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Summary */}
        <section className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] mt-6 rounded-2xl border border-primary/40 bg-card p-4 shadow-lg md:bottom-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" /> {totals.marks} မှတ်</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {totals.minutes} မိနစ်</span>
              <span className="text-muted-foreground">{units.length ? `Unit ${units.join(", ")}` : "Unit မရွေးရသေးပါ"}</span>
            </div>
            <RequireSignIn>
              <Button onClick={generate} disabled={!canGenerate} className="min-h-11">
                <Rocket className="h-4 w-4" /> စာမေးပွဲ ထုတ်မည်
              </Button>
            </RequireSignIn>
          </div>
        </section>
      </main>
    </div>
  );
}
