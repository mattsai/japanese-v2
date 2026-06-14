import {
  conjugateNounModifier,
  conjugatePredicate,
  generateAdjectiveExercise,
  n5AdjectiveCatalog,
  type AdjectiveCatalogEntry,
  type AdjectiveExerciseRequest,
  type AdjectivePolarity,
  type AdjectivePoliteness,
  type AdjectiveTense,
} from "@/features/adjective-practice";
import type { StudyExercise } from "./types";

const tenses: AdjectiveTense[] = ["present", "past"];
const polarities: AdjectivePolarity[] = ["affirmative", "negative"];
const politenesses: AdjectivePoliteness[] = ["formal", "informal"];
const nounTargets = [
  { japanese: "ほん", meaningEs: "libro" },
  { japanese: "ひと", meaningEs: "persona" },
] as const;

export function createAdjectiveStudyExercises(): StudyExercise[] {
  return n5AdjectiveCatalog.flatMap((adjective) => {
    const predicateRequests = tenses.flatMap((tense) =>
      polarities.flatMap((polarity) =>
        politenesses.map((politeness): AdjectiveExerciseRequest => ({
          adjectiveId: adjective.id,
          tense,
          polarity,
          politeness,
          use: "predicate",
        })),
      ),
    );
    const nounRequests: AdjectiveExerciseRequest[] = [
      {
        adjectiveId: adjective.id,
        tense: "present",
        polarity: "affirmative",
        politeness: "informal",
        use: "noun-modifying",
        noun: nounTargets[0],
      },
      {
        adjectiveId: adjective.id,
        tense: "past",
        polarity: "negative",
        politeness: "informal",
        use: "noun-modifying",
        noun: nounTargets[1],
      },
    ];

    return [...predicateRequests, ...nounRequests].map(toStudyExercise);
  });
}

function toStudyExercise(request: AdjectiveExerciseRequest): StudyExercise {
  const exercise = generateAdjectiveExercise(request);
  const displayAnswer = buildKanaAnswer(exercise.adjective, request);
  const choices = buildChoices(displayAnswer);

  return {
    id: exercise.id,
    section: "adjectives",
    title: "Adjetivo N5",
    subtitle: buildSubtitle(request),
    details: buildAdjectiveDetails(request),
    promptEs: request.use === "noun-modifying"
      ? "Elige la forma correcta antes del sustantivo."
      : "Elige la forma correcta del adjetivo.",
    japanese: exercise.adjective.reading,
    reading: exercise.adjective.reading,
    romaji: exercise.adjective.romaji,
    choices,
    correctChoiceId: "correct",
    hint: [
      `lectura: ${exercise.adjective.reading} (${exercise.adjective.romaji})`,
      ...exercise.hints.map((hint) => `${hint.label}: ${hint.value}`),
    ].join(" | "),
    info: `Hay ${n5AdjectiveCatalog.length} adjetivos aqui. Este es ${exercise.adjective.kind === "i" ? "i-adjetivo" : "na-adjetivo"}.`,
    explanation: exercise.explanationEs,
  };
}

function buildKanaAnswer(
  adjective: AdjectiveCatalogEntry,
  request: AdjectiveExerciseRequest,
) {
  const kanaAdjective = {
    ...adjective,
    japanese: adjective.reading,
  };

  if (request.use === "noun-modifying") {
    return `${conjugateNounModifier(kanaAdjective, request)}${request.noun?.japanese ?? nounTargets[0].japanese}`;
  }

  return conjugatePredicate(kanaAdjective, request);
}

function buildChoices(correctAnswer: string) {
  const distractors = [
    `${correctAnswer}です`,
    correctAnswer.replace(/です$/, ""),
    `${correctAnswer}じゃない`,
  ].filter((choice, index, all) => choice !== correctAnswer && all.indexOf(choice) === index);

  return [
    {
      id: "correct",
      label: correctAnswer,
      info: "Esta opcion coincide con el objetivo del prompt.",
    },
    ...distractors.slice(0, 3).map((label, index) => ({
      id: `distractor-${index + 1}`,
      label,
      info: "Pista: revisa si es pasado, negativo, formal/informal o si va antes del sustantivo.",
    })),
  ];
}

function buildSubtitle(request: AdjectiveExerciseRequest) {
  const useLabel = request.use === "noun-modifying" ? "antes de sustantivo" : "predicado";
  return `${useLabel} | ${tenseLabels[request.tense]} | ${polarityLabels[request.polarity]} | ${politenessLabels[request.politeness]}`;
}

function buildAdjectiveDetails(request: AdjectiveExerciseRequest) {
  const details = [
    { label: "Tiempo", value: tenseLabels[request.tense] },
  ];

  if (request.polarity === "negative") {
    details.push({ label: "Tipo", value: "negativo" });
  }

  if (request.use === "noun-modifying") {
    details.push({ label: "Va", value: "antes del sustantivo" });
  } else {
    details.push({ label: "Modo", value: politenessLabels[request.politeness] });
  }

  return details;
}

const tenseLabels: Record<AdjectiveTense, string> = {
  present: "presente",
  past: "pasado",
};

const polarityLabels: Record<AdjectivePolarity, string> = {
  affirmative: "afirmativo",
  negative: "negativo",
};

const politenessLabels: Record<AdjectivePoliteness, string> = {
  formal: "formal",
  informal: "informal",
};
