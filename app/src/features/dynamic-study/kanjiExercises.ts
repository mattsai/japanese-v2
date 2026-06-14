import { createKanjiMemorandumExercises } from "@/features/kanji-memorandum/kanji";
import type { StudyExercise } from "./types";

export function createKanjiStudyExercises(): StudyExercise[] {
  return createKanjiMemorandumExercises().map((exercise) => ({
    id: exercise.id,
    section: "kanji",
    title: `Kanji: ${exercise.item.character}`,
    subtitle: "Significado",
    promptEs: exercise.promptEs,
    japanese: exercise.item.character,
    choices: exercise.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      info:
        choice.id === exercise.correctChoiceId
          ? "Esta opcion coincide con el significado del kanji."
          : "Distractor: revisa el significado.",
    })),
    correctChoiceId: exercise.correctChoiceId,
    hint: buildKanjiHintInfo(exercise),
    info: buildKanjiMetaInfo(exercise),
    explanation: exercise.explanation,
  }));
}

function buildKanjiHintInfo(exercise: ReturnType<typeof createKanjiMemorandumExercises>[number]) {
  return [exercise.hint, exercise.info].filter(Boolean).join(" | ");
}

function buildKanjiMetaInfo(exercise: ReturnType<typeof createKanjiMemorandumExercises>[number]) {
  return exercise.item.strokes ? `Trazos: ${exercise.item.strokes}` : "Observa la forma del kanji y elige su significado.";
}
