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
  Globe,
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
    reviews = [],
  } = investigation || {};

  const googleSource = evidence.find((e) => e.type === "google");
  const newsSource = evidence.find((e) => e.type === "news");
  const listingMapsLink = mapsLink(listing.coordinates, `${listing.name} ${listing.address || ""}`);
  // Direct link to this place's Google reviews tab, when we have its place_id.
  const googleReviewsLink = listing.id
    ? `https://search.google.com/local/reviews?placeid=${listing.id}`
    : listingMapsLink;

  const sourcesChecked = [
    { icon: Search, label: "Web search", done: !!googleSource, count: googleSource?.results?.length },
    { icon: Newspaper, label: "News search", done: !!newsSource, count: newsSource?.results?.length },
    { icon: Home, label: "Neighborhood check", done: neighborhood.length > 0, count: neighborhood.length },
  ];
  const sourcesCheckedCount = sourcesChecked.filter((s) => s.done).length;

  // Photos: prefer a real photo gallery (from place-details), fall back to
  // the single thumbnail from search results, or nothing at all.
  const photos = listing.photos?.length ? listing.photos : listing.image ? [listing.image] : [];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page heading — separate from the verdict panel below */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8680] dark:text-[#6E6A62]">
          Investigation result
        </p>
        <h1 className="font-display mt-2 text-3xl text-[#1B1E24] dark:text-[#F4F1EA]">
          {listing.name || "Untitled listing"}
        </h1>
        <p className="mt-1.5 text-sm text-[#5A564F] dark:text-[#8A8680]">
          {listing.address || "Address not available"}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {listingMapsLink && (
            <a
              href={listingMapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#9C7A1F] hover:text-[#C9A24B] dark:text-[#C9A24B] dark:hover:text-[#D6B26A]"
            >
              <MapPin size={12} />
              View on Google Maps
              <ExternalLink size={10} />
            </a>
          )}
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#9C7A1F] hover:text-[#C9A24B] dark:text-[#C9A24B] dark:hover:text-[#D6B26A]"
            >
              <Globe size={12} />
              Visit website
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Verdict panel — its own distinct card, separate from the heading */}
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/[0.08] dark:bg-[#1B1E24] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5A564F] dark:text-[#B7B2A8]">
          Trust assessment based on {sourcesCheckedCount} source{sourcesCheckedCount === 1 ? "" : "s"} checked
        </p>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <VerdictBadge verdict={verdict.verdict} />
          <ConfidenceMeter level={verdict.confidence} />
        </div>
      </div>

      {/* Photo gallery — responsive, handles 0/1/many photos gracefully */}
      {photos.length > 0 && <PhotoGallery photos={photos} name={listing.name} />}

      {/* Two-column body */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* MAIN COLUMN */}
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h3 className="text-sm font-medium text-[#1B1E24] dark:text-[#F4F1EA]">Assessment</h3>
            <p className="mt-2.5 text-[15px] leading-7 text-[#403C35] dark:text-[#B7B2A8]">
              {verdict.summary || "No summary was generated for this listing."}
            </p>
          </div>

          {verdict.evidence?.length > 0 && (
            <ListBlock title="Evidence" items={verdict.evidence} icon={CheckCircle2} iconClass="text-[#4A7A54] dark:text-[#6E9277]" />
          )}

          {verdict.warnings?.length > 0 && (
            <ListBlock title="Warnings" items={verdict.warnings} icon={Circle} iconClass="text-[#9C7A1F] dark:text-[#D6B26A]" />
          )}

          <Reviews reviews={reviews} moreLink={googleReviewsLink} />

          <RawResults title="Web mentions" source={googleSource} />
          <RawResults title="News mentions" source={newsSource} />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/[0.08] dark:bg-[#1B1E24]">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#8A8680] dark:text-[#6E6A62]">
              Details
            </p>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Fact icon={Star} label="Rating">{listing.rating ?? "N/A"}</Fact>
              <Fact label="Reviews">{listing.reviewCount ?? "N/A"}</Fact>
              <Fact label="Type">{listing.type || "PG"}</Fact>
              {listing.phone && <Fact icon={Phone} label="Phone">{listing.phone}</Fact>}
            </dl>
          </div>

          <ReportedDetails details={verdict.reportedDetails} />

          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/[0.08] dark:bg-[#1B1E24]">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#8A8680] dark:text-[#6E6A62]">
              Sources checked
            </p>
            <div className="mt-3 space-y-2.5">
              {sourcesChecked.map(({ icon: Icon, label, done, count }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#403C35] dark:text-[#B7B2A8]">
                    <Icon size={14} className={done ? "text-[#4A7A54] dark:text-[#6E9277]" : "text-[#B0AAA0] dark:text-[#5A564F]"} />
                    {label}
                  </div>
                  <span className="text-xs text-[#8A8680] dark:text-[#6E6A62]">
                    {done ? `${count ?? 0} found` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {neighborhood.length > 0 && (
            <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/[0.08] dark:bg-[#1B1E24]">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#8A8680] dark:text-[#6E6A62]">
                Nearby
              </p>
              <div className="mt-3 space-y-3">
                {neighborhood.map((place, i) => {
                  const link = mapsLink(place.coordinates, `${place.name} ${place.address || ""}`);
                  return (
                    <div key={i} className="flex items-start justify-between gap-2 text-sm">
                      <div>
                        <p className="text-[#1B1E24] dark:text-[#D8D4CB]">{place.name}</p>
                        <p className="text-xs text-[#8A8680] dark:text-[#6E6A62]">{place.type || "Place"}</p>
                      </div>
                      {link && (
                        <a href={link} target="_blank" rel="noreferrer" className="mt-0.5 shrink-0 text-[#9C7A1F] hover:text-[#C9A24B] dark:text-[#C9A24B] dark:hover:text-[#D6B26A]">
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

      <p className="mt-8 border-t border-black/10 pt-4 text-[11px] text-[#8A8680] dark:border-white/[0.06] dark:text-[#5A564F]">
        Assessment based on publicly available web, news, and map information.
      </p>
    </div>
  );
}

// Responsive photo gallery: 1 photo = single wide image; 2+ = a main image
// plus a horizontally-scrollable strip of thumbnails (works on mobile).
function PhotoGallery({ photos, name }) {
  return (
    <div className="mt-6">
      <img
        src={photos[0]}
        alt={name}
        className="aspect-video w-full rounded-lg border border-black/10 object-cover dark:border-white/[0.08]"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
        loading="lazy"
      />
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.slice(1, 8).map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noreferrer" className="shrink-0">
              <img
                src={src}
                alt={`${name} photo ${i + 2}`}
                className="h-20 w-28 rounded-md border border-black/10 object-cover dark:border-white/[0.08]"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Rent/food/room-type/facilities — extracted by Gemini ONLY when
// explicitly mentioned in the fetched search results. Genuinely absent
// for most small listings — that's honest, not broken.
function ReportedDetails({ details }) {
  const rent = details?.rent;
  const food = details?.food;
  const roomType = details?.roomType;
  const facilities = details?.facilities || [];
  const hasAnything = rent || food || roomType || facilities.length > 0;

  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/[0.08] dark:bg-[#1B1E24]">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#8A8680] dark:text-[#6E6A62]">
        Rent & facilities
      </p>

      {!hasAnything ? (
        <p className="mt-2.5 text-xs leading-5 text-[#8A8680] dark:text-[#6E6A62]">
          Not mentioned in any of the sources checked — common for listings
          without a public price sheet. Confirm directly with the PG.
        </p>
      ) : (
        <dl className="mt-3 space-y-2.5 text-sm">
          <Fact label="Rent">{rent || "Not mentioned"}</Fact>
          <Fact label="Food">{food || "Not mentioned"}</Fact>
          <Fact label="Room type">{roomType || "Not mentioned"}</Fact>
          {facilities.length > 0 && (
            <div>
              <span className="text-[#8A8680] dark:text-[#6E6A62]">Facilities</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {facilities.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-black/10 px-2.5 py-1 text-xs text-[#1B1E24] dark:border-white/[0.1] dark:text-[#D8D4CB]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </dl>
      )}
      <p className="mt-3 text-[10px] text-[#B0AAA0] dark:text-[#5A564F]">
        As mentioned in public search results — not guaranteed accurate or current.
      </p>
    </div>
  );
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-[#8A8680] dark:text-[#6E6A62]">
        {Icon && <Icon size={13} />}
        {label}
      </span>
      <span className="font-medium text-[#1B1E24] dark:text-[#D8D4CB]">{children}</span>
    </div>
  );
}

function ConfidenceMeter({ level }) {
  const levels = { low: 1, medium: 2, high: 3 };
  const filled = levels[level?.toLowerCase()] || 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#8A8680] dark:text-[#6E6A62]">
        {level || "unknown"} confidence
      </span>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full ${i <= filled ? "bg-[#C9A24B]" : "bg-black/10 dark:bg-white/[0.1]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function ListBlock({ title, items, icon: Icon, iconClass }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-[#1B1E24] dark:text-[#F4F1EA]">{title}</h3>
      <ul className="mt-2.5 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-[#403C35] dark:text-[#B7B2A8]">
            <Icon size={15} className={`mt-1 shrink-0 ${iconClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reviews({ reviews, moreLink }) {
  if (!reviews?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1B1E24] dark:text-[#F4F1EA]">Reviews</h3>
        {moreLink && (
          <a
            href={moreLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#9C7A1F] hover:text-[#C9A24B] dark:text-[#C9A24B] dark:hover:text-[#D6B26A]"
          >
            See all on Google
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
        {reviews.slice(0, 4).map((review, i) => (
          <a
            key={i}
            href={moreLink}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-black/10 p-4 transition-colors hover:border-[#C9A24B]/50 dark:border-white/[0.06] dark:hover:border-[#C9A24B]/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#1B1E24] dark:text-[#D8D4CB]">{review.author}</p>
              {review.rating != null && (
                <span className="flex items-center gap-1 text-xs text-[#9C7A1F] dark:text-[#D6B26A]">
                  <Star size={11} className="fill-current" />
                  {review.rating}
                </span>
              )}
            </div>
            {review.snippet && (
              <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[#5A564F] dark:text-[#8A8680]">
                {review.snippet}
              </p>
            )}
            {review.date && (
              <p className="mt-1.5 text-[10px] text-[#B0AAA0] dark:text-[#5A564F]">{review.date}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function RawResults({ title, source }) {
  if (!source || !source.results?.length) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-[#1B1E24] dark:text-[#F4F1EA]">{title}</h3>
      <div className="mt-2.5 space-y-2.5">
        {source.results.slice(0, 3).map((result, i) => (
          <a
            key={i}
            href={result.link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-black/10 p-4 transition-colors hover:border-[#C9A24B]/50 dark:border-white/[0.06] dark:hover:border-[#C9A24B]/30"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-1 text-sm font-medium text-[#1B1E24] dark:text-[#D8D4CB]">{result.title}</p>
              <ExternalLink size={13} className="mt-0.5 shrink-0 text-[#8A8680] dark:text-[#6E6A62]" />
            </div>
            {result.snippet && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#5A564F] dark:text-[#8A8680]">{result.snippet}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ListingDetails;