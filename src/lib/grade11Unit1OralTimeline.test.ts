import { expect, it } from "vitest";
import { createHash } from "node:crypto";
import { UNIT1_GRAMMAR } from "./grade11Unit1Grammar";
import { UNIT1_ORAL_PARAGRAPHS, UNIT1_ORAL_SCRIPTS } from "./grade11Unit1Oral";
import { unit1OralTimeline } from "./grade11Unit1OralTimeline";
const originalHashes = {
  "both-and": "56a1ce767f7489a67f3d465634d3048fe2e5ebfb25eef2ec8c0cc7a174871d9f",
  before: "2ab5bc2fb15f1bc4252b25ade09e51a2986214b321fde6828fdda37c7323195c",
  after: "b9f7cf894c08ef331182dddbacfbebb5cb2d98352b56ccaa26ee71257455759b",
};
it.each(["both-and", "before", "after"] as const)(
  "preserves the accepted example narration after the new %s introduction",
  (topic) => {
    expect(createHash("sha256").update(UNIT1_ORAL_SCRIPTS[topic]).digest("hex")).toBe(
      originalHashes[topic],
    );
    const segments = unit1OralTimeline(topic);
    expect(segments[0].titleMy).toContain("သင်ခန်းစာမိတ်ဆက်");
    expect(segments[1].titleMy).toContain("နမူနာမကြည့်မီ");
    expect(
      segments
        .slice(2)
        .map((segment) => segment.scriptMy)
        .join("\n\n"),
    ).toBe(UNIT1_ORAL_PARAGRAPHS[topic].slice(topic === "both-and" ? 4 : 3).join("\n\n"));
    expect(
      UNIT1_GRAMMAR.sections.find((section) => section.id.endsWith(topic))!.oral.scriptMy,
    ).toBe(segments.map((segment) => segment.scriptMy).join("\n\n"));
    let introducedText = "";
    for (const segment of segments) {
      introducedText += segment.scriptMy;
      expect(segment.scriptMy.trim()).not.toBe("");
      if (segment.sentenceEn) {
        // A walkthrough may retain a sentence introduced earlier, but must not show a future one.
        expect(introducedText).toContain(segment.sentenceEn.split(". ")[0]);
      }
    }
  },
);
