import { useState, type ReactNode } from "react";
import { useAuth } from "@/components/AuthGate";
import { signInToGrade11 } from "@/lib/grade11SignIn";
import { Button } from "@/components/ui/button";

export function Grade11RequireSignIn({ children }: { children: ReactNode }) {
  const { session, ready = true } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!ready)
    return (
      <p role="status" className="py-3 text-sm text-muted-foreground">
        အကောင့် စစ်ဆေးနေသည်…
      </p>
    );
  if (session) return <>{children}</>;
  return (
    <div className="my-4 space-y-3 rounded-xl border border-border p-4">
      <p className="text-sm">ဆရာဇီးကွက် (AI) ကို သုံးရန် Google ဖြင့် Login ဝင်ပါ။</p>
      <Button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          const result = await signInToGrade11();
          if (result.error) setError(result.error.message);
          if (result.error || !result.redirected) setBusy(false);
        }}
      >
        {busy ? "Signing in…" : "Sign in with Google"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
