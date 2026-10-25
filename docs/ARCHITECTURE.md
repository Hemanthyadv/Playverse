# Playverse Architecture

## Current implementation

Playverse is a client-rendered React + TypeScript application built with Vite and React Router. The interface uses responsive CSS and Lucide React icons. It currently includes Size It Up, Higher or Lower, a date-based daily challenge, a searchable archive, and a local progress dashboard.

### Application layers

- `src/App.tsx`: route definitions, shared navigation and page composition.
- `src/games/`: game-specific UI and pure game rules.
- `src/pages/`: route-level screens, including archive and progress.
- `src/lib/gameHistory.ts`: validated local browser storage for saved game results.
- `src/lib/progress.ts`: deterministic statistics and achievement thresholds.
- `src/styles.css`: design tokens, shared styles, responsive layouts and visible keyboard focus.
- `e2e/`: Playwright browser tests for navigation and complete game flows.
- `src/**/*.test.ts`: Vitest unit tests for game logic, persistence and statistics.

## Core principles

1. **Isolated game modules.** Game-specific rules, data and scoring should not be coupled to global navigation.
2. **Pure logic first.** Scoring, date validation, challenge selection and progress calculations are testable functions.
3. **Persistence behind an interface.** Browser-storage validation and failure handling live in `gameHistory.ts`, not scattered across components.
4. **Stable daily challenges.** Daily IDs use the local calendar date and deterministic puzzle order so an archived challenge can be replayed.
5. **Local-first privacy.** Current scores and progress remain in this browser. There is no account, analytics service or backend requirement.
6. **Accessible by default.** Use semantic HTML, visible keyboard focus, keyboard-operable controls, readable labels and reduced-motion support.
7. **Verify before claiming.** A passing production build, unit tests, browser tests and dependency audit are separate verification signals.

## Persistence and hosting trade-offs

### Current release: static frontend

A static Vite build is the simplest, lowest-cost starting point. It avoids operating a server and keeps personal results on-device. The trade-off is that data does not sync across devices, and users can edit or clear their own local storage. Client-side scores must not be treated as trusted competition results.

### When to add a backend

A backend is justified when Playverse needs accounts, cross-device sync, shared leaderboards, moderation or server-enforced achievements. At that point, the server should validate scores from recorded game actions rather than accepting a client-submitted total. Authentication should be added only with a concrete account feature; rate limits, access controls and abuse prevention must ship with any public score submission endpoint.

### Suggested future service boundaries

- `GameHistoryStore`: interface between UI and local or remote history.
- `ProgressService`: computes transparent metrics from validated game history.
- `ScoreSubmissionService` (future): submits game events to a trusted server for validation.
- `IdentityProvider` (future): introduced only if user accounts become necessary.

## Directory structure

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── e2e/
├── src/
│   ├── games/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   └── styles.css
├── playwright.config.ts
├── vite.config.ts
└── package.json
```

## Current release boundary

Implemented: two playable mini-games, deterministic daily estimation challenges, local history and replay, a progress dashboard, unit tests, browser end-to-end tests, and dependency auditing in CI.

Not implemented: user accounts, cloud sync, database persistence, public leaderboards, server-validated scores or production deployment configuration. Those remain separate release decisions rather than implied capabilities.
