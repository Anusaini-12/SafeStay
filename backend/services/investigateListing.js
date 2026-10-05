import { createInvestigationPlan } from "./investigationPlanner.js";
import { runInvestigationSearches } from "./runInvestigationSearches.js";
import { formatSearchResults } from "./formatSearchResults.js";
import { synthesizeTrustVerdict } from "./synthesizeTrustVerdict.js";
import { getNeighborhoodSnapshot } from "./getNeighborhoodSnapshot.js";
import { getPlaceDetails } from "./getPlaceDetails.js";
import { getReviews } from "./getReviews.js";

export async function investigateListing(listing) {
  const plan = createInvestigationPlan(listing);

  try {
    const [
      searchResults,
      neighborhood,
      placeDetailsResult,
      reviewsResult,
    ] = await Promise.allSettled([
      runInvestigationSearches(plan),
      getNeighborhoodSnapshot(listing),
      getPlaceDetails(listing.placeId),
      getReviews(listing.dataId, listing.placeId),
    ]);

    const sourceErrors = [];
    const settledValue = (result, source, fallback) => {
      if (result.status === "fulfilled") return result.value;

      console.error(`${source} lookup failed:`, result.reason.message);
      sourceErrors.push(source);
      return fallback;
    };

    const rawSearchResults = settledValue(
      searchResults,
      "Search",
      []
    );
    const formattedResults = formatSearchResults(rawSearchResults);
    const nearbyPlaces = settledValue(
      neighborhood,
      "Neighborhood",
      []
    );
    const placeDetails = settledValue(
      placeDetailsResult,
      "Google Maps place details",
      null
    );
    const reviews = settledValue(reviewsResult, "Google reviews", []);

    const verdict = await synthesizeTrustVerdict(listing, {
      searchResults: formattedResults,
      neighborhood: nearbyPlaces,
      reviews,
      sourceErrors,
    });

    const detailFields = Object.fromEntries(
      Object.entries(placeDetails || {}).filter(
        ([key, value]) =>
          !["id", "placeId", "dataId"].includes(key) &&
          value !== null &&
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const enrichedListing = {
      ...listing,
      ...detailFields,
      id: placeDetails?.placeId ?? listing.placeId ?? listing.id,
      placeId: placeDetails?.placeId ?? listing.placeId ?? null,
      dataId: placeDetails?.dataId ?? listing.dataId ?? null,
    };

    return {
      listing: enrichedListing,
      verdict,
      evidence: formattedResults,
      neighborhood: nearbyPlaces,
      reviews,
      sourceErrors,
    };
  } catch (error) {
    console.error(
      "investigateListing failed:",
      error.message
    );

    throw error;
  }
}