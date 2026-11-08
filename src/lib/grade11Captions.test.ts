import translations from "@/data/grade11/listeningTranslations.my.json";
import { createHash } from "node:crypto";
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
      const myVtt = readFileSync(`public/grade11/captions/unit${track.unit}.my.vtt`, "utf8");
      expect(myVtt.startsWith("WEBVTT")).toBe(true);
      expect(myVtt.match(/^\d{2}:.*-->.*$/gm)).toEqual(vtt.match(/^\d{2}:.*-->.*$/gm));
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
        expect(cue.my).toMatch(/[\u1000-\u109f]/);
        expect(cue.my).not.toBe(cue.en);
        expect(myVtt).toContain(cue.my);
        for (const word of cue.words) {
          expect(word.start).toBeGreaterThanOrEqual(cue.start);
          expect(word.end).toBeGreaterThanOrEqual(word.start);
          expect(word.end).toBeLessThanOrEqual(cue.end);
        }
        lastEnd = cue.end;
      }
    },
  );
  it("covers exactly the current English cues and detects stale translations after source edits", () => {
    const ids = Object.values(GRADE11_TRANSCRIPTS)
      .flatMap((transcript) => transcript.cues.map((cue) => cue.id))
      .sort();
    expect(Object.keys(translations.translations).sort()).toEqual(ids);
    expect(translations.sourceSha256).toBe(
      createHash("sha256")
        .update(readFileSync("src/data/grade11/listeningCaptions.json"))
        .digest("hex"),
    );
  });

  it("uses the media time with no artificial offset and retains the final cue", () => {
    const cues = getGrade11Captions(1);
    const word = cues[1].words.find((item) => item.end > item.start)!;
    const time = (word.start + word.end) / 2;
    expect(grade11CaptionAt(cues, time)).toEqual({
      cueIndex: 1,
      wordIndex: cues[1].words.indexOf(word),
    });
    expect(grade11CaptionAt(cues, 0).cueIndex).toBe(-1);
    expect(grade11CaptionAt(cues, 115)).toEqual({ cueIndex: cues.length - 1, wordIndex: -1 });
    expect(grade11CaptionAt(cues, cues[1].end)).toEqual({ cueIndex: 1, wordIndex: -1 });
  });
  it.each(tracks)(
    "holds Unit $unit captions through gaps, switches at the next start, and resets on rewind",
    (track) => {
      const cues = getGrade11Captions(track.unit);
      const index = cues.findIndex((cue, i) => i + 1 < cues.length && cue.end < cues[i + 1].start);
      expect(index).toBeGreaterThanOrEqual(0);
      const gap = (cues[index].end + cues[index + 1].start) / 2;
      expect(grade11CaptionAt(cues, gap)).toEqual({ cueIndex: index, wordIndex: -1 });
      expect(grade11CaptionAt(cues, cues[index + 1].start).cueIndex).toBe(index + 1);
      expect(grade11CaptionAt(cues, track.durationSeconds)).toEqual({
        cueIndex: cues.length - 1,
        wordIndex: -1,
      });
      expect(grade11CaptionAt(cues, 0)).toEqual({ cueIndex: -1, wordIndex: -1 });
    },
  );
});
