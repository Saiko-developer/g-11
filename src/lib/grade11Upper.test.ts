import { UPPER_STRUCTURES } from "./grade11UpperStructure";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  UPPER_UNITS,
  UPPER_KEYS,
  UPPER_PAGES,
  isUpperUnit,
  type UpperUnitNumber,
} from "./grade11Upper";
import { G11_SYLLABUS } from "@/data/grade11/syllabus";

const numbers: UpperUnitNumber[] = [7, 8, 9, 10, 11, 12];
const expected = {
  7: [18, 14, 22, 10, 5, 1],
  8: [32, 24, 25, 8, 6, 7],
  9: [22, 10, 15, 8, 4, 1],
  10: [19, 19, 20, 9, 6, 6],
  11: [28, 15, 30, 10, 6, 9],
  12: [17, 50, 50, 12, 5, 10],
};

describe("Grade 11 Units 7–12 source coverage", () => {
  it.each(numbers)("backs every Unit %i task with local original textbook sources", (number) => {
    const unit = UPPER_UNITS[number];
    const skills = Object.values(unit.skills);
    const allIds = skills.flatMap((skill) =>
      skill.groups.flatMap((g) => g.items.map((item) => item.id)),
    );
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(
      skills.map((skill) => skill.groups.reduce((count, g) => count + g.items.length, 0)),
    ).toEqual(expected[number]);
    for (const skill of skills) {
      const pages = new Set(skill.sources.map((s) => s.page));
      for (const source of skill.sources) {
        expect(existsSync(`public${source.url}`)).toBe(true);
        expect(existsSync(`public${source.originalUrl}`)).toBe(true);
        expect(source.top).toBeGreaterThanOrEqual(0);
        expect(source.bottom).toBeLessThanOrEqual(1);
        expect(source.bottom).toBeGreaterThan(source.top);
      }
      for (const group of skill.groups) {
        expect(group.instructionMy).toBeTruthy();
        for (const page of group.pages) expect(pages.has(page)).toBe(true);
        for (const item of group.items) {
          expect(item.prompt).toBeTruthy();
          if (group.audio) expect(UPPER_KEYS[number][item.id]).toBeUndefined();
        }
      }
    }
    for (const [id, key] of Object.entries(UPPER_KEYS[number])) {
      expect(allIds).toContain(id);
      expect(key.origin).toBe("source-derived");
      expect(key.sourcePages.length).toBeGreaterThan(0);
    }
    expect(UPPER_PAGES[`unit-${number}`].ready).toBe(true);
    const entry = G11_SYLLABUS.find((node) => node.type === "unit" && node.number === number);
    expect(entry?.type).toBe("unit");
    if (entry?.type === "unit")
      expect(entry.skills.every((skill) => skill.pages.length)).toBe(true);
  });

  it.each(numbers)(
    "retains every page and both sides of shared skill boundaries in Unit %i",
    (number) => {
      const intervals = new Map<number, { top: number; bottom: number }[]>();
      for (const skill of Object.values(UPPER_UNITS[number].skills))
        for (const source of skill.sources) {
          intervals.set(source.page, [...(intervals.get(source.page) ?? []), source]);
        }
      const pages = [...intervals.keys()].sort((a, b) => a - b);
      expect(pages).toEqual(
        Array.from({ length: pages.at(-1)! - pages[0] + 1 }, (_, i) => i + pages[0]),
      );
      for (const parts of intervals.values()) {
        parts.sort((a, b) => a.top - b.top);
        expect(parts[0].top).toBe(0);
        expect(parts.at(-1)!.bottom).toBe(1);
        for (let i = 1; i < parts.length; i++) expect(parts[i].top).toBe(parts[i - 1].bottom);
      }
    },
  );

  it("excludes printed worked examples from response counts and leaves open work unkeyed", () => {
    expect(UPPER_UNITS[8].skills.vocabulary.groups[0].items[0].prompt).toMatch(/^3\./);
    expect(UPPER_UNITS[10].skills.vocabulary.groups[0].items[0].prompt).toMatch(/^2\./);
    expect(UPPER_UNITS[12].skills.writing.groups[0].items[0].prompt).toMatch(/^2\./);
    for (const number of numbers) {
      for (const skill of ["speaking", "writing"] as const)
        for (const group of UPPER_UNITS[number].skills[skill].groups)
          for (const item of group.items) {
            if (group.multiline) expect(UPPER_KEYS[number][item.id]).toBeUndefined();
          }
    }
    expect(isUpperUnit(6)).toBe(false);
    expect(isUpperUnit(13)).toBe(false);
    expect(isUpperUnit(7.5)).toBe(false);
  });

  it("keeps reading-question translations entirely Burmese", () => {
    for (const number of numbers)
      for (const group of UPPER_UNITS[number].skills.reading.groups)
        for (const item of group.items) {
          if (group.structure) {
            expect(item.promptMy).toBeTruthy();
            expect(item.promptMy).not.toMatch(/[a-z]/i);
          }
        }
  });
  it("preserves the complete printed questions in curated structure cards", () => {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const unit of Object.values(UPPER_UNITS))
      for (const group of unit.skills.reading.groups) {
        if (!group.structure) continue;
        for (const item of group.items) {
          const cards = UPPER_STRUCTURES[item.id];
          expect(cards, item.id).toBeTruthy();
          expect(normalize(cards.map((card) => card.word).join(" ")), item.id).toBe(
            normalize(item.prompt.replace(/^\d+\.\s*/, "")),
          );
          expect(cards.every((card) => Boolean(card.tag))).toBe(true);
        }
      }
    expect(UPPER_STRUCTURES["12-comprehension-1"]).toContainEqual({
      word: "affect",
      tag: "Main Verb",
    });
    expect(UPPER_STRUCTURES["12-comprehension-1"]).toContainEqual({
      word: "the world?",
      tag: "Noun Object",
    });
  });
});
