import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAnswerMatch } from "@/lib/answerMatch";
import { splitUnit1 } from "@/lib/grade11Unit1";
import { TRAVEL_LESSONS, TRAVEL_PAGES, travelScanUrl } from "@/lib/grade11Travel";
import answers5 from "@/data/grade11/textbook/unit5-answer.json";
import answers6 from "@/data/grade11/textbook/unit6-answer.json";
import { G11_SYLLABUS } from "@/data/grade11/syllabus";

const find = (n: 5 | 6, code: string) => TRAVEL_LESSONS[n].sections.find((s) => s.code === code)!;

describe("Grade 11 Units 5 and 6 source coverage", () => {
  it("retains all original source exercises, excluding printed completed examples", () => {
    expect(
      TRAVEL_LESSONS[5].sections.map((s) => s.blocks.filter((b) => b.t === "q").length),
    ).toEqual([51, 16, 29, 11, 2]);
    expect(
      TRAVEL_LESSONS[6].sections.map((s) => s.blocks.filter((b) => b.t === "q").length),
    ).toEqual([25, 20, 20, 10, 2]);
    expect(
      splitUnit1(find(5, "5C")).exercises.map((ex) => ex.blocks.filter((b) => b.t === "q").length),
    ).toEqual([9, 15, 5]);
    expect(
      splitUnit1(find(6, "6C")).exercises.map((ex) => ex.blocks.filter((b) => b.t === "q").length),
    ).toEqual([12, 8]);
    expect(
      find(6, "6A").blocks.some((b) => b.t === "q" && b.x.startsWith("11. Choose a place")),
    ).toBe(true);
  });
  it("keeps the ASEAN map, all five Dawei paragraphs and the exact writing task", () => {
    expect(existsSync(`public${travelScanUrl(5, 51)}`)).toBe(true);
    expect(find(5, "5A").blocks.some((b) => b.scanPage === 51)).toBe(true);
    expect(
      find(5, "5E")
        .blocks.filter((b) => b.t === "para")
        .map((b) => b.x[0]),
    ).toEqual(["A", "B", "C", "D", "E"]);
    expect(find(6, "6E").blocks.some((b) => b.x.includes("200-250 words"))).toBe(true);
    expect(
      find(6, "6E").blocks.some(
        (b) => b.x === "Advantages — generates income\nDisadvantages — causes pollution",
      ),
    ).toBe(true);
    expect(find(6, "6E").blocks.filter((b) => b.t === "para")).toHaveLength(0);
  });
  it("keeps original tourism facts and source-based answer references", () => {
    expect(
      find(5, "5A").blocks.some((b) =>
        b.x.startsWith("In western Sumatra, one can find Komodo National Park"),
      ),
    ).toBe(true);
    expect(find(6, "6A").blocks.some((b) => b.x.includes("UNESCO Heritage Site in 2019"))).toBe(
      true,
    );
    expect(Object.keys(TRAVEL_LESSONS[5].keys)).toHaveLength(95);
    const nounTable = splitUnit1(find(5, "5B")).exercises[0].blocks.filter((b) => b.t === "q");
    expect(isAnswerMatch("lovers", TRAVEL_LESSONS[5].keys[nounTable[0].id].answer)).toBe(true);
    expect(isAnswerMatch("gallery, museum", TRAVEL_LESSONS[5].keys[nounTable[1].id].answer)).toBe(
      true,
    );
    expect(Object.keys(TRAVEL_LESSONS[6].keys)).toHaveLength(64);
    expect(answers5.official_answer_key).toBe(false);
    expect(answers6.official_answer_key).toBe(false);
  });
  it("never invents listening answers or personal compositions, and translates every source block", () => {
    for (const n of [5, 6] as const) {
      const { sections, keys } = TRAVEL_LESSONS[n];
      const blocks = sections.flatMap((s) => s.blocks);
      expect(new Set(blocks.map((b) => b.id)).size).toBe(blocks.length);
      expect(blocks.filter((b) => b.response === "audio")).toHaveLength(n === 5 ? 11 : 10);
      for (const block of blocks) {
        expect(block.my || block.t === "scan").toBeTruthy();
        expect("ma" in block || "a" in block).toBe(false);
        if (block.response) expect(keys[block.id]).toBeUndefined();
      }
      for (const key of Object.values(keys)) expect(key.answerMy).toBeTruthy();
      for (const section of (n === 5 ? answers5 : answers6).sections) {
        for (const item of section.items)
          if (item.status !== "source-derived") expect(item.answer).toBeNull();
      }
    }
  });
  it("links both travel units to complete PDF page ranges without altering Grade 10", () => {
    for (const n of [5, 6] as const) {
      expect(TRAVEL_PAGES[`unit-${n}`].ready).toBe(true);
      const unit = G11_SYLLABUS.find((node) => node.type === "unit" && node.number === n);
      expect(unit?.type).toBe("unit");
      if (unit?.type === "unit")
        expect(unit.skills.every((skill) => skill.pages.length)).toBe(true);
    }
    expect(travelScanUrl(6, 51)).toBeNull();
  });
});
