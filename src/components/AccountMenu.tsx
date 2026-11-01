import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Coins, LogOut, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TutorQuota } from "@/components/TutorQuotaBar";

/** Circular SVG ring with an animated fill. */
function Ring({ value, max, label, sub, icon, glow }: {
  value: number; max: number; label: string; sub: string; icon: React.ReactNode; glow?: boolean;
}) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = setTimeout(() => setShown(pct), 80); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-24 w-24 transition-transform duration-300 hover:scale-105">
        {glow && (
          <div
            className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-full opacity-70 blur-[2px]"
            style={{ background: "conic-gradient(from 0deg, transparent 0deg, hsl(var(--accent, 40 90% 55%)) 90deg, transparent 180deg)" }}
          />
        )}
        <svg viewBox="0 0 80 80" className="relative h-24 w-24 -rotate-90">
          <circle cx="40" cy="40" r={r} className="fill-card stroke-muted" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
            className={glow ? "stroke-amber-500" : "stroke-primary"}
            strokeDasharray={c} strokeDashoffset={c * (1 - shown)}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={glow ? "text-amber-500" : "animate-pulse text-primary"}>{icon}</span>
          <span className="text-base font-bold leading-tight">{label}</span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-muted-foreground">{sub}</span>
    </div>
  );
}

export function AccountMenu({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const meta = session.user.user_metadata ?? {};
  const name = (meta.full_name as string) || session.user.email || "";
  const avatar = meta.avatar_url as string | undefined;
  const [q, setQ] = useState<TutorQuota | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc("tutor_quota" as never);
    setQ((data as unknown as TutorQuota) ?? null);
  }, []);

  const bonus = q?.bonus_left ?? 0;
  const left = q?.daily_left ?? 0;
  const limit = q?.daily_limit ?? 0;

  return (
    <Popover onOpenChange={(o) => { if (o) void load(); }}>
      <PopoverTrigger asChild>
        <button
          aria-label="Account"
          className="ml-1 rounded-full p-0.5 ring-2 ring-primary/30 shadow-sm transition hover:ring-primary/60 focus:outline-none focus-visible:ring-primary"
        >
          {avatar ? (
            <img src={avatar} alt={name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-2xl p-0">
        <div className="p-4">
          <div className="truncate font-semibold">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{session.user.email}</div>
        </div>
        <div className="mx-3 mb-3 rounded-2xl border border-border bg-gradient-to-br from-muted/60 to-card p-3">
          {q?.unlimited ? (
            <p className="py-6 text-center text-sm font-medium text-primary">🎓 အကန့်အသတ်မရှိ</p>
          ) : (
            <div className="flex justify-around">
              <Ring value={bonus} max={Math.max(bonus, 50)} label={String(bonus)} sub="🪙 AI Credits" icon={<Coins className="h-4 w-4" />} glow />
              <Ring value={left} max={limit} label={`${left}/${limit}`} sub="⚡ Today Free" icon={<Zap className="h-4 w-4" />} />
            </div>
          )}
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-sm text-destructive hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </PopoverContent>
    </Popover>
  );
}
