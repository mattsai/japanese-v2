import { getAdjectiveById } from "./catalog";
import type {
  AdjectiveCatalogEntry,
  AdjectiveExercise,
  AdjectiveExerciseHint,
  AdjectiveExerciseRequest,
  AdjectivePolarity,
  AdjectivePoliteness,
  AdjectiveTense,
} from "./types";

const defaultNoun = {
  japanese: "本",
  meaningEs: "libro",
};

const tenseLabels: Record<AdjectiveTense, string> = {
  present: "presente",
  past: "pasado",
};

const polarityLabels: Record<AdjectivePolarity, string> = {
  affirmative: "afirmativo",
  negative: "negativo",
};

const politenessLabels: Record<AdjectivePoliteness, string> = {
  informal: "informal",
  formal: "formal",
};

export function generateAdjectiveExercise(request: AdjectiveExerciseRequest): AdjectiveExercise {
  const adjective = getAdjectiveById(request.adjectiveId);

  if (!adjective) {
    throw new Error(`Unknown adjective id: ${request.adjectiveId}`);
  }

  const noun = request.noun ?? defaultNoun;
  const correctAnswer =
    request.use === "noun-modifying"
      ? `${conjugateNounModifier(adjective, request)}${noun.japanese}`
      : conjugatePredicate(adjective, request);

  return {
    id: [
      "adj",
      adjective.id,
      request.use,
      request.tense,
      request.polarity,
      request.politeness,
      request.use === "noun-modifying" ? noun.japanese : "predicate",
    ].join(":"),
    promptEs: buildPrompt(adjective, request, noun.meaningEs),
    adjective,
    request,
    correctAnswer,
    acceptedAnswers: [correctAnswer],
    explanationEs: buildExplanation(adjective, request),
    hints: buildHints(adjective, request),
  };
}

export function conjugatePredicate(
  adjective: AdjectiveCatalogEntry,
  request: Pick<AdjectiveExerciseRequest, "tense" | "polarity" | "politeness">,
): string {
  if (adjective.kind === "i") {
    return conjugateIAdjectivePredicate(adjective, request);
  }

  return conjugateNaAdjectivePredicate(adjective, request);
}

export function conjugateNounModifier(
  adjective: AdjectiveCatalogEntry,
  request: Pick<AdjectiveExerciseRequest, "tense" | "polarity">,
): string {
  if (adjective.kind === "i") {
    return conjugateIAdjectiveNounModifier(adjective, request);
  }

  return conjugateNaAdjectiveNounModifier(adjective, request);
}

function conjugateIAdjectivePredicate(
  adjective: AdjectiveCatalogEntry,
  request: Pick<AdjectiveExerciseRequest, "tense" | "polarity" | "politeness">,
) {
  const informal = conjugateIAdjectiveNounModifier(adjective, request);

  if (request.politeness === "informal") {
    return informal;
  }

  return `${informal}です`;
}

function conjugateIAdjectiveNounModifier(
  adjective: AdjectiveCatalogEntry,
  request: Pick<AdjectiveExerciseRequest, "tense" | "polarity">,
) {
  if (request.tense === "present" && request.polarity === "affirmative") {
    return adjective.japanese;
  }

  const stem = getIAdjectiveStem(adjective);

  if (request.tense === "present" && request.polarity === "negative") {
    return `${stem}くない`;
  }

  if (request.tense === "past" && request.polarity === "affirmative") {
    return `${stem}かった`;
  }

  return `${stem}くなかった`;
}

function conjugateNaAdjectivePredicate(
  adjective: AdjectiveCatalogEntry,
  request: Pick<AdjectiveExerciseRequest, "tense" | "polarity" | "politeness">,
) {
  const base = adjective.japanese;

  if (request.politeness === "formal") {
    if (request.tense === "present" && request.polarity === "affirmative") {
      return `${base}です`;
    }

    if (request.tense === "present" && request.polarity === "negative") {
      return `${base}じゃないです`;
    }

    if (request.tense === "past" && request.polarity === "affirmative") {
      return `${base}でした`;
    }

    return `${base}じゃなかったです`;
  }

  if (request.tense === "present" && request.polarity === "affirmative") {
    return `${base}だ`;
  }

  if (request.tense === "present" && request.polarity === "negative") {
    return `${base}じゃない`;
  }

  if (request.tense === "past" && request.polarity === "affirmative") {
    return `${base}だった`;
  }

  return `${base}じゃなかった`;
}

