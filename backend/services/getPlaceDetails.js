import { getJson } from "serpapi";

// ⚠️ UNVERIFIED FIELD NAMES: SerpApi's Google Maps "place details" response
// (queried via data_id) commonly includes `photos` and `website`, but I
// haven't been able to test this live. Before trusting this in your demo:
//   1. Run one real call and console.log(JSON.stringify(result, null, 2))
//   2. Confirm the actual field names/paths match what's used below
//   3. Adjust the destructuring if they don't
//
// Costs one extra SerpApi credit per investigation — factor that into your
// budget (you're already using up to 3 per investigation elsewhere).
export async function getPlaceDetails(dataId) {
  if (!dataId) return null;

  try {
    const result = await getJson({
      engine: "google_maps",
      data_id: dataId,
      api_key: process.env.SERPAPI_KEY,
    });

    const place = result.place_results || result;

    const photos = (place.photos || place.images || [])
      .slice(0, 8)
      .map((p) => p.thumbnail || p.image || p.link || p)
      .filter((p) => typeof p === "string");

    return {
      website: place.website ?? null,
      photos,
    };
  } catch (error) {
    console.error("getPlaceDetails failed:", error.message);
    return null; // degrade gracefully — no photos/website is fine, a crash isn't
  }
}