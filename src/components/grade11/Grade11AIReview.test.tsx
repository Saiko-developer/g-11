import { cleanup, fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { Grade11AIReview } from "./Grade11AIReview";
vi.mock("@/components/AuthGate", () => ({
  useAuth: () => ({ session: { access_token: "test" } }),
}));
vi.mock("@/components/RequireSignIn", () => ({ signInWithGoogle: vi.fn() }));
beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const props = {
  question: "Write your own answer",
  instructions: "Give reasons",
  context: "Textbook passage",
  answer: "My first answer.",
};
describe("Grade 11 AI review lifecycle", () => {
  it("does not auto-charge on render and submits one complete review on click", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ feedback: "အကြောင်းပြချက် ထည့်ပြောထားတာ ကောင်းပါတယ်။" }),
    );
    render(<Grade11AIReview {...props} />);
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Check Answer with AI" }));
    await screen.findByRole("status");
    expect(fetch).toHaveBeenCalledOnce();
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string).studentAnswer).toBe(
      props.answer,
    );
  });
  it("aborts stale checks when an answer changes and allows another review", async () => {
    let finish!: (r: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const view = render(<Grade11AIReview {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Check Answer with AI" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const signal = vi.mocked(fetch).mock.calls[0][1]!.signal!;
    view.rerender(<Grade11AIReview {...props} answer="A revised answer." />);
    expect(signal.aborted).toBe(true);
    expect(screen.getByRole("button", { name: "Check Answer with AI" })).toBeEnabled();
    await act(async () => {
      finish(Response.json({ feedback: "Old feedback" }));
    });
    expect(screen.queryByText("Old feedback")).toBeNull();
  });
  it("handles credit denial without losing the student answer", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 402 }));
    render(<Grade11AIReview {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Check Answer with AI" }));
    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: "Check Answer with AI" })).toBeEnabled();
  });
});
