import { describe, expect, it } from "vitest";
import { createKanjiMemorandumExercises, n5KanjiMemorandum } from "./kanji";

describe("kanji memorandum catalog", () => {
  it("keeps a broad N5 kanji starter catalog with unique ids", () => {
    const ids = new Set(n5KanjiMemorandum.map((item) => item.id));

    expect(n5KanjiMemorandum.length).toBeGreaterThanOrEqual(80);
    expect(ids.size).toBe(n5KanjiMemorandum.length);
  });

  it("generates meaning exercises with hints, info, and four choices", () => {
    const exercises = createKanjiMemorandumExercises();
    const first = exercises[0];

    expect(first.section).toBe("kanji");
    expect(first.promptEs).toContain("elige el significado correcto");
    expect(first.hint.length).toBeGreaterThan(10);
    expect(first.info).toContain("Trazos");
    expect(first.choices).toHaveLength(4);
    expect(first.choices.some((choice) => choice.id === first.correctChoiceId)).toBe(true);
  });
});
