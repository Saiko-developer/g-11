import { createClient } from "@supabase/supabase-js";

/** Consumes one Sayar Owl message for the caller. Returns a Response to send back if blocked, or null to proceed. */
export async function consumeTutorQuota(request: Request): Promise<Response | null> {
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "signin", message: "ဆရာဇီးကွက်ကို မေးရန် အရင် Login ဝင်ပါ။" }, { status: 401 });
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const db = createClient(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}`, apikey: key } },
  });
  const { data, error } = await db.rpc("consume_tutor_message" as never);
  if (error) return Response.json({ error: "signin", message: "ပြန်လည် Login ဝင်ပါ။" }, { status: 401 });
  const r = data as unknown as { ok: boolean; reason?: string };
  if (r.ok) return null;
  if (r.reason === "signin") return Response.json({ error: "signin", message: "ဆရာဇီးကွက်ကို မေးရန် အရင် Login ဝင်ပါ။" }, { status: 401 });
  return Response.json({ error: "limit", message: "ယနေ့ မေးခွင့် ကုန်သွားပါပြီ။" }, { status: 429 });
}