function conjugateNaAdjectiveNounModifier(
  adjective: AdjectiveCatalogEntry,
  request: Pick<AdjectiveExerciseRequest, "tense" | "polarity">,
) {
  const base = adjective.japanese;

  if (request.tense === "present" && request.polarity === "affirmative") {
    return `${base}な`;
  }

  if (request.tense === "present" && request.polarity === "negative") {
    return `${base}じゃない`;
  }

  if (request.tense === "past" && request.polarity === "affirmative") {
    return `${base}だった`;
  }

  return `${base}じゃなかった`;
}

function getIAdjectiveStem(adjective: AdjectiveCatalogEntry) {
  if (adjective.irregularStem) {
    return adjective.irregularStem;
  }

  return adjective.japanese.slice(0, -1);
}

function buildPrompt(
  adjective: AdjectiveCatalogEntry,
  request: AdjectiveExerciseRequest,
  nounMeaningEs: string,
) {
  const formLabel = `${tenseLabels[request.tense]} ${polarityLabels[request.polarity]}`;

  if (request.use === "noun-modifying") {
    return [
      `Conjuga "${adjective.meaningEs}" (${adjective.romaji}) para modificar el sustantivo "${nounMeaningEs}".`,
      `Usa forma ${formLabel}; antes de sustantivo se usa forma llana aunque el ajuste de registro sea ${politenessLabels[request.politeness]}.`,
    ].join(" ");
  }

  return `Conjuga "${adjective.meaningEs}" (${adjective.romaji}) en ${formLabel}, registro ${politenessLabels[request.politeness]}.`;
}

function buildExplanation(adjective: AdjectiveCatalogEntry, request: AdjectiveExerciseRequest) {
  const formLabel = `${tenseLabels[request.tense]} ${polarityLabels[request.polarity]}`;

  if (request.use === "noun-modifying") {
    if (adjective.kind === "na" && request.tense === "present" && request.polarity === "affirmative") {
      return `Los adjetivos na usan な antes de un sustantivo en ${formLabel}: ${adjective.japanese}な.`;
    }

    return `Antes de un sustantivo se usa la forma llana del adjetivo en ${formLabel}; no se agrega です.`;
  }

  if (adjective.kind === "i") {
    if (adjective.irregularStem) {
      return `いい es irregular: conserva いい en presente afirmativo, pero usa el tallo よ para formas negativas y pasadas.`;
    }

    return `Los adjetivos i cambian la い final para formar ${formLabel}; en registro formal se agrega です al final.`;
  }

  return `Los adjetivos na usan だ en informal afirmativo, です/でした en formal, y じゃない para las formas negativas N5.`;
}

function buildHints(
  adjective: AdjectiveCatalogEntry,
  request: AdjectiveExerciseRequest,
): AdjectiveExerciseHint[] {
  const hints: AdjectiveExerciseHint[] = [
    { label: "tipo", value: adjective.kind === "i" ? "i-adjetivo" : "na-adjetivo" },
    { label: "lectura", value: adjective.reading },
    { label: "registro", value: politenessLabels[request.politeness] },
    { label: "forma", value: `${tenseLabels[request.tense]} ${polarityLabels[request.polarity]}` },
  ];

  if (request.use === "noun-modifying") {
    hints.push({
      label: "uso",
      value: adjective.kind === "na" ? "antes de sustantivo, presente afirmativo usa な" : "antes de sustantivo, no uses です",
    });
  }

  if (adjective.notes) {
    hints.push({ label: "nota", value: adjective.notes });
  }

  return hints;
}
