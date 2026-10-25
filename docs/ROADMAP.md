# Playverse Roadmap

This roadmap is the project status source of truth. Mark a feature complete only after implementation and appropriate verification.

## Phase 1 — Foundation
- [x] Create React + TypeScript + Vite application scaffold.
- [x] Establish shared responsive visual foundations and initial homepage shell.
- [x] Document architecture and roadmap.
- [x] Install dependencies and run a production build in CI.
- [x] Add automated test tooling and baseline checks.

## Phase 2 — Brand and interface
- [x] Refine design tokens and component conventions.
- [x] Add functional responsive navigation and real routes.
- [x] Add empty and not-found states; loading/error states will be added where data services require them.
- [x] Verify keyboard navigation and small-screen layouts in a browser with Playwright.

## Phase 3 — First playable game
- [x] Implement original size-estimation gameplay and puzzle data.
- [x] Add pointer/touch controls, keyboard support, answer reveal and scoring; verify scoring logic with unit tests.
- [x] Add deterministic five-round data and scoring logic.
- [x] Add automated unit tests and verify the production build in CI.

## Phase 4 — Daily challenges and archive
- [x] Define stable date-based challenge IDs and local-calendar date rules.
- [x] Build archive filters and date-preserving replay behavior.
- [x] Persist results locally and prevent duplicate daily challenge saves on the same browser.

## Phase 5 — More games
- [x] Define a shared game catalog contract for IDs, titles, routes, categories and score caps.
- [x] Add Higher or Lower as a second fully playable mini-game.
- [x] Extract Higher or Lower direction and scoring rules into pure functions.
- [x] Add Vitest coverage for number direction, scoring, sequence generation and daily date IDs.
- [x] Verify production build and automated tests in GitHub Actions.

## Phase 6 — Personal progress
- [x] Save local history, best scores, estimation accuracy and daily streaks for both playable games.
- [x] Add a local progress dashboard, statistics and achievements with transparent rules.

## Phase 7 — Online services
- [x] Evaluate backend and hosting trade-offs in the architecture document.
- [ ] Add authentication only when needed.
- [ ] Add database persistence, server-validated scores and leaderboards.
- [ ] Add access controls, rate limits and abuse prevention.

## Phase 8 — Quality and launch
- [x] Add automated unit and end-to-end checks in CI.
- [ ] Verify accessibility, responsive behavior and performance.
- [x] Configure the GitHub Pages deployment workflow and document setup; live publication still requires Pages enablement and a successful deployment.

## Status convention
- [ ] Not done.
- [x] Implemented in the repository. This does not imply build or runtime verification unless the verification item is separately checked.
