import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FALLBACK_VERDICT = {
  verdict: "Not enough data",
  confidence: "low",
  // FIX: no mention of "AI" or "Gemini" — this is a system status message,
  // not something the end user needs implementation detail about.
  summary:
    "We couldn't finish checking this listing just now. Try investigating it again in a moment.",
  evidence: [],
  // FIX: a system failure is NOT a trust warning about the property —
  // it was wrongly living here before, which reads as "something is
  // wrong with this PG" when it actually means "our backend hiccuped."
  warnings: [],
  reportedDetails: { rent: null, food: null, roomType: null, facilities: [] },
};

export async function synthesizeTrustVerdict(listing, investigationData) {
  const model = genAI.getGenerativeModel({
    // FIX: "gemini-3.6-flash" is not a real model name — this call was
    // failing every single time, which is why every listing fell back to
    // "Not enough data". gemini-2.5-flash is the current stable, free-tier
    // friendly choice as of now.
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are analyzing a PG/room listing for a rental discovery application.

Your job is to assess the evidence provided by our investigation tools, AND
separately extract any concrete rental details (rent, food, room type,
facilities) that happen to be mentioned in that evidence — real estate
listing pages and classifieds often mention these in passing even though
this app's own listing data doesn't structurally capture them.

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
8. Use "Verified" only when the available evidence contains enough positive/consistent information and no significant negative signals were found in the investigated sources.
9. Use "Caution" when there are meaningful concerns but the evidence does not establish a serious scam.
10. Use "Red Flag" only when the provided evidence contains clear and significant warning signs.
11. Use "Not enough data" when the available evidence is insufficient to make a meaningful assessment.
12. Nearby places are only neighborhood context. Their presence does NOT prove that the PG itself is trustworthy.
13. Every item in "evidence" and "warnings" must be directly supported by the provided data.
14. Do not mention information that is not present in the provided data.
15. If external investigation results are empty and only listing metadata or neighborhood information is available, prefer "Not enough data".
16. For "reportedDetails": only fill a field if it is EXPLICITLY mentioned somewhere in the provided search result titles/snippets — e.g. a snippet saying "PG for boys @ ₹8,000/month, WiFi, food included" would justify filling rent, food, and facilities. If nothing in the evidence mentions a field, use null (or an empty array for facilities) — do not guess or estimate typical rent/facilities for this type of listing.

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

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      result = await model.generateContent(prompt);
      break;
    } catch (error) {
      console.log(`Gemini attempt ${attempt} failed:`, error.status, error.message);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  if (!result) {
    return FALLBACK_VERDICT;
  }

  const text = result.response.text();
  const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();


  try {
    const parsed = JSON.parse(cleanedText);
    return parsed;
  } catch (parseError) {
    console.error("Failed to parse Gemini response as JSON:", parseError.message);
    console.error("Raw response was:", cleanedText);
    return {
      ...FALLBACK_VERDICT,
      summary:
        "We couldn't finish checking this listing just now. Try investigating it again in a moment.",
    };
  }
}