import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TopupPanel } from "@/components/Topup";

export type TutorQuota = {
  signed_in: boolean;
  daily_left?: number;
  daily_limit?: number;
  bonus_left?: number;
  unlimited?: boolean;
  scholarship?: string;
};

const EVT = "tutor-quota-changed";

/** fetch wrapper for Sayar Owl chat: attaches sign-in token and refreshes the quota bar after each call. */
export const tutorFetch: typeof fetch = async (input, init) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token ?? "";
  const headers = new Headers(init?.headers);
  if (token) headers.set("authorization", `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  setTimeout(() => window.dispatchEvent(new Event(EVT)), 300);
  if (!res.ok) {
    let msg = "Something went wrong.";
    try { msg = ((await res.clone().json()) as { message?: string }).message ?? msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res;
};

export function TutorQuotaBar({ compact = false, lowOnly = false }: { compact?: boolean; lowOnly?: boolean }) {
  const [q, setQ] = useState<TutorQuota | null>(null);
  const [sending, setSending] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.rpc("tutor_quota" as never);
    setQ((data as unknown as TutorQuota) ?? null);
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(EVT, load);
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT") load();
    });
    return () => { window.removeEventListener(EVT, load); sub.subscription.unsubscribe(); };
  }, [load]);

  if (!q) return null;
  if (!q.signed_in) {
    return <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">ဆရာဇီးကွက်ကို မေးရန် Login ဝင်ပါ။</p>;
  }
  if (q.unlimited) {
    return <p className="text-xs text-primary">{q.scholarship === "approved" ? "🎓 ပညာသင်ဆု — အကန့်အသတ်မရှိ" : "အကန့်အသတ်မရှိ"}</p>;
  }
  const left = (q.daily_left ?? 0) + (q.bonus_left ?? 0);
  const request = async () => {
    setSending(true);
    await supabase.rpc("request_scholarship" as never, { _note: note } as never);
    setSending(false);
    setAskOpen(false);
    load();
  };

  if (lowOnly && left > 3) return null;
  if (lowOnly && left > 0) {
    return (
      <p className={`rounded-full px-3 py-1 text-xs font-medium shadow ${left === 1 ? "bg-destructive/15 text-destructive" : "bg-accent/20 text-foreground"}`}>
        ⚠️ {left === 1 ? "နောက်ဆုံး (၁) ကြိမ်သာ မေးခွင့် ကျန်ပါတော့သည်" : `ယနေ့ မေးခွင့် (${left}) ကြိမ်သာ ကျန်ပါတော့သည်`}
      </p>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-card px-3 py-2 text-xs ${compact ? "" : "text-sm"}`}>
      <p className="text-muted-foreground">
        ယနေ့ ကျန်: <b className="text-foreground">{q.daily_left}/{q.daily_limit}</b> · လက်ဆောင်: <b className="text-foreground">{q.bonus_left}</b>
      </p>
      {left <= 0 && (
        <div className="mt-2 space-y-2">
          <p className="font-medium text-destructive">မေးခွင့် ကုန်သွားပါပြီ။ မနက်ဖြန် ၁၀ ကြိမ် ပြန်ရပါမည်။ ပိုမေးလိုပါက အောက်တွင် အကြိမ်ဝယ်ယူနိုင်ပါသည်။</p>
          <TopupPanel />
          {q.scholarship === "pending" ? (
            <p className="text-primary">ပညာသင်ဆု လျှောက်ထားပြီးပါပြီ — Admin စစ်ဆေးနေပါသည်။</p>
          ) : askOpen ? (
            <div className="space-y-1">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2} placeholder="အကြောင်းအရာ အတိုချုပ် (မဖြစ်မနေ မဟုတ်)" className="w-full rounded border border-input bg-background p-1.5" />
              <button disabled={sending} onClick={request} className="rounded bg-primary px-3 py-1 text-primary-foreground">{sending ? "…" : "ပို့မည်"}</button>
            </div>
          ) : (
            <button onClick={() => setAskOpen(true)} className="rounded border border-primary px-3 py-1 text-primary">
              🎓 ပညာသင်ဆု လျှောက်ရန်{q.scholarship === "rejected" ? " (ထပ်မံ)" : ""}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
