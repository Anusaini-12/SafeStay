import { getGoogleMapsReviews } from "../integrations/serpapi.js";

export async function getReviews(dataId, placeId, limit = 4) {
  const result = await getGoogleMapsReviews(dataId, placeId);

  if (!result) {
    throw new Error(
      "Google Maps did not provide a data_id or place_id for reviews"
    );
  }

  return (result.reviews || []).slice(0, limit).map((review) => ({
    author: review.user?.name ?? "Anonymous",
    rating: review.rating ?? null,
    date: review.iso_date ?? review.date ?? null,
    snippet:
      review.snippet ??
      review.extracted_snippet?.original ??
      "",
  }));
}
