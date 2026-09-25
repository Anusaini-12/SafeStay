export function createInvestigationPlan(listing) {
  // FIX: previously wrapped the FULL address in exact quotes alongside the
  // name — e.g. `"Neelam PG" "House no - 3374, Sector 15, Chandigarh"`.
  // That demands an exact verbatim match of the whole address string,
  // which almost nothing on the web will ever contain, even for a listing
  // with real complaints out there. Loosen to name (quoted, since it's a
  // proper noun worth matching exactly) + area/city as plain keywords.
  const areaHint = extractAreaHint(listing.address);

  return {
    listingId: listing.id,
    listingName: listing.name,

    searches: [
      {
        type: "google",
        purpose: "Find complaints, scam reports, or negative experiences",
        query: `"${listing.name}" ${areaHint} scam OR fraud OR complaint OR cheated`,
      },
      {
        type: "news",
        purpose: "Find relevant news or reported incidents",
        query: `"${listing.name}" ${areaHint}`,
      },
    ],

    neighborhood: {
      address: listing.address,
      purpose: "Check nearby essentials and neighborhood context",
    },
  };
}

// Pull a short, loose location hint (e.g. "Sector 15 Chandigarh") out of a
// full street address, instead of quoting the whole thing verbatim.
function extractAreaHint(address) {
  if (!address) return "";
  // Take the last 2-3 comma-separated segments, which are usually the
  // area/city/pincode — more likely to actually appear on a web page than
  // a full house-number-included address string.
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.slice(-3, -1).join(" ") || parts[0] || "";
}
