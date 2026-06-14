# Japanese Learning App Roadmap

## Decision

Build a web-first modular monolith with a clean path to APK packaging.

Primary stack:

- Next.js + React + TypeScript
- Tailwind CSS
- Supabase for PostgreSQL, Auth, and Storage
- Drizzle ORM
- Zod validation
- Vitest for unit tests
- Playwright for end-to-end tests
- Sentry later for production error tracking

Mobile/APK strategy:

- Phase 1 and MVP ship as responsive web/PWA.
- Keep review/content logic behind domain services and API routes so a mobile client can reuse the same backend.
- Use Capacitor for an early APK wrapper if a quick Android build is needed.
- Use Expo React Native later only if mobile traction justifies a real native app.

AI strategy:

- Do not make AI part of the MVP foundation.
- Build deterministic study, SRS, progress, and content workflows first.
- Add AI later for explanations, mnemonics, examples, and quiz generation.
- Cache AI outputs and never send private study data unless the user explicitly requests a personalized explanation.

## Why This Stack

The best parts of the three proposals are:

- From the initial recommendation: use a modular monolith, PostgreSQL, managed auth, and defer AI.
- From Agent 1: model the app as a guided learning system, not a simple flashcard clone.
- From Agent 2: validate the mobile flashcard loop early with static data and a pure SRS function.

Chosen direction:

- Use Next.js because the first product is web/admin/content heavy.
- Use PostgreSQL because Japanese learning content, decks, cards, review history, and progress are relational.
- Use Supabase because it gives auth, Postgres, storage, and local tooling without building infrastructure first.
- Use Drizzle because it is lightweight, TypeScript-native, and works well with explicit SQL-shaped schema design.
- Use a route/API boundary for core mutations so APK/mobile clients are not blocked by web-only server actions.

Deferred:

- FastAPI: useful later for PDF ingestion, NLP, embeddings, and heavy AI jobs.
- Redis: not needed until queues, rate limits, or hot cache pressure exist.
- Kubernetes/microservices/Kafka: unnecessary operational cost.
- GraphQL: not needed; route handlers and typed service functions are simpler.
- Full offline native app: defer until real mobile usage proves it is necessary.

## Product Principle

The core differentiator is the failure path:

> When the learner does not know something, the app should teach, diagnose, and reschedule intelligently.

The first build must prove this loop:

1. Show a Japanese card.
2. Let the learner answer or admit they do not know.
3. If wrong or unknown, show a useful explanation or micro-lesson.
4. Reschedule the item sooner.
5. Track weak areas.
6. Recommend what to study next.

## Dynamic Study Sections

The app should not only show static flashcards. It should generate structured
study sections dynamically from the content catalog, with Spanish as the
learner-facing prompt language by default.

Initial sections:

- Verbs: all JLPT N5 verbs.
- Adjectives: all JLPT N5 i-adjectives and na-adjectives.
- Kanji: all JLPT N5 kanji.
- Grammar: N5 grammar patterns when they are needed to explain a form.

Verb practice should train meaning plus real N5-useful forms. A generated prompt can
look like:

```text
Verbo: Comer
Uso N5: Pasado
Registro: Informal
Selecciona la respuesta correcta
```

The answer boxes should include plausible formal and informal forms, for
example:

```text
tabemashita  |  tabeta
tabemasen    |  taberu
```

The same exercise model should support N5-safe verb targets such as:

- Presente/futuro formal and informal.
- Pasado formal and informal.
- Negativo formal and informal.
- Pasado negativo formal and informal.
- Forma te.
- ている for action in progress or state, with the hidden hint tied to te-form.
- てください for requests.
- てもいいです for permission.
- てはいけません for prohibition.
- たいです for desire.
- ましょう and ませんか for invitation.
- ながら for simultaneous actions.

Do not drill "past continuous" as a core N5 target. It is not a useful base
bucket for this app and makes the study model feel fake.

Every generated exercise should have a separate Hint button. Hint starts hidden.
When opened, it should guide the learner without directly marking the correct
answer. Examples:

- For "presente continuo", show that the learner should think about te-form.
- For "pasado informal", show that casual past forms usually do not use masu.
- For a multiple-choice contrast, optional hint labels may annotate each choice
  as a form category, such as `tabemashita [pasado formal]` or
  `tabeta [pasado informal]`, but the UI must still require the learner to make
  the final selection.

Adjective practice should follow the same pattern, with separate handling for
i-adjectives and na-adjectives:

- Present affirmative formal and informal.
- Present negative formal and informal.
- Past affirmative formal and informal.
- Past negative formal and informal.
- Noun-modifying forms, including when na is required.

Kanji practice should focus less on formal/informal and more on recognition:

- Meaning in Spanish.
- Common N5 readings.
- Example vocabulary using the kanji.
- Choice between similar-looking kanji where useful.
- Hint that shows radicals, mnemonic, or example-word context without marking
  the answer.

