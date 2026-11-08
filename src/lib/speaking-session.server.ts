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

function blocked(reason?: string, options?: SpeakingOptions): Response {
  if (reason === "no_session" && options?.reportServiceErrors)
    return Response.json(
      { error: "expired", message: "စကားပြော session မရှိတော့ပါ။ အသစ် ပြန်စပါ။" },
      { status: 410 },
    );
  if (reason === "signin" || reason === "no_session")
    return Response.json({ error: "signin" }, { status: 401 });
  if (reason === "unit_limit") return Response.json({ error: "unit_limit" }, { status: 429 });
  if (reason === "expired") return Response.json({ error: "expired" }, { status: 410 });
  return Response.json({ error: "limit" }, { status: 402 });
}

type SpeakingOptions = { reportServiceErrors?: boolean };

function serviceFailure(operation: string, code?: string): Response {
  // Keep credentials, tokens and student data out of diagnostics.
  console.error("[speaking-session] service failure", {
    operation,
    code: code ?? "invalid_response",
  });
  return Response.json(
    {
      error: "speaking_service_unavailable",
      message:
        "AI စကားပြောဝန်ဆောင်မှုကို ချိတ်ဆက်မရပါ။ ခဏစောင့်ပြီး ပြန်စမ်းပါ။ ဆက်ဖြစ်နေလျှင် ဆရာထံ အကြောင်းကြားပါ။",
    },
    { status: 503 },
  );
}

/** Opens a speaking call: 2 per unit per day, charges the first credit. */
export async function startSpeakingSession(
  request: Request,
  unit: number,
  options?: SpeakingOptions,
): Promise<{ session: string } | Response> {
  const db = userDb(request);
  if (!db) return blocked("signin");
  const { data, error } = await db.rpc(
    "start_speaking_session" as never,
    { p_unit: unit } as never,
  );
  if (error)
    return options?.reportServiceErrors
      ? serviceFailure("start_speaking_session", error.code)
      : blocked("signin");
  const r = data as unknown as { ok: boolean; reason?: string; session?: string };
  if (
    options?.reportServiceErrors &&
    (!r ||
      typeof r.ok !== "boolean" ||
      (r.ok && (typeof r.session !== "string" || !r.session.trim())) ||
      (!r.ok && typeof r.reason !== "string"))
  )
    return serviceFailure("start_speaking_session");
  return r.ok && r.session ? { session: r.session } : blocked(r.reason, options);
}

/** Charges 1 more credit for every new 3-minute block of an open call. */
export async function chargeSpeakingTurn(
  request: Request,
  session: string,
  options?: SpeakingOptions,
): Promise<Response | null> {
  const db = userDb(request);
  if (!db) return blocked("signin");
  const { data, error } = await db.rpc("speaking_turn" as never, { p_session: session } as never);
  if (error)
    return options?.reportServiceErrors
      ? serviceFailure("speaking_turn", error.code)
      : blocked("signin");
  const r = data as unknown as { ok: boolean; reason?: string };
  if (
    options?.reportServiceErrors &&
    (!r || typeof r.ok !== "boolean" || (!r.ok && typeof r.reason !== "string"))
  )
    return serviceFailure("speaking_turn");
  return r.ok ? null : blocked(r.reason, options);
}
