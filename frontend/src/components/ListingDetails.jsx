import VerdictBadge from "./VerdictBadge";
import {
  ExternalLink,
  MapPin,
  Search,
  Newspaper,
  Home,
  CheckCircle2,
  CircleAlert,
  Phone,
  Star,
  Globe,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

function mapsLink(coordinates, fallbackQuery) {
  if (coordinates?.latitude && coordinates?.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
  }

  if (fallbackQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fallbackQuery,
    )}`;
  }

  return null;
}

function ListingDetails({ investigation }) {
  const {
    listing = {},
    verdict = {},
    evidence = [],
    neighborhood = [],
    reviews = [],
  } = investigation || {};

  const googleSource = evidence.find((e) => e.type === "google");
  const newsSource = evidence.find((e) => e.type === "news");

  const listingMapsLink = mapsLink(
    listing.coordinates,
    `${listing.name} ${listing.address || ""}`,
  );

  const googleReviewsLink = listing.id
    ? `https://search.google.com/local/reviews?placeid=${listing.id}`
    : listingMapsLink;

  // A source counts as "checked" only if it actually returned results
  const webCount = googleSource?.results?.length || 0;
  const newsCount = newsSource?.results?.length || 0;

  const sourcesChecked = [
    {
      icon: Search,
      label: "Web search",
      done: webCount > 0,
      count: webCount,
    },
    {
      icon: Newspaper,
      label: "News search",
      done: newsCount > 0,
      count: newsCount,
    },
    {
      icon: Home,
      label: "Neighborhood",
      done: neighborhood.length > 0,
      count: neighborhood.length,
    },
  ];

  const sourcesCheckedCount = sourcesChecked.filter(
    (source) => source.done,
  ).length;

  const photos = listing.photos?.length
    ? listing.photos
    : listing.image
      ? [listing.image]
      : [];

  const showConfidence =
    verdict.verdict !== "Assessment unavailable" &&
    verdict.verdict !== "Not enough data";

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0">
      {/* HEADER */}
      <section className="mb-6 sm:mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9C7A1F] dark:text-[#C9A24B] sm:text-[11px]">
          Investigation report
        </p>

        <div className="mt-3 flex min-w-0 flex-col gap-4">
          <div className="min-w-0">
            <h1 className="break-words font-display text-2xl leading-tight tracking-tight text-[#1B1E24] dark:text-[#F4F1EA] sm:text-4xl">
              {listing.name || "Untitled listing"}
            </h1>

            <div className="mt-2 flex min-w-0 items-start gap-2 text-sm leading-6 text-[#5A564F] dark:text-[#9B968C]">
              <MapPin size={15} className="mt-1 shrink-0 text-[#C9A24B]" />

              <span className="min-w-0 break-words">
                {listing.address || "Address not available"}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
            {listingMapsLink && (
              <ExternalLinkButton
                href={listingMapsLink}
                icon={MapPin}
                label="Google Maps"
              />
            )}

            {listing.website && (
              <ExternalLinkButton
                href={listing.website}
                icon={Globe}
                label="Website"
              />
            )}
          </div>
        </div>
      </section>

      {/* VERDICT */}
      <section className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.04)] dark:border-white/[0.07] dark:bg-[#1B1E24] dark:shadow-none">
        <div className="p-5 sm:p-8">
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A8680] dark:text-[#6E6A62] sm:text-xs">
                <ShieldCheck size={15} className="shrink-0" />
                SafeStay assessment
              </div>

              <h2 className="mt-3 font-display text-xl text-[#1B1E24] dark:text-[#F4F1EA] sm:text-2xl">
                What we found
              </h2>

              <p className="mt-3 break-words text-sm leading-6 text-[#5A564F] dark:text-[#B7B2A8] sm:text-[15px] sm:leading-7">
                {verdict.summary ||
                  "No summary was generated for this listing."}
              </p>
            </div>

            <div className="w-full min-w-0 lg:w-auto lg:max-w-xs">
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <VerdictBadge verdict={verdict.verdict} />
              </div>

              {showConfidence && (
                <div className="mt-3">
                  <ConfidenceMeter level={verdict.confidence} />
                </div>
              )}

              {verdict.verdict !== "Assessment unavailable" && (
                <p className="mt-3 text-xs leading-5 text-[#8A8680] dark:text-[#8A8680] lg:text-right">
                  {VERDICT_EXPLANATIONS[verdict.verdict]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SOURCES */}
        <div className="border-t border-black/[0.07] bg-[#FAF9F6] px-5 py-4 dark:border-white/[0.06] dark:bg-[#17191D] sm:px-8">
          <div className="flex min-w-0 items-center gap-5 overflow-x-auto pb-1">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8680] dark:text-[#6E6A62]">
              Sources checked
            </span>

            {sourcesChecked.map(({ icon: Icon, label, done, count }) => (
              <div
                key={label}
                className="flex shrink-0 items-center gap-2 text-xs"
              >
                <Icon
                  size={14}
                  className={
                    done
                      ? "text-[#4A7A54] dark:text-[#6E9277]"
                      : "text-[#B0AAA0] dark:text-[#5A564F]"
                  }
                />

                <span className="text-[#5A564F] dark:text-[#9B968C]">
                  {label}
                </span>

                {done && (
                  <span className="text-[#8A8680] dark:text-[#6E6A62]">
                    {count}
                  </span>
                )}
              </div>
            ))}

            <span className="hidden shrink-0 text-xs text-[#8A8680] dark:text-[#6E6A62] sm:block">
              {sourcesCheckedCount} of {sourcesChecked.length} returned results
            </span>
          </div>
        </div>
      </section>

      {/* PHOTOS */}
      {photos.length > 0 && (
        <PhotoGallery photos={photos} name={listing.name} />
      )}

      {/* CONTENT */}
      <div className="mt-7 grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <main className="min-w-0 space-y-8 sm:space-y-10">
          {verdict.evidence?.length > 0 && (
            <ReportSection
              title="Positive signals"
              icon={CheckCircle2}
              iconClass="text-[#4A7A54] dark:text-[#6E9277]"
            >
              <ul className="space-y-3">
                {verdict.evidence.map((item, index) => (
                  <li
                    key={index}
                    className="flex min-w-0 items-start gap-3 text-sm leading-6 text-[#403C35] dark:text-[#B7B2A8]"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-[#4A7A54] dark:text-[#6E9277]"
                    />

                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {verdict.warnings?.length > 0 && (
            <ReportSection
              title="Things to check"
              icon={CircleAlert}
              iconClass="text-[#9C7A1F] dark:text-[#D6B26A]"
            >
              <div className="rounded-xl border border-[#C9A24B]/25 bg-[#C9A24B]/[0.06] p-4 dark:border-[#C9A24B]/20 dark:bg-[#C9A24B]/[0.06] sm:p-5">
                <ul className="space-y-3">
                  {verdict.warnings.map((item, index) => (
                    <li
                      key={index}
                      className="flex min-w-0 items-start gap-3 text-sm leading-6 text-[#5A564F] dark:text-[#B7B2A8]"
                    >
                      <CircleAlert
                        size={16}
                        className="mt-1 shrink-0 text-[#9C7A1F] dark:text-[#D6B26A]"
                      />

                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ReportSection>
          )}

          <Reviews reviews={reviews} moreLink={googleReviewsLink} />

          <RawResults title="Web mentions" source={googleSource} />

          <RawResults title="News mentions" source={newsSource} />
        </main>

        {/* SIDEBAR */}
        <aside className="min-w-0 space-y-5">
          <DetailsCard listing={listing} />

          <ReportedDetails details={verdict.reportedDetails} />

          {neighborhood.length > 0 && (
            <NearbyPlaces neighborhood={neighborhood} />
          )}
        </aside>
      </div>

      <p className="mt-8 border-t border-black/[0.07] pt-5 text-[11px] leading-5 text-[#8A8680] dark:border-white/[0.06] dark:text-[#5A564F] sm:mt-10">
        SafeStay's assessment uses publicly available web, news, and map
        information. Information may be incomplete or outdated. Always verify
        important details directly with the property.
      </p>
    </div>
  );
}

function ExternalLinkButton({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2.5 text-xs font-medium text-[#5A564F] transition hover:border-[#C9A24B]/40 hover:text-[#9C7A1F] sm:w-auto dark:border-white/[0.08] dark:bg-[#1B1E24] dark:text-[#B7B2A8] dark:hover:border-[#C9A24B]/30 dark:hover:text-[#D6B26A]"
    >
      <Icon size={13} />
      {label}
      <ArrowUpRight size={11} />
    </a>
  );
}

function DetailsCard({ listing }) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.07] dark:bg-[#1B1E24]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8680] dark:text-[#6E6A62]">
        Listing details
      </p>

      <dl className="mt-4 space-y-4">
        <Fact icon={Star} label="Rating">
          {listing.rating ?? "N/A"}
        </Fact>

        <Fact label="Reviews">{listing.reviewCount ?? "N/A"}</Fact>

        <Fact label="Type">{listing.type || "PG"}</Fact>

        {listing.phone && (
          <Fact icon={Phone} label="Phone">
            {listing.phone}
          </Fact>
        )}
      </dl>
    </div>
  );
}

function NearbyPlaces({ neighborhood }) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.07] dark:bg-[#1B1E24]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8680] dark:text-[#6E6A62]">
        Nearby
      </p>

      <div className="mt-4 space-y-4">
        {neighborhood.map((place, index) => {
          const link = mapsLink(
            place.coordinates,
            `${place.name} ${place.address || ""}`,
          );

          return (
            <div
              key={index}
              className="flex min-w-0 items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="break-words text-sm text-[#1B1E24] dark:text-[#D8D4CB]">
                  {place.name}
                </p>

                <p className="mt-0.5 break-words text-xs text-[#8A8680] dark:text-[#6E6A62]">
                  {place.type || "Place"}
                </p>

                {place.rating && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9C7A1F] dark:text-[#D6B26A]">
                    <Star size={10} className="fill-current" />
                    {place.rating}
                  </div>
                )}
              </div>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${place.name} on Google Maps`}
                  className="shrink-0 rounded-md p-1.5 text-[#9C7A1F] transition hover:bg-[#C9A24B]/10 dark:text-[#C9A24B]"
                >
                  <MapPin size={14} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportedDetails({ details }) {
  const rent = details?.rent;
  const food = details?.food;
  const roomType = details?.roomType;
  const facilities = details?.facilities || [];

  const hasAnything = rent || food || roomType || facilities.length > 0;

  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.07] dark:bg-[#1B1E24]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8680] dark:text-[#6E6A62]">
        Rent & facilities
      </p>

      {!hasAnything ? (
        <p className="mt-3 text-xs leading-5 text-[#8A8680] dark:text-[#6E6A62]">
          Not mentioned in the sources checked. Confirm these details directly
          with the PG.
        </p>
      ) : (
        <dl className="mt-4 space-y-3">
          <Fact label="Rent">{rent || "Not mentioned"}</Fact>
          <Fact label="Food">{food || "Not mentioned"}</Fact>
          <Fact label="Room">{roomType || "Not mentioned"}</Fact>

          {facilities.length > 0 && (
            <div className="pt-1">
              <span className="text-xs text-[#8A8680] dark:text-[#6E6A62]">
                Facilities
              </span>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="break-words rounded-full border border-black/[0.08] px-2.5 py-1 text-[11px] text-[#403C35] dark:border-white/[0.1] dark:text-[#D8D4CB]"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}
        </dl>
      )}

      <p className="mt-4 text-[10px] leading-4 text-[#B0AAA0] dark:text-[#5A564F]">
        Based on public search information and may not be current.
      </p>
    </div>
  );
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <span className="flex shrink-0 items-center gap-1.5 text-xs text-[#8A8680] dark:text-[#6E6A62]">
        {Icon && <Icon size={13} />}
        {label}
      </span>

      <span className="min-w-0 max-w-[65%] break-words text-right text-xs font-medium text-[#1B1E24] dark:text-[#D8D4CB]">
        {children}
      </span>
    </div>
  );
}

function ReportSection({ title, icon: Icon, iconClass, children }) {
  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={17} className={iconClass} />

        <h3 className="text-sm font-semibold text-[#1B1E24] dark:text-[#F4F1EA]">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

const VERDICT_EXPLANATIONS = {
  Verified: "We found good signs and no serious concerns in public sources.",
  Caution: "We found a few things worth reading before you decide.",
  "Red Flag": "We found serious concerns — read the details below.",
  "Not enough data":
    "We couldn't find enough public information to assess this listing.",
  "Assessment unavailable":
    "The assessment service is temporarily unavailable. The information collected above is still shown for you to review.",
};

// Confidence describes how sure the assessment is, not how much data was found
const CONFIDENCE_LABELS = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

function ConfidenceMeter({ level }) {
  const levels = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const key = level?.toLowerCase();
  const filled = levels[key] || 0;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 lg:justify-end">
      <span className="text-[11px] text-[#8A8680] dark:text-[#6E6A62]">
        {CONFIDENCE_LABELS[key] || "Confidence unclear"}
      </span>

      <div className="flex shrink-0 gap-1">
        {[1, 2, 3].map((index) => (
          <span
            key={index}
            className={`h-1.5 w-4 rounded-full ${
              index <= filled
                ? "bg-[#C9A24B]"
                : "bg-black/10 dark:bg-white/[0.1]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoGallery({ photos, name }) {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.07]">
        <img
          src={photos[0]}
          alt={name}
          className="aspect-[16/9] w-full object-cover sm:aspect-[16/7]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.slice(1, 8).map((src, index) => (
            <a
              key={index}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 overflow-hidden rounded-lg border border-black/[0.08] dark:border-white/[0.07]"
            >
              <img
                src={src}
                alt={`${name} photo ${index + 2}`}
                className="h-16 w-24 object-cover transition-transform hover:scale-105 sm:h-20 sm:w-28"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Reviews({ reviews, moreLink }) {
  if (!reviews?.length) return null;

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-[#1B1E24] dark:text-[#F4F1EA]">
          Reviews
        </h3>

        {moreLink && (
          <a
            href={moreLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs text-[#9C7A1F] hover:text-[#C9A24B] dark:text-[#C9A24B]"
          >
            See all
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
        {reviews.slice(0, 4).map((review, index) => (
          <a
            key={index}
            href={moreLink}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 rounded-xl border border-black/[0.08] p-4 transition hover:border-[#C9A24B]/40 dark:border-white/[0.07] dark:hover:border-[#C9A24B]/30"
          >
            <div className="flex min-w-0 items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-medium text-[#1B1E24] dark:text-[#D8D4CB]">
                {review.author}
              </p>

              {review.rating != null && (
                <span className="flex shrink-0 items-center gap-1 text-xs text-[#9C7A1F] dark:text-[#D6B26A]">
                  <Star size={11} className="fill-current" />
                  {review.rating}
                </span>
              )}
            </div>

            {review.snippet && (
              <p className="mt-2 line-clamp-3 break-words text-xs leading-5 text-[#5A564F] dark:text-[#8A8680]">
                {review.snippet}
              </p>
            )}

            {review.date && (
              <p className="mt-2 text-[10px] text-[#B0AAA0] dark:text-[#5A564F]">
                {review.date}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function RawResults({ title, source }) {
  if (!source || !source.results?.length) return null;

  return (
    <section className="min-w-0">
      <h3 className="text-sm font-semibold text-[#1B1E24] dark:text-[#F4F1EA]">
        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {source.results.slice(0, 3).map((result, index) => (
          <a
            key={index}
            href={result.link}
            target="_blank"
            rel="noreferrer"
            className="block min-w-0 rounded-xl border border-black/[0.08] p-4 transition hover:border-[#C9A24B]/40 dark:border-white/[0.07] dark:hover:border-[#C9A24B]/30"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-medium text-[#1B1E24] dark:text-[#D8D4CB]">
                {result.title}
              </p>

              <ArrowUpRight
                size={14}
                className="mt-0.5 shrink-0 text-[#8A8680]"
              />
            </div>

            {result.snippet && (
              <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-[#5A564F] dark:text-[#8A8680]">
                {result.snippet}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

export default ListingDetails;