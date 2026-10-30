import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import tutorLogo from "@/assets/tutor-logo.png";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/components/AuthGate";
import { signInWithGoogle } from "@/components/RequireSignIn";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/** Header sign-in / sign-out control driven by the current session. */
function AccountButton() {
  const { session, ready, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  if (!ready) return null;
  const btn = "ml-1 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-60";
  if (session) {
    const meta = session.user.user_metadata ?? {};
    const name = (meta.full_name as string) || session.user.email || "";
    const avatar = meta.avatar_url as string | undefined;
    return (
      <div className="ml-1 flex items-center gap-2">
        {avatar ? (
          <img src={avatar} alt={name} title={name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span title={name} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <Button variant="outline" onClick={() => void signOut()} className={btn} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    );
  }
  return (
    <Button variant="outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const r = await signInWithGoogle();
        if (r.error) toast.error(r.error.message);
        if (r.error || !r.redirected) setBusy(false);
      }}
      className={btn}
      aria-label="Login"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden min-[400px]:inline">{busy ? "…" : "Login"}</span>
    </Button>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={tutorLogo} alt="Sayar Owl Academy" width={36} height={36} className="h-9 w-9 shrink-0" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">{t("site.title")}</div>
            <div className="hidden truncate text-[11px] text-muted-foreground sm:block">{t("site.tagline")}</div>
          </div>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="hidden rounded-md px-3 py-2 text-muted-foreground hover:text-foreground md:inline-flex"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            {t("nav.home")}
          </Link>
          <Link to="/progress" className="hidden rounded-md px-3 py-2 text-muted-foreground hover:text-foreground md:inline-flex" activeProps={{ className: "text-foreground font-medium" }}>
            My Progress
          </Link>
          <Link to="/classrooms" className="hidden rounded-md px-3 py-2 text-muted-foreground hover:text-foreground md:inline-flex" activeProps={{ className: "text-foreground font-medium" }}>
            Classrooms
          </Link>
          <Link to="/guide" className="rounded-md px-2 py-2 text-muted-foreground hover:text-foreground sm:px-3" activeProps={{ className: "text-foreground font-medium" }}>
            📖<span className="hidden sm:inline"> Guide</span>
          </Link>
          <AccountButton />
          <Link
            to="/tutor"
            className="ml-2 hidden items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 md:inline-flex"
          >
            {t("nav.ask")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
