# Mahjong Score Tracker

**🌐 Live app: [https://sergeevalera.github.io/mahjong-score-tracker/](https://sergeevalera.github.io/mahjong-score-tracker/)**

### Install on your phone

**Android (Chrome):** open the link → menu (⋮) → "Add to Home Screen"

**iOS (Safari):** open the link → Share button → "Add to Home Screen"

After installing, the app launches full-screen without a browser bar and works offline.

---

A Progressive Web App for tracking scores and settlements in classic Mahjong (4 players). Enter hand values, mark the winner, and the app calculates all payments between players automatically, including the East wind double rule.

Built with React and TypeScript.

### 🌍 Contributing translations

The app currently supports English and Russian. PRs adding new languages are very welcome — just add a `src/locales/<lang>.json` file (use `en.json` as a template) and register it in `src/i18n.ts`.

## Features

- Full settlement calculation with East wind ×2 multiplier
- 4-round (16-hand) game tracking
- Automatic East wind rotation
- Draw handling
- Hand history with undo
- Works offline (PWA)
- Russian and English interface

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

### Build for Production

```bash
npm run build
npm run preview
```

### Install as PWA

Open the app in a mobile browser and tap "Add to Home Screen" — it works like a native app on both Android and iOS.

## Project Structure

```
mahjong-score-tracker/
├── docs/
│   └── SPEC.md              # Full specification (in Russian)
├── src/
│   ├── components/          # React components
│   ├── locales/             # i18n translation files
│   │   ├── ru.json
│   │   └── en.json
│   ├── logic/               # Game logic (calculation, state)
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── manifest.json        # PWA manifest
├── CLAUDE.md
├── README.md
├── package.json
└── tsconfig.json
```

## License

GPL-3.0 — see [LICENSE](LICENSE) for details.
