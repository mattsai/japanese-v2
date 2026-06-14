export type VerbPracticeKind = "meaning" | "conjugation";

export type VerbFormTarget =
  | "present-future"
  | "past"
  | "negative"
  | "past-negative"
  | "te-form"
  | "te-kara"
  | "progressive"
  | "te-kudasai"
  | "te-mo-ii"
  | "te-wa-ikemasen"
  | "naide-kudasai"
  | "nakute-mo-ii"
  | "tai"
  | "mashou"
  | "masen-ka"
  | "nagara";

export type VerbPoliteness = "formal" | "informal";

export type VerbGroup = "ichidan" | "godan" | "irregular";

export type VerbPracticeChoice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type VerbFormPair = {
  formal: string;
  informal: string;
};

export type VerbPracticeForms = {
  presentFuture: VerbFormPair;
  past: VerbFormPair;
  negative: VerbFormPair;
  pastNegative: VerbFormPair;
  teForm: string;
  teKara: string;
  progressive: VerbFormPair;
  teKudasai: string;
  teMoIi: string;
  teWaIkemasen: string;
  naideKudasai: string;
  nakuteMoIi: string;
  tai: string;
  mashou: string;
  masenKa: string;
  nagara: string;
};

export type VerbCatalogEntry = {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaningEs: string;
  meaningEn: string;
  group: VerbGroup;
  forms: VerbPracticeForms;
  hints: {
    meaning: string;
    conjugation: Partial<Record<VerbFormTarget, string>>;
  };
  explanation: Partial<Record<VerbFormTarget | "meaning", string>>;
  tags: string[];
};

export type VerbPracticeQuestion = {
  id: string;
  kind: VerbPracticeKind;
  verbId: string;
  promptEs: string;
  target?: VerbFormTarget;
  politeness?: VerbPoliteness;
  choices: VerbPracticeChoice[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  tags: string[];
};

export type VerbPracticeGenerationOptions = {
  verbId?: string;
  kind?: VerbPracticeKind;
  target?: VerbFormTarget;
  politeness?: VerbPoliteness;
  choiceCount?: number;
  seed?: number;
};
