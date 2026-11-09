import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { Route } from "@/routes/api/chat-home";
import { consumeTutorQuota } from "./tutor-quota.server";
import { getLovableChatModel } from "./ai-gateway.server";
import { streamText } from "ai";
import { GRADE11_HOME_PROMPT } from "./grade11TutorPrompt.server";
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
}));
vi.mock("./tutor-quota.server", () => ({ consumeTutorQuota: vi.fn() }));
vi.mock("./ai-gateway.server", () => ({
  getLovableChatModel: vi.fn().mockReturnValue("existing-model"),
}));
vi.mock("ai", () => ({
  convertToModelMessages: vi.fn().mockResolvedValue([]),
  streamText: vi.fn().mockReturnValue({ toUIMessageStreamResponse: () => new Response("stream") }),
}));
const post = (
  Route as unknown as {
    options: { server: { handlers: { POST: (arg: { request: Request }) => Promise<Response> } } };
  }
).options.server.handlers.POST;
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("LOVABLE_API_KEY", "test-only");
  vi.mocked(consumeTutorQuota).mockResolvedValue(null);
});
afterEach(() => vi.unstubAllEnvs());
const request = (body: unknown) =>
  new Request("https://example.invalid/api/chat-home", {
    method: "POST",
    body: JSON.stringify(body),
  });
describe("shared tutor workflow keeps Grade 10 defaults and supports Grade 11", () => {
  it.each([10, 11])("uses the same model, quota and stream for Grade %i", async (grade) => {
    const response = await post({
      request: request({ grade, messages: [], lessonContext: `Grade ${grade} reference` }),
    });
    expect(response.status).toBe(200);
    expect(consumeTutorQuota).toHaveBeenCalledOnce();
    expect(getLovableChatModel).toHaveBeenCalledOnce();
    const args = vi.mocked(streamText).mock.calls[0][0];
    expect(args.model).toBe("existing-model");
    expect(args.system).toContain(`(Grade ${grade})`);
    if (grade === 11) expect(args.system).not.toContain("Grade 10");
  });
  it.each([undefined, 11])(
    "grounds voice replies in the active section for grade %s",
    async (grade) => {
      await post({
        request: request({
          grade,
          mode: "voice",
          messages: [],
          lessonContext: "Original textbook lesson",
          sectionContent: "Current exercise question",
        }),
      });
      const system = vi.mocked(streamText).mock.calls[0][0].system;
      expect(system).toContain(grade === 11 ? "Grade 11" : "Grade 10");
      expect(system).toContain('<untrusted label="screen_section">');
      expect(system).toContain("Current exercise question");
      expect(system).toContain("markdown");
    },
  );
  it("does not make a model call after the existing quota denies access", async () => {
    vi.mocked(consumeTutorQuota).mockResolvedValue(new Response(null, { status: 429 }));
    expect((await post({ request: request({ grade: 11, messages: [] }) })).status).toBe(429);
    expect(streamText).not.toHaveBeenCalled();
  });
  it("keeps long Grade 11 references available and identifies configuration failures correctly", async () => {
    await post({
      request: request({
        grade: 11,
        messages: [],
        lessonContext: "x".repeat(10000) + "SOURCE END",
      }),
    });
    expect(vi.mocked(streamText).mock.calls[0][0].system).toContain("SOURCE END");
    vi.stubEnv("LOVABLE_API_KEY", "");
    const response = await post({ request: request({ grade: 11, messages: [] }) });
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("ai_unavailable");
  });
});

it("uses a request-specific Grade 11 policy without the Grade 10 exercise template", async () => {
  await post({
    request: request({
      grade: 11,
      mode: "voice",
      messages: [],
      lessonContext: "[Paragraph 1] The dolphin is a kind of sea animal.",
    }),
  });
  const system = vi.mocked(streamText).mock.calls[0][0].system;
  expect(system).toContain(GRADE11_HOME_PROMPT);
  expect(system).toContain("Paragraph 1 / ပထမစာပိုဒ်");
  expect(system).toContain("မူရင်းဝါကျတစ်ကြောင်းစီ");
  expect(system).not.toContain("# အသေးစိတ် ရှင်းပြရသည့်အခါ အဖြေပုံစံ");
  expect(system).toContain("The dolphin is a kind of sea animal.");
});
it("grounds the reported Unit 3 Grammar question separately from the full section", async () => {
  await post({
    request: request({
      grade: 11,
      mode: "voice",
      messages: [],
      currentQuestion:
        "Question 3 | source 3C-32\nI finished ___________ (write) the assignment just before the deadline.",
    }),
  });
  const system = vi.mocked(streamText).mock.calls[0][0].system;
  expect(system).toContain('<untrusted label="resolved_question">');
  expect(system).toContain("I finished ___________ (write) the assignment");
});
