import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MAIN_ADMIN = "saikokayzin123@gmail.com";

async function assertNotMain(supabase: any, id: string) {
  const { data } = await supabase.rpc("is_main_admin", { _user_id: id });
  if (data) throw new Error("The main admin account cannot be changed");
}

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const listStudents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id,email,full_name,avatar_url,status,suspended_until,created_at,last_seen_at")
      .order("last_seen_at", { ascending: false });
    if (error) throw new Error(error.message);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await (supabaseAdmin as any).from("user_roles").select("user_id,role").in("role", ["admin", "teacher"]);
    const rs = (roles ?? []) as { user_id: string; role: string }[];
    const admins = new Set(rs.filter((r) => r.role === "admin").map((r) => r.user_id));
    const teachers = new Set(rs.filter((r) => r.role === "teacher").map((r) => r.user_id));
    const { data: wallets } = await (supabaseAdmin as any).from("tutor_wallets").select("user_id,bonus_left,scholarship,scholarship_note");
    const today = new Date(Date.now() + 6.5 * 3600000).toISOString().slice(0, 10);
    const { data: usage } = await (supabaseAdmin as any).from("tutor_usage").select("user_id,used").eq("day", today);
    const wm = new Map((wallets ?? []).map((w: any) => [w.user_id, w]));
    const um = new Map((usage ?? []).map((u: any) => [u.user_id, u.used as number]));
    return (data ?? []).map((s) => ({
      ...s,
      tutor_bonus: ((wm.get(s.id) as any)?.bonus_left ?? 5) as number,
      exam_bonus: ((wm.get(s.id) as any)?.exam_bonus_left ?? 0) as number,
      tutor_used_today: (um.get(s.id) ?? 0) as number,
      scholarship: ((wm.get(s.id) as any)?.scholarship ?? "none") as string,
      scholarship_note: ((wm.get(s.id) as any)?.scholarship_note ?? null) as string | null,
      is_admin: admins.has(s.id),
      is_teacher: teachers.has(s.id),
      is_main_admin: (s.email ?? "").toLowerCase() === MAIN_ADMIN,
    }));
  });

export const setStudentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; status: "active" | "suspended"; days?: number | null }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId) throw new Error("You cannot change your own account");
    await assertNotMain(context.supabase, data.id);
    const until =
      data.status === "suspended" && data.days ? new Date(Date.now() + data.days * 86400000).toISOString() : null;
    const { error } = await context.supabase
      .from("profiles")
      .update({ status: data.status, suspended_until: until })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId) throw new Error("You cannot delete your own account");
    await assertNotMain(context.supabase, data.id);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; admin: boolean }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId) throw new Error("You cannot change your own role");
    await assertNotMain(context.supabase, data.id);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    if (data.admin) {
      const { error } = await db.from("user_roles").upsert({ user_id: data.id, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db.from("user_roles").delete().eq("user_id", data.id).eq("role", "admin");
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const setTeacherRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; teacher: boolean }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    if (data.teacher) {
      const { error } = await db.from("user_roles").upsert({ user_id: data.id, role: "teacher" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db.from("user_roles").delete().eq("user_id", data.id).eq("role", "teacher");
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const updateTutorWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; addBonus?: number; addExam?: number; scholarship?: "none" | "approved" | "rejected" }) => i)
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).rpc("admin_tutor_update", {
      _user: data.id, _add_bonus: data.addBonus ?? 0, _scholarship: data.scholarship ?? "",
    });
    if (error) throw new Error(error.message);
    if (data.addExam) {
      const { error: e2 } = await (context.supabase as any).rpc("admin_exam_credit", { _user: data.id, _add: data.addExam });
      if (e2) throw new Error(e2.message);
    }
    return { ok: true };
  });