This dynamic section work should still reuse the same scheduler. Generated
questions are study cards with metadata: category, source item, target form,
register, tense/aspect, prompt language, hint text, choices, correct answer, and
post-answer explanation.

## Phase 0: Project Foundation

Goal: create the project shell and architecture contracts.

Deliverables:

- Next.js app scaffolded with TypeScript and Tailwind.
- Domain-oriented folder structure.
- Static seed file with initial N5 cards.
- Pure SRS scheduler function.
- Basic test setup.
- First flashcard review screen.

Exit criteria:

- App runs locally.
- A learner can review static sample cards.
- Ratings update local scheduling state.
- The scheduler has unit tests.

## Phase 1: Prototype

Goal: validate the study loop without cloud dependencies.

Features:

- Static N5 sample data, starting with 50 cards.
- Deck categories:
  - verbs
  - nouns
  - i-adjectives
  - na-adjectives
  - kanji
  - grammar
- Flashcard UI optimized for mobile width.
- Rating buttons:
  - Again
  - Hard
  - Good
  - Easy
- "I don't know" path.
- Local progress saved in browser storage.
- Simple dashboard:
  - due cards
  - new cards
  - reviewed today
  - weak cards

Technical work:

- Implement an FSRS-inspired simple scheduler first.
- Store card states in localStorage for prototype speed.
- Keep scheduler pure and database-independent.
- Add Vitest coverage for scheduling edge cases.

Exit criteria:

- The review flow feels good on mobile.
- Wrong answers come back sooner.
- Progress survives browser refresh.
- Data model supports vocab, kanji, verbs, adjectives, and grammar.

## Phase 2: MVP

Goal: launch a real N5 study product with saved accounts.

Features:

- Supabase Auth.
- PostgreSQL schema and migrations.
- User profile with target level and preferred explanation language.
- System decks for JLPT N5.
- Persisted review history.
- Persisted user card state.
- Admin CSV/JSON import.
- Search across N5 content.
- Basic progress dashboard.
- Spanish and English meanings where available.

Core tables:

- learning_items
- vocabulary_items
- kanji_items
- grammar_points
- verb_details
- adjective_details
- decks
- cards
- user_card_state
- review_events
- study_sessions
- content_sources
- audio_assets

API boundaries:

- GET /api/me
- GET /api/decks
- GET /api/reviews/due
- POST /api/reviews/session/start
- POST /api/reviews/answer
- GET /api/reviews/stats
- GET /api/content/search
- POST /api/admin/import

Exit criteria:

- A user can create an account and study daily.
- Review scheduling is reliable across sessions.
- Admin can import content without direct database edits.
- Basic privacy boundaries are enforced.

## Phase 3: Production Hardening

Goal: make the app reliable enough for public users.

Features:

- Better scheduler behavior and leech handling.
- Content validation and duplicate detection.
- Admin review/publish workflow.
- Import rollback.
- Sentry error tracking.
- Structured logs.
- Playwright coverage for critical study flows.
- Responsive PWA polish.
- Optional email reminders.

Exit criteria:

- Scheduler bugs are covered by tests.
- Import failures are visible and recoverable.
- User-specific data access is tested.
- The app can support real learners without manual repair.

## Phase 4: Learning Intelligence

Goal: make the product smarter after the core loop is stable.

Features:

- AI grammar explanations.
- AI-generated examples.
- AI-generated mnemonics.
- AI-generated quizzes.
- Cached TTS audio.
- Weak-area recommendations.
- Focused practice sessions.

Rules:

- AI output must be cached.
- AI failure must not block studying.
- AI explanations should be grounded in stored content when possible.
- Human-reviewed content remains the source of truth.

## Phase 5: Mobile/APK

Goal: provide a real Android path without rewriting the product prematurely.

Option A: Capacitor wrapper

- Best for a fast APK.
- Reuses the web app.
- Good when the app remains mostly online.
- Requires API routes for review/content mutations.

Option B: Expo React Native app

- Best for a serious mobile product.
- More work than Capacitor.
- Allows stronger offline support and native UX.
- Should reuse shared TypeScript domain packages where possible.

Decision point:

- Use Capacitor if users simply ask for an APK.
- Use Expo if mobile retention, offline reviews, and native interactions become central.

## Initial Folder Plan

```text
japanese/
  ROADMAP.md
  app/
    src/
      app/
      components/
      data/
      features/
        cards/
        review/
        srs/
        progress/
        content/
      lib/
      types/
    public/
  docs/
    architecture.md
```

## First Milestone

Build a local prototype:

- Next.js app created.
- Static sample N5 cards added.
- Flashcard review page implemented.
- SRS scheduler implemented.
- Ratings change next due timing.
- Progress stored locally.
- Unit tests validate scheduler behavior.
