import type { CardSchedule, ReviewRating } from "@/types/learning";

export type ScheduleInput = {
  cardId: string;
  previous?: CardSchedule;
  rating: ReviewRating;
  reviewedAt?: Date;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const ratingWeights: Record<ReviewRating, number> = {
  again: 0,
  hard: 1,
  good: 2,
  easy: 3,
};

export function createInitialSchedule(cardId: string, now = new Date()): CardSchedule {
  return {
    cardId,
    dueAt: now.toISOString(),
    stability: 0,
    difficulty: 5,
    intervalDays: 0,
    reviewCount: 0,
    lapseCount: 0,
  };
}

export function scheduleNextReview({
  cardId,
  previous,
  rating,
  reviewedAt = new Date(),
}: ScheduleInput): CardSchedule {
  const current = previous ?? createInitialSchedule(cardId, reviewedAt);
  const weight = ratingWeights[rating];
  const reviewCount = current.reviewCount + 1;
  const lapseCount = rating === "again" ? current.lapseCount + 1 : current.lapseCount;

  const difficulty = clamp(
    current.difficulty + (rating === "again" ? 1.1 : rating === "hard" ? 0.35 : rating === "easy" ? -0.55 : -0.2),
    1,
    10,
  );

  const stability =
    rating === "again"
      ? Math.max(0.2, current.stability * 0.45)
      : Math.max(1, current.stability + 0.8 + weight * 0.7 - difficulty * 0.05);

  const intervalDays = nextIntervalDays(current.intervalDays, rating, reviewCount, stability);
  const dueAt = new Date(reviewedAt.getTime() + intervalDays * DAY_MS);

  return {
    cardId,
    dueAt: dueAt.toISOString(),
    stability: round(stability),
    difficulty: round(difficulty),
    intervalDays,
    reviewCount,
    lapseCount,
    lastRating: rating,
    lastReviewedAt: reviewedAt.toISOString(),
  };
}

export function isDue(schedule: CardSchedule | undefined, now = new Date()) {
  if (!schedule) {
    return true;
  }

  return new Date(schedule.dueAt).getTime() <= now.getTime();
}

function nextIntervalDays(
  previousIntervalDays: number,
  rating: ReviewRating,
  reviewCount: number,
  stability: number,
) {
  if (rating === "again") {
    return 0;
  }

  if (reviewCount === 1) {
    if (rating === "hard") {
      return 1;
    }

    if (rating === "easy") {
      return 4;
    }

    return 2;
  }

  const multiplier =
    rating === "hard" ? 1.25 : rating === "good" ? 2.2 : 3.2;

  return Math.max(1, Math.round(Math.max(previousIntervalDays, stability) * multiplier));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

