import { getJson } from "serpapi";

export async function searchGoogleMaps(query) {
  const results = await getJson({
    engine: "google_maps",
    q: query,
    hl: "en",
    gl: "in",
    api_key: process.env.SERPAPI_KEY,
  });

  return results;
}

export async function searchGoogle(query) {
  return getJson({
    engine: "google",
    q: query,
    hl: "en",
    gl: "in",
    api_key: process.env.SERPAPI_KEY,
  });
}

export async function searchGoogleNews(query) {
  return getJson({
    engine: "google_news",
    q: query,
    hl: "en",
    gl: "in",
    api_key: process.env.SERPAPI_KEY,
  });
}
