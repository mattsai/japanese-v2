"use client";

import { useEffect, useMemo, useState } from "react";
import { getVerbCatalog } from "@/features/verb-practice";
import { createAdjectiveStudyExercises } from "./adjectiveExercises";
import { createKanjiStudyExercises } from "./kanjiExercises";
import type { DynamicSectionId, StudyExercise } from "./types";
import {
  createVerbStudyExercises,
  type VerbKnowledgeState,
} from "./verbExercises";

type AnswerState = "idle" | "correct" | "wrong";
type VerbMode = "split" | "exam";
type VerbExamFilter = "all" | "known" | "unknown";
type RandomPracticeSectionId = Exclude<DynamicSectionId, "verbs">;

const verbKnowledgeStorageKey = "japanese:n5-study-space:verb-knowledge";
const verbExamOrderStorageKey = "japanese:n5-study-space:verb-exam-order";

const aboutLinks = [
  {
    label: "Instagram",
    handle: "_matt.sai_",
    href: "https://instagram.com/_matt.sai_",
  },
  {
    label: "GitHub",
    handle: "mattsai",
    href: "https://github.com/mattsai",
  },
  {
    label: "PayPal",
    handle: "@kenpaachii",
    href: "https://paypal.me/kenpaachii",
  },
];

const sections: {
  id: DynamicSectionId;
  label: string;
  description: string;
}[] = [
  {
    id: "verbs",
    label: "Verbos",
    description: "",
  },
  {
    id: "adjectives",
    label: "Adjetivos",
    description: "",
  },
  {
    id: "kanji",
    label: "Kanji",
    description: "",
  },
];

