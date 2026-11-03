import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { checkAiStatus } from "@/lib/ai-status.functions";

type Result = Awaited<ReturnType<typeof checkAiStatus>>;

function Row({ label, c }: { label: string; c?: Result["lovable"] }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2 text-sm">
      <span className="font-medium">{label}</span>
      {!c ? <span className="text-muted-foreground">—</span> : c.ok ? (
        <span className="text-primary">✅ အလုပ်လုပ်နေပါသည် ({(c.ms / 1000).toFixed(1)}s)</span>
      ) : (
        <span className="truncate text-destructive" title={c.message}>❌ {c.message}</span>
      )}
    </div>
  );
}

export function AdminAiStatus() {
  const check = useServerFn(checkAiStatus);
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setBusy(true); setErr(null);
    try { setRes(await check()); } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="mb-6 rounded-xl border border-input bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">🤖 AI ချိတ်ဆက်မှု အခြေအနေ</h2>
          <p className="text-xs text-muted-foreground">Lovable AI (ပထမ) နှင့် Google Gemini (အရန်) ကို စစ်ဆေးပါ</p>
        </div>
        <button onClick={run} disabled={busy} className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60">
          {busy ? "စစ်ဆေးနေသည်…" : "စစ်ဆေးမည်"}
        </button>
      </div>
      <div className="grid gap-2">
        <Row label="Lovable AI" c={res?.lovable} />
        <Row label="Google Gemini Key" c={res?.gemini} />
      </div>
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
    </div>
  );
}
