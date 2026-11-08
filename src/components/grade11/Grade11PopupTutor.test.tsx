import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { Grade11UnitPage } from "./Grade11UnitPage";
import { Grade11PopupTutor } from "./Grade11PopupTutor";
import { useAuth } from "@/components/AuthGate";
const mocks = vi.hoisted(() => ({ popup: vi.fn() }));
vi.mock("@/components/SayaOwlHome", () => ({
  SayaOwlHome: (props: unknown) => {
    mocks.popup(props);
    return <button>Open Saya Owl tutor</button>;
  },
}));
vi.mock("@/components/AuthGate", () => ({ useAuth: vi.fn() }));
vi.mock("@/components/SiteHeader", () => ({ SiteHeader: () => null }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("./Grade11TextLesson", () => ({
  Grade11TextLesson: ({ unit, kind }: { unit: number; kind: string }) => (
    <p>
      Textbook {unit} {kind}
    </p>
  ),
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuth).mockReturnValue({ session: { access_token: "test" }, ready: true } as never);
});
afterEach(cleanup);
describe("Grade 11 uses the shared Grade 10 voice popup instead of the inline panel", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "provides one correctly grounded popup in all Unit %i sections",
    (unit) => {
      for (const kind of [
        "reading",
        "vocabulary",
        "grammar",
        "listening",
        "speaking",
        "writing",
      ] as const) {
        const view = render(
          <Grade11UnitPage
            unitNumber={unit}
            skill={kind}
            title={`Unit ${unit}`}
            mmTitle="သင်ခန်းစာ"
          />,
        );
        expect(screen.getAllByRole("button", { name: "Open Saya Owl tutor" })).toHaveLength(1);
        expect(screen.queryByRole("region", { name: "Grade 11 AI learning tools" })).toBeNull();
        expect(screen.queryByLabelText("ဒီသင်ခန်းစာအကြောင်း မေးပါ")).toBeNull();
        const props = mocks.popup.mock.calls.at(-1)![0];
        expect(props.grade).toBe(11);
        expect(props.lessonContext).toContain(`Grade 11 English · Unit ${unit} · ${kind}`);
        expect(document.querySelector("[data-saya-home-section]")).toHaveTextContent(
          `Textbook ${unit} ${kind}`,
        );
        view.unmount();
      }
    },
  );
  it("preserves Grade 11 context for revision/poem popups", () => {
    render(<Grade11PopupTutor lessonContext="Grade 11 English · Review 1" />);
    expect(mocks.popup).toHaveBeenCalledWith({
      grade: 11,
      lessonContext: "Grade 11 English · Review 1",
    });
  });
  it("waits for session restoration without mounting the popup or requesting another login", () => {
    vi.mocked(useAuth).mockReturnValue({ ready: false, session: null } as never);
    render(<Grade11PopupTutor unit={5} kind="reading" />);
    expect(mocks.popup).not.toHaveBeenCalled();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
