import { describe, expect, it } from "vitest";
import { getAdjectiveById, n5AdjectiveCatalog } from "./catalog";
import {
  conjugateNounModifier,
  conjugatePredicate,
  generateAdjectiveExercise,
} from "./generator";

describe("adjective practice generator", () => {
  it("ships the requested N5 starter catalog", () => {
    const ids = n5AdjectiveCatalog.map((adjective) => adjective.id);

    expect(ids.length).toBeGreaterThanOrEqual(35);
    expect(ids).toEqual(
      expect.arrayContaining([
        "ookii",
        "chiisai",
        "atarashii",
        "furui",
        "ii_yoi",
        "warui",
        "atsui",
        "samui",
        "takai",
        "yasui",
        "omoshiroi",
        "muzukashii",
        "kantan",
        "shizuka",
        "nigiyaka",
        "kirei",
        "genki",
        "benri",
        "oishii",
        "suki",
        "kirai",
        "jouzu",
      ]),
    );
  });

  it("generates formal negative exercises for irregular ii/yoi", () => {
    const exercise = generateAdjectiveExercise({
      adjectiveId: "ii_yoi",
      tense: "present",
      polarity: "negative",
      politeness: "formal",
      use: "predicate",
    });

    expect(exercise.correctAnswer).toBe("よくないです");
    expect(exercise.promptEs).toContain("registro formal");
    expect(exercise.explanationEs).toContain("tallo よ");
  });

  it("adds na for present affirmative noun-modifying na-adjectives", () => {
    const exercise = generateAdjectiveExercise({
      adjectiveId: "kantan",
      tense: "present",
      polarity: "affirmative",
      politeness: "informal",
      use: "noun-modifying",
      noun: {
        japanese: "テスト",
        meaningEs: "examen",
      },
    });

    expect(exercise.correctAnswer).toBe("簡単なテスト");
    expect(exercise.hints).toContainEqual({
      label: "uso",
      value: "antes de sustantivo, presente afirmativo usa な",
    });
  });

  it("uses plain forms before nouns instead of formal desu endings", () => {
    const adjective = getAdjectiveById("samui");

    expect(adjective).toBeDefined();
    expect(
      conjugateNounModifier(adjective!, {
        tense: "past",
        polarity: "negative",
      }),
    ).toBe("寒くなかった");
  });

  it("conjugates na-adjective formal past predicate forms", () => {
    const adjective = getAdjectiveById("shizuka");

    expect(adjective).toBeDefined();
    expect(
      conjugatePredicate(adjective!, {
        tense: "past",
        polarity: "affirmative",
        politeness: "formal",
      }),
    ).toBe("静かでした");
  });
});
