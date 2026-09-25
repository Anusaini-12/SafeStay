import { searchGoogle, searchGoogleNews } from "../integrations/serpapi.js";

const MAX_SEARCHES = 2;

export async function runInvestigationSearches(plan) {
  const results = [];

  for (const search of plan.searches.slice(0, MAX_SEARCHES)) {
    let data = null;

    try {
      if (search.type === "google") {
        data = await searchGoogle(search.query);
      }
      if (search.type === "news") {
        data = await searchGoogleNews(search.query);
      }
    } catch (error) {
      // FIX: don't let one failed search (rate limit, timeout) take down
      // the whole investigation — log it and continue with what we have.
      console.error(`Search failed for "${search.query}":`, error.message);
      data = { error: true };
    }

    results.push({
      type: search.type,
      purpose: search.purpose,
      query: search.query,
      data: data || {},
    });
  }

  return results;
}
