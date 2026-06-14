import { describe, expect, it } from "vitest";
import { createVerbStudyExercises, verbExamTargets } from "./verbExercises";

describe("dynamic verb study exercises", () => {
  it("always includes the correct answer in visible choices", () => {
    const exercises = createVerbStudyExercises();

    for (const exercise of exercises) {
      expect(
        exercise.choices.some((choice) => choice.id === exercise.correctChoiceId),
      ).toBe(true);
    }
  });

  it("includes present/future formal taberu answer", () => {
    const exercise = createVerbStudyExercises(["verb-taberu"]).find(
      (item) => item.id === "verb-practice-verb-taberu-present-future-formal",
    );

    expect(exercise).toBeDefined();
    expect(exercise?.choices.map((choice) => choice.label)).toContain("食べます");
  });

  it("keeps N5 book forms in the main verb exam", () => {
    expect(verbExamTargets).toEqual([
      "present-future",
      "past",
      "negative",
      "past-negative",
      "te-form",
      "te-kara",
      "progressive",
      "te-kudasai",
      "te-mo-ii",
      "te-wa-ikemasen",
      "naide-kudasai",
      "nakute-mo-ii",
      "tai",
      "mashou",
      "masen-ka",
      "nagara",
    ]);

    const labels = createVerbStudyExercises(["verb-taberu"])
      .flatMap((exercise) => exercise.choices.map((choice) => choice.label));

    expect(labels).toEqual(
      expect.arrayContaining([
        "食べて",
        "食べてから",
        "食べています",
        "食べてください",
        "食べてもいいです",
        "食べてはいけません",
        "食べないでください",
        "食べなくてもいいです",
        "食べたいです",
        "食べましょう",
        "食べませんか",
        "食べながら",
      ]),
    );
  });

  it("rotates verbs before repeating the same verb in exam order", () => {
    const firstTen = createVerbStudyExercises().slice(0, 10);
    const titles = new Set(firstTen.map((exercise) => exercise.title));

    expect(titles.size).toBeGreaterThan(1);
  });

  it("rotates forms before the learner sees the same tense repeatedly", () => {
    const firstTen = createVerbStudyExercises().slice(0, 10);
    const subtitles = new Set(firstTen.map((exercise) => exercise.subtitle));

    expect(subtitles.size).toBeGreaterThan(1);
  });

  it("skips progressive drills for existence verbs", () => {
    const exercises = createVerbStudyExercises(["verb-aru", "verb-iru"]);

    expect(exercises.map((exercise) => exercise.id).join(" ")).not.toContain("progressive");
  });

  it("shows every verb exercise with tiempo and modo only", () => {
    const exercises = createVerbStudyExercises(["verb-taberu"]);
    const detailsById = new Map(exercises.map((exercise) => [exercise.id, exercise.details]));

    expect(detailsById.get("verb-practice-verb-taberu-negative-formal")).toEqual([
      { label: "Tiempo", value: "presente negativo" },
      { label: "Modo", value: "formal" },
    ]);
    expect(detailsById.get("verb-practice-verb-taberu-te-form")).toEqual([
      { label: "Tiempo", value: "forma te" },
      { label: "Modo", value: "informal" },
    ]);
    expect(detailsById.get("verb-practice-verb-taberu-te-mo-ii")).toEqual([
      { label: "Tiempo", value: "permiso" },
      { label: "Modo", value: "formal" },
    ]);
    expect(detailsById.get("verb-practice-verb-taberu-naide-kudasai")).toEqual([
      { label: "Tiempo", value: "petición negativa" },
      { label: "Modo", value: "formal" },
    ]);
    expect(detailsById.get("verb-practice-verb-taberu-nakute-mo-ii")).toEqual([
      { label: "Tiempo", value: "permiso negativo" },
      { label: "Modo", value: "formal" },
    ]);
    expect(detailsById.get("verb-practice-verb-taberu-mashou")).toEqual([
      { label: "Tiempo", value: "hagamos" },
      { label: "Modo", value: "formal" },
    ]);

    for (const exercise of exercises) {
      expect(exercise.details?.map((detail) => detail.label)).toEqual(["Tiempo", "Modo"]);
      expect(exercise.details?.map((detail) => detail.label)).not.toContain("Uso");
      expect(exercise.details?.map((detail) => detail.label)).not.toContain("Forma");
      expect(exercise.details?.map((detail) => detail.label)).not.toContain("Patrón");
      expect(exercise.details?.map((detail) => detail.label)).not.toContain("Polaridad");
    }
  });

  it("uses hint text to show the target form type without giving the verb answer", () => {
    const exercises = createVerbStudyExercises(["verb-taberu"]);
    const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));

    expect(byId.get("verb-practice-verb-taberu-past-informal")?.hint).toBe(
      "En Tiempo pasado: Forma TA.",
    );
    expect(byId.get("verb-practice-verb-taberu-te-form")?.hint).toBe(
      "En Tiempo forma te: Forma TE.",
    );
    expect(byId.get("verb-practice-verb-taberu-te-mo-ii")?.hint).toBe(
      "En Tiempo permiso: Forma TE + もいいです.",
    );
    expect(byId.get("verb-practice-verb-taberu-mashou")?.hint).toBe(
      "En Tiempo hagamos: Tallo MASU + ましょう.",
    );

    for (const exercise of exercises) {
      expect(exercise.hint).not.toContain("食べ");
    }
  });
});
