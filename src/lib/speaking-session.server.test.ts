import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { startSpeakingSession, chargeSpeakingTurn } from "./speaking-session.server";
const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: mocks.rpc }) }));
const request = () =>
  new Request("https://example.invalid/api/g11-roleplay", {
    headers: { Authorization: "Bearer test-token" },
  });
const session = "1bb5ec00-a69a-4f0e-a5d6-607ca4ab4177";
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());
describe("speaking RPC diagnostics without changing Grade 10 behavior", () => {
  it("reports a missing or rejected RPC as service unavailable for Grade 11, not another login", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "PGRST202" } });
    for (const response of [
      await startSpeakingSession(request(), 5, { reportServiceErrors: true }),
      await chargeSpeakingTurn(request(), session, { reportServiceErrors: true }),
    ]) {
      expect(response).toBeInstanceOf(Response);
      expect((response as Response).status).toBe(503);
      expect((await (response as Response).json()).error).toBe("speaking_service_unavailable");
    }
  });
  it("preserves legacy Grade 10 callers without the new diagnostics option", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "PGRST202" } });
    expect(((await startSpeakingSession(request(), 5)) as Response).status).toBe(401);
    expect((await chargeSpeakingTurn(request(), session))!.status).toBe(401);
  });
  it.each([
    ["signin", 401],
    ["unit_limit", 429],
    ["limit", 402],
    ["expired", 410],
    ["no_session", 410],
  ] as const)("keeps the server-enforced %s policy", async (reason, status) => {
    mocks.rpc.mockResolvedValue({ data: { ok: false, reason }, error: null });
    expect(
      ((await startSpeakingSession(request(), 5, { reportServiceErrors: true })) as Response)
        .status,
    ).toBe(status);
    expect(
      (await chargeSpeakingTurn(request(), session, { reportServiceErrors: true }))!.status,
    ).toBe(status);
  });
  it.each([null, {}, { ok: true, session: "" }])(
    "handles malformed session results as a service error: %j",
    async (data) => {
      mocks.rpc.mockResolvedValue({ data, error: null });
      expect(
        ((await startSpeakingSession(request(), 5, { reportServiceErrors: true })) as Response)
          .status,
      ).toBe(503);
    },
  );
  it("uses the same existing RPCs, unit numbers and caller-owned session", async () => {
    mocks.rpc
      .mockResolvedValueOnce({ data: { ok: true, session }, error: null })
      .mockResolvedValueOnce({ data: { ok: true }, error: null });
    expect(await startSpeakingSession(request(), 5, { reportServiceErrors: true })).toEqual({
      session,
    });
    expect(mocks.rpc).toHaveBeenNthCalledWith(1, "start_speaking_session", { p_unit: 5 });
    expect(await chargeSpeakingTurn(request(), session, { reportServiceErrors: true })).toBeNull();
    expect(mocks.rpc).toHaveBeenNthCalledWith(2, "speaking_turn", { p_session: session });
  });
  it("rejects an anonymous request without touching the database", async () => {
    expect(
      (
        (await startSpeakingSession(new Request("https://example.invalid"), 5, {
          reportServiceErrors: true,
        })) as Response
      ).status,
    ).toBe(401);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
