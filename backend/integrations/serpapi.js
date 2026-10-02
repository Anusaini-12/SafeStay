import { getJson } from "serpapi";

const SERPAPI_TIMEOUT = 15000;

function getSerpApiKey() {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error("SERPAPI_KEY is not configured");
  }

  return apiKey;
}

async function runSerpApiSearch(engine, query) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("SerpApi query must be a non-empty string");
  }

  const apiKey = getSerpApiKey();

  try {
    return await getJson({
      engine,
      q: query.trim(),
      hl: "en",
      gl: "in",
      api_key: apiKey,
      timeout: SERPAPI_TIMEOUT,
    });
  } catch (error) {
    console.error(
      `SerpApi ${engine} search failed:`,
      error.message
    );

    throw error;
  }
}

export async function searchGoogleMaps(query) {
  return runSerpApiSearch("google_maps", query);
}

export async function searchGoogle(query) {
  return runSerpApiSearch("google", query);
}

export async function searchGoogleNews(query) {
  return runSerpApiSearch("google_news", query);
}