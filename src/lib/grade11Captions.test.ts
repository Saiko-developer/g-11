import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GRADE11_TRANSCRIPTS, getGrade11Captions, grade11CaptionAt } from "./grade11Captions";
import tracks from "@/data/grade11/listeningAudio.json";

describe("Grade 11 MP3-aligned captions", () => {
  it.each(tracks)(
    "has bounded word and sentence timestamps matching the original Unit $unit audio",
    (track) => {
      const transcript = GRADE11_TRANSCRIPTS[track.unit];
      expect(transcript.audioSha256).toBe(track.sha256);
      expect(transcript.cues.length).toBeGreaterThan(5);
      let lastEnd = 0;
      const vtt = readFileSync(`public/grade11/captions/unit${track.unit}.vtt`, "utf8");
      expect(vtt.startsWith("WEBVTT")).toBe(true);
      for (const cue of transcript.cues) {
        expect(cue.start).toBeGreaterThanOrEqual(lastEnd - 0.05);
        expect(cue.end).toBeGreaterThan(cue.start);
        expect(cue.end).toBeLessThanOrEqual(track.durationSeconds);
        expect(
          cue.words
            .map((word) => word.word)
            .join("")
            .trim(),
        ).toBe(cue.en);
        expect(vtt).toContain(cue.en);
        for (const word of cue.words) {
          expect(word.start).toBeGreaterThanOrEqual(cue.start);
          expect(word.end).toBeGreaterThanOrEqual(word.start);
          expect(word.end).toBeLessThanOrEqual(cue.end);
        }
        lastEnd = cue.end;
      }
    },
  );
  it("uses the media time with no artificial offset and clears captions during silence", () => {
    const cues = getGrade11Captions(1);
    const word = cues[1].words.find((item) => item.end > item.start)!;
    const time = (word.start + word.end) / 2;
    expect(grade11CaptionAt(cues, time)).toEqual({
      cueIndex: 1,
      wordIndex: cues[1].words.indexOf(word),
    });
    expect(grade11CaptionAt(cues, 0).cueIndex).toBe(-1);
    expect(grade11CaptionAt(cues, 115).cueIndex).toBe(-1);
    expect(grade11CaptionAt(cues, cues[1].end).cueIndex).not.toBe(1);
  });
});
