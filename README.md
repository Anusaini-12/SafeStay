# SafeStay

Find a PG or room, and let an agent investigate it — address verification,
public complaint/fraud search, neighborhood context, and real reviews —
before you commit.

Built for the SerpApi India Hackathon 2026 (AI Agents track).

## How it works

1. Search for PGs/rooms by city, area, approximate budget, and category
   (Girls PG / Boys PG / Co-ed PG / Couple-Family friendly / Any) — pulled
   live from SerpApi's Google Maps engine.
2. Pick any listing and click "Investigate" — an agent extracts key
   details, runs targeted Google Search + Google News queries for
   complaints or fraud reports, checks nearby essentials via Maps, pulls
   any interior photos and the listing's own website (if available), and
   synthesizes a trust verdict (Verified / Caution / Red Flag / Not enough
   data) — citing the actual evidence found, plus any rent/food/room-type/
   facilities details it happened to find mentioned in those sources.
3. Real Google reviews (up to 4) are shown as cards, linking straight to
   the listing's full reviews on Google.
4. If the search results don't clearly match the city you typed (Maps can
   be fuzzy about area vs. city), a warning banner says so instead of
   silently showing possibly-mismatched results.
5. First 3 searches are free (tracked locally); after that, sign up via
   Firebase Auth to keep going.
6. Light/dark theme toggle, persisted across visits.

## Project structure

```
safestay/
├── backend/     Node/Express API — SerpApi + Gemini integration
│   └── services/
│       ├── findListings.js          location search + city-match check
│       ├── normalizeListing.js      shapes raw Maps results
│       ├── investigationPlanner.js  builds fraud-check search queries
│       ├── runInvestigationSearches.js
│       ├── formatSearchResults.js
│       ├── getNeighborhoodSnapshot.js
│       ├── getPlaceDetails.js       photos + website (needs a data_id)
│       ├── getReviews.js            up to 4 real Google reviews
│       ├── synthesizeTrustVerdict.js  Gemini verdict + rent/facilities extraction
│       └── investigateListing.js    orchestrates all of the above
└── frontend/    React (Vite) + Tailwind + Firebase Auth
    └── src/components/
        ├── LandingPage.jsx, SearchForm.jsx, ListingCard.jsx
        ├── ListingDetails.jsx       verdict, evidence, reviews, rent/facilities
        ├── AuthScreen.jsx           login + signup
        └── ThemeToggle.jsx          light/dark switch
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

Runs on `http://localhost:5000`.

- Get a SerpApi key at https://serpapi.com
- Get a Gemini API key at https://aistudio.google.com
- The Gemini model used is `gemini-3.8-flash` (stable, free-tier friendly)
- If investigations keep falling back to "we couldn't finish checking this
  listing," check this server's console for `Gemini attempt X failed:` —
  that means the API call itself is failing (bad/missing key, region
  restriction), not a data problem.

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
- `darkMode: "class"` must be set in `tailwind.config.js` for the theme
  toggle to work — if you change that file, fully restart the dev server
  (hot-reload doesn't always pick up config changes).

## Notes on known limitations

- **Budget field**: this is a search hint, not a hard filter — SerpApi's
  Maps engine doesn't support real numeric price filtering, and most PG
  listings don't carry structured price data at all. The UI is labeled
  "approximate" for this reason.
- **Rent/food/room-type/facilities**: only populated when a search result
  snippet happens to mention them explicitly — genuinely absent for most
  small listings. The UI shows an honest empty state rather than a guess.
- **Photos/website (`getPlaceDetails.js`) and reviews (`getReviews.js`)**:
  both rely on SerpApi field names (`photos`, `website`, `reviews`) that
  haven't been verified against a live response. Before relying on these
  for a demo, uncomment the sample-response logging mentioned in each
  file and confirm the actual shape matches.
- **City-mismatch warning**: checks whether a listing's address contains
  the city you typed; this is a simple substring check, not a geocoding
  verification, so it can still be wrong in either direction occasionally.
- **"Not enough data" verdicts**: often the honest, correct outcome for a
  small listing with no public online footprint — not a bug.
- **Credit usage**: each investigation now makes up to 5 SerpApi calls (2
  fraud-signal searches + 1 neighborhood search + 1 place-details call +
  1 reviews call). That's roughly 50 full investigations on the 250/month
  free tier — budget your testing accordingly, especially since this is
  shared with the AI shopping agent capstone project on the same account.

## Tech stack

- **Frontend**: React, Vite, Tailwind CSS (light/dark via `class` strategy),
  Firebase Auth, lucide-react
- **Backend**: Node.js, Express
- **Data**: SerpApi (Google Maps, Google Search, Google News, Google Maps
  Reviews engines)
- **AI reasoning**: Google Gemini (`gemini-3.8-flash`) — used internally
  only; not named anywhere in user-facing copy