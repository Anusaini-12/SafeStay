import { getGoogleMapsPlaceDetails } from "../integrations/serpapi.js";
import { normalizeListing } from "./normalizeListing.js";

export async function getPlaceDetails(placeId) {
  if (!placeId) {
    throw new Error("Google Maps did not provide a place_id for this listing");
  }

  const response = await getGoogleMapsPlaceDetails(placeId);
  const place = response?.place_results;

  if (!place) {
    throw new Error("SerpApi returned no Google Maps place details");
  }

  return normalizeListing(place);
}