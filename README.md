# Playverse

**A little play. A sharper mind.**

Playverse is a growing collection of interactive mini-games, daily puzzles and friendly challenges. The goal is to make short, satisfying games that are easy to start and fun to return to.

## Project status

The repository includes three playable games (Size It Up, Higher or Lower, and Daily Quiz), a date-based Size It Up challenge, a searchable local archive, and a personal progress dashboard with scores, estimation accuracy, daily streaks and rule-based achievements. Results stay in browser local storage and do not sync across devices. Online accounts, leaderboards and server-validated scores remain planned. Vitest covers core logic; Playwright covers desktop/mobile navigation and end-to-end game flows.

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

## Deployment

A GitHub Pages deployment workflow is included in `.github/workflows/deploy-pages.yml`. Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. A push to `main` (or manual workflow dispatch) builds the app with the `/Playverse/` asset path and deploys it. Live publication is verified when the Pages deployment workflow succeeds.

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
