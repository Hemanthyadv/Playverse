# Playverse

**A little play. A sharper mind.**

Playverse is a growing collection of interactive mini-games, daily puzzles and friendly challenges. The goal is to make short, satisfying games that are easy to start and fun to return to.

## Project status

The repository includes two playable mini-games (Size It Up and Higher or Lower), a date-based daily challenge, and a searchable local archive for completed Size It Up games. Results are stored in browser local storage and do not sync across devices. Higher or Lower currently keeps its score in the active session; online accounts, leaderboards and server-validated scores remain planned. A Vitest test suite covers core game rules and date IDs.

## Tech stack

- React + TypeScript
- Vite
- React Router
- Lucide React icons
- CSS design tokens and responsive styling

## Run locally

Requires a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Build and type-check:

```bash
npm run build
npm run typecheck
```

## Project documentation

- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)

## Principles

- Original branding, interface and puzzle content.
- Playable features, not decorative mockups.
- Game logic kept separate from presentation.
- Accessibility and responsive design from the beginning.
- Never claim a build or test passed unless it was actually run.

## License

No license has been selected yet. Until one is added, standard copyright applies to the repository contents.
