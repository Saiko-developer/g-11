import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { GraduationCap, Lock, LogOut } from "lucide-react";

type Access = { status: string; suspended_until: string | null; is_admin: boolean };
type Ctx = { session: Session | null; access: Access | null; ready: boolean; signOut: () => Promise<void> };
const AuthCtx = createContext<Ctx>({ session: null, access: null, ready: false, signOut: async () => {} });
export const useAuth = () => useContext(AuthCtx);

/** Provides session state without blocking pages; lessons are public, AI features use RequireSignIn. */
export function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [access, setAccess] = useState<Access | null>(null);

  const loadAccess = useCallback(async (s: Session | null) => {
    if (!s) return setAccess(null);
    const { data } = await supabase.rpc("my_access");
    setAccess((data as unknown as Access) ?? null);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setSession(s);
        setTimeout(() => void loadAccess(s), 0);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      void loadAccess(data.session);
      const next = localStorage.getItem("postLoginRedirect");
      if (data.session && next && next.startsWith("/") && !next.startsWith("//")) {
        localStorage.removeItem("postLoginRedirect");
        if (window.location.pathname !== next) window.location.assign(next);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadAccess]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (session && access && access.status === "suspended") {
    return <BlockedScreen access={access} onSignOut={signOut} />;
  }

  return <AuthCtx.Provider value={{ session, access, ready, signOut }}>{children}</AuthCtx.Provider>;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-sm">{children}</section>
    </main>
  );
}

function SignInScreen() {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signIn = async () => {
    setBusy(true);
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setErr("Sign-in failed. Please try again.");
      setBusy(false);
    }
  };
  return (
    <Shell>
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <GraduationCap className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Sayar Owl Academy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Gmail ဖြင့် တစ်ချက်နှိပ်ပြီး ဝင်ရောက်ပါ။</p>
      <button
        onClick={signIn}
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in with Google"}
      </button>
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
    </Shell>
  );
}

function BlockedScreen({ access, onSignOut }: { access: Access; onSignOut: () => void }) {
  return (
    <Shell>
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <Lock className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold">သင့်အကောင့်ကို ယာယီရပ်ဆိုင်းထားပါသည်</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your account is suspended. Please contact your teacher.
        {access.suspended_until && (
          <> <br />Until: {new Date(access.suspended_until).toLocaleDateString()}</>
        )}
      </p>
      <button onClick={onSignOut} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </Shell>
  );
}
