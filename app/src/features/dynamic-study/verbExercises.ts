import {
  getVerbCatalog,
  getVerbForm,
} from "../verb-practice";
import type {
  VerbCatalogEntry,
  VerbFormTarget,
  VerbPoliteness,
} from "../../types/verb-practice";
import type { StudyExercise } from "./types";

export type VerbKnowledgeState = "known" | "unknown";
type VerbExamRound = {
  target: VerbFormTarget;
  targetIndex: number;
  politeness?: VerbPoliteness;
  politenessIndex: number;
};

export const verbExamTargets: VerbFormTarget[] = [
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
];

const politenesses: VerbPoliteness[] = ["formal", "informal"];
const targetsWithPoliteness = new Set<VerbFormTarget>([
  "present-future",
  "past",
  "negative",
  "past-negative",
  "progressive",
]);

export function createVerbStudyExercises(verbIds?: string[]): StudyExercise[] {
  const allowedIds = verbIds ? new Set(verbIds) : null;
  const verbs = getVerbCatalog().filter((verb) => !allowedIds || allowedIds.has(verb.id));
  const rounds: VerbExamRound[] = verbExamTargets.flatMap((target, targetIndex): VerbExamRound[] => {
    if (!targetUsesPoliteness(target)) {
      return [{ target, targetIndex, politeness: undefined, politenessIndex: 0 }];
    }

    return politenesses.map((politeness, politenessIndex) => ({
      target,
      targetIndex,
      politeness,
      politenessIndex,
    }));
  });

  const exercises = rounds.flatMap((round) =>
    verbs.filter((verb) => canUseVerbTarget(verb, round.target)).map((verb, verbIndex) =>
      toStudyExercise({
        verb,
        target: round.target,
        politeness: round.politeness,
        seed: seedFor(verbIndex, round.targetIndex, round.politenessIndex),
      }),
    ),
  );

  return interleaveVerbExam(exercises);
}

function toStudyExercise({
  verb,
  target,
  politeness,
  seed,
}: {
  verb: VerbCatalogEntry;
  target: VerbFormTarget;
  politeness?: VerbPoliteness;
  seed: number;
}): StudyExercise {
  const correctAnswer = getVerbForm(verb, target, politeness);
  const choices = buildSameVerbChoices(verb, target, politeness, seed);

  return {
    id: `verb-practice-${verb.id}-${target}${politeness ? `-${politeness}` : ""}`,
    section: "verbs",
    title: `Verbo: ${capitalize(verb.meaningEs.split(";")[0])}`,
    subtitle: buildVerbSubtitle(target, politeness),
    details: buildVerbDetails(target, politeness),
    promptEs: buildVerbPrompt(),
    japanese: verb.kanji,
    reading: verb.kana,
    romaji: verb.romaji,
    choices: choices.map((choice, index) => ({
      id: choice === correctAnswer ? "correct" : `distractor-${index}`,
      label: choice,
      info: describeVerbChoice(verb, choice),
    })),
    correctChoiceId: "correct",
    hint: buildVerbHint(target, politeness),
    info: buildVerbInfo(verb),
    explanation: buildVerbExplanation(verb, target, politeness),
  };
}

function buildSameVerbChoices(
  verb: VerbCatalogEntry,
  target: VerbFormTarget,
  politeness: VerbPoliteness | undefined,
  seed: number,
) {
  const correct = getVerbForm(verb, target, politeness);
  const candidates = [
    verb.forms.presentFuture.formal,
    verb.forms.presentFuture.informal,
    verb.forms.past.formal,
    verb.forms.past.informal,
    verb.forms.negative.formal,
    verb.forms.negative.informal,
    verb.forms.pastNegative.formal,
    verb.forms.pastNegative.informal,
    verb.forms.teForm,
    verb.forms.teKara,
    verb.forms.progressive.formal,
    verb.forms.progressive.informal,
    verb.forms.teKudasai,
    verb.forms.teMoIi,
    verb.forms.teWaIkemasen,
    verb.forms.naideKudasai,
    verb.forms.nakuteMoIi,
    verb.forms.tai,
    verb.forms.mashou,
    verb.forms.masenKa,
    verb.forms.nagara,
  ].filter((form, index, all) => form !== correct && all.indexOf(form) === index);

  const distractors = shuffleStable(candidates, seed).slice(0, 3);

  return shuffleStable([correct, ...distractors], seed + 97);
}

function buildVerbPrompt() {
  return "";
}

function buildVerbSubtitle(
  target: VerbFormTarget,
  politeness: VerbPoliteness | undefined,
) {
  const targetLabel = targetLabels[target];
  return politeness ? `${targetLabel} | ${politenessLabels[politeness]}` : targetLabel;
}

function buildVerbDetails(
  target: VerbFormTarget,
  politeness: VerbPoliteness | undefined,
) {
  const details = verbDetailsByTarget(target);

  details.push({ label: "Modo", value: politenessLabels[politeness ?? defaultModeByTarget(target)] });

  return details;
}

