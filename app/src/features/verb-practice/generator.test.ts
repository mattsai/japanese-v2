import { describe, expect, it } from "vitest";
import {
  createVerbPracticeQuestion,
  createVerbPracticeSet,
  getVerbById,
  getVerbCatalog,
  getVerbForm,
} from "./generator";

describe("verb-practice generator", () => {
  it("exposes the required N5 starter catalog", () => {
    const romaji = getVerbCatalog().map((verb) => verb.romaji);

    expect(romaji).toEqual(
      expect.arrayContaining([
        "taberu",
        "nomu",
        "miru",
        "iku",
        "kuru",
        "suru",
        "kau",
        "kaku",
        "yomu",
        "kiku",
        "hanasu",
        "matsu",
        "kaeru",
        "neru",
        "okiru",
        "benkyou suru",
      ]),
    );
  });

  it("returns exact conjugation forms for formal and informal prompts", () => {
    const nomu = getVerbById("verb-nomu");
    expect(nomu).toBeDefined();
    expect(getVerbForm(nomu!, "negative", "informal")).toBe("飲まない");
    expect(getVerbForm(nomu!, "negative", "formal")).toBe("飲みません");
  });

  it("returns N5 functional verb patterns", () => {
    const taberu = getVerbById("verb-taberu");
    const nomu = getVerbById("verb-nomu");
    expect(taberu).toBeDefined();
    expect(nomu).toBeDefined();

    expect(getVerbForm(taberu!, "te-kudasai")).toBe("食べてください");
    expect(getVerbForm(taberu!, "te-mo-ii")).toBe("食べてもいいです");
    expect(getVerbForm(taberu!, "te-wa-ikemasen")).toBe("食べてはいけません");
    expect(getVerbForm(taberu!, "tai")).toBe("食べたいです");
    expect(getVerbForm(taberu!, "mashou")).toBe("食べましょう");
    expect(getVerbForm(taberu!, "masen-ka")).toBe("食べませんか");
    expect(getVerbForm(taberu!, "nagara")).toBe("食べながら");
    expect(getVerbForm(nomu!, "te-mo-ii")).toBe("飲んでもいいです");
  });

  it("creates a Spanish meaning question with one correct answer and hint metadata", () => {
    const question = createVerbPracticeQuestion({
      verbId: "verb-taberu",
      kind: "meaning",
      seed: 10,
    });

    expect(question.promptEs).toContain("Que significa");
    expect(question.correctAnswer).toBe("comer");
    expect(question.hint).toContain("significa comer");
    expect(question.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    expect(question.choices.map((choice) => choice.text)).toContain("comer");
  });

  it("creates a deterministic conjugation question for te-form without politeness", () => {
    const question = createVerbPracticeQuestion({
      verbId: "verb-iku",
      kind: "conjugation",
      target: "te-form",
      politeness: "formal",
      seed: 3,
    });

    expect(question.promptEs).toContain("forma te");
    expect(question.politeness).toBeUndefined();
    expect(question.correctAnswer).toBe("行って");
    expect(question.hint).toContain("excepcion");
    expect(question.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
  });

  it("builds repeatable practice sets from a seed", () => {
    const first = createVerbPracticeSet(3, { seed: 5 });
    const second = createVerbPracticeSet(3, { seed: 5 });

    expect(first).toEqual(second);
    expect(first).toHaveLength(3);
  });
});
