import { createInvestigationPlan } from "./investigationPlanner.js";
import { runInvestigationSearches } from "./runInvestigationSearches.js";
import { formatSearchResults } from "./formatSearchResults.js";
import { synthesizeTrustVerdict } from "./synthesizeTrustVerdict.js";
import { getNeighborhoodSnapshot } from "./getNeighborhoodSnapshot.js";
import { getPlaceDetails } from "./getPlaceDetails.js";
import { getReviews } from "./GetReviews.js";

export async function investigateListing(listing) {
  const plan = createInvestigationPlan(listing);

  const [searchResults, neighborhood, placeDetails, reviews] = await Promise.all([
    runInvestigationSearches(plan),
    getNeighborhoodSnapshot(listing),
    getPlaceDetails(listing.dataId),
    getReviews(listing.dataId),
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
    reviews,
  };
}