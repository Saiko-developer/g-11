import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { CreditCard, FileText, LogOut, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TopupPanel } from "@/components/Topup";
import { HelpIcon, SupportThread, useSupportUnread } from "@/components/Support";
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
  const [eq, setEq] = useState<{ role: string; limit: number; used: number; extra?: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { unread, reload: reloadUnread } = useSupportUnread(session.user.id);
  const [buyOpenRaw, setBuyOpenRaw] = useState(false);
  const buyOpen = buyOpenRaw;
  const setBuyOpen = (o: boolean) => { if (o) setMenuOpen(false); setBuyOpenRaw(o); };

  const load = useCallback(async () => {
    const [t, e] = await Promise.all([
      supabase.rpc("tutor_quota" as never),
      supabase.rpc("exam_quota"),
    ]);
    setQ((t.data as unknown as TutorQuota) ?? null);
    setEq((e.data as unknown as typeof eq) ?? null);
  }, []);

  const bonus = q?.bonus_left ?? 0;
  const left = q?.daily_left ?? 0;
  const limit = q?.daily_limit ?? 0;
  const examLimit = eq?.limit ?? 0;
  const examLeft = Math.max(0, examLimit - (eq?.used ?? 0));
  const examExtra = eq?.extra ?? 0;

  return (
    <>
    <Popover open={menuOpen} onOpenChange={(o) => { setMenuOpen(o); if (o) void load(); }}>
      <PopoverTrigger asChild>
        <button
          aria-label="Account"
          className="relative ml-1 rounded-full p-0.5 ring-2 ring-primary/30 shadow-sm transition hover:ring-primary/60 focus:outline-none focus-visible:ring-primary"
        >
          {avatar ? (
            <img src={avatar} alt={name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-destructive" />}
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
              <div className="flex flex-col items-center gap-1">
                <Ring value={left} max={limit} label={`${left}/${limit}`} sub="💬 AI Tutor" icon={<Zap className="h-4 w-4" />} />
                <span className="text-[10px] font-semibold text-amber-500">+{bonus} AI Credits</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Ring value={examLeft} max={examLimit} label={`${examLeft}/${examLimit}`} sub="📑 Exam Credits" icon={<FileText className="h-4 w-4" />} glow />
                <span className="text-[10px] font-semibold text-amber-500">+{examExtra} Bonus Exams</span>
              </div>
            </div>
          )}
        </div>
        {!q?.unlimited && (
          <div className="px-3 pb-3">
            <button
              onClick={() => setBuyOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <CreditCard className="h-4 w-4" /> Credit ဝယ်ယူရန် / Top Up
            </button>
          </div>
        )}
        <button
          onClick={() => { setMenuOpen(false); setHelpOpen(true); }}
          className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-sm hover:bg-muted"
        >
          <span className="rounded-lg bg-primary/10 p-1.5 text-primary"><HelpIcon /></span>
          <span className="flex-1 text-left">အကူအညီနှင့် အကြံပြုချက်<span className="block text-[11px] text-muted-foreground">Help & Feedback</span></span>
          {unread > 0 && <span className="rounded-full bg-destructive px-2 text-xs text-destructive-foreground">{unread}</span>}
        </button>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-sm text-destructive hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </PopoverContent>
    </Popover>
    <Dialog open={buyOpen} onOpenChange={(o) => { setBuyOpen(o); if (!o) void load(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>💳 Credit ဝယ်ယူရန်</DialogTitle>
        </DialogHeader>
        <TopupPanel kind="tutor" showTabs />
      </DialogContent>
    </Dialog>
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><HelpIcon /> အကူအညီနှင့် အကြံပြုချက်</DialogTitle>
        </DialogHeader>
        {helpOpen && <SupportThread userId={session.user.id} onRead={reloadUnread} />}
      </DialogContent>
    </Dialog>
    </>
  );
}
