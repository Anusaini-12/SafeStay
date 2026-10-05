import { getJson } from "serpapi";

const SERPAPI_TIMEOUT = 15000;

function getSerpApiKey() {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error("SERPAPI_KEY is not configured");
  }

  return apiKey;
}

async function runSerpApiRequest(engine, params, localization = {}) {
  const apiKey = getSerpApiKey();

  try {
    return await getJson({
      engine,
      ...localization,
      ...params,
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
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("SerpApi query must be a non-empty string");
  }

  return runSerpApiRequest(
    "google_maps",
    { q: query.trim() },
    { hl: "en", gl: "in" }
  );
}

export async function searchGoogle(query) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("SerpApi query must be a non-empty string");
  }

  return runSerpApiRequest(
    "google",
    { q: query.trim() },
    { hl: "en", gl: "in" }
  );
}

export async function searchGoogleNews(query) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("SerpApi query must be a non-empty string");
  }

  return runSerpApiRequest(
    "google_news",
    { q: query.trim() },
    { hl: "en", gl: "in" }
  );
}

export async function getGoogleMapsPlaceDetails(placeId) {
  if (!placeId) {
    return null;
  }

  return runSerpApiRequest(
    "google_maps",
    { place_id: placeId },
    { hl: "en", gl: "in" }
  );
}

export async function getGoogleMapsReviews(dataId, placeId) {
  const placeIdentifier = dataId
    ? { data_id: dataId }
    : placeId
      ? { place_id: placeId }
      : null;

  if (!placeIdentifier) {
    return null;
  }

  return runSerpApiRequest(
    "google_maps_reviews",
    placeIdentifier,
    { hl: "en" }
  );
}