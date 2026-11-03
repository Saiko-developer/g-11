import { useEffect, useState, type ReactNode } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Link } from "@tanstack/react-router";

/** Tracks browser online status (true during SSR). */
export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  return online;
}

/** Global strip shown while offline. */
export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-muted px-3 py-2 text-center text-sm text-foreground">
      <WifiOff className="h-4 w-4 shrink-0" /> အင်တာနက်လိုင်း ပြတ်တောက်နေပါသည် — သင်ခန်းစာများကို ဆက်လက်ဖတ်ရှုနိုင်ပါသည်
    </div>
  );
}

/** Replaces AI features with a friendly message while offline. */
export function OfflineGuard({ feature, children }: { feature: string; children: ReactNode }) {
  const online = useOnline();
  if (online) return <>{children}</>;
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="rounded-full bg-muted p-5"><WifiOff className="h-10 w-10 text-muted-foreground" /></div>
      <h1 className="text-lg font-semibold">အင်တာနက်လိုင်း လိုအပ်ပါသည်</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{feature} ကို အသုံးပြုရန် အင်တာနက် ဖွင့်ထားပေးပါ။</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/" className="rounded-lg border border-input px-4 py-2 text-sm">သင်ခန်းစာများသို့ ပြန်သွားမည်</Link>
        <button onClick={() => location.reload()} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"><RefreshCw className="h-4 w-4" /> ပြန်လည်စစ်မည်</button>
      </div>
    </main>
  );
}
