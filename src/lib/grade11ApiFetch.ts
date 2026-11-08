import { supabase } from "@/integrations/supabase/client";

/** Same bearer-token flow as Grade 10's tutorFetch, explicit for every Grade 11 AI action. */
export async function grade11ApiFetch(path: string, init: RequestInit): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const send = (accessToken?: string) => {
    const headers = new Headers(init.headers);
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(path, { ...init, headers });
  };
  const response = await send(token);
  // Only an auth rejection is retried; never repeat paid 402/429/5xx requests.
  if (response.status !== 401 || !token || init.signal?.aborted) return response;
  const refreshed = await supabase.auth.refreshSession();
  const next = refreshed.data.session?.access_token;
  if (refreshed.error || !next || next === token || init.signal?.aborted) return response;
  return send(next);
}
