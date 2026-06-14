import { describe, expect, it } from "vitest";
import { createInitialSchedule, isDue, scheduleNextReview } from "./scheduler";

const now = new Date("2026-05-01T12:00:00.000Z");

describe("scheduleNextReview", () => {
  it("schedules a new good card two days out", () => {
    const next = scheduleNextReview({
      cardId: "vocab-taberu",
      rating: "good",
      reviewedAt: now,
    });

    expect(next.intervalDays).toBe(2);
    expect(next.reviewCount).toBe(1);
    expect(next.lapseCount).toBe(0);
    expect(next.dueAt).toBe("2026-05-03T12:00:00.000Z");
  });

  it("keeps failed cards due immediately and increments lapses", () => {
    const previous = createInitialSchedule("vocab-nomu", now);
    const next = scheduleNextReview({
      cardId: "vocab-nomu",
      previous,
      rating: "again",
      reviewedAt: now,
    });

    expect(next.intervalDays).toBe(0);
    expect(next.lapseCount).toBe(1);
    expect(isDue(next, now)).toBe(true);
  });

  it("grows intervals faster for easy answers than hard answers", () => {
    const first = scheduleNextReview({
      cardId: "kanji-hi",
      rating: "good",
      reviewedAt: now,
    });

    const hard = scheduleNextReview({
      cardId: "kanji-hi",
      previous: first,
      rating: "hard",
      reviewedAt: new Date(first.dueAt),
    });

    const easy = scheduleNextReview({
      cardId: "kanji-hi",
      previous: first,
      rating: "easy",
      reviewedAt: new Date(first.dueAt),
    });

    expect(easy.intervalDays).toBeGreaterThan(hard.intervalDays);
  });
});

