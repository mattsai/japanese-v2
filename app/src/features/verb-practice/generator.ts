import type {
  VerbCatalogEntry,
  VerbFormTarget,
  VerbPoliteness,
  VerbPracticeGenerationOptions,
  VerbPracticeQuestion,
} from "@/types/verb-practice";
import { n5VerbCatalog } from "./catalog";

const formTargetLabels: Record<VerbFormTarget, string> = {
  "present-future": "presente/futuro",
  past: "pasado",
  negative: "negativo",
  "past-negative": "pasado negativo",
  "te-form": "forma te",
  "te-kara": "despues de hacer con てから",
  progressive: "forma ている",
  "te-kudasai": "peticion con てください",
  "te-mo-ii": "permiso con てもいいです",
  "te-wa-ikemasen": "prohibicion con てはいけません",
  "naide-kudasai": "peticion negativa con ないでください",
  "nakute-mo-ii": "permiso negativo con なくてもいいです",
  tai: "deseo con たいです",
  mashou: "invitacion con ましょう",
  "masen-ka": "invitacion con ませんか",
  nagara: "accion simultanea con ながら",
};

const politenessLabels: Record<VerbPoliteness, string> = {
  formal: "formal",
  informal: "informal",
};

const formTargets: VerbFormTarget[] = [
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

const targetsWithPoliteness = new Set<VerbFormTarget>([
  "present-future",
  "past",
  "negative",
  "past-negative",
  "progressive",
]);

export function getVerbCatalog(): readonly VerbCatalogEntry[] {
  return n5VerbCatalog;
}

export function getVerbById(verbId: string): VerbCatalogEntry | undefined {
  return n5VerbCatalog.find((verb) => verb.id === verbId);
}

export function getVerbForm(
  verb: VerbCatalogEntry,
  target: VerbFormTarget,
  politeness: VerbPoliteness = "formal",
): string {
  switch (target) {
    case "te-form":
      return verb.forms.teForm;
    case "te-kara":
      return verb.forms.teKara;
    case "te-kudasai":
      return verb.forms.teKudasai;
    case "te-mo-ii":
      return verb.forms.teMoIi;
    case "te-wa-ikemasen":
      return verb.forms.teWaIkemasen;
    case "naide-kudasai":
      return verb.forms.naideKudasai;
    case "nakute-mo-ii":
      return verb.forms.nakuteMoIi;
    case "tai":
      return verb.forms.tai;
    case "mashou":
      return verb.forms.mashou;
    case "masen-ka":
      return verb.forms.masenKa;
    case "nagara":
      return verb.forms.nagara;
    default: {
      const formKey = targetToFormKey(target);
      return verb.forms[formKey][politeness];
    }
  }
}

export function createVerbPracticeQuestion(
  options: VerbPracticeGenerationOptions = {},
): VerbPracticeQuestion {
  const random = createSeededRandom(options.seed ?? 1);
  const kind = options.kind ?? pick(["meaning", "conjugation"], random);
  const verb = options.verbId
    ? requireVerb(options.verbId)
    : pick(n5VerbCatalog, random);

  if (kind === "meaning") {
    return createMeaningQuestion(verb, random, options.choiceCount);
  }

  const target = options.target ?? pick(formTargets, random);
  const politeness = targetUsesPoliteness(target)
    ? options.politeness ?? pick(["formal", "informal"], random)
    : undefined;

  return createConjugationQuestion(verb, target, politeness, random, options.choiceCount);
}

export function createVerbPracticeSet(
  count: number,
  options: VerbPracticeGenerationOptions = {},
): VerbPracticeQuestion[] {
  return Array.from({ length: count }, (_, index) =>
    createVerbPracticeQuestion({
      ...options,
      seed: (options.seed ?? 1) + index,
    }),
  );
}

function createMeaningQuestion(
  verb: VerbCatalogEntry,
  random: () => number,
  requestedChoiceCount = 4,
): VerbPracticeQuestion {
  const correctAnswer = verb.meaningEs;
  const choices = buildChoices({
    correctAnswer,
    distractors: n5VerbCatalog
      .filter((candidate) => candidate.id !== verb.id)
      .map((candidate) => candidate.meaningEs),
    random,
    requestedChoiceCount,
  });

  return {
    id: `verb-practice-${verb.id}-meaning`,
    kind: "meaning",
    verbId: verb.id,
    promptEs: `Que significa ${verb.kanji} (${verb.kana})?`,
    choices,
    correctAnswer,
    hint: verb.hints.meaning,
    explanation: verb.explanation.meaning ?? `${verb.kanji} significa ${verb.meaningEs}.`,
    tags: [...verb.tags, "meaning"],
  };
}

function createConjugationQuestion(
  verb: VerbCatalogEntry,
  target: VerbFormTarget,
  politeness: VerbPoliteness | undefined,
  random: () => number,
  requestedChoiceCount = 4,
): VerbPracticeQuestion {
  const correctAnswer = getVerbForm(verb, target, politeness);
  const promptEs =
    politeness
      ? `Elige ${formTargetLabels[target]} en registro ${politenessLabels[politeness]} de ${verb.kanji} (${verb.meaningEs}).`
      : `Elige el uso N5: ${formTargetLabels[target]} de ${verb.kanji} (${verb.meaningEs}).`;

  const choices = buildChoices({
    correctAnswer,
    distractors: collectConjugationDistractors(verb, target, politeness),
    random,
    requestedChoiceCount,
  });

  return {
    id: `verb-practice-${verb.id}-${target}${politeness ? `-${politeness}` : ""}`,
    kind: "conjugation",
    verbId: verb.id,
    target,
    politeness,
    promptEs,
    choices,
    correctAnswer,
    hint: verb.hints.conjugation[target] ?? defaultConjugationHint(verb, target),
    explanation: verb.explanation[target] ?? defaultConjugationExplanation(verb, target, politeness, correctAnswer),
    tags: [...verb.tags, "conjugation", target, politeness ?? "plain"],
  };
}

function collectConjugationDistractors(
  verb: VerbCatalogEntry,
  target: VerbFormTarget,
  politeness: VerbPoliteness | undefined,
) {
  const sameVerbForms = formTargets
    .flatMap((candidateTarget) =>
      targetUsesPoliteness(candidateTarget)
        ? [getVerbForm(verb, candidateTarget, "formal"), getVerbForm(verb, candidateTarget, "informal")]
        : [getVerbForm(verb, candidateTarget)],
    )
    .filter((form) => form !== getVerbForm(verb, target, politeness));

  const peerForms = n5VerbCatalog
    .filter((candidate) => candidate.id !== verb.id)
    .map((candidate) => getVerbForm(candidate, target, politeness));

  return unique([...sameVerbForms, ...peerForms]);
}

function buildChoices({
  correctAnswer,
  distractors,
  random,
  requestedChoiceCount,
}: {
  correctAnswer: string;
  distractors: string[];
  random: () => number;
  requestedChoiceCount: number;
}) {
  const choiceCount = Math.max(2, Math.min(requestedChoiceCount, 6));
  const selectedDistractors = shuffle(unique(distractors).filter((text) => text !== correctAnswer), random).slice(
    0,
    choiceCount - 1,
  );

  return shuffle([correctAnswer, ...selectedDistractors], random).map((text, index) => ({
    id: `choice-${index + 1}`,
    text,
    isCorrect: text === correctAnswer,
  }));
}

function targetToFormKey(target: Exclude<
  VerbFormTarget,
  | "te-form"
  | "te-kara"
  | "te-kudasai"
  | "te-mo-ii"
  | "te-wa-ikemasen"
  | "naide-kudasai"
  | "nakute-mo-ii"
  | "tai"
  | "mashou"
  | "masen-ka"
  | "nagara"
>) {
  switch (target) {
    case "present-future":
      return "presentFuture";
    case "past":
      return "past";
    case "negative":
      return "negative";
    case "past-negative":
      return "pastNegative";
    case "progressive":
      return "progressive";
  }
}

function targetUsesPoliteness(target: VerbFormTarget) {
  return targetsWithPoliteness.has(target);
}

function requireVerb(verbId: string) {
  const verb = getVerbById(verbId);
  if (!verb) {
    throw new Error(`Unknown N5 verb id: ${verbId}`);
  }

  return verb;
}

function defaultConjugationHint(verb: VerbCatalogEntry, target: VerbFormTarget) {
  if (target === "te-form") {
    return `${verb.kanji} es un verbo ${verb.group}. Construye la forma te segun su grupo.`;
  }

  if (target === "progressive") {
    return `${verb.kanji}: usa forma te + います para formal o forma te + いる para informal.`;
  }

  if (target === "te-kara" || target === "te-kudasai" || target === "te-mo-ii" || target === "te-wa-ikemasen") {
    return `${verb.kanji}: primero busca la forma te (${verb.forms.teForm}); luego agrega la estructura N5 del prompt.`;
  }

  if (target === "naide-kudasai" || target === "nakute-mo-ii") {
    return `${verb.kanji}: empieza desde la forma negativa informal (${verb.forms.negative.informal}).`;
  }

  if (target === "tai" || target === "mashou" || target === "masen-ka" || target === "nagara") {
    return `${verb.kanji}: usa el tallo de la forma ます; no uses la forma de diccionario completa.`;
  }

  return `${verb.kanji} es un verbo ${verb.group}. Revisa si el prompt pide registro formal o informal.`;
}

function defaultConjugationExplanation(
  verb: VerbCatalogEntry,
  target: VerbFormTarget,
  politeness: VerbPoliteness | undefined,
  correctAnswer: string,
) {
  const politenessText = politeness ? ` ${politenessLabels[politeness]}` : "";
  return `${correctAnswer} es la forma${politenessText} de ${formTargetLabels[target]} para ${verb.kanji}.`;
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function unique(items: string[]) {
  return [...new Set(items)];
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
