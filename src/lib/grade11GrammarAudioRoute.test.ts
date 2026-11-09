import { afterEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ requireUser: vi.fn(), cache: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (config: unknown) => config }));
vi.mock("@/lib/api-guard.server", () => ({
  requireUser: mocks.requireUser,
  untrusted: vi.fn(),
  cleanLine: vi.fn(),
}));
vi.mock("@/lib/grade11GrammarAudioCache.server", () => ({ unit1GrammarAudio: mocks.cache }));
import { Route } from "../routes/api/tts";
const post = (
  Route as unknown as {
    server: { handlers: { POST: (args: { request: Request }) => Promise<Response> } };
  }
).server.handlers.POST;
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});
it("requires authentication before a Unit 1 cache lookup", async () => {
  mocks.requireUser.mockResolvedValue(new Response("sign in", { status: 401 }));
  const response = await post({
    request: new Request("https://school.example/api/tts", {
      method: "POST",
      body: JSON.stringify({ text: "lesson", lessonCache: "grade11-unit1" }),
    }),
  });
  expect(response.status).toBe(401);
  expect(mocks.cache).not.toHaveBeenCalled();
});
it("keeps ordinary TTS requests on the original generation path", async () => {
  mocks.requireUser.mockResolvedValue({ userId: "student" });
  vi.stubEnv("LOVABLE_API_KEY", "");
  const response = await post({
    request: new Request("https://school.example/api/tts", {
      method: "POST",
      body: JSON.stringify({ text: "Grade 10 explanation", voice: "sarah" }),
    }),
  });
  expect(response.status).toBe(500);
  expect(mocks.cache).not.toHaveBeenCalled();
});

it("opts Unit 1 requests into the cache after authentication", async () => {
  mocks.requireUser.mockResolvedValue({ userId: "student" });
  mocks.cache.mockResolvedValue(new Response("saved audio"));
  const request = new Request("https://school.example/api/tts", {
    method: "POST",
    body: JSON.stringify({
      text: "authored clip",
      voice: "sarah",
      speed: 1,
      lessonCache: "grade11-unit1",
    }),
  });
  expect(await (await post({ request })).text()).toBe("saved audio");
  expect(mocks.cache).toHaveBeenCalledWith(
    request,
    { text: "authored clip", voice: "sarah", speed: 1, provider: undefined },
    expect.any(Function),
  );
});