export function DynamicStudySpace() {
  const verbCatalog = useMemo(() => getVerbCatalog(), []);
  const [verbKnowledge, setVerbKnowledge] = useState<Record<string, VerbKnowledgeState>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const saved = window.localStorage.getItem(verbKnowledgeStorageKey);

    if (!saved) {
      return {};
    }

    try {
      return JSON.parse(saved) as Record<string, VerbKnowledgeState>;
    } catch {
      window.localStorage.removeItem(verbKnowledgeStorageKey);
      return {};
    }
  });
  const [verbMode, setVerbMode] = useState<VerbMode>("split");
  const [verbExamFilter, setVerbExamFilter] = useState<VerbExamFilter>("all");
  const [splitIndex, setSplitIndex] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(verbKnowledgeStorageKey, JSON.stringify(verbKnowledge));
  }, [verbKnowledge]);

  const knownVerbIds = useMemo(
    () => verbCatalog.filter((verb) => verbKnowledge[verb.id] === "known").map((verb) => verb.id),
    [verbCatalog, verbKnowledge],
  );
  const unknownVerbIds = useMemo(
    () => verbCatalog.filter((verb) => verbKnowledge[verb.id] === "unknown").map((verb) => verb.id),
    [verbCatalog, verbKnowledge],
  );
  const verbExamIds =
    verbExamFilter === "known"
      ? knownVerbIds
      : verbExamFilter === "unknown"
        ? unknownVerbIds
        : undefined;
  const exercisesBySection = useMemo(
    () => ({
      verbs: createVerbStudyExercises(verbExamIds),
      adjectives: createAdjectiveStudyExercises(),
      kanji: createKanjiStudyExercises(),
    }),
    [verbExamIds],
  );
  const [exerciseOrders, setExerciseOrders] = useState<Record<RandomPracticeSectionId, string[]>>(
    () => ({
      adjectives: shuffleIds(createAdjectiveStudyExercises().map((exercise) => exercise.id)),
      kanji: shuffleIds(createKanjiStudyExercises().map((exercise) => exercise.id)),
    }),
  );
  const [activeSection, setActiveSection] = useState<DynamicSectionId>("verbs");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [showHint, setShowHint] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const activeExercises = exercisesBySection[activeSection];
  const [verbExamOrder, setVerbExamOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(verbExamOrderStorageKey);
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as string[];
    } catch {
      window.localStorage.removeItem(verbExamOrderStorageKey);
      return [];
    }
  });
  const displayedExercises = (() => {
    if (activeSection === "verbs" && verbMode === "exam") {
      return orderExercises(activeExercises, verbExamOrder);
    }

    if (activeSection === "adjectives") {
      return orderExercises(activeExercises, exerciseOrders.adjectives);
    }

    if (activeSection === "kanji") {
      return orderExercises(activeExercises, exerciseOrders.kanji);
    }

    return activeExercises;
  })();
  const activeExercise = displayedExercises[activeIndex] ?? displayedExercises[0];
  const section = sections.find((item) => item.id === activeSection) ?? sections[0];
  const currentSplitVerb = verbCatalog[splitIndex] ?? verbCatalog[0];
  const markedVerbs = useMemo(
    () =>
      verbCatalog
        .filter((verb) => verbKnowledge[verb.id])
        .map((verb) => ({
          id: verb.id,
          kanji: verb.kanji,
          kana: verb.kana,
          meaningEs: verb.meaningEs,
          state: verbKnowledge[verb.id],
        })),
    [verbCatalog, verbKnowledge],
  );

  function switchSection(sectionId: DynamicSectionId) {
    if (isRandomPracticeSection(sectionId)) {
      randomizeSection(sectionId);
    }

    setActiveSection(sectionId);
    setActiveIndex(0);
    resetAnswer();
  }

  function chooseAnswer(choiceId: string) {
    setSelectedChoiceId(choiceId);
    setAnswerState(choiceId === activeExercise.correctChoiceId ? "correct" : "wrong");
  }

  function goNext() {
    if (!displayedExercises.length) {
      resetAnswer();
      return;
    }

    if (isRandomPracticeSection(activeSection) && activeIndex >= displayedExercises.length - 1) {
      randomizeSection(activeSection);
      setActiveIndex(0);
    } else {
      setActiveIndex((index) => (index + 1) % displayedExercises.length);
    }

    resetAnswer();
  }

  function markVerb(state: VerbKnowledgeState) {
    changeVerbKnowledge(currentSplitVerb.id, state);
    setSplitIndex((index) => (index + 1) % verbCatalog.length);
  }

  function changeVerbKnowledge(verbId: string, state: VerbKnowledgeState) {
    setVerbKnowledge((current) => ({
      ...current,
      [verbId]: state,
    }));
  }

  function startVerbExam(filter: VerbExamFilter) {
    setVerbExamFilter(filter);
    setVerbMode("exam");
    const nextOrder = shuffleIds(createVerbStudyExercises(
      filter === "known" ? knownVerbIds : filter === "unknown" ? unknownVerbIds : undefined,
    ).map((exercise) => exercise.id));
    setVerbExamOrder(nextOrder);
    window.localStorage.setItem(verbExamOrderStorageKey, JSON.stringify(nextOrder));
    setActiveIndex(0);
    resetAnswer();
  }

  function resetVerbSplit() {
    setVerbMode("split");
    setSplitIndex(0);
    resetAnswer();
  }

  function resetAnswer() {
    setSelectedChoiceId(null);
    setAnswerState("idle");
    setShowHint(false);
    setShowInfo(false);
  }

  function randomizeSection(sectionId: RandomPracticeSectionId) {
    setExerciseOrders((current) => ({
      ...current,
      [sectionId]: shuffleIds(exercisesBySection[sectionId].map((exercise) => exercise.id)),
    }));
  }

  return (
    <main className="min-h-screen bg-[#f2faff] text-[#263c4a]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-5 lg:px-8">
        <header className="grid gap-4 border-b border-[#cdeeff] pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f9fd4]">
            N5 modo kawaii owo
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Kawaii Nihongo owo - Narumero
              </h1>
              <button
                type="button"
                onClick={() => setShowAbout(true)}
                className="shrink-0 rounded-full border border-[#b9e3fb] bg-white px-3 py-1.5 text-xs font-semibold text-[#41606f] shadow-sm transition hover:bg-[#e7f6ff] sm:hidden"
              >
                Redes
              </button>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 rounded-full border border-[#cdeeff] bg-white p-1 shadow-sm sm:min-w-[430px]">
              {sections.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchSection(item.id)}
                  className={`h-10 rounded-full px-3 text-sm font-semibold transition ${
                    activeSection === item.id
                      ? "bg-[#78bdeb] text-white"
                      : "text-[#41606f] hover:bg-[#e7f6ff]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowAbout(true)}
                className="hidden h-10 rounded-full px-3 text-sm font-semibold text-[#41606f] transition hover:bg-[#e7f6ff] sm:block"
              >
                Redes
              </button>
            </div>
          </div>
        </header>

        <DashboardBand
          section={section.label}
          focus={section.description}
          activeSection={activeSection}
          verbMode={verbMode}
          verbExamFilter={verbExamFilter}
          verbCount={verbCatalog.length}
          knownCount={knownVerbIds.length}
          unknownCount={unknownVerbIds.length}
          exerciseCount={activeExercises.length}
          currentExercise={activeIndex + 1}
          onExamAll={() => startVerbExam("all")}
          onExamKnown={() => startVerbExam("known")}
          onExamUnknown={() => startVerbExam("unknown")}
          onSplit={resetVerbSplit}
        />

        <div className="flex flex-1 flex-col">
          {activeSection === "verbs" && verbMode === "split" ? (
            <VerbSplitPanel
              verb={currentSplitVerb}
              progress={`${splitIndex + 1}/${verbCatalog.length}`}
              state={verbKnowledge[currentSplitVerb.id]}
              markedVerbs={markedVerbs}
              onKnown={() => markVerb("known")}
              onUnknown={() => markVerb("unknown")}
              onChangeState={changeVerbKnowledge}
            />
          ) : activeSection === "verbs" && displayedExercises.length === 0 ? (
            <EmptyExamPanel onBack={resetVerbSplit} />
          ) : (
            <StudyPanel
              exercise={activeExercise}
              selectedChoiceId={selectedChoiceId}
              answerState={answerState}
              showHint={showHint}
              showInfo={showInfo}
              onChoose={chooseAnswer}
              onToggleHint={() => setShowHint((value) => !value)}
              onToggleInfo={() => setShowInfo((value) => !value)}
              onNext={goNext}
            />
          )}
        </div>
      </section>
      {showAbout ? <AboutDialog onClose={() => setShowAbout(false)} /> : null}
    </main>
  );
}

function AboutDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-[#263c4a]/30 p-3 sm:place-items-center">
      <section className="w-full max-w-md rounded-2xl border border-[#cdeeff] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f9fd4]">
              Redes
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#263c4a]">Narumero</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-[#b9e3fb] text-sm font-semibold text-[#41606f] transition hover:bg-[#e7f6ff]"
            aria-label="Cerrar redes"
          >
            x
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#5b7888]">
          Kawaii Nihongo owo es un espacio chiquito para estudiar japones sin drama.
        </p>
        <div className="mt-4 grid gap-2">
          {aboutLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#dff3ff] bg-[#f8fdff] px-3 py-2.5 text-sm font-semibold text-[#263c4a] transition hover:bg-[#eef9ff]"
            >
              <span>{link.label}</span>
              <span className="truncate text-[#4f9fd4]">{link.handle}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardBand({
  section,
  focus,
  activeSection,
  verbMode,
  verbExamFilter,
  verbCount,
  knownCount,
  unknownCount,
  exerciseCount,
  currentExercise,
  onExamAll,
  onExamKnown,
  onExamUnknown,
  onSplit,
}: {
  section: string;
  focus: string;
  activeSection: DynamicSectionId;
  verbMode: VerbMode;
  verbExamFilter: VerbExamFilter;
  verbCount: number;
  knownCount: number;
  unknownCount: number;
  exerciseCount: number;
  currentExercise: number;
  onExamAll: () => void;
  onExamKnown: () => void;
  onExamUnknown: () => void;
  onSplit: () => void;
}) {
  return (
    <section className="rounded-xl border border-[#cdeeff] bg-white px-3 py-2 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="grid w-full grid-cols-4 gap-1.5">
            <CompactStat label="Zona" value={section} />
          {activeSection === "verbs" ? (
            <>
              <CompactStat label="Vista" value={verbMode === "split" ? "Clasifica" : "Examen"} />
              <CompactStat label="Total" value={String(verbCount)} />
              <CompactStat label="Sé/No sé" value={`${knownCount}/${unknownCount}`} />
            </>
          ) : (
            <>
              <CompactStat label="Total" value={String(exerciseCount)} />
              <CompactStat label="Ahora" value={`${currentExercise}/${exerciseCount}`} />
              <CompactStat label="Vista" value="Práctica" />
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {focus ? <p className="text-sm leading-5 text-[#5b7888]">{focus}</p> : null}
          {activeSection === "verbs" ? (
            <div className="grid w-full grid-cols-4 gap-1">
              <SmallAction label="Todos" onClick={onExamAll} active={verbMode === "exam" && verbExamFilter === "all"} />
              <SmallAction label="Me los sé" onClick={onExamKnown} active={verbMode === "exam" && verbExamFilter === "known"} />
              <SmallAction label="No me los sé" onClick={onExamUnknown} active={verbMode === "exam" && verbExamFilter === "unknown"} />
              <SmallAction label="Clasificar" onClick={onSplit} active={verbMode === "split"} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function orderExercises(exercises: StudyExercise[], order: string[]) {
  if (!order.length) {
    return exercises;
  }

  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const ordered = order
    .map((id) => byId.get(id))
    .filter((exercise): exercise is StudyExercise => Boolean(exercise));
  const used = new Set(ordered.map((exercise) => exercise.id));
  const missing = exercises.filter((exercise) => !used.has(exercise.id));

  return [...ordered, ...missing];
}

function shuffleIds(ids: string[]) {
  const copy = [...ids];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function isRandomPracticeSection(sectionId: DynamicSectionId): sectionId is RandomPracticeSectionId {
  return sectionId === "adjectives" || sectionId === "kanji";
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-[#eef9ff] px-2 py-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4f9fd4]">
        {label}
      </p>
      <p className="truncate text-[13px] font-semibold leading-5 text-[#263c4a]">{value}</p>
    </div>
  );
}

function SmallAction({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-8 rounded-md px-1.5 text-[11px] font-semibold leading-tight transition sm:min-h-9 sm:px-3 sm:text-sm ${
        active
          ? "bg-[#78bdeb] text-white hover:bg-[#5aaadd]"
          : "border border-[#b9e3fb] bg-white text-[#41606f] hover:bg-[#e7f6ff]"
      }`}
    >
      {label}
    </button>
  );
}

