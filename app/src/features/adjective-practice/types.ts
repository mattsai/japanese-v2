export type AdjectiveKind = "i" | "na";

export type AdjectivePoliteness = "informal" | "formal";

export type AdjectiveTense = "present" | "past";

export type AdjectivePolarity = "affirmative" | "negative";

export type AdjectiveFormUse = "predicate" | "noun-modifying";

export type AdjectiveCatalogEntry = {
  id: string;
  kind: AdjectiveKind;
  japanese: string;
  reading: string;
  romaji: string;
  meaningEs: string;
  meaningEn: string;
  tags: string[];
  notes?: string;
  irregularStem?: string;
};

export type AdjectiveExerciseRequest = {
  adjectiveId: string;
  tense: AdjectiveTense;
  polarity: AdjectivePolarity;
  politeness: AdjectivePoliteness;
  use: AdjectiveFormUse;
  noun?: {
    japanese: string;
    meaningEs: string;
  };
};

export type AdjectiveExerciseHint = {
  label: string;
  value: string;
};

export type AdjectiveExercise = {
  id: string;
  promptEs: string;
  adjective: AdjectiveCatalogEntry;
  request: AdjectiveExerciseRequest;
  correctAnswer: string;
  acceptedAnswers: string[];
  explanationEs: string;
  hints: AdjectiveExerciseHint[];
};