function verbDetailsByTarget(target: VerbFormTarget) {
  if (target === "present-future") {
    return [{ label: "Tiempo", value: "presente/futuro" }];
  }

  if (target === "past") {
    return [{ label: "Tiempo", value: "pasado" }];
  }

  if (target === "negative") {
    return [{ label: "Tiempo", value: "presente negativo" }];
  }

  if (target === "past-negative") {
    return [{ label: "Tiempo", value: "pasado negativo" }];
  }

  if (target === "progressive") {
    return [{ label: "Tiempo", value: "presente continuo" }];
  }

  if (target === "te-form") {
    return [{ label: "Tiempo", value: "forma te" }];
  }

  if (target === "te-kara") {
    return [{ label: "Tiempo", value: "después de hacer" }];
  }

  if (target === "te-kudasai") {
    return [{ label: "Tiempo", value: "petición" }];
  }

  if (target === "te-mo-ii") {
    return [{ label: "Tiempo", value: "permiso" }];
  }

  if (target === "te-wa-ikemasen") {
    return [{ label: "Tiempo", value: "prohibición" }];
  }

  if (target === "naide-kudasai") {
    return [{ label: "Tiempo", value: "petición negativa" }];
  }

  if (target === "nakute-mo-ii") {
    return [{ label: "Tiempo", value: "permiso negativo" }];
  }

  if (target === "tai") {
    return [{ label: "Tiempo", value: "quiero hacer" }];
  }

  if (target === "mashou") {
    return [{ label: "Tiempo", value: "hagamos" }];
  }

  if (target === "masen-ka") {
    return [{ label: "Tiempo", value: "invitación" }];
  }

  if (target === "nagara") {
    return [{ label: "Tiempo", value: "mientras" }];
  }

  return [{ label: "Tiempo", value: "presente/futuro" }];
}

function buildVerbHint(
  target: VerbFormTarget,
  politeness?: VerbPoliteness,
) {
  const timeLabel = verbDetailsByTarget(target)[0].value;

  return `En Tiempo ${timeLabel}: ${verbHintFormLabel(target, politeness)}.`;
}

function verbHintFormLabel(target: VerbFormTarget, politeness?: VerbPoliteness) {
  if (target === "present-future") {
    return politeness === "formal" ? "Forma MASU" : "Forma diccionario";
  }

  if (target === "past") {
    return politeness === "formal" ? "Forma MASU pasada" : "Forma TA";
  }

  if (target === "negative") {
    return politeness === "formal" ? "Forma MASU negativa" : "Forma NAI";
  }

  if (target === "past-negative") {
    return politeness === "formal" ? "Forma MASU negativa pasada" : "Forma NAKATTA";
  }

  if (target === "te-form") {
    return "Forma TE";
  }

  if (target === "te-kara") {
    return "Forma TE + から";
  }

  if (target === "progressive") {
    return politeness === "formal" ? "Forma TE + います" : "Forma TE + いる";
  }

  if (target === "te-kudasai") {
    return "Forma TE + ください";
  }

  if (target === "te-mo-ii") {
    return "Forma TE + もいいです";
  }

  if (target === "te-wa-ikemasen") {
    return "Forma TE + はいけません";
  }

  if (target === "naide-kudasai") {
    return "Forma NAI + でください";
  }

  if (target === "nakute-mo-ii") {
    return "Forma NAI + くてもいいです";
  }

  if (target === "tai") {
    return "Tallo MASU + たいです";
  }

  if (target === "mashou") {
    return "Tallo MASU + ましょう";
  }

  if (target === "masen-ka") {
    return "Tallo MASU + ませんか";
  }

  return "Tallo MASU + ながら";
}

function buildVerbExplanation(
  verb: VerbCatalogEntry,
  target: VerbFormTarget,
  politeness?: VerbPoliteness,
) {
  const answer = getVerbForm(verb, target, politeness);

  if (target === "te-form") {
    return `${answer} es la forma te de ${verb.kanji}. Sirve para conectar acciones y para estructuras N5 como てください, てもいいです y ている.`;
  }

  if (!targetUsesPoliteness(target)) {
    return `${answer} es ${targetLabels[target]} para ${verb.kanji} (${verb.meaningEs}).`;
  }

  return `${answer} es ${targetLabels[target]} en modo ${politenessLabels[politeness ?? "formal"]} para ${verb.kanji} (${verb.meaningEs}).`;
}

