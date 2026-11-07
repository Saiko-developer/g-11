import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, LogIn, ShieldCheck } from "lucide-react";
import { AccountMenu } from "@/components/AccountMenu";
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
  if (session) return <AccountMenu session={session} onSignOut={() => void signOut()} />;
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

/** Shown only when the server says the signed-in account is an admin. */
function AdminLink() {
  const { session, access } = useAuth();
  if (!session || !access?.is_admin) return null;
  return (
    <Link
      to="/admin"
      aria-label="Admin"
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 text-primary shadow-sm transition hover:bg-primary/20 sm:px-3.5"
      activeProps={{ className: "bg-primary text-primary-foreground" }}
    >
      <ShieldCheck className="h-4 w-4" />
      <span className="hidden sm:inline">Admin</span>
    </Link>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isGrade11 = path === "/grade-11" || path.startsWith("/grade-11/");
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={tutorLogo} alt="Sayar Owl Academy" width={36} height={36} className="h-9 w-9 shrink-0" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">{t("site.title")}</div>
            <div className="hidden truncate text-[11px] text-muted-foreground sm:block">{t(isGrade11 ? "site.tagline.grade11" : "site.tagline")}</div>
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
          <Link to="/grade-11" className="inline-flex rounded-full border border-primary/40 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 sm:text-sm" activeProps={{ className: "bg-primary/10" }}>
            Grade 11
          </Link>
          <Link to="/progress" className="hidden rounded-md px-3 py-2 text-muted-foreground hover:text-foreground md:inline-flex" activeProps={{ className: "text-foreground font-medium" }}>
            My Progress
          </Link>
          <Link to="/classrooms" className="hidden rounded-md px-3 py-2 text-muted-foreground hover:text-foreground md:inline-flex" activeProps={{ className: "text-foreground font-medium" }}>
            Classrooms
          </Link>
          <Link
            to="/guide"
            aria-label="Guide"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-muted-foreground shadow-sm transition hover:border-primary/50 hover:text-primary sm:px-3.5"
            activeProps={{ className: "border-primary/60 bg-primary/10 text-primary font-medium" }}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </Link>
          <AdminLink />
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
