# CLAUDE.md — Instructions for Claude Code

## Project Overview

Mahjong Score Tracker — a React PWA for calculating settlements between 4 players in classic Mahjong. The full specification is in `docs/SPEC.md`.

## Tech Stack

- **React 19** with functional components and hooks
- **TypeScript 5.9** (strict mode)
- **Vite 8** as build tool
- **react-i18next** + **i18next** + **i18next-browser-languagedetector** for internationalization
- **CSS Modules** for styling (no external UI libraries)
- **PWA** via vite-plugin-pwa (installed with `--legacy-peer-deps` due to Vite 8 peer dep)

## Commands

```bash
npm install          # install dependencies
npm run dev          # run dev server
npm run build        # production build
npm run preview      # preview production build
npm run lint         # run ESLint
npm run typecheck    # run TypeScript compiler check
```

## Key Rules

### Code Style
- All components are functional (no class components).
- Use `const` arrow functions for components: `const MyComponent: React.FC = () => { ... }`.
- One component per file.
- Keep game logic in `src/logic/` — separated from UI components.
- All TypeScript interfaces go in `src/types/`.

### i18n
- **Never hardcode UI text in components.** All strings must use `t('key')` from react-i18next.
- Translation files: `src/locales/ru.json` and `src/locales/en.json`.
- Russian is the primary language — write Russian translations first, then English.
- Wind names, button labels, status messages — everything goes through i18n.
- Player names and numeric values are NOT translated.

### Game Logic
- The calculation algorithm is defined in `docs/SPEC.md` section 4. Follow it exactly.
- Use the test scenario from section 9 to verify the calculation is correct.
- East wind (×2 multiplier) applies to ALL transactions involving the East player — both payments to the winner and settlements between losers.

### State Management
- Use React Context or `useReducer` for global game state.
- Save state to localStorage after every hand.
- On app load, restore state from localStorage if available.
- Locale preference is also saved to localStorage.

### PWA
- Configure `vite-plugin-pwa` with `registerType: 'autoUpdate'`.
- Provide app icons (192×192 and 512×512).
- Set `display: 'standalone'` in manifest.

### File Organization
```
src/
  components/
    SetupScreen.tsx        # Player names, East selection
    SetupScreen.module.css
    GameScreen.tsx         # Main screen: input scores, mark winner
    GameScreen.module.css
    HandResult.tsx         # Settlement breakdown after calculation
    HandResult.module.css
    HistoryScreen.tsx      # List of past hands, undo button
    HistoryScreen.module.css
    ResultsScreen.tsx      # Final standings and debts
    ResultsScreen.module.css
    LanguageSwitcher.tsx   # Language toggle
    LanguageSwitcher.module.css
  context/
    GameContext.tsx         # React context + provider (useGameState, useGameDispatch)
  logic/
    calculate.ts           # Settlement calculation algorithm
    gameState.ts           # Reducer + actions (START_GAME, PLAY_HAND, DRAW, UNDO_LAST, NEW_GAME, RESTORE)
    storage.ts             # localStorage save/load/clear
  locales/
    ru.json
    en.json
  types/
    index.ts               # Player, WindRound, Transfer, Round, GameState interfaces
  App.tsx
  main.tsx
  i18n.ts                  # i18next configuration
  index.css                # Global styles, reset, header, animations
```

## Implementation Status

All steps completed:

1. **Project init** — Vite 8 + React 19 + TypeScript 5.9 + i18next setup.
2. **Types** — all interfaces defined in `src/types/index.ts`.
3. **Calculation logic** — `src/logic/calculate.ts`, verified against SPEC section 9.
4. **State management** — useReducer + React Context (`src/context/GameContext.tsx`) + localStorage persistence.
5. **SetupScreen** — player names, East selection (東 button), start game.
6. **GameScreen** — score input, winner selection, draw button, calculate.
7. **HandResult** — transfers list, balance changes, continue button.
8. **HistoryScreen** — list of hands with details, undo last hand.
9. **ResultsScreen** — final standings with medals, debt summary, new game.
10. **PWA config** — vite-plugin-pwa, manifest, service worker, icons (192/512).
11. **Polish** — global CSS reset, sticky header, animations, safe-area insets, mobile touch feedback.

## Testing the Calculation

Use this scenario to verify (from SPEC section 9):

- Players: Alice, Bob, Vika, Gleb
- East: Alice (index 0)
- Winner: Bob (index 1), score 30
- Scores: Alice=22, Bob=30, Vika=10, Gleb=4

Expected payments:
- Alice → Bob: 60 (30×2, Alice is East)
- Vika → Bob: 30
- Gleb → Bob: 30
- Gleb → Vika: 6
- Vika → Alice: 24 (12×2, Alice is East)
- Gleb → Alice: 36 (18×2, Alice is East)

Expected balance changes:
- Alice: 0 (−60 +24 +36)
- Bob: +120 (+60 +30 +30)
- Vika: −48 (−30 +6 −24)
- Gleb: −72 (−30 −6 −36)
