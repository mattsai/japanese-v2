import { describe, expect, it } from "vitest";
import { n5KanjiMemorandum } from "./kanji-memorandum/kanji";
import { n5VerbCatalog } from "./verb-practice/catalog";
import { n5AdjectiveCatalog } from "./adjective-practice/catalog";

// Cross-catalog validation: guards N5 completeness and catches data bugs
// (duplicate ids, missing readings, bad groups/kinds) before they ship.

function duplicates<T>(values: T[]): T[] {
  const seen = new Set<T>();
  const dupes = new Set<T>();
  for (const value of values) {
    if (seen.has(value)) {
      dupes.add(value);
    }
    seen.add(value);
  }
  return [...dupes];
}

describe("kanji catalog integrity", () => {
  it("covers the N5 set with unique ids and characters", () => {
    expect(n5KanjiMemorandum.length).toBeGreaterThanOrEqual(80);
    expect(duplicates(n5KanjiMemorandum.map((item) => item.id))).toEqual([]);
    expect(duplicates(n5KanjiMemorandum.map((item) => item.character))).toEqual([]);
  });

  it("includes the core N5 kanji that were missing before", () => {
    const characters = new Set(n5KanjiMemorandum.map((item) => item.character));
    for (const kanji of ["毎", "天", "曜", "気", "何"]) {
      expect(characters.has(kanji)).toBe(true);
    }
  });

  it("gives every kanji a meaning, a reading and a stroke count", () => {
    for (const item of n5KanjiMemorandum) {
      expect(item.meaningEs.trim().length).toBeGreaterThan(0);
      expect(item.onyomi.length + item.kunyomi.length).toBeGreaterThan(0);
      expect(item.strokes ?? 0).toBeGreaterThan(0);
      expect(item.examples.length).toBeGreaterThan(0);
    }
  });
});

describe("verb catalog integrity", () => {
  it("covers the N5 verbs with unique ids", () => {
    expect(n5VerbCatalog.length).toBeGreaterThanOrEqual(90);
    expect(duplicates(n5VerbCatalog.map((verb) => verb.id))).toEqual([]);
  });

  it("uses only valid verb groups and never empty readings", () => {
    const groups = new Set(["ichidan", "godan", "irregular"]);
    for (const verb of n5VerbCatalog) {
      expect(groups.has(verb.group)).toBe(true);
      expect(verb.kanji.trim().length).toBeGreaterThan(0);
      expect(verb.kana.trim().length).toBeGreaterThan(0);
      expect(verb.romaji.trim().length).toBeGreaterThan(0);
    }
  });

  it("classifies the tricky -iru/-eru godan verbs correctly", () => {
    const byId = new Map(n5VerbCatalog.map((verb) => [verb.id, verb]));
    const godanExceptions = ["verb-kaeru", "verb-hairu", "verb-hashiru", "verb-shiru", "verb-iru-need", "verb-kiru-cut"];
    for (const id of godanExceptions) {
      expect(byId.get(id)?.group).toBe("godan");
    }
    // look-alikes that really are ichidan
    expect(byId.get("verb-kiru-wear")?.group).toBe("ichidan");
    expect(byId.get("verb-kaeru-change")?.group).toBe("ichidan");
  });
});

describe("adjective catalog integrity", () => {
  it("covers the N5 adjectives with unique ids and words", () => {
    expect(n5AdjectiveCatalog.length).toBeGreaterThanOrEqual(65);
    expect(duplicates(n5AdjectiveCatalog.map((adjective) => adjective.id))).toEqual([]);
    expect(duplicates(n5AdjectiveCatalog.map((adjective) => adjective.japanese))).toEqual([]);
  });

  it("uses only i/na kinds and fills reading, romaji and meaning", () => {
    for (const adjective of n5AdjectiveCatalog) {
      expect(adjective.kind === "i" || adjective.kind === "na").toBe(true);
      expect(adjective.reading.trim().length).toBeGreaterThan(0);
      expect(adjective.romaji.trim().length).toBeGreaterThan(0);
      expect(adjective.meaningEs.trim().length).toBeGreaterThan(0);
    }
  });
});
