import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Route } from "@/routes/api/transcribe";
import { requireUser } from "./api-guard.server";
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
}));
vi.mock("./api-guard.server", async (original) => ({
  ...(await original<object>()),
  requireUser: vi.fn(),
}));
const post = (
  Route as unknown as {
    options: { server: { handlers: { POST: (args: { request: Request }) => Promise<Response> } } };
  }
).options.server.handlers.POST;
beforeEach(() => {
  vi.stubEnv("LOVABLE_API_KEY", "test-only");
  vi.mocked(requireUser).mockResolvedValue({ id: "test" } as never);
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ text: "ဒါလေး ရှင်းပြပေးပါ" }) }),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
it.each([undefined, "11"])(
  "preserves default transcription and scopes lesson hints to Grade %s",
  async (grade) => {
    const form = new FormData();
    form.append("file", new File(["audio"], "voice.webm", { type: "audio/webm" }));
    form.append("lessonContext", "Unit 1 dolphins");
    if (grade) form.append("grade", grade);
    const response = await post({ request: { formData: async () => form } as Request });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ text: "ဒါလေး ရှင်းပြပေးပါ" });
    const init = vi.mocked(fetch).mock.calls[0][1]!;
    const upstream = init.body as FormData;
    expect(upstream.has("language")).toBe(false);
    if (grade) {
      expect(upstream.get("prompt")).toContain("Grade 11");
      expect(upstream.get("prompt")).toContain("Unit 1 dolphins");
      expect(upstream.get("prompt")).toContain('<untrusted label="lesson_vocabulary">');
      expect(init.signal).toBeInstanceOf(AbortSignal);
    } else {
      expect(upstream.get("prompt")).toContain("Grade 10");
      expect(upstream.get("prompt")).not.toContain("Unit 1 dolphins");
      expect(init.signal).toBeUndefined();
    }
  },
);
it("does not transcribe without authentication", async () => {
  vi.mocked(requireUser).mockResolvedValue(new Response(null, { status: 401 }));
  expect((await post({ request: {} as Request })).status).toBe(401);
  expect(fetch).not.toHaveBeenCalled();
});
it("returns a service error for malformed upstream output instead of empty recognized speech", async () => {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ unexpected: "value" }),
  } as unknown as Response);
  const form = new FormData();
  form.append("file", new File(["audio"], "voice.webm", { type: "audio/webm" }));
  form.append("grade", "11");
  const response = await post({ request: { formData: async () => form } as Request });
  expect(response.status).toBe(502);
  expect((await response.json()).error).toBe("invalid_transcription_response");
});
