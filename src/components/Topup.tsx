import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Pkg = { credits: number; price: number };
type Kind = "tutor" | "exam";
type Settings = { kpay: string | null; wavepay: string | null; account_name: string | null; contact: string | null; packages: Pkg[]; exam_packages: Pkg[] };
type Req = { id: string; user_id: string; kind?: Kind; credits: number; price: number; method: string; txn_ref: string; status: string; created_at: string };

const db = supabase as any;

async function loadSettings(): Promise<Settings | null> {
  const { data } = await db.from("payment_settings").select("*").eq("id", 1).maybeSingle();
  return data ? { ...data, packages: (data.packages ?? []) as Pkg[], exam_packages: (data.exam_packages ?? []) as Pkg[] } : null;
}

const UNIT: Record<Kind, string> = { tutor: "ကြိမ်", exam: "စုံ" };

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={() => { void navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="ml-2 rounded border border-input px-1.5 py-0.5 text-[11px]">{ok ? "Copied ✓" : "📋 Copy"}</button>
  );
}

/** Buy credits: AI Tutor questions or exam-generation credits, as a 3-step guide. */
export function TopupPanel({ kind: initial = "tutor", showTabs = false }: { kind?: Kind; showTabs?: boolean }) {
  const [kind, setKind] = useState<Kind>(initial);
  const [s, setS] = useState<Settings | null>(null);
  const [pick, setPick] = useState<Pkg | null>(null);
  const [method, setMethod] = useState("kpay");
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState<Req[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const st = await loadSettings();
    const def = { kpay: null, wavepay: null, account_name: null, contact: null, packages: [{ credits: 50, price: 1000 }, { credits: 150, price: 2500 }], exam_packages: [{ credits: 5, price: 1500 }, { credits: 15, price: 4000 }] };
    setS(st ? { ...st, packages: st.packages.length ? st.packages : def.packages, exam_packages: st.exam_packages.length ? st.exam_packages : def.exam_packages } : def);
    const { data } = await db.from("topup_requests").select("*").order("created_at", { ascending: false }).limit(5);
    setMine(data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!s) return null;
  const mineK = mine.filter((r) => (r.kind ?? "tutor") === kind);
  const pending = mineK.find((r) => r.status === "pending");
  const pkgs = kind === "exam" ? s.exam_packages : s.packages;
  const u = UNIT[kind];

  const submit = async () => {
    if (!pick || ref.trim().length < 3) { setMsg("Package ရွေးပြီး ငွေလွှဲ Transaction နံပါတ် ထည့်ပါ။"); return; }
    setBusy(true); setMsg(null);
    const { data: au } = await supabase.auth.getUser();
    const { error } = await db.from("topup_requests").insert({ user_id: au.user?.id, kind, credits: pick.credits, price: pick.price, method, txn_ref: ref.trim() });
    setBusy(false);
    if (error) setMsg(error.message); else { setRef(""); setPick(null); load(); }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-3 text-sm">
      {showTabs && (
        <div className="flex gap-1 rounded-lg bg-background p-1">
          {(["tutor", "exam"] as Kind[]).map((k) => (
            <button key={k} type="button" onClick={() => { setKind(k); setPick(null); }}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium ${kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {k === "tutor" ? "💬 AI Tutor မေးခွန်း Credit" : "📝 စာမေးပွဲထုတ်ခွင့် Credit"}
            </button>
          ))}
        </div>
      )}
      <p className="font-semibold text-foreground">{kind === "tutor" ? "💳 AI Tutor မေးခွင့် ဝယ်ယူရန်" : "💳 စာမေးပွဲထုတ်ခွင့် (Exam Credit) ဝယ်ယူရန်"}</p>
      {kind === "exam" && <p className="text-xs text-muted-foreground">နေ့စဉ် အခမဲ့ (ဆရာ ၂ ကြိမ် / ကျောင်းသား ၁ ကြိမ်) ပြည့်သွားပါက Exam Credit မှ အလိုအလျောက် နှုတ်ပါမည်။</p>}
      {pending ? (
        <p className="text-primary">{pending.credits} {u} ({pending.price.toLocaleString()} ကျပ်) တောင်းဆိုထားပြီးပါပြီ — Admin စစ်ဆေးနေပါသည်။</p>
      ) : (
        <>
          <div>
            <p className="mb-1 text-xs font-medium">အဆင့် ၁ — ပက်ကေ့ချ် ရွေးပါ</p>
            <div className="grid grid-cols-2 gap-2">
              {pkgs.map((p) => (
                <button key={p.credits} type="button" onClick={() => setPick(p)}
                  className={`rounded-lg border p-2 text-center ${pick?.credits === p.credits ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}>
                  <div className="text-base font-bold">{p.credits} {u}</div>
                  <div className="text-xs">{p.price.toLocaleString()} ကျပ်</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium">အဆင့် ၂ — KPay / WavePay ဖြင့် ငွေလွှဲပါ</p>
            <div className="space-y-1 rounded-lg bg-background p-2 text-muted-foreground">
              {s.kpay && <p>KPay: <b className="text-foreground">{s.kpay}</b><CopyBtn text={s.kpay} /></p>}
              {s.wavepay && <p>WavePay: <b className="text-foreground">{s.wavepay}</b><CopyBtn text={s.wavepay} /></p>}
              {s.account_name && <p>အမည်: <b className="text-foreground">{s.account_name}</b></p>}
              {!s.kpay && !s.wavepay && <p>ငွေလွှဲ အချက်အလက် မထည့်ရသေးပါ — Admin ထံ ဆက်သွယ်ပါ။</p>}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium">အဆင့် ၃ — Transaction နံပါတ် (နောက်ဆုံး ၆ လုံး) ထည့်ပြီး ပို့ပါ</p>
            <div className="flex flex-wrap gap-1">
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="rounded border border-input bg-background p-1">
                <option value="kpay">KPay</option><option value="wavepay">WavePay</option><option value="other">Other</option>
              </select>
              <input value={ref} onChange={(e) => setRef(e.target.value)} maxLength={64} placeholder="Transaction No." className="min-w-0 flex-1 rounded border border-input bg-background p-1" />
              <button disabled={busy} onClick={submit} className="rounded bg-primary px-3 py-1 text-primary-foreground">{busy ? "…" : "ပို့မည်"}</button>
            </div>
            {s.contact && <p className="mt-1 text-xs text-muted-foreground">မေးမြန်းရန်: <b className="text-foreground">{s.contact}</b></p>}
          </div>
        </>
      )}
      {mineK[0]?.status === "rejected" && !pending && <p className="text-destructive">ယခင်တောင်းဆိုမှု ပယ်ချခံရပါသည်။ Admin ထံ ဆက်သွယ်ပါ။</p>}
      {msg && <p className="text-destructive">{msg}</p>}
    </div>
  );
}

/** Admin side: payment info editor + pending top-up approvals. */
export function AdminTopups({ emails, onChanged }: { emails: Record<string, string>; onChanged: () => void }) {
  const [s, setS] = useState<Settings | null>(null);
  const [pkgText, setPkgText] = useState("");
  const [examText, setExamText] = useState("");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const st = (await loadSettings()) ?? { kpay: null, wavepay: null, account_name: null, contact: null, packages: [{ credits: 50, price: 1000 }, { credits: 150, price: 2500 }], exam_packages: [{ credits: 5, price: 1500 }, { credits: 15, price: 4000 }] };
    setS(st);
    setPkgText((st?.packages ?? []).map((p) => `${p.credits}=${p.price}`).join(", "));
    setExamText((st?.exam_packages ?? []).map((p) => `${p.credits}=${p.price}`).join(", "));
    const { data } = await db.from("topup_requests").select("*").eq("status", "pending").order("created_at");
    setReqs(data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!s) return null;
  const save = async () => {
    const parse = (t: string) => t.split(",").map((x) => x.trim().split("=").map(Number)).filter(([c, p]) => c > 0 && p >= 0).map(([credits, price]) => ({ credits, price }));
    const packages = parse(pkgText);
    const exam_packages = parse(examText);
    setBusy(true);
    const { error } = await db.from("payment_settings").upsert({ id: 1, kpay: s.kpay, wavepay: s.wavepay, account_name: s.account_name, contact: s.contact, packages, exam_packages, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { alert(error.message); return; }
    setSaved(true); setTimeout(() => setSaved(false), 2000); load();
  };
  const review = async (id: string, approve: boolean) => {
    setBusy(true);
    const { error } = await db.rpc("admin_review_topup", { _id: id, _approve: approve });
    setBusy(false);
    if (error) alert(error.message);
    load(); onChanged();
  };
  const field = (k: keyof Settings, label: string) => (
    <label className="text-xs">{label}
      <input value={(s[k] as string) ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="mt-0.5 w-full rounded border border-input bg-background px-2 py-1 text-sm" />
    </label>
  );

  return (
    <div className="mb-6 space-y-4 rounded-xl border border-border bg-card p-4">
      <div>
        <h2 className="mb-2 font-semibold">💳 Top-up တောင်းဆိုမှုများ ({reqs.length})</h2>
        {reqs.length === 0 && <p className="text-sm text-muted-foreground">စောင့်ဆိုင်းနေသော တောင်းဆိုမှု မရှိပါ။</p>}
        {reqs.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-2 border-t border-border py-2 text-sm">
            <span className="flex-1">{emails[r.user_id] ?? r.user_id} — {r.kind === "exam" ? "📝 Exam" : "💬 Tutor"} <b>{r.credits} {UNIT[r.kind ?? "tutor"]}</b> · {r.price.toLocaleString()} ကျပ် · {r.method.toUpperCase()} #{r.txn_ref}
              <span className="ml-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span></span>
            <button disabled={busy} onClick={() => review(r.id, true)} className="rounded-lg bg-primary px-3 py-1 text-primary-foreground">ငွေရပြီ — Approve</button>
            <button disabled={busy} onClick={() => review(r.id, false)} className="rounded-lg border border-input px-3 py-1">Reject</button>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4">
        <h2 className="font-semibold">⚙️ Payment & Package Settings</h2>
        <p className="text-xs text-muted-foreground">ကျောင်းသားများ မြင်ရမည့် ငွေလွှဲ အချက်အလက်နှင့် ဈေးနှုန်းများ</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {field("kpay", "KPay ဖုန်းနံပါတ်")}
          {field("wavepay", "WavePay ဖုန်းနံပါတ်")}
          {field("account_name", "အကောင့်အမည်")}
          {field("contact", "ဆက်သွယ်ရန် (Viber / Telegram / Phone)")}
          <label className="text-xs sm:col-span-2">📝 Exam Generation Packages (စုံ=ကျပ်, ကော်မာခြား) ဥပမာ 5=1500, 15=4000
            <input value={examText} onChange={(e) => setExamText(e.target.value)} className="mt-0.5 w-full rounded border border-input bg-background px-2 py-1 text-sm" />
          </label>
          <label className="text-xs sm:col-span-2">💬 AI Tutor Packages (ကြိမ်=ကျပ်, ကော်မာခြား) ဥပမာ 50=1000, 150=2500
            <input value={pkgText} onChange={(e) => setPkgText(e.target.value)} className="mt-0.5 w-full rounded border border-input bg-background px-2 py-1 text-sm" />
          </label>
        </div>
        <button disabled={busy} onClick={save} className="mt-3 rounded-lg bg-primary px-4 py-1.5 text-sm text-primary-foreground">{saved ? "Saved ✓" : "💾 Save"}</button>
      </div>
    </div>
  );
}
