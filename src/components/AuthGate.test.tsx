import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate, useAuth } from "./AuthGate";

const mocks = vi.hoisted(() => ({
  listener: undefined as undefined | ((event: string, session: unknown) => void),
  navigate: vi.fn(), invalidate: vi.fn(), getSession: vi.fn(), getUser: vi.fn(), rpc: vi.fn(), signOut: vi.fn(),
}));
vi.mock("@tanstack/react-router", () => {
  const router = { navigate: mocks.navigate, invalidate: mocks.invalidate };
  return { useRouter: () => router };
});
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  auth: { getSession: mocks.getSession, getUser: mocks.getUser, signOut: mocks.signOut,
    onAuthStateChange: (cb: typeof mocks.listener) => { mocks.listener = cb; return { data: { subscription: { unsubscribe: vi.fn() } } }; } },
  rpc: mocks.rpc,
} }));

function Account() {
  const { session, ready, signOut } = useAuth();
  return <><p>{ready ? session ? "Authenticated" : "Signed out" : "Pending"}</p><button onClick={() => void signOut()}>Leave</button></>;
}
const session = { user: { id: "student-id" }, access_token: "test-token" };

describe("Root authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.getSession.mockResolvedValue({ data: { session: null } });
    mocks.getUser.mockResolvedValue({ data: { user: session.user }, error: null });
    mocks.rpc.mockResolvedValue({ data: { status: "active", is_admin: false } });
    mocks.signOut.mockResolvedValue({ error: null });
    mocks.navigate.mockResolvedValue(undefined);
  });
  const mount = () => {
    const client = new QueryClient();
    render(<QueryClientProvider client={client}><AuthGate><Account /></AuthGate></QueryClientProvider>);
    return client;
  };
  it("returns to admin only after a validated sign-in event", async () => {
    localStorage.setItem("postLoginRedirect", "/admin");
    mount();
    await screen.findByText("Signed out");
    act(() => mocks.listener?.("SIGNED_IN", session));
    await screen.findByText("Authenticated");
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith({ to: "/admin", replace: true }));
    expect(mocks.getUser).toHaveBeenCalled();
    expect(localStorage.getItem("postLoginRedirect")).toBeNull();
  });
  it("does not authenticate an invalid restored session", async () => {
    mocks.getSession.mockResolvedValue({ data: { session } });
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: Object.assign(new Error("Invalid session"), { status: 401 }) });
    mount();
    await screen.findByText("Signed out");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("clears private cached data and returns home on sign-out", async () => {
    mocks.getSession.mockResolvedValue({ data: { session } });
    const client = mount();
    await screen.findByText("Authenticated");
    client.setQueryData(["private"], { name: "student" });
    await act(async () => screen.getByRole("button", { name: "Leave" }).click());
    await screen.findByText("Signed out");
    expect(client.getQueryData(["private"])).toBeUndefined();
    expect(mocks.signOut).toHaveBeenCalled();
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/", replace: true });
  });
});