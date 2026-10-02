import { getJson } from "serpapi";

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