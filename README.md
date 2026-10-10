# FarmShield

FarmShield is an agriculture technology platform frontend: crop guidance, weather
analysis, market prices, a farmer diary and an AI farm assistant — in one clean,
farmer-friendly interface (English / తెలుగు).

This repository contains the **frontend only** (my responsibility). The backend
(APIs, database, AI processing) is developed separately and is **not** included
here — see `API_CONTRACT.md` for the integration map.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # ESLint
npm test           # Vitest unit tests
```

## Configuration

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the FarmShield backend. **Leave empty for demo mode.** |
| `VITE_API_PROXY_TARGET` | Optional: proxy `/api` during `npm run dev` to a local backend (avoids CORS). |

These variables are **public** (shipped to the browser). Never put secrets —
database strings, AI/weather provider keys, private credentials — in frontend
env vars or source code.

## Demo mode

When `VITE_API_BASE_URL` is not set, the app runs in **clearly labelled demo
mode**: all weather, prices, diary entries and AI answers come from
`src/data/demoData.js` (sample data for layout testing) and every data surface
shows a `DEMO` badge. Demo diary entries persist to the browser's
`localStorage` only. Nothing in demo mode is presented as live or verified data.

## Project structure

```
src/
  api/          Central API client, provisional endpoint map, services
                (the only place that switches API vs demo adapter)
  components/   Reusable UI (layout, home, crop, weather, market, diary, shared)
  data/         Crop catalogue (single source of truth) + demo dataset
  i18n/         English/తెలుగు translations + language context
  pages/        Route pages (Home, Crops, Crop details, Weather, Market,
                Farmer Diary, AI Assistant, 404)
public/
  images/       Crop / hero / diary photographs (see images/CREDITS.md)
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Home / Dashboard |
| `/crops` | Crop catalogue with search & category filters |
| `/crops/:cropId` | Crop details (tabs, quick facts, analysis, growth stages) |
| `/weather` | Weather analysis |
| `/market-prices` | Market prices |
| `/farmer-diary` | Farmer diary |
| `/ai-assistant` | AI farm assistant (opened via "Ask AI") |

## Backend integration

The backend is developed separately. Frontend capabilities and their expected
operations are documented in `API_CONTRACT.md`. **No endpoint in that document
is verified yet** — the endpoint map (`src/api/endpoints.js`) is provisional and
must be updated from the real OpenAPI spec when it is available. UI components
never hard-code URLs or assume unverified response fields.

## Language support

The header language selector switches the complete interface between English
and తెలుగు (persisted in `localStorage`). Farmer-entered text (diary notes,
questions) is preserved as entered. Telugu rendering uses a Telugu-capable font
fallback stack.

## Images

Crop photographs live in `public/images/crops/` and are configured in
`src/data/crops.js`. Credits and replacement notes: `public/images/CREDITS.md`.
Broken image paths degrade to a labelled placeholder and never break the layout.
