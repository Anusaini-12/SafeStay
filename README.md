# SafeStay

Find a PG or room, and let an AI agent investigate it — address verification,
public complaint/fraud search, and neighborhood context — before you commit.

Built for the SerpApi India Hackathon 2026 (AI Agents track).

## How it works

1. Search for PGs/rooms by city, area, budget, and category (Girls/Boys/
   Co-ed/Couple/Any PG) — pulled live from SerpApi's Google Maps engine.
2. Pick any listing and click "Investigate" — an agent extracts key
   details, runs targeted Google Search + Google News queries for
   complaints or fraud reports, checks nearby essentials via Maps, and
   uses Gemini to synthesize a trust verdict (Verified / Caution / Red
   Flag / Not enough data) — citing the actual evidence found.
3. First 3 searches are free (tracked locally); after that, sign up via
   Firebase Auth to keep going.

## Project structure

```
safestay/
├── backend/     Node/Express API — SerpApi + Gemini integration
└── frontend/    React (Vite) + Tailwind + Firebase Auth
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# fill in SERPAPI_KEY and GEMINI_API_KEY in .env
npm run dev
```

Runs on `http://localhost:3001`.

- Get a SerpApi key at https://serpapi.com
- Get a Gemini API key at https://aistudio.google.com
- The Gemini model used is `gemini-2.5-flash` (stable, free-tier friendly)

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# fill in your Firebase config + VITE_API_BASE_URL in .env
npm run dev
```

Runs on `http://localhost:5173` (Vite's default).

- Create a free Firebase project at https://console.firebase.google.com
- Enable Email/Password sign-in under Authentication
- Copy your web app's config values into `.env`

## Notes on known limitations

- **Budget filtering**: SerpApi's Google Maps engine doesn't support a real
  numeric price filter, and PG-type listings often don't carry price data
  at all. The budget field is currently passed into the search query text
  as a soft hint, not a hard filter — check `findListings.js` before
  relying on it for a demo.
- **"Not enough data" verdicts**: this is often the honest, correct
  outcome for small listings with no public online footprint — not a bug.
- **Credit usage**: each investigation runs up to 3 SerpApi searches (2
  fraud-signal searches + 1 neighborhood search). Budget your free-tier
  250 monthly credits accordingly during testing.

## Tech stack

- **Frontend**: React, Vite, Tailwind CSS, Firebase Auth, lucide-react
- **Backend**: Node.js, Express
- **Data**: SerpApi (Google Maps, Google Search, Google News engines)
- **AI reasoning**: Google Gemini (`gemini-2.5-flash`)
