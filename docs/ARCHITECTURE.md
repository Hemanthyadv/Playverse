# Playverse Architecture

## Current foundation

Playverse starts as a client-rendered React application using TypeScript and Vite. React Router is included for explicit page routes as the app grows. Lucide React provides consistent interface icons.

## Principles

1. **Isolated game modules.** Game-specific rules, data and scoring must not be coupled to global navigation.
2. **Pure logic first.** Scoring, validation, challenge selection and date calculations should be testable functions.
3. **Persistence behind an interface.** Avoid scattering localStorage calls across UI components.
4. **Stable daily challenges.** Give each challenge a stable identifier and deterministic data so archived replays match the original.
5. **Backend trust boundaries.** Browser-side scores are not trustworthy for competitive leaderboards; validate on a trusted server.
6. **Accessible by default.** Use semantic HTML, visible focus, keyboard-operable controls, sufficient contrast and reduced-motion support.
7. **Verify before claiming.** Committed source code is not proof of a successful build or working browser behavior.

## Intended directory structure

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── public/                 # Static assets
├── src/
│   ├── components/         # Shared UI components
│   ├── games/              # Isolated game modules
│   ├── pages/              # Route-level screens
│   ├── services/           # Persistence/backend adapters
│   ├── utils/              # Pure shared logic
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

Add directories when their first real implementation arrives; avoid empty placeholder files.

## First release boundary

The foundation includes the app entry point, initial responsive homepage, visual tokens and project documentation. It does not yet include playable games, archive logic, accounts, database integration, automated tests or a verified deployment.
