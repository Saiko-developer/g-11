import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Grade11GrammarVideos } from "./Grade11GrammarVideos";

vi.mock("@/data/grade11/grammarVideos.json", () => ({
  default: {
    "1": [{ title: "Both ... and", url: "" }],
    "2": [
      { title: "First grammar video", url: "https://youtu.be/abcdefghijk" },
      { title: "Second grammar video", url: "https://www.youtube.com/watch?v=ABCDEFGHIJK" },
    ],
    "3": [{ title: "Unconfigured video", url: "https://example.com/embed/abcdefghijk" }],
  },
}));

afterEach(cleanup);

describe("Grade 11 grammar video links", () => {
  it("shows a placeholder without loading a Grade 10 video when a link is empty", () => {
    const { container } = render(<Grade11GrammarVideos unit={1} />);
    expect(screen.getByText("ဗီဒီယို မထည့်ရသေးပါ။")).toBeVisible();
    expect(container.querySelector("iframe")).toBeNull();
  });
  it("embeds teacher YouTube links and switches between multiple lessons", () => {
    const { container } = render(<Grade11GrammarVideos unit={2} />);
    expect(container.querySelector("iframe")?.src).toBe(
      "https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0",
    );
    fireEvent.click(screen.getByRole("button", { name: "Second grammar video" }));
    expect(container.querySelector("iframe")?.src).toBe(
      "https://www.youtube-nocookie.com/embed/ABCDEFGHIJK?rel=0",
    );
  });
  it("does not embed unrelated websites", () => {
    const { container } = render(<Grade11GrammarVideos unit={3} />);
    expect(container.querySelector("iframe")).toBeNull();
  });
});
