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
    const rawListings = results.local_results || [];
    const listings = rawListings.map(normalizeListing);

    const cityLower = city.trim().toLowerCase();
    const matchingCity = listings.filter((l) =>
      l.address?.toLowerCase().includes(cityLower)
    );

    // If at least some results genuinely match the city, prefer those
    // first but don't hide the rest — just flag the mismatch honestly.
    const cityMismatch = matchingCity.length === 0 && listings.length > 0;
    const orderedListings = matchingCity.length > 0
      ? [...matchingCity, ...listings.filter((l) => !matchingCity.includes(l))]
      : listings;

    return { listings: orderedListings, cityMismatch };
  } catch (error) {
    console.error("findListings failed:", error.message);

    return { listings: [], cityMismatch: false };
  }
}