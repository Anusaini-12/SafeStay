import { searchGoogleMaps } from "../integrations/serpapi.js";
import { normalizeListing } from "./normalizeListing.js";

// FIX: the frontend sends a category value ("female", "male", "coed",
// "couple", or "" for any) — this used to get pasted RAW into the query
// (e.g. "PG female near..."), which isn't how anyone actually phrases a
// search. Map it to a real search phrase instead.
const GENDER_QUERY_TERMS = {
  female: "for girls",
  male: "for boys",
  coed: "co-ed",
  couple: "couple friendly",
  "": "",
};

export async function findListings(city, area, preferences = {}) {
  const genderTerm = GENDER_QUERY_TERMS[preferences.gender] ?? "";
  const budget = preferences.budget || "";

  const query = [
    "PG",
    genderTerm,
    "near",
    area,
    city,
    budget ? `under ${budget}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  console.log("Maps query:", query);

  try {
    const results = await searchGoogleMaps(query);

    // TEMP: uncomment to check what fields SerpApi actually returns for a
    // PG listing — needed to confirm whether price data exists at all.
    // if (results.local_results?.[0]) {
    //   console.log("Sample raw listing:", JSON.stringify(results.local_results[0], null, 2));
    // }

    const listings = results.local_results || [];
    return listings.map(normalizeListing);
  } catch (error) {
    console.error("findListings failed:", error.message);
    // FIX: degrade gracefully — return an empty list instead of crashing
    // the whole /api/search-pgs request. The frontend already handles a
    // "No listings found" empty state.
    return [];
  }
}
