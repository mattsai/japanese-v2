export type LearningItemType =
  | "verb"
  | "noun"
  | "i-adjective"
  | "na-adjective"
  | "kanji"
  | "grammar";

export type ReviewRating = "again" | "hard" | "good" | "easy";

export type SampleCard = {
  id: string;
  type: LearningItemType;
  front: string;
  reading: string;
  romaji?: string;
  meaningEn: string;
  meaningEs: string;
  exampleJa: string;
  exampleEn: string;
  hint: string;
  teachingNote?: string;
  tags: string[];
};

export type CardSchedule = {
  cardId: string;
  dueAt: string;
  stability: number;
  difficulty: number;
  intervalDays: number;
  reviewCount: number;
  lapseCount: number;
  lastRating?: ReviewRating;
  lastReviewedAt?: string;
};
