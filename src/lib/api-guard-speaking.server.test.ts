import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { requireUser } from "./api-guard.server";
beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://example.invalid");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "test-public-key");
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
const request = () =>
  new Request("https://example.invalid/api/g11-roleplay", {
    headers: { Authorization: "Bearer test-token" },
  });
describe("speaking distinguishes authentication rejection from unavailable authentication service", () => {
  it("still validates the actual bearer token before allowing the request", async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json({ id: "student" }));
    expect(await requireUser(request(), { reportServiceErrors: true })).toEqual({
      userId: "student",
    });
    expect(vi.mocked(fetch).mock.calls[0][1]!.headers).toEqual({
      Authorization: "Bearer test-token",
      apikey: "test-public-key",
    });
  });
  it.each([401, 403])("keeps real token rejection %i as 401", async (status) => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status }));
    expect(((await requireUser(request(), { reportServiceErrors: true })) as Response).status).toBe(
      401,
    );
  });
  it.each([429, 500, 503])(
    "does not ask for another login on auth service failure %i",
    async (status) => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status }));
      expect(
        ((await requireUser(request(), { reportServiceErrors: true })) as Response).status,
      ).toBe(503);
    },
  );
  it("fails closed with a service error on unreachable or malformed auth responses", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network"));
    expect(((await requireUser(request(), { reportServiceErrors: true })) as Response).status).toBe(
      503,
    );
    vi.mocked(fetch).mockResolvedValueOnce(new Response("<html>unavailable</html>"));
    expect(((await requireUser(request(), { reportServiceErrors: true })) as Response).status).toBe(
      503,
    );
  });
  it("preserves the default behavior for existing Grade 10 callers", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 503 }));
    expect(((await requireUser(request())) as Response).status).toBe(401);
  });
  it("does not contact the service for an anonymous request", async () => {
    expect(
      (
        (await requireUser(new Request("https://example.invalid"), {
          reportServiceErrors: true,
        })) as Response
      ).status,
    ).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
  });
});
