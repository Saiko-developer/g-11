import { describe, it, expect } from "vitest";
import keys from "@/data/grade11/listeningExerciseKeys.json";
import captions from "@/data/grade11/listeningCaptions.json";
import tracks from "@/data/grade11/listeningAudio.json";
describe("source-audio Grade 11 exercise keys", () => {
  it("binds every listening key to the supplied audio and existing evidence cues", () => {
    for (const [id, key] of Object.entries(keys)) {
      const unit = Number(id.split("D")[0]);
      const track = tracks.find((t) => t.unit === unit)!;
      expect(key.audioSrc).toBe(track.src);
      expect(key.audioSha256).toBe(track.sha256);
      expect(key.origin).toBe("audio-derived");
      const cues = (captions as Record<string, { cues: { id: string }[] }>)[String(unit)].cues;
      expect(key.evidenceCueIds.length).toBeGreaterThan(0);
      for (const evidence of key.evidenceCueIds)
        expect(cues.some((c) => c.id === evidence)).toBe(true);
    }
  });
  it("matches the inspected Facebook, mobile banking and shopping pictures to dialogues 3, 1 and 2", () => {
    expect([keys["2D-1"].answer, keys["2D-2"].answer, keys["2D-3"].answer]).toEqual([
      "3",
      "1",
      "2",
    ]);
  });
});
