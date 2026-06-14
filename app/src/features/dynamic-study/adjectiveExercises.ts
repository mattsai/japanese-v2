import {
  n5AdjectiveCatalog,
  type AdjectiveCatalogEntry,
} from "@/features/adjective-practice";
import type { StudyChoice, StudyExercise } from "./types";

// Reconocimiento puro: muestra el adjetivo y eliges su significado.
// SIN conjugaciones (eso es solo para verbos).
export function createAdjectiveStudyExercises(): StudyExercise[] {
  return n5AdjectiveCatalog.map((adjective) => toRecognitionExercise(adjective));
}

function toRecognitionExercise(adjective: AdjectiveCatalogEntry): StudyExercise {
  const kindLabel = adjective.kind === "i" ? "i-adjetivo" : "na-adjetivo";
  const choices = buildMeaningChoices(adjective);

  return {
    id: `adj-recognition-${adjective.id}`,
    section: "adjectives",
    title: "Adjetivo N5",
    subtitle: kindLabel,
    details: [{ label: "Tipo", value: kindLabel }],
    promptEs: "¿Qué significa este adjetivo?",
    japanese: adjective.japanese,
    reading: adjective.reading,
    romaji: adjective.romaji,
    choices,
    correctChoiceId: adjective.id,
    hint: `lectura: ${adjective.reading} (${adjective.romaji})`,
    info: `${kindLabel}. Hay ${n5AdjectiveCatalog.length} adjetivos para reconocer.`,
    explanation: `${adjective.japanese} (${adjective.reading}) significa ${adjective.meaningEs}.`,
  };
}

function buildMeaningChoices(adjective: AdjectiveCatalogEntry): StudyChoice[] {
  const distractors: StudyChoice[] = [];
  const usedMeanings = new Set([adjective.meaningEs]);

  for (const candidate of shuffle(n5AdjectiveCatalog)) {
    if (usedMeanings.has(candidate.meaningEs)) {
      continue;
    }
    usedMeanings.add(candidate.meaningEs);
    distractors.push({ id: candidate.id, label: candidate.meaningEs });
    if (distractors.length === 3) {
      break;
    }
  }

  return shuffle([
    { id: adjective.id, label: adjective.meaningEs },
    ...distractors,
  ]);
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
