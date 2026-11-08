import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleGrade11Check } from "./grade11Check.server";
import { generateJson } from "./ai-json.server";
import { requireUser } from "./api-guard.server";
vi.mock("./ai-json.server", () => ({ generateJson: vi.fn() }));
vi.mock("./api-guard.server", async (original) => ({
  ...(await original<object>()),
  requireUser: vi.fn(),
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireUser).mockResolvedValue({ userId: "student" });
  vi.mocked(generateJson).mockResolvedValue({ correct: true, feedback: "ကောင်းပါတယ်။" });
});
const request = (body: unknown) =>
  new Request("https://example.com/api/g11-check", { method: "POST", body: JSON.stringify(body) });
describe("Grade 11 semantic checking and writing", () => {
  it("requires login before sending any work to the model", async () => {
    vi.mocked(requireUser).mockResolvedValue(new Response(null, { status: 401 }));
    expect((await handleGrade11Check(request({ question: "q", studentAnswer: "a" }))).status).toBe(
      401,
    );
    expect(generateJson).not.toHaveBeenCalled();
  });
  it("reviews the complete writing submission beyond the old 800-character limit", async () => {
    const essay = "My review. ".repeat(900) + "END OF ESSAY";
    const response = await handleGrade11Check(
      request({
        question: "Write a website review",
        instructions: "Use the given points",
        taskType: "writing",
        studentAnswer: essay,
        context: "Original textbook points",
      }),
    );
    expect(response.status).toBe(200);
    const args = vi.mocked(generateJson).mock.calls[0][0];
    expect(args.prompt).toContain("END OF ESSAY");
    expect(args.system).toContain("paragraph organisation");
    expect(args.prompt).toContain('<untrusted label="student_answer">');
  });
  it("accepts different defensible personal answers instead of requiring one model sentence", async () => {
    await handleGrade11Check(
      request({
        question: "Do you like online shopping? Why?",
        studentAnswer: "No, I prefer to see products in person.",
      }),
    );
    expect(vi.mocked(generateJson).mock.calls[0][0].system).toContain(
      "accept different defensible answers",
    );
  });
  it("does not make an AI request for missing answers", async () => {
    expect(
      (await handleGrade11Check(request({ question: "Write a review", studentAnswer: "" }))).status,
    ).toBe(400);
    expect(generateJson).not.toHaveBeenCalled();
  });
});
