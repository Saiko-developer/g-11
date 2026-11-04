import { createClient } from "@supabase/supabase-js";

function userDb(request: Request) {
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}`, apikey: key } },
  });
}

function blocked(reason?: string): Response {
  if (reason === "signin" || reason === "no_session") return Response.json({ error: "signin" }, { status: 401 });
  if (reason === "unit_limit") return Response.json({ error: "unit_limit" }, { status: 429 });
  if (reason === "expired") return Response.json({ error: "expired" }, { status: 410 });
  return Response.json({ error: "limit" }, { status: 402 });
}

/** Opens a speaking call: 2 per unit per day, charges the first credit. */
export async function startSpeakingSession(request: Request, unit: number): Promise<{ session: string } | Response> {
  const db = userDb(request);
  if (!db) return blocked("signin");
  const { data, error } = await db.rpc("start_speaking_session" as never, { p_unit: unit } as never);
  if (error) return blocked("signin");
  const r = data as unknown as { ok: boolean; reason?: string; session?: string };
  return r.ok && r.session ? { session: r.session } : blocked(r.reason);
}

/** Charges 1 more credit for every new 3-minute block of an open call. */
export async function chargeSpeakingTurn(request: Request, session: string): Promise<Response | null> {
  const db = userDb(request);
  if (!db) return blocked("signin");
  const { data, error } = await db.rpc("speaking_turn" as never, { p_session: session } as never);
  if (error) return blocked("signin");
  const r = data as unknown as { ok: boolean; reason?: string };
  return r.ok ? null : blocked(r.reason);
}
