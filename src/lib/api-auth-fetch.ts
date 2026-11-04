import { supabase } from "@/integrations/supabase/client";

let installed = false;

/** Attaches the signed-in user's bearer token to same-origin /api/* calls that don't set one. */
export function installApiAuthFetch() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = new URL(typeof input === "string" || input instanceof URL ? input.toString() : input.url, window.location.origin);
      if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
        const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
        if (!headers.has("authorization")) {
          const token = (await supabase.auth.getSession()).data.session?.access_token;
          if (token) {
            headers.set("authorization", `Bearer ${token}`);
            return original(input, { ...init, headers });
          }
        }
      }
    } catch {
      /* fall through */
    }
    return original(input, init);
  };
}
