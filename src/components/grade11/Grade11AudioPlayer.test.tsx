import { StrictMode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Grade11TextLesson } from "./Grade11TextLesson";
import { Grade11AudioPlayer } from "./Grade11AudioPlayer";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const player = () => screen.getByLabelText(/listening track/) as HTMLAudioElement;

describe("Grade 11 original audio", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "attaches the user-supplied Listening track for Unit %i",
    (unit) => {
      render(<Grade11TextLesson unit={unit} kind="listening" />);
      expect(player()).toHaveAttribute("src", `/grade11/audio/unit${unit}.mp3`);
      expect(screen.queryByText(/အသံဖိုင် မရရှိသေးပါ/)).toBeNull();
    },
  );

  it("keeps a playable source after Strict Mode cleanup and releases playback when leaving", () => {
    const view = render(
      <StrictMode>
        <Grade11AudioPlayer unit={1} />
      </StrictMode>,
    );
    const audio = player();
    expect(audio.getAttribute("src")).toBe("/grade11/audio/unit1.mp3");
    vi.mocked(audio.pause).mockClear();
    view.unmount();
    expect(audio.pause).toHaveBeenCalledOnce();
    expect(audio.hasAttribute("src")).toBe(false);
  });

  it("enables seeking when metadata loaded before hydration", () => {
    vi.spyOn(HTMLMediaElement.prototype, "readyState", "get").mockReturnValue(1);
    render(<Grade11AudioPlayer unit={2} />);
    expect(screen.getByRole("button", { name: "+10s" })).toBeEnabled();
  });

  it("clamps seek controls and applies playback speed to the actual audio", () => {
    render(<Grade11AudioPlayer unit={6} />);
    const audio = player();
    expect(screen.getByRole("button", { name: "+10s" })).toBeDisabled();
    Object.defineProperty(audio, "duration", { value: 25 });
    fireEvent.loadedMetadata(audio);
    audio.currentTime = 20;
    fireEvent.click(screen.getByRole("button", { name: "+10s" }));
    expect(audio.currentTime).toBe(25);
    audio.currentTime = 3;
    fireEvent.click(screen.getByRole("button", { name: "−10s" }));
    expect(audio.currentTime).toBe(0);
    fireEvent.change(screen.getByLabelText("Audio playback speed"), { target: { value: "0.75" } });
    expect(audio.playbackRate).toBe(0.75);
    audio.playbackRate = 2;
    fireEvent.rateChange(audio);
    expect(screen.getByLabelText("Audio playback speed")).toHaveValue("2");
  });

  it("offers a download and retry on failure, then clears the failure after metadata loads", () => {
    render(<Grade11AudioPlayer unit={12} />);
    const audio = player();
    fireEvent.error(audio);
    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getByRole("link", { name: "MP3 ရယူမည်" })).toHaveAttribute(
      "href",
      "/grade11/audio/unit12.mp3",
    );
    fireEvent.click(screen.getByRole("button", { name: "ပြန်ဖွင့်မည်" }));
    expect(audio.load).toHaveBeenCalled();
    fireEvent.loadedMetadata(audio);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("button", { name: "+10s" })).toBeEnabled();
  });

  it("releases the old track and resets speed and readiness when switching units", () => {
    const view = render(<Grade11AudioPlayer unit={3} />);
    const old = player();
    fireEvent.loadedMetadata(old);
    fireEvent.change(screen.getByLabelText("Audio playback speed"), { target: { value: "1.5" } });
    view.rerender(<Grade11AudioPlayer unit={4} reference />);
    expect(old.pause).toHaveBeenCalled();
    expect(player()).toHaveAttribute("src", "/grade11/audio/unit4.mp3");
    expect(screen.getByLabelText("Audio playback speed")).toHaveValue("1");
    expect(screen.getByRole("button", { name: "+10s" })).toBeDisabled();
    expect(screen.getByText(/Speaking စာကြောင်း/)).toBeVisible();
  });
});
