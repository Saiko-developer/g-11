import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { grade11ApiFetch } from "./grade11ApiFetch";
import { supabase } from "@/integrations/supabase/client";
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getSession: vi.fn(), refreshSession: vi.fn() } },
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: { access_token: "current-token" } },
    error: null,
  } as never);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true })));
});
afterEach(() => vi.unstubAllGlobals());
describe("Grade 11 uses the existing signed-in session explicitly", () => {
  it("adds the bearer token without relying on global fetch installation", async () => {
    await grade11ApiFetch("/api/g11-check", { method: "POST", body: "{}" });
    expect(new Headers(vi.mocked(fetch).mock.calls[0][1]!.headers).get("authorization")).toBe(
      "Bearer current-token",
    );
    expect(supabase.auth.refreshSession).not.toHaveBeenCalled();
  });
  it("refreshes an expired token and retries an auth rejection once", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
    vi.mocked(supabase.auth.refreshSession).mockResolvedValue({
      data: { session: { access_token: "refreshed-token" } },
      error: null,
    } as never);
    expect((await grade11ApiFetch("/api/g11-check", { method: "POST", body: "{}" })).status).toBe(
      200,
    );
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(new Headers(vi.mocked(fetch).mock.calls[1][1]!.headers).get("authorization")).toBe(
      "Bearer refreshed-token",
    );
  });
  it.each([402, 429, 500])("never retries a paid or service failure %i", async (status) => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status }));
    expect((await grade11ApiFetch("/api/g11-roleplay", { method: "POST" })).status).toBe(status);
    expect(fetch).toHaveBeenCalledOnce();
    expect(supabase.auth.refreshSession).not.toHaveBeenCalled();
  });
  it("does not loop when refresh fails or returns the same token", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 401 }));
    vi.mocked(supabase.auth.refreshSession).mockResolvedValue({
      data: { session: { access_token: "current-token" } },
      error: null,
    } as never);
    expect((await grade11ApiFetch("/api/g11-check", { method: "POST" })).status).toBe(401);
    expect(fetch).toHaveBeenCalledOnce();
  });
});
