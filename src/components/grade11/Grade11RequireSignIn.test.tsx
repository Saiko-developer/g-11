import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { Grade11RequireSignIn } from "./Grade11RequireSignIn";
import { useAuth } from "@/components/AuthGate";
import { signInWithGoogle } from "@/components/RequireSignIn";
vi.mock("@/components/AuthGate", () => ({ useAuth: vi.fn() }));
vi.mock("@/components/RequireSignIn", () => ({
  signInWithGoogle: vi.fn().mockResolvedValue({ redirected: false }),
}));
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
afterEach(cleanup);
describe("Grade 11 sign-in does not loop", () => {
  it("waits for session restoration without offering another login", () => {
    vi.mocked(useAuth).mockReturnValue({ ready: false, session: null } as never);
    render(<Grade11RequireSignIn>AI tools</Grade11RequireSignIn>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(signInWithGoogle).not.toHaveBeenCalled();
  });
  it("uses an already signed-in session without requesting Google again", () => {
    vi.mocked(useAuth).mockReturnValue({ ready: true, session: { access_token: "test" } } as never);
    render(<Grade11RequireSignIn>AI tools</Grade11RequireSignIn>);
    expect(screen.getByText("AI tools")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Sign in with Google" })).toBeNull();
    expect(signInWithGoogle).not.toHaveBeenCalled();
  });
  it("preserves the current section for the existing validated post-login redirect", async () => {
    window.history.replaceState({}, "", "/grade-11/5/writing");
    vi.mocked(useAuth).mockReturnValue({ ready: true, session: null } as never);
    render(<Grade11RequireSignIn>AI tools</Grade11RequireSignIn>);
    fireEvent.click(screen.getByRole("button", { name: "Sign in with Google" }));
    expect(localStorage.getItem("postLoginRedirect")).toBe("/grade-11/5/writing");
    expect(signInWithGoogle).toHaveBeenCalledOnce();
    window.history.replaceState({}, "", "/");
  });
});
