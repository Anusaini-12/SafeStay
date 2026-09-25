import VerdictBadge from "./VerdictBadge";
import {
  ExternalLink,
  MapPin,
  Search,
  Newspaper,
  Home,
  CheckCircle2,
  Circle,
  Phone,
  Star,
} from "lucide-react";

function mapsLink(coordinates, fallbackQuery) {
  if (coordinates?.latitude && coordinates?.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
  }
  if (fallbackQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
  }
  return null;
}

function ListingDetails({ investigation }) {
  const {
    listing = {},
    verdict = {},
    evidence = [], // [{ type, query, results: [{title, link, snippet}] }]
    neighborhood = [],
  } = investigation || {};

  const googleSource = evidence.find((e) => e.type === "google");
  const newsSource = evidence.find((e) => e.type === "news");
  const listingMapsLink = mapsLink(listing.coordinates, `${listing.name} ${listing.address || ""}`);
  const sourcesChecked = [
    { icon: Search, label: "Web search", done: !!googleSource, count: googleSource?.results?.length },
    { icon: Newspaper, label: "News search", done: !!newsSource, count: newsSource?.results?.length },
    { icon: Home, label: "Neighborhood check", done: neighborhood.length > 0, count: neighborhood.length },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Top panel: identity + verdict, side by side */}
      <div className="flex flex-col gap-6 rounded-xl border border-white/[0.08] bg-[#1B1E24] p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6E6A62]">
            Investigation result
          </p>
          <h2 className="font-display mt-2 text-2xl text-[#F4F1EA]">
            {listing.name || "Untitled listing"}
          </h2>
          <p className="mt-1.5 text-sm text-[#8A8680]">{listing.address || "Address not available"}</p>
          {listingMapsLink && (
            <a
              href={listingMapsLink}
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[#C9A24B] hover:text-[#D6B26A]"
            >
              <MapPin size={12} />
              View on Google Maps
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <VerdictBadge verdict={verdict.verdict} />
          <ConfidenceMeter level={verdict.confidence} />
        </div>
      </div>

      {/* Two-column body */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* MAIN COLUMN */}
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h3 className="text-sm font-medium text-[#F4F1EA]">Assessment</h3>
            <p className="mt-2.5 text-[15px] leading-7 text-[#B7B2A8]">
              {verdict.summary || "No summary was generated for this listing."}
            </p>
          </div>

          {verdict.evidence?.length > 0 && (
            <ListBlock title="Evidence" items={verdict.evidence} icon={CheckCircle2} iconClass="text-[#6E9277]" />
          )}

          {verdict.warnings?.length > 0 && (
            <ListBlock title="Warnings" items={verdict.warnings} icon={Circle} iconClass="text-[#D6B26A]" />
          )}

          <RawResults title="Web mentions" source={googleSource} />
          <RawResults title="News mentions" source={newsSource} />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {listing.image && (
            <img
              src={listing.image}
              alt={listing.name}
              className="h-40 w-full rounded-lg object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}

          <div className="rounded-lg border border-white/[0.08] bg-[#1B1E24] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6E6A62]">
              Details
            </p>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Fact icon={Star} label="Rating">{listing.rating ?? "N/A"}</Fact>
              <Fact label="Reviews">{listing.reviewCount ?? "N/A"}</Fact>
              <Fact label="Type">{listing.type || "PG"}</Fact>
              {listing.phone && <Fact icon={Phone} label="Phone">{listing.phone}</Fact>}
            </dl>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#1B1E24] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6E6A62]">
              Sources checked
            </p>
            <div className="mt-3 space-y-2.5">
              {sourcesChecked.map(({ icon: Icon, label, done, count }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#B7B2A8]">
                    <Icon size={14} className={done ? "text-[#6E9277]" : "text-[#5A564F]"} />
                    {label}
                  </div>
                  <span className="text-xs text-[#6E6A62]">
                    {done ? `${count ?? 0} found` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {neighborhood.length > 0 && (
            <div className="rounded-lg border border-white/[0.08] bg-[#1B1E24] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6E6A62]">
                Nearby
              </p>
              <div className="mt-3 space-y-3">
                {neighborhood.map((place, i) => {
                  const link = mapsLink(place.coordinates, `${place.name} ${place.address || ""}`);
                  return (
                    <div key={i} className="flex items-start justify-between gap-2 text-sm">
                      <div>
                        <p className="text-[#D8D4CB]">{place.name}</p>
                        <p className="text-xs text-[#6E6A62]">{place.type || "Place"}</p>
                      </div>
                      {link && (
                        <a href={link} target="_blank" rel="noreferrer" className="mt-0.5 shrink-0 text-[#C9A24B] hover:text-[#D6B26A]">
                          <MapPin size={13} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>

      <p className="mt-8 border-t border-white/[0.06] pt-4 text-[11px] text-[#5A564F]">
        Powered by Google Search, Google News, and Google Maps data via SerpApi, analyzed with Gemini.
      </p>
    </div>
  );
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-[#6E6A62]">
        {Icon && <Icon size={13} />}
        {label}
      </span>
      <span className="font-medium text-[#D8D4CB]">{children}</span>
    </div>
  );
}

function ConfidenceMeter({ level }) {
  const levels = { low: 1, medium: 2, high: 3 };
  const filled = levels[level?.toLowerCase()] || 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#6E6A62]">
        {level || "unknown"} confidence
      </span>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 w-4 rounded-full ${i <= filled ? "bg-[#C9A24B]" : "bg-white/[0.1]"}`} />
        ))}
      </div>
    </div>
  );
}

function ListBlock({ title, items, icon: Icon, iconClass }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-[#F4F1EA]">{title}</h3>
      <ul className="mt-2.5 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-[#B7B2A8]">
            <Icon size={15} className={`mt-1 shrink-0 ${iconClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RawResults({ title, source }) {
  if (!source || !source.results?.length) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-[#F4F1EA]">{title}</h3>
      <div className="mt-2.5 space-y-2.5">
        {source.results.slice(0, 3).map((result, i) => (
          <a
            key={i}
            href={result.link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-white/[0.06] p-4 transition-colors hover:border-[#C9A24B]/30"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-1 text-sm font-medium text-[#D8D4CB]">{result.title}</p>
              <ExternalLink size={13} className="mt-0.5 shrink-0 text-[#6E6A62]" />
            </div>
            {result.snippet && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#8A8680]">{result.snippet}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ListingDetails;