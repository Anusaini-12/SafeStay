# SafeStay

Find a PG or room, and let an agent investigate it — address verification,
public complaint/fraud search, neighborhood context, and real reviews —
before you commit.

Built for the SerpApi India Hackathon 2026 (AI Agents track).

## How it works

1. Search for PGs/rooms by city, area, approximate budget, and category
   (Girls PG / Boys PG / Co-ed PG / Couple-Family friendly / Any) — pulled
   from SerpApi's Google Maps engine. The API preserves the fields Google
   provides (including address, Google place/data IDs, rating, review count,
   phone, website, coordinates, and available thumbnails/photos); unavailable
   fields remain empty rather than being estimated.
2. Pick any listing and click "Investigate" — an agent extracts key
   details, runs targeted Google Search + Google News queries for
   complaints or fraud reports, checks nearby essentials via Maps, fetches
   additional place details and real Google reviews when Google returns an
   identifier, and synthesizes a trust verdict (Verified / Caution / Red Flag /
   Not enough data). Verdict and confidence are separate; unavailable data
   lowers confidence but is not treated as evidence against a listing.
3. Real Google reviews (up to 4) are shown as cards, linking straight to
   the listing's full reviews on Google. Review text and ratings are also
   included as evidence for the assessment.
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
│       ├── getPlaceDetails.js       photos + website (needs a Google place_id)
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

Runs on `http://localhost:5000` by default. Set `PORT` in `backend/.env`
to override it; keep `VITE_API_BASE_URL` in `frontend/.env` pointed at the
same port.

Run the backend's offline normalization and verdict-rule tests with
`npm test` from `backend/`. These tests do not call SerpApi or Gemini.

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
- **Photos and website**: Maps search results include only fields made
  available by Google for each place. Investigating a listing makes one
  additional place-details request to fetch any further available images,
  website, and listing metadata. Google may omit any of these.
- **Reviews**: up to four reviews are fetched from SerpApi's Google Maps
  Reviews engine using the listing's `data_id` or Google `place_id`. Missing
  identifiers, private/limited listings, API failures, and listings with no
  returned reviews can result in an empty review section; the UI distinguishes
  a request failure from a successful response with no reviews.
- **Verdicts**: positive and negative signals must be listing-specific.
  "Verified" is an evidence-based assessment label, not an official check or
  guarantee. Missing fields and failed source requests reduce confidence but
  are not negative evidence. Always verify important claims directly.
- **City-mismatch warning**: checks whether a listing's address contains
  the city you typed; this is a simple substring check, not a geocoding
  verification, so it can still be wrong in either direction occasionally.
- **"Not enough data" verdicts**: often the honest, correct outcome for a
  small listing with no public online footprint — not a bug.
- **Credit usage**: each investigation makes up to 5 SerpApi calls (2
  fraud-signal searches + 1 neighborhood search + 1 place-details call +
  1 reviews call; place-details/reviews are skipped if the listing has no
  identifier). That's roughly 50 full investigations on the 250/month free
  tier — budget testing accordingly, especially since this is shared with the
  AI shopping agent capstone project on the same account.

## Tech stack

- **Frontend**: React, Vite, Tailwind CSS (light/dark via `class` strategy),
  Firebase Auth, lucide-react
- **Backend**: Node.js, Express
- **Data**: SerpApi (Google Maps, Google Search, Google News, Google Maps
  Reviews engines)
- **AI reasoning**: Google Gemini (`gemini-3.8-flash`) — used internally
  only; not named anywhere in user-facing copy