function buildVerbInfo(verb: VerbCatalogEntry) {
  return [
    `${verb.kanji} [diccionario informal]`,
    `${verb.forms.presentFuture.formal} [presente/futuro formal]`,
    `${verb.forms.past.formal} [pasado formal]`,
    `${verb.forms.past.informal} [pasado informal]`,
    `${verb.forms.negative.formal} [negativo formal]`,
    `${verb.forms.negative.informal} [negativo informal]`,
    `${verb.forms.pastNegative.formal} [pasado negativo formal]`,
    `${verb.forms.pastNegative.informal} [pasado negativo informal]`,
    `${verb.forms.teForm} [forma te]`,
    `${verb.forms.teKara} [después de hacer]`,
    `${verb.forms.progressive.formal} [ている formal / accion en curso]`,
    `${verb.forms.progressive.informal} [ている informal]`,
    `${verb.forms.teKudasai} [pide algo]`,
    `${verb.forms.teMoIi} [puedes hacerlo]`,
    `${verb.forms.teWaIkemasen} [no se puede]`,
    `${verb.forms.naideKudasai} [pide no hacerlo]`,
    `${verb.forms.nakuteMoIi} [puedes no hacerlo]`,
    `${verb.forms.tai} [quiero hacerlo]`,
    `${verb.forms.mashou} [hagamos]`,
    `${verb.forms.masenKa} [invitar suave]`,
    `${verb.forms.nagara} [hacer mientras]`,
  ].join(" | ");
}

function describeVerbChoice(verb: VerbCatalogEntry, value: string) {
  const labels: string[] = [];

  if (value === verb.forms.presentFuture.formal) labels.push("presente/futuro formal");
  if (value === verb.forms.presentFuture.informal) labels.push("presente/futuro informal");
  if (value === verb.forms.past.formal) labels.push("pasado formal");
  if (value === verb.forms.past.informal) labels.push("pasado informal");
  if (value === verb.forms.negative.formal) labels.push("negativo formal");
  if (value === verb.forms.negative.informal) labels.push("negativo informal");
  if (value === verb.forms.pastNegative.formal) labels.push("pasado negativo formal");
  if (value === verb.forms.pastNegative.informal) labels.push("pasado negativo informal");
  if (value === verb.forms.teForm) labels.push("forma te");
  if (value === verb.forms.teKara) labels.push("después de hacer con てから");
  if (value === verb.forms.progressive.formal) labels.push("ている formal / accion en curso");
  if (value === verb.forms.progressive.informal) labels.push("ている informal");
  if (value === verb.forms.teKudasai) labels.push("pide algo con てください");
  if (value === verb.forms.teMoIi) labels.push("puedes hacerlo con てもいいです");
  if (value === verb.forms.teWaIkemasen) labels.push("no se puede con てはいけません");
  if (value === verb.forms.naideKudasai) labels.push("pide no hacerlo con ないでください");
  if (value === verb.forms.nakuteMoIi) labels.push("puedes no hacerlo con なくてもいいです");
  if (value === verb.forms.tai) labels.push("quiero hacerlo con たいです");
  if (value === verb.forms.mashou) labels.push("hagamos con ましょう");
  if (value === verb.forms.masenKa) labels.push("invitar suave con ませんか");
  if (value === verb.forms.nagara) labels.push("hacer mientras / ながら");

  return labels.length
    ? `${value} [${labels.join(", ")}]`
    : "Forma de otro verbo o distractor cercano.";
}

function seedFor(verbIndex: number, targetIndex: number, politenessIndex: number) {
  return 1000 + verbIndex * 100 + targetIndex * 10 + politenessIndex;
}

function shuffleStable<T>(items: T[], seed: number) {
  const copy = [...items];
  let state = seed >>> 0;

  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function interleaveVerbExam(exercises: StudyExercise[]) {
  const bucketCount = 17;
  const buckets = Array.from({ length: bucketCount }, () => [] as StudyExercise[]);

  exercises.forEach((exercise, index) => {
    buckets[index % bucketCount].push(exercise);
  });

  return buckets.flat();
}

const targetLabels: Record<VerbFormTarget, string> = {
  "present-future": "presente/futuro",
  past: "pasado",
  negative: "negativo",
  "past-negative": "pasado negativo",
  "te-form": "forma te",
  "te-kara": "después de hacer / てから",
  progressive: "accion en curso / ている",
  "te-kudasai": "pide algo / てください",
  "te-mo-ii": "puedes hacerlo / てもいいです",
  "te-wa-ikemasen": "no se puede / てはいけません",
  "naide-kudasai": "pide no hacerlo / ないでください",
  "nakute-mo-ii": "puedes no hacerlo / なくてもいいです",
  tai: "quiero hacerlo / たいです",
  mashou: "hagamos / ましょう",
  "masen-ka": "invitar suave / ませんか",
  nagara: "hacer mientras / ながら",
};

const politenessLabels: Record<VerbPoliteness, string> = {
  formal: "formal",
  informal: "informal",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function targetUsesPoliteness(target: VerbFormTarget) {
  return targetsWithPoliteness.has(target);
}

function defaultModeByTarget(target: VerbFormTarget): VerbPoliteness {
  if (
    target === "te-kudasai" ||
    target === "te-mo-ii" ||
    target === "te-wa-ikemasen" ||
    target === "naide-kudasai" ||
    target === "nakute-mo-ii" ||
    target === "tai" ||
    target === "mashou" ||
    target === "masen-ka"
  ) {
    return "formal";
  }

  return "informal";
}

function canUseVerbTarget(verb: VerbCatalogEntry, target: VerbFormTarget) {
  if (target === "progressive" && verb.tags.includes("existence")) {
    return false;
  }

  return true;
}
