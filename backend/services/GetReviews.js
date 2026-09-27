import { getJson } from "serpapi";

// ⚠️ UNVERIFIED FIELD NAMES — same caveat as getPlaceDetails.js. SerpApi's
// google_maps_reviews engine commonly returns a `reviews` array with
// fields like user.name, user.link, rating, snippet, date — but confirm
// with a real console.log before trusting this shape.
//
// COST: this is ANOTHER SerpApi credit per investigation, on top of the
// 2 fraud searches + 1 neighborhood + 1 place-details call you're already
// making. That's up to 5 credits per investigation now — budget
// accordingly against your 250/month free tier (roughly 50 investigations
// before you'd exhaust it). Consider whether reviews are worth that cost
// for your demo, or whether to skip this call for most listings and only
// fetch it for the one you plan to demo live.
export async function getReviews(dataId, limit = 4) {
  if (!dataId) return [];

  try {
    const result = await getJson({
      engine: "google_maps_reviews",
      data_id: dataId,
      api_key: process.env.SERPAPI_KEY,
    });

    const rawReviews = result.reviews || [];

    return rawReviews.slice(0, limit).map((r) => ({
      author: r.user?.name ?? "Anonymous",
      rating: r.rating ?? null,
      date: r.date ?? null,
      snippet: r.snippet ?? r.extracted_snippet?.original ?? "",
    }));
  } catch (error) {
    console.error("getReviews failed:", error.message);
    return []; // degrade gracefully — no reviews shown is fine, a crash isn't
  }
}