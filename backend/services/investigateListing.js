import { createInvestigationPlan } from "./investigationPlanner.js";
import { runInvestigationSearches } from "./runInvestigationSearches.js";
import { formatSearchResults } from "./formatSearchResults.js";
import { synthesizeTrustVerdict } from "./synthesizeTrustVerdict.js";
import { getNeighborhoodSnapshot } from "./getNeighborhoodSnapshot.js";

export async function investigateListing(listing) {
  const plan = createInvestigationPlan(listing);

  const searchResults = await runInvestigationSearches(plan);

  const formattedResults = formatSearchResults(searchResults);
  const neighborhood = await getNeighborhoodSnapshot(listing);

  const verdict = await synthesizeTrustVerdict(listing, {
    searchResults: formattedResults,
    neighborhood,
  });

  return {
    listing,
    verdict,
    evidence: formattedResults,
    neighborhood,
  };
}
