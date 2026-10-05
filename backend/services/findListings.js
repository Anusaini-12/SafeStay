import { searchGoogleMaps } from "../integrations/serpapi.js";
import { normalizeListing } from "./normalizeListing.js";

const GENDER_QUERY_TERMS = {
  female: "for girls",
  male: "for boys",
  coed: "co-ed",
  couple: "couple friendly",
  "": "",
};

const GENDER_KEYWORDS = {
  female: {
    include: ["girl", "ladies", "women"],
    exclude: ["boy", "gents", "men's"],
  },
  male: {
    include: ["boy", "gents", "men"],
    exclude: ["girl", "ladies", "women"],
  },
  coed: {
    include: ["co-ed", "coed", "unisex"],
    exclude: [],
  },
};

function filterByGender(listings, genderValue) {
  const rule = GENDER_KEYWORDS[genderValue];

  if (!rule) return listings;

  return listings.filter((listing) => {
    const name = (listing.name || "").toLowerCase();

    const hasExcludedKeyword = rule.exclude.some((kw) =>
      name.includes(kw)
    );

    return !hasExcludedKeyword;
  });
}

const CITY_ALIASES = {
  bangalore: ["bengaluru", "banglore", "bangaluru"],
  bengaluru: ["bangalore", "banglore", "bangaluru"],
  mumbai: ["bombay"],
  bombay: ["mumbai"],
  kolkata: ["calcutta"],
  calcutta: ["kolkata"],
  chennai: ["madras"],
  madras: ["chennai"],
  pune: ["poona"],
  poona: ["pune"],
  gurugram: ["gurgaon"],
  gurgaon: ["gurugram"],
};

function levenshtein(a, b) {
  const dp = Array.from(
    { length: a.length + 1 },
    (_, i) => [i, ...Array(b.length).fill(0)]
  );

  for (let j = 0; j <= b.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    dp[i][0] = i;

    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 +
            Math.min(
              dp[i - 1][j - 1],
              dp[i - 1][j],
              dp[i][j - 1]
            );
    }
  }

  return dp[a.length][b.length];
}

function cityMatches(userCity, address) {
  if (!address) return false;

  const cityClean = userCity.trim().toLowerCase();

  const aliases = [
    cityClean,
    ...(CITY_ALIASES[cityClean] || []),
  ];

  const segments = address
    .toLowerCase()
    .split(",")
    .map((s) => s.trim());

  return segments.some((segment) =>
    aliases.some((alias) => {
      if (segment.includes(alias)) return true;

      const words = segment.split(/\s+/);

      return words.some(
        (word) => levenshtein(word, alias) <= 2
      );
    })
  );
}

export async function findListings(city, area, preferences = {}) {
  const genderTerm =
    GENDER_QUERY_TERMS[preferences.gender] ?? "";

  const budget =
    Number.isFinite(Number(preferences.budget)) &&
    Number(preferences.budget) > 0
      ? Number(preferences.budget)
      : "";

  const query = [
    "PG",
    genderTerm,
    "near",
    area,
    city,
    budget ? `under ${budget}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  console.log("Maps query:", query);

  try {
    const results = await searchGoogleMaps(query);

    const rawListings = results.local_results || [];
    const normalizedListings =
      rawListings.map(normalizeListing);

    const listings = filterByGender(
      normalizedListings,
      preferences.gender
    );

    const matchingCity = listings.filter((listing) =>
      cityMatches(city, listing.address)
    );

    const cityMismatch =
      matchingCity.length === 0 && listings.length > 0;

    const orderedListings =
      matchingCity.length > 0
        ? [
            ...matchingCity,
            ...listings.filter(
              (listing) => !matchingCity.includes(listing)
            ),
          ]
        : listings;

    return {
      listings: orderedListings,
      cityMismatch,
    };
  } catch (error) {
    console.error(
      "findListings failed:",
      error.message
    );
    throw error;
  }
}
