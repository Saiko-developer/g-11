import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { safeAuthDestination } from "@/lib/auth-redirect";

type Access = { status: string; suspended_until: string | null; is_admin: boolean };
type Ctx = { session: Session | null; access: Access | null; ready: boolean; signOut: () => Promise<void> };
const AuthCtx = createContext<Ctx>({ session: null, access: null, ready: false, signOut: async () => {} });
export const useAuth = () => useContext(AuthCtx);

/** Provides session state without blocking pages; lessons are public, AI features use RequireSignIn. */
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [access, setAccess] = useState<Access | null>(null);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const applySession = async (s: Session | null, current: number) => {
      const { data, error } = s ? await supabase.auth.getUser() : { data: { user: null }, error: null };
      if (!active || current !== revision) return;
      const validated = !error && data.user ? s : null;
      setSession(validated);
      setReady(true);
      if (!validated) setAccess(null);
      else {
        const { data: accessData } = await supabase.rpc("my_access");
        if (!active || current !== revision) return;
        setAccess((accessData as unknown as Access) ?? null);
        const next = safeAuthDestination(localStorage.getItem("postLoginRedirect"));
        localStorage.removeItem("postLoginRedirect");
        if (next && window.location.pathname !== next) void router.navigate({ to: next, replace: true });
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      const current = ++revision;
      if (event === "SIGNED_OUT") {
        setSession(null);
        setAccess(null);
        setReady(true);
      }
      // Auth calls must run outside the callback to avoid locking the auth client.
      setTimeout(() => { if (active) void applySession(s, current); }, 0);
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });
    const initialRevision = revision;
    supabase.auth.getSession().then(({ data }) => {
      if (active && revision === initialRevision) void applySession(data.session, initialRevision);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [router, queryClient]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error(error.message); return; }
    localStorage.removeItem("postLoginRedirect");
    setSession(null);
    setAccess(null);
    await router.navigate({ to: "/", replace: true });
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
      <Button onClick={onSignOut} variant="outline" className="mt-6">
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </Shell>
  );
}
