import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { Route } from "@/routes/api/chat";
import { consumeTutorQuota } from "./tutor-quota.server";
import { getLovableChatModel } from "./ai-gateway.server";
import { streamText } from "ai";
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
    options: { server: { handlers: { POST: (args: { request: Request }) => Promise<Response> } } };
  }
).options.server.handlers.POST;
const request = (body: unknown) =>
  new Request("https://example.invalid/api/chat", { method: "POST", body: JSON.stringify(body) });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("LOVABLE_API_KEY", "test-only");
  vi.mocked(consumeTutorQuota).mockResolvedValue(null);
});
afterEach(() => vi.unstubAllEnvs());
describe("shared Grade 10 section popup supports Grade 11", () => {
  it.each([undefined, 11])(
    "keeps the existing model/quota workflow with grade %s",
    async (grade) => {
      const response = await post({
        request: request({
          grade,
          mode: "text",
          messages: [],
          lessonContext: "Original textbook reference",
        }),
      });
      expect(response.status).toBe(200);
      expect(consumeTutorQuota).toHaveBeenCalledOnce();
      expect(getLovableChatModel).toHaveBeenCalledOnce();
      const args = vi.mocked(streamText).mock.calls[0][0];
      expect(args.model).toBe("existing-model");
      expect(args.system).toContain(grade === 11 ? "Grade 11" : "Grade 10");
      if (grade === 11) expect(args.system).not.toContain("Grade 10");
    },
  );
  it("keeps full Grade 11 source context inside an untrusted reference block", async () => {
    await post({
      request: request({
        grade: 11,
        mode: "text",
        messages: [],
        lessonContext: "x".repeat(10000) + "SOURCE END",
        sectionContent: "Visible Review 1 questions",
      }),
    });
    const args = vi.mocked(streamText).mock.calls[0][0];
    expect(args.system).toContain("SOURCE END");
    expect(args.system).toContain('<untrusted label="lesson">');
    expect(args.system).toContain('<untrusted label="screen_section">');
    expect(args.system).toContain("Visible Review 1 questions");
  });
  it("does not call the model when the existing tutor quota rejects the request", async () => {
    vi.mocked(consumeTutorQuota).mockResolvedValue(new Response(null, { status: 429 }));
    expect((await post({ request: request({ grade: 11, messages: [] }) })).status).toBe(429);
    expect(streamText).not.toHaveBeenCalled();
  });
});
