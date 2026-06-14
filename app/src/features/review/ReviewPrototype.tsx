"use client";

import { useEffect, useMemo, useState } from "react";
import { n5SampleCards } from "@/data/n5-sample";
import { isDue, scheduleNextReview } from "@/features/srs/scheduler";
import type { CardSchedule, LearningItemType, ReviewRating } from "@/types/learning";

const storageKey = "japanese:n5-prototype:schedules";

type TypeFilter = "all" | LearningItemType;

const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "verb", label: "Verbs" },
  { value: "noun", label: "Nouns" },
  { value: "i-adjective", label: "い-adj" },
  { value: "na-adjective", label: "な-adj" },
  { value: "kanji", label: "Kanji" },
  { value: "grammar", label: "Grammar" },
];

export function ReviewPrototype() {
  const [schedules, setSchedules] = useState<Record<string, CardSchedule>>({});
  const [storageReady, setStorageReady] = useState(false);
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);

  useEffect(() => {
    let cancelled = false;

    window.queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const saved = window.localStorage.getItem(storageKey);

      if (saved) {
        try {
          setSchedules(JSON.parse(saved) as Record<string, CardSchedule>);
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }

      setStorageReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(schedules));
  }, [schedules, storageReady]);

  const visibleCards = useMemo(
    () =>
      selectedType === "all"
        ? n5SampleCards
        : n5SampleCards.filter((card) => card.type === selectedType),
    [selectedType],
  );

  const dueCards = useMemo(
    () => visibleCards.filter((card) => isDue(schedules[card.id])),
    [schedules, visibleCards],
  );

  const activeCard = dueCards[activeIndex] ?? dueCards[0] ?? visibleCards[0] ?? n5SampleCards[0];
  const activeSchedule = schedules[activeCard.id];
  const learnedCount = visibleCards.length - dueCards.length;
  const weakCount = Object.values(schedules).filter((schedule) => schedule.lapseCount > 0).length;

  function submitRating(rating: ReviewRating) {
    if (!activeCard) {
      return;
    }

    const nextSchedule = scheduleNextReview({
      cardId: activeCard.id,
      previous: schedules[activeCard.id],
      rating,
    });

    setSchedules((current) => ({
      ...current,
      [activeCard.id]: nextSchedule,
    }));
    setReviewedToday((count) => count + 1);
    setIsFlipped(false);
    setShowTeaching(false);
    setActiveIndex((index) => {
      const nextLength = Math.max(dueCards.length - 1, 1);
      return index >= nextLength - 1 ? 0 : index + 1;
    });
  }

  function revealTeaching() {
    setIsFlipped(true);
    setShowTeaching(true);
  }

  function selectType(type: TypeFilter) {
    setSelectedType(type);
    setActiveIndex(0);
    setIsFlipped(false);
    setShowTeaching(false);
  }

  function resetPrototype() {
    window.localStorage.removeItem(storageKey);
    setSchedules({});
    setSelectedType("all");
    setActiveIndex(0);
    setIsFlipped(false);
    setShowTeaching(false);
    setReviewedToday(0);
  }

  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#1c1a17]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[#d8cfc0] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8f402f]">
              JLPT N5 Prototype
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#171412] sm:text-4xl">
              Japanese Review Loop
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f574e] sm:text-base">
              Static cards, local progress, and a tested scheduler. This is the
              first proof of the core study loop before Supabase and AI.
            </p>
          </div>
          <button
            type="button"
            onClick={resetPrototype}
            className="h-10 rounded-md border border-[#b7aa99] px-4 text-sm font-medium text-[#3d342c] transition hover:bg-[#eee5d8]"
          >
            Reset
          </button>
        </header>

        <div className="grid flex-1 gap-5 py-5 lg:grid-cols-[280px_1fr]">
          <aside className="grid gap-3 self-start sm:grid-cols-2 lg:grid-cols-1">
            <Metric label="Due now" value={dueCards.length} />
            <Metric label="Reviewed today" value={reviewedToday} />
            <Metric label="Scheduled later" value={learnedCount} />
            <Metric label="Weak cards" value={weakCount} />
            <div className="rounded-lg border border-[#d8cfc0] bg-[#fffdf8] p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-sm font-semibold text-[#171412]">Focus</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => selectType(filter.value)}
                    className={`h-9 rounded-md border px-2 text-xs font-semibold transition ${
                      selectedType === filter.value
                        ? "border-[#8f402f] bg-[#8f402f] text-white"
                        : "border-[#d8cfc0] text-[#4d4036] hover:bg-[#eee5d8]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-h-[620px] flex-col rounded-lg border border-[#d8cfc0] bg-[#fffdf8] p-4 shadow-sm sm:p-6">
            {dueCards.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="font-jp text-5xl font-semibold">今日は終わり</p>
                <p className="mt-4 max-w-md text-[#5f574e]">
                  No cards are due right now. Reset the prototype or come back
                  after the next due date.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f402f]">
                      {activeCard.type}
                    </p>
                    <p className="mt-1 text-sm text-[#6f665c]">
                      Card {activeIndex + 1} of {dueCards.length}
                    </p>
                    {activeSchedule ? (
                      <p className="mt-1 text-xs text-[#85796d]">
                        Reviews: {activeSchedule.reviewCount} | Lapses:{" "}
                        {activeSchedule.lapseCount}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {activeCard.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#eee5d8] px-2 py-1 text-xs font-medium text-[#5a4538]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFlipped((value) => !value)}
                  className="my-6 flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-lg border border-[#cfbfa9] bg-[#fdf8ef] p-5 text-center transition hover:border-[#9d654e] focus:outline-none focus:ring-2 focus:ring-[#9d654e] sm:min-h-[360px]"
                  aria-label="Flip flashcard"
                >
                  {!isFlipped ? (
                    <>
                      <span className="font-jp text-6xl font-semibold leading-tight sm:text-7xl">
                        {activeCard.front}
                      </span>
                      <span className="mt-6 text-sm font-medium text-[#7a7166]">
                        Tap to reveal reading and meaning
                      </span>
                    </>
                  ) : (
                    <div className="grid max-w-2xl gap-4">
                      <p className="font-jp text-4xl font-semibold">
                        {activeCard.reading}
                      </p>
                      {activeCard.romaji ? (
                        <p className="text-base font-medium uppercase tracking-[0.14em] text-[#8f402f]">
                          {activeCard.romaji}
                        </p>
                      ) : null}
                      <div>
                        <p className="text-2xl font-semibold">
                          {activeCard.meaningEn}
                        </p>
                        <p className="mt-1 text-lg text-[#6f665c]">
                          {activeCard.meaningEs}
                        </p>
                      </div>
                      <div className="rounded-md bg-white p-4 text-left">
                        <p className="font-jp text-xl">
                          {activeCard.exampleJa}
                        </p>
                        <p className="mt-2 text-sm text-[#5f574e]">
                          {activeCard.exampleEn}
                        </p>
                      </div>
                    </div>
                  )}
                </button>

                {showTeaching ? (
                  <div className="mb-4 grid gap-3 rounded-md border border-[#e1c7a8] bg-[#fff7e8] p-4 text-sm leading-6 text-[#4d4036]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f402f]">
                        Reading helper
                      </p>
                      <p className="mt-1">
                        {activeCard.reading}
                        {activeCard.romaji ? ` (${activeCard.romaji})` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f402f]">
                        What to notice
                      </p>
                      <p className="mt-1">{activeCard.hint}</p>
                    </div>
                    {activeCard.teachingNote ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f402f]">
                          Micro-lesson
                        </p>
                        <p className="mt-1">{activeCard.teachingNote}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr]">
                  <button
                    type="button"
                    onClick={() => submitRating("again")}
                    className="h-12 rounded-md bg-[#8f402f] px-3 text-sm font-semibold text-white transition hover:bg-[#773426]"
                  >
                    Again
                  </button>
                  <RatingButton label="Hard" onClick={() => submitRating("hard")} />
                  <RatingButton label="Good" onClick={() => submitRating("good")} />
                  <RatingButton label="Easy" onClick={() => submitRating("easy")} />
                </div>

                <button
                  type="button"
                  onClick={showTeaching ? () => setShowTeaching(false) : revealTeaching}
                  className="mt-4 h-11 rounded-md border border-[#b7aa99] px-4 text-sm font-medium text-[#3d342c] transition hover:bg-[#eee5d8]"
                >
                  {showTeaching ? "Hide teaching note" : "I don't know this"}
                </button>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#d8cfc0] bg-[#fffdf8] p-4">
      <p className="text-sm font-medium text-[#6f665c]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#171412]">{value}</p>
    </div>
  );
}

function RatingButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 rounded-md border border-[#b7aa99] px-3 text-sm font-semibold text-[#3d342c] transition hover:bg-[#eee5d8]"
    >
      {label}
    </button>
  );
}
