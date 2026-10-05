import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_VERDICT = {
  verdict: "Assessment unavailable",
  confidence: "low",

  summary:
    "We couldn't finish checking this listing just now. Try investigating it again in a moment.",

  reasoning:
    "An assessment could not be generated because the analysis service was unavailable.",

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

const VALID_VERDICTS = new Set([
  "Verified",
  "Caution",
  "Red Flag",
  "Not enough data",
]);

const VALID_CONFIDENCE = new Set(["low", "medium", "high"]);

function stringsOnly(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
}

export function normalizeAssessment(parsed, investigationData) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return FALLBACK_VERDICT;
  }

  let verdict = VALID_VERDICTS.has(parsed.verdict)
    ? parsed.verdict
    : "Not enough data";
  const evidence = stringsOnly(parsed.evidence);
  const warnings = stringsOnly(parsed.warnings);

  // Negative claims must have a matching, user-visible explanation.
  if (verdict === "Red Flag" && warnings.length === 0) {
    verdict = "Caution";
  } else if (verdict === "Verified" && warnings.length > 0) {
    verdict = "Caution";
  } else if (verdict === "Verified" && evidence.length === 0) {
    verdict = "Not enough data";
  }

  let confidence = VALID_CONFIDENCE.has(parsed.confidence)
    ? parsed.confidence
    : "low";
  const failedSources = new Set(investigationData.sourceErrors || []);

  for (const source of investigationData.searchResults || []) {
    if (source.status === "failed") failedSources.add(source.type);
  }

  // Unavailable sources affect certainty, not the trust category itself.
  if (failedSources.size > 0 && confidence === "high") {
    confidence = "medium";
  }
  if (failedSources.size > 1) {
    confidence = "low";
  }
  if (verdict === "Not enough data") {
    confidence = "low";
  }

  const details = parsed.reportedDetails || {};

  return {
    verdict,
    confidence,
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary
        : "The available public information is limited.",
    reasoning:
      typeof parsed.reasoning === "string" && parsed.reasoning.trim()
        ? parsed.reasoning
        : "This category is based on the listing-specific evidence and concerns shown below.",
    evidence,
    warnings,
    reportedDetails: {
      rent:
        typeof details.rent === "string" ? details.rent : null,
      food:
        typeof details.food === "string" ? details.food : null,
      roomType:
        typeof details.roomType === "string" ? details.roomType : null,
      facilities: stringsOnly(details.facilities),
    },
  };
}

export async function synthesizeTrustVerdict(listing, investigationData) {
  // Initialize Gemini here so dotenv has already loaded the API key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `
You are analyzing a PG/room listing for a rental discovery application.

Assess the listing-specific evidence provided by the investigation tools and
separately extract concrete rental details (rent, food, room type, facilities)
when those details are explicitly stated.

LISTING:
${JSON.stringify(listing, null, 2)}

INVESTIGATION DATA:
${JSON.stringify(investigationData, null, 2)}

IMPORTANT RULES:

1. Use ONLY information explicitly present in the LISTING or INVESTIGATION DATA.

2. Never invent facts, sources, reviews, complaints, searches, or findings.

3. Do not claim that any source confirmed something unless that information is
explicitly present in the provided data.

4. A search returning no relevant results does NOT prove that the listing is
safe. A failed search is not the same as a successful search with no results.

5. Missing information, a missing website, or a missing source is NOT negative
evidence. Missing data lowers confidence only; it must not by itself produce
"Caution" or "Red Flag".

6. Use "Verified" when substantive, listing-specific positive evidence supports
the listing and there is no credible negative evidence or significant
contradiction. Examples include several substantive positive Google reviews
and/or consistent independent public coverage. A high rating or review count
alone is not enough. "Verified" is an assessment label, not an official
certification or a guarantee of safety.

7. Use "Caution" when there is a credible, specific concern, a meaningful
contradiction, or a suspicious signal that deserves follow-up but does not
meet the high bar for "Red Flag".

8. Use "Red Flag" only for clear, specific, significant negative evidence
supported by the supplied sources. Name the supporting evidence in warnings.
Do not escalate a verdict based on a generic allegation or an unsupported
search-result match.

9. Use "Not enough data" only when there is not enough substantive,
listing-specific evidence to make a meaningful assessment. It is not a
fallback merely because some details or sources are missing.

10. Keep verdict and confidence independent. Verdict describes the direction
of the evidence; confidence describes how complete and reliable that evidence
is. A positive or cautious verdict may still have low confidence.

11. Treat review text as user-generated evidence, not independently verified
fact. Mention the number and substance of relevant reviews rather than
presenting an allegation as proven.

12. Nearby places are neighborhood context only and do not establish that the
PG itself is trustworthy.

13. Every item in "evidence", "warnings", and "reasoning" must be directly
grounded in supplied data. "evidence" is positive/listing-supporting evidence;
"warnings" contains only credible negative or unresolved contradictory signals,
not missing data.

14. For "reportedDetails", only fill a field if it is explicitly stated in a
provided result or review. Do not guess or estimate.

15. Write "summary", "reasoning", "evidence", and "warnings" in simple
everyday language. In "reasoning", explain why the verdict follows from the
signals and how missing/failed sources affect confidence.

Return ONLY valid JSON. Do not use markdown code fences.

Use exactly this structure:

{
  "verdict": "Verified | Caution | Red Flag | Not enough data",
  "confidence": "low | medium | high",
  "summary": "short explanation based only on the provided evidence",
  "reasoning": "explainable reason for the verdict and confidence",
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
    return normalizeAssessment(
      JSON.parse(cleanedText),
      investigationData
    );
  } catch (parseError) {
    console.error(
      "Failed to parse Gemini response as JSON:",
      parseError.message
    );
    console.error("Raw response was:", cleanedText);
    return FALLBACK_VERDICT;
  }
}