import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_VERDICT = {
  verdict: "Assessment unavailable",
  confidence: "low",

  summary:
    "We couldn't finish checking this listing just now. Try investigating it again in a moment.",

  evidence: [],

  warnings: [],

  reportedDetails: {
    rent: null,
    food: null,
    roomType: null,
    facilities: [],
  },
};

// Lighter, higher-availability model first so the limited free-tier quota
// of gemini-3.8-flash is not spent on every request.
const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
];

const ATTEMPTS_PER_MODEL = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function synthesizeTrustVerdict(listing, investigationData) {
  // Initialize Gemini here so dotenv has already loaded the API key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `
You are analyzing a PG/room listing for a rental discovery application.

Your job is to assess the evidence provided by our investigation tools, AND
separately extract any concrete rental details (rent, food, room type,
facilities) that happen to be mentioned in that evidence.

LISTING:
${JSON.stringify(listing, null, 2)}

INVESTIGATION DATA:
${JSON.stringify(investigationData, null, 2)}

IMPORTANT RULES:

1. Use ONLY information explicitly present in the LISTING or INVESTIGATION DATA.
2. Never invent facts, sources, reviews, complaints, searches, or findings.
3. Do not claim that any source confirmed something unless that information is explicitly present in the provided data.
4. A search returning no relevant results does NOT prove that the listing is safe.
5. Missing information is NOT negative evidence.
6. A high rating or many reviews does NOT prove that a listing is trustworthy.
7. Do not call the listing officially "verified" or guaranteed safe.
8. Use "Verified" only when multiple independent sources provide consistent positive information about the listing itself.
9. Do not use "Verified" merely because no complaints were found.
10. Use "Caution" when the listing has some supporting evidence but important details are inconsistent, unclear, or cannot be confirmed.
11. Use "Red Flag" only when the provided evidence contains clear and significant warning signs.
12. Nearby places are only neighborhood context. Their presence does NOT prove that the PG itself is trustworthy.
13. Every item in "evidence" and "warnings" must be directly supported by the provided data.
14. Do not mention information that is not present in the provided data.
15. If external investigation results are empty and only listing metadata or neighborhood information is available, use "Not enough data".
16. For "reportedDetails": only fill a field if it is explicitly mentioned in the provided search result titles/snippets. Do not guess or estimate.
17. Write "summary", "evidence", and "warnings" in simple everyday language.

Return ONLY valid JSON. Do not use markdown code fences.

Use exactly this structure:

{
  "verdict": "Verified | Caution | Red Flag | Not enough data",
  "confidence": "low | medium | high",
  "summary": "short explanation based only on the provided evidence",
  "evidence": [
    "specific evidence directly supported by the provided data"
  ],
  "warnings": [
    "specific concern directly supported by the provided data"
  ],
  "reportedDetails": {
    "rent": "exact rent as mentioned in a source, or null",
    "food": "food/meal arrangement as mentioned in a source, or null",
    "roomType": "room/sharing type as mentioned in a source, or null",
    "facilities": ["facility as mentioned in a source"]
  }
}
`;

  let result;

  outer: for (const modelName of MODELS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: "application/json" },
    });

    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      try {
        result = await model.generateContent(prompt);
        console.log(`Gemini success with ${modelName}`);
        break outer;
      } catch (error) {
        console.error(
          `${modelName} attempt ${attempt} failed:`,
          error.status,
          String(error.message).slice(0, 200)
        );

        // Daily free-tier quota used up: retrying this model is pointless,
        // so move straight to the next one.
        const isDailyQuota =
          error.status === 429 &&
          /PerDay|free_tier_requests/i.test(String(error.message));

        if (isDailyQuota) {
          console.log(`Daily quota reached for ${modelName}.`);
          break;
        }

        // Retry only temporary errors (503 overloaded, other 429 rate limits).
        // Anything else (invalid key, bad request) fails immediately.
        const retryable = error.status === 503 || error.status === 429;

        if (!retryable) {
          return FALLBACK_VERDICT;
        }

        if (attempt < ATTEMPTS_PER_MODEL) {
          console.log("Temporarily unavailable. Retrying shortly...");
          await sleep(1500 * attempt);
        }
      }
    }

    console.log(`Switching away from ${modelName}...`);
  }

  if (!result) {
    return FALLBACK_VERDICT;
  }

  const text = result.response.text();

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);

    // "Not enough data" can never be high confidence
    if (parsed.verdict === "Not enough data") {
      parsed.confidence = "low";
    }

    return parsed;
  } catch (parseError) {
    console.error(
      "Failed to parse Gemini response as JSON:",
      parseError.message
    );
    console.error("Raw response was:", cleanedText);
    return FALLBACK_VERDICT;
  }
}