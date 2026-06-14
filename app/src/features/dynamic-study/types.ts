export type DynamicSectionId = "verbs" | "adjectives" | "kanji";

export type StudyChoice = {
  id: string;
  label: string;
  detail?: string;
  info?: string;
};

export type StudyExercise = {
  id: string;
  section: DynamicSectionId;
  title: string;
  subtitle: string;
  details?: { label: string; value: string }[];
  promptEs: string;
  japanese: string;
  reading?: string;
  romaji?: string;
  choices: StudyChoice[];
  correctChoiceId: string;
  hint: string;
  info: string;
  explanation: string;
};
