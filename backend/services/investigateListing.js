import { createInvestigationPlan } from "./investigationPlanner.js";
import { runInvestigationSearches } from "./runInvestigationSearches.js";
import { formatSearchResults } from "./formatSearchResults.js";
import { synthesizeTrustVerdict } from "./synthesizeTrustVerdict.js";
import { getNeighborhoodSnapshot } from "./getNeighborhoodSnapshot.js";
import { getPlaceDetails } from "./getPlaceDetails.js";

export async function investigateListing(listing) {
  const plan = createInvestigationPlan(listing);

  try {
    const [
      searchResults,
      neighborhood,
      placeDetails,
    ] = await Promise.all([
      runInvestigationSearches(plan),
      getNeighborhoodSnapshot(listing),
      getPlaceDetails(listing.dataId),
    ]);

    const formattedResults = formatSearchResults(searchResults);

    const verdict = await synthesizeTrustVerdict(listing, {
      searchResults: formattedResults,
      neighborhood,
    });

    const enrichedListing = {
      ...listing,
      ...(placeDetails || {}),
    };

    return {
      listing: enrichedListing,
      verdict,
      evidence: formattedResults,
      neighborhood,
      reviews: [],
    };
  } catch (error) {
    console.error(
      "investigateListing failed:",
      error.message
    );

    throw error;
  }
}