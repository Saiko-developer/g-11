import { useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";

export async function signInWithGoogle(redirectUri?: string) {
  try {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: redirectUri ?? window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (r.error || r.redirected || !("tokens" in r) || !r.tokens) return r;
    // Make sure the returned tokens actually became the active session (popup flow in preview).
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const { error } = await supabase.auth.setSession(r.tokens);
      if (error) return { error: new Error("Login မအောင်မြင်ပါ။ ထပ်စမ်းပါ။ (" + error.message + ")"), redirected: false };
    }
    return r;
  } catch (error) {
    return { error: error instanceof Error ? error : new Error("Sign-in failed. Please try again."), redirected: false };
  }
}

/** Shows children only for signed-in students; otherwise an inline sign-in card (no page redirect). */
export function RequireSignIn({ children }: { children: ReactNode }) {
  const { session, ready } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!ready) return null;
  if (session) return <>{children}</>;
  return (
    <div className="mx-auto my-6 max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold">ဆရာဇီးကွက် (AI) ကို သုံးရန် Login ဝင်ပါ</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sign in with Google to use the AI tutor and exam grading.</p>
      <Button
        onClick={async () => {
          setBusy(true);
          setErr(null);
          const r = await signInWithGoogle();
          if (r.error) setErr(r.error.message);
          if (r.error || !r.redirected) setBusy(false);
        }}
        disabled={busy}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in with Google"}
      </Button>
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
    </div>
  );
}
