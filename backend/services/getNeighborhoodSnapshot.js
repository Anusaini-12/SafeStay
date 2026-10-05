import { searchGoogleMaps } from "../integrations/serpapi.js";

export async function getNeighborhoodSnapshot(listing) {
  const query = [
    "hospital police station grocery store",
    "near",
    listing.address,
  ].join(" ");

  console.log("Neighborhood query:", query);

  try {
    const results = await searchGoogleMaps(query);
    const places = results.local_results || [];

    return places.slice(0, 5).map((place) => ({
      name: place.title,
      address: place.address,
      type: place.type ?? null,
      rating: place.rating ?? null,
      reviewCount: place.reviews ?? 0,
      coordinates: place.gps_coordinates ?? null,
    }));
  } catch (error) {
    console.error("getNeighborhoodSnapshot failed:", error.message);
    throw error;
  }
}