function VerbSplitPanel({
  verb,
  progress,
  state,
  markedVerbs,
  onKnown,
  onUnknown,
  onChangeState,
}: {
  verb: ReturnType<typeof getVerbCatalog>[number];
  progress: string;
  state?: VerbKnowledgeState;
  markedVerbs: {
    id: string;
    kanji: string;
    kana: string;
    meaningEs: string;
    state?: VerbKnowledgeState;
  }[];
  onKnown: () => void;
  onUnknown: () => void;
  onChangeState: (verbId: string, state: VerbKnowledgeState) => void;
}) {
  return (
    <section className="flex min-h-[640px] flex-col rounded-2xl border border-[#cdeeff] bg-white p-4 shadow-sm sm:p-6">
      <div className="border-b border-[#dff3ff] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f9fd4]">
            Clasifica
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Clasifica los verbos</h2>
          <p className="mt-1 text-sm text-[#5b7888]">
            {progress} | Decide rápido si ya reconoces el verbo base.
          </p>
        </div>
      </div>

      <div className="grid flex-1 gap-5 py-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#cdeeff] bg-[#eef9ff] p-5 text-center">
          <div
            aria-hidden="true"
            className="absolute right-5 top-5 h-10 w-16 rounded-full bg-white/80 shadow-sm before:absolute before:-left-3 before:top-2 before:size-6 before:rounded-full before:bg-white/80 after:absolute after:-right-3 after:top-2 after:size-6 after:rounded-full after:bg-white/80"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-5 left-5 h-3 w-20 rounded-full bg-[#cdeeff]"
          />
          <p className="font-jp text-7xl font-semibold leading-tight">
            {verb.kanji}
          </p>
          <p className="mt-5 font-jp text-2xl font-medium text-[#41606f]">
            {verb.kana}
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#4f9fd4]">
            {verb.romaji}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f9fd4]">
            Verbo
          </p>
          <h3 className="mt-2 text-3xl font-semibold capitalize">
            {verb.meaningEs}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#5b7888]">
            Marca este verbo como conocido o pendiente. Luego puedes hacer un
            examen solo con los conocidos, solo con los pendientes, o con todos.
          </p>

          {state ? (
            <div className="mt-5 rounded-xl border border-[#cdeeff] bg-[#f8fdff] p-4">
              <p className="text-sm font-semibold">Estado actual</p>
              <p className="mt-1 text-sm text-[#5b7888]">
                {state === "known" ? "Me lo sé" : "No me lo sé"}
              </p>
            </div>
          ) : null}

          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onUnknown}
              className="h-14 rounded-full border border-[#ffd9e6] bg-[#fff7fb] px-4 text-sm font-semibold text-[#8f6b7a] shadow-sm transition hover:bg-[#ffeef6]"
            >
              No me lo sé
            </button>
            <button
              type="button"
              onClick={onKnown}
              className="h-14 rounded-full border border-[#b9e3fb] bg-[#dff3ff] px-4 text-sm font-semibold text-[#2f6f97] shadow-sm transition hover:bg-[#cdeeff]"
            >
              Me lo sé
            </button>
          </div>
        </div>
      </div>

      {markedVerbs.length ? (
        <div className="border-t border-[#dff3ff] pt-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f9fd4]">
                Mis marcas
              </p>
              <p className="mt-1 text-sm text-[#5b7888]">
                Cambia cualquier verbo tocando el otro botoncito.
              </p>
            </div>
            <p className="text-sm font-semibold text-[#41606f]">
              {markedVerbs.length} marcados
            </p>
          </div>
          <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
            {markedVerbs.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-xl border border-[#dff3ff] bg-[#f8fdff] p-3 sm:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold capitalize text-[#263c4a]">
                    {item.meaningEs}
                  </p>
                  <p className="mt-1 font-jp text-lg font-semibold text-[#41606f]">
                    {item.kanji} <span className="text-sm font-medium">{item.kana}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:w-48">
                  <button
                    type="button"
                    onClick={() => onChangeState(item.id, "unknown")}
                    className={`h-10 rounded-full border px-3 text-xs font-semibold transition ${
                      item.state === "unknown"
                        ? "border-[#ffd9e6] bg-[#fff0f7] text-[#8f6b7a]"
                        : "border-[#dff3ff] bg-white text-[#5b7888] hover:bg-[#fff7fb]"
                    }`}
                  >
                    No me lo sé
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeState(item.id, "known")}
                    className={`h-10 rounded-full border px-3 text-xs font-semibold transition ${
                      item.state === "known"
                        ? "border-[#b9e3fb] bg-[#dff3ff] text-[#2f6f97]"
                        : "border-[#dff3ff] bg-white text-[#5b7888] hover:bg-[#eef9ff]"
                    }`}
                  >
                    Me lo sé
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function EmptyExamPanel({ onBack }: { onBack: () => void }) {
  return (
    <section className="flex min-h-[640px] flex-col items-center justify-center rounded-2xl border border-[#cdeeff] bg-white p-6 text-center shadow-sm">
      <h2 className="text-2xl font-semibold">No hay verbos en este grupo</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#5b7888]">
        Primero usa el clasificador para marcar verbos como conocidos o pendientes.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-5 h-11 rounded-full bg-[#78bdeb] px-4 text-sm font-semibold text-white"
      >
        Volver al split
      </button>
    </section>
  );
}

function PromptBlock({ exercise }: { exercise: StudyExercise }) {
  const fallbackDetails = exercise.subtitle
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => ({
      label: index === 0 ? "Tema" : index === 1 ? "Dato" : "Extra",
      value: part,
    }));
  const details = exercise.details ?? fallbackDetails;

  return (
    <div>
      <div className="rounded-xl border border-[#cdeeff] bg-[#f8fdff] p-2">
        {exercise.promptEs ? (
          <p className="text-base font-semibold leading-6">{exercise.promptEs}</p>
        ) : null}
        {details.length ? (
          <div className="flex flex-wrap gap-1.5">
            {details.map((detail) => (
              <div
                key={`${exercise.id}-${detail.label}-${detail.value}`}
                className="min-w-0 rounded-full bg-[#eef9ff] px-2.5 py-1 text-xs font-semibold text-[#263c4a]"
              >
                <span className="text-[#4f9fd4]">{detail.label}: </span>
                <span>{detail.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StudyPanel({
  exercise,
  selectedChoiceId,
  answerState,
  showHint,
  showInfo,
  onChoose,
  onToggleHint,
  onToggleInfo,
  onNext,
}: {
  exercise: StudyExercise;
  selectedChoiceId: string | null;
  answerState: AnswerState;
  showHint: boolean;
  showInfo: boolean;
  onChoose: (choiceId: string) => void;
  onToggleHint: () => void;
  onToggleInfo: () => void;
  onNext: () => void;
}) {
  const showReadingHelp = exercise.section === "verbs" || showHint;
  const showChoiceDetail = exercise.section === "verbs" || showHint;

  return (
    <section className="flex min-h-[640px] flex-col rounded-xl border border-[#cdeeff] bg-white p-2.5 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2 border-b border-[#dff3ff] pb-2">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold sm:text-2xl">{exercise.title}</h2>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <IconButton
            label={showHint ? "Ocultar" : "Pista"}
            active={showHint}
            showIcon={false}
            onClick={onToggleHint}
          />
          <IconButton
            label={showInfo ? "Ocultar" : "Info"}
            active={showInfo}
            showIcon
            onClick={onToggleInfo}
          />
        </div>
      </div>

      <div className="grid flex-1 gap-2.5 py-2.5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-[#cdeeff] bg-[#eef9ff] p-3 text-center sm:min-h-[260px]">
          <p className="font-jp text-5xl font-semibold leading-tight sm:text-7xl">
            {exercise.japanese}
          </p>
          {showReadingHelp && exercise.reading ? (
            <p className="mt-3 font-jp text-xl font-medium text-[#41606f] sm:text-2xl">
              {exercise.reading}
            </p>
          ) : null}
          {showReadingHelp && exercise.romaji ? (
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#4f9fd4]">
              {exercise.romaji}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <PromptBlock exercise={exercise} />

          {showHint ? <InfoBox title="Pista" text={exercise.hint} /> : null}
          {showInfo ? <InfoBox title="Info" text={exercise.info} /> : null}

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
            {exercise.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const isCorrect = choice.id === exercise.correctChoiceId;
              const showCorrect = answerState !== "idle" && isCorrect;
              const showWrong = answerState === "wrong" && isSelected;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => onChoose(choice.id)}
                  className={`min-h-14 rounded-md border p-2 text-left transition sm:min-h-20 sm:p-3 ${
                    showCorrect
                      ? "border-[#88d8b0] bg-[#f0fff7]"
                      : showWrong
                        ? "border-[#ffc2d1] bg-[#fff5f8]"
                        : isSelected
                          ? "border-[#78bdeb] bg-[#eef9ff]"
                          : "border-[#cdeeff] hover:bg-[#f6fcff]"
                  }`}
                >
                  <span className="font-jp block text-lg font-semibold sm:text-xl">
                    {choice.label}
                  </span>
                  {showChoiceDetail && choice.detail ? (
                    <span className="mt-1 block text-xs text-[#5b7888]">
                      {choice.detail}
                    </span>
                  ) : null}
                  {showInfo && choice.info ? (
                    <span className="mt-2 block text-xs leading-5 text-[#5b7888]">
                      {choice.info}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {answerState !== "idle" ? (
            <div className="mt-3 rounded-xl border border-[#cdeeff] bg-[#f8fdff] p-3">
              <p className="text-sm font-semibold">
                {answerState === "correct" ? "Correcto" : "Revisa la forma"}
              </p>
              <p className="mt-1 text-sm leading-5 text-[#5b7888]">
                {exercise.explanation}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onNext}
            className="mt-auto h-11 rounded-full bg-[#78bdeb] px-4 text-sm font-semibold text-white transition hover:bg-[#5aaadd]"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoBox({ title, text }: { title: string; text: string }) {
  const infoItems = title === "Info" ? parseInfoItems(text) : [];

  return (
    <div className="mt-2.5 rounded-xl border border-[#cdeeff] bg-[#f8fdff] p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f9fd4]">
        {title}
      </p>
      {infoItems.length ? (
        <div className="mt-2 grid max-h-48 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {infoItems.map((item) => (
            <div
              key={`${item.form}-${item.label}`}
              className="rounded-lg border border-[#dff3ff] bg-white px-2.5 py-1.5"
            >
              <p className="font-jp text-base font-semibold leading-5 text-[#263c4a]">
                {item.form}
              </p>
              <p className="text-[11px] leading-4 text-[#5b7888]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm leading-5 text-[#41606f]">{text}</p>
      )}
    </div>
  );
}

function parseInfoItems(text: string) {
  return text
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const match = item.match(/^(.*?)\s+\[(.*)\]$/);

      if (!match) {
        return { form: item, label: "" };
      }

      return {
        form: match[1],
        label: match[2],
      };
    });
}

function IconButton({
  label,
  active,
  showIcon,
  onClick,
}: {
  label: string;
  active: boolean;
  showIcon: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition sm:text-sm ${
        active
          ? "border-[#78bdeb] bg-[#78bdeb] text-white"
          : "border-[#b9e3fb] text-[#41606f] hover:bg-[#e7f6ff]"
      }`}
    >
      {showIcon ? (
        <span
          aria-hidden="true"
          className={`grid size-4 place-items-center rounded-full border text-[10px] sm:size-5 sm:text-xs ${
            active ? "border-white" : "border-[#78bdeb] text-[#4f9fd4]"
          }`}
        >
          i
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  );
}
