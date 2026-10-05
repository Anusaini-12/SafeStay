import { useState } from "react";
import VerdictBadge from "./VerdictBadge";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Globe,
  MapPin,
  Newspaper,
  Phone,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

const EXPLANATIONS = {
  Verified: "Good signs and no serious concerns in the sources checked.",
  Caution: "Some findings are worth reviewing before you decide.",
  "Red Flag": "Serious concerns were reported. Read the supporting details.",
  "Not enough data": "There is not enough listing-specific evidence to assess this stay.",
  "Assessment unavailable":
    "The assessment service is unavailable. The collected information is still shown below.",
};

const CONFIDENCE = { low: 1, medium: 2, high: 3 };

const card =
  "rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.07] dark:bg-[#1B1E24]";
const muted = "text-[#8A8680] dark:text-[#6E6A62]";
const heading = "text-[#1B1E24] dark:text-[#F4F1EA]";

function mapsLink(coordinates, fallbackQuery, placeId) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fallbackQuery || "",
    )}&query_place_id=${encodeURIComponent(placeId)}`;
  }

  if (
    coordinates?.latitude != null &&
    coordinates?.longitude != null
  ) {
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
    sourceErrors = [],
  } = investigation || {};
  const [activeTab, setActiveTab] = useState("overview");

  const googleSource = evidence.find((source) => source.type === "google");
  const newsSource = evidence.find((source) => source.type === "news");
  const webResults = googleSource?.results || [];
  const newsResults = newsSource?.results || [];
  const details = verdict.reportedDetails || {};
  const facilities = Array.isArray(details.facilities)
    ? details.facilities
    : [];
  const photos = [
    ...new Set(
      (Array.isArray(listing.photos) ? listing.photos : []).filter(
        (photo) => typeof photo === "string" && photo,
      ),
    ),
  ];

  if (photos.length === 0 && listing.image) {
    photos.push(listing.image);
  }

  const listingQuery = [listing.name, listing.address]
    .filter(Boolean)
    .join(" ");
  const listingMapsLink = mapsLink(
    listing.coordinates,
    listingQuery,
    listing.placeId,
  );
  const reviewsLink = listing.placeId
    ? `https://search.google.com/local/reviews?placeid=${encodeURIComponent(
        listing.placeId,
      )}`
    : listingMapsLink;

  const sources = [
    {
      icon: Search,
      label: "Web",
      status: googleSource?.status,
      count: webResults.length,
    },
    {
      icon: Newspaper,
      label: "News",
      status: newsSource?.status,
      count: newsResults.length,
    },
    {
      icon: Star,
      label: "Google reviews",
      status: sourceErrors.includes("Google reviews") ? "failed" : "ok",
      count: reviews.length,
    },
    {
      icon: MapPin,
      label: "Nearby",
      status: sourceErrors.includes("Neighborhood") ? "failed" : "ok",
      count: neighborhood.length,
    },
  ];
  const returnedSources = sources.filter(
    (source) => source.status === "ok" && source.count > 0,
  ).length;
  const mentionCount = webResults.length + newsResults.length;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "mentions", label: "Mentions", count: mentionCount },
    { id: "nearby", label: "Nearby", count: neighborhood.length },
  ];
  const confidenceLevel = CONFIDENCE[verdict.confidence?.toLowerCase()] || 0;
  const showConfidence = verdict.verdict !== "Assessment unavailable";

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl">
      <section className={`${card} p-5 sm:p-8`}>
        <div className="min-w-0">
          <h1
            className={`break-words font-display text-3xl leading-tight tracking-tight sm:text-5xl ${heading}`}
          >
            {listing.name || "Untitled listing"}
          </h1>
          <div className="mt-3 flex min-w-0 items-start gap-2 text-sm leading-6 text-[#5A564F] dark:text-[#B7B2A8]">
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#C9A24B]" />
            <span className="min-w-0 break-words">
              {listing.address || "Address not available"}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {listingMapsLink && (
              <HeroLink
                href={listingMapsLink}
                icon={MapPin}
                label="Google Maps"
                light
              />
            )}
            {listing.website && (
              <HeroLink
                href={listing.website}
                icon={Globe}
                label="Website"
                light
              />
            )}
            {listing.phone && (
              <HeroLink
                href={`tel:${listing.phone}`}
                icon={Phone}
                label={listing.phone}
                light
              />
            )}
          </div>
        </div>
      </section>

      <section className={`${card} mt-4 p-4 sm:p-7`}>
        <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 md:max-w-xl">
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/[0.08] px-3 py-1.5 text-[11px] font-medium text-[#80631A] dark:text-[#D6B26A]">
                <ShieldCheck size={13} />
                SafeStay report
              </span>
            </div>
            <h2 className={`font-display text-xl sm:text-2xl ${heading}`}>
              What we found
            </h2>
            <p className="mt-3 break-words text-sm leading-7 text-[#5A564F] dark:text-[#B7B2A8] sm:text-[15px]">
              {verdict.summary || "No summary was generated for this listing."}
            </p>
            {verdict.reasoning && (
              <p className={`mt-3 break-words text-xs leading-5 ${muted}`}>
                Why this assessment: {verdict.reasoning}
              </p>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-col items-end text-right md:w-64 md:shrink-0">
            <VerdictBadge verdict={verdict.verdict} />
            {showConfidence && (
              <div className="mt-3 flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                <span className={`text-xs ${muted}`}>
                  {["Confidence unclear", "Low", "Medium", "High"][
                    confidenceLevel
                  ]}
                  {confidenceLevel > 0 && " confidence"}
                </span>
                <div
                  className="flex gap-1"
                  aria-label={`${verdict.confidence || "Unknown"} confidence`}
                >
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={`h-1.5 w-5 rounded-full ${
                        level <= confidenceLevel
                          ? "bg-[#C9A24B]"
                          : "bg-black/10 dark:bg-white/[0.1]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            <p className={`mt-3 w-full text-left text-xs leading-5 ${muted} sm:text-right`}>
              {EXPLANATIONS[verdict.verdict] ||
                EXPLANATIONS["Not enough data"]}
            </p>

            <div className="mt-4 flex w-full flex-wrap justify-start gap-2 sm:justify-end">
              {sources.map(({ icon: Icon, label, count, status }) => (
                <span
                  key={label}
                  title={
                    status === "failed"
                      ? `${label} check unavailable`
                      : `${count} ${label.toLowerCase()} returned`
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${
                    status === "failed"
                      ? "border-[#C9A24B]/30 text-[#9C7A1F] dark:text-[#D6B26A]"
                      : count > 0
                        ? "border-[#4A7A54]/30 text-[#4A7A54] dark:border-[#6E9277]/30 dark:text-[#8FB596]"
                        : "border-black/10 text-[#8A8680] dark:border-white/10 dark:text-[#6E6A62]"
                  }`}
                >
                  <Icon size={12} className="shrink-0" />
                  <span>{label}</span>
                  {status === "failed" ? (
                    <span className="rounded-full bg-[#C9A24B]/15 px-1.5 py-0.5 text-[10px] font-semibold">
                      unavailable
                    </span>
                  ) : (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-current/10 px-1 text-[10px] font-bold leading-none">
                      {count}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        {sourceErrors.length > 0 && (
          <p className={`mt-4 border-t border-black/[0.07] pt-3 text-xs leading-5 ${muted} dark:border-white/[0.07]`}>
            Some checks could not be completed: {sourceErrors.join(", ")}.
            Unavailable sources are not treated as negative evidence.
          </p>
        )}
      </section>

      <section
        aria-label="Listing facts"
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5"
      >
        {[
          { label: "Rating", value: listing.rating ?? "Not available", icon: Star },
          { label: "Google reviews", value: listing.reviewCount ?? "Not available" },
          { label: "Rent", value: details.rent || "Not mentioned" },
          { label: "Food", value: details.food || "Not mentioned" },
          { label: "Room", value: details.roomType || "Not mentioned" },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className={`${card} min-w-0 px-3 py-3 sm:px-4 sm:py-3.5`}
          >
            <p className={`flex items-center gap-1.5 text-xs ${muted}`}>
              {Icon && <Icon size={12} className="text-[#C9A24B]" />}
              {label}
            </p>
            <p className={`mt-1.5 break-words text-sm font-medium ${heading}`}>
              {value}
            </p>
          </div>
        ))}
      </section>

      <div
        role="tablist"
        aria-label="Investigation sections"
        className="mt-8 flex gap-1 overflow-x-auto border-b border-black/[0.08] dark:border-white/[0.07]"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`listing-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="listing-tabpanel"
              tabIndex={selected ? 0 : -1}
              onKeyDown={(event) => {
                const currentIndex = tabs.findIndex(
                  (item) => item.id === activeTab,
                );
                let nextIndex = currentIndex;

                if (event.key === "ArrowRight") {
                  nextIndex = (currentIndex + 1) % tabs.length;
                } else if (event.key === "ArrowLeft") {
                  nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = tabs.length - 1;
                } else {
                  return;
                }

                event.preventDefault();
                setActiveTab(tabs[nextIndex].id);
                document
                  .getElementById(`listing-tab-${tabs[nextIndex].id}`)
                  ?.focus();
              }}
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-xs font-medium transition sm:px-4 sm:text-sm ${
                selected
                  ? "border-[#C9A24B] text-[#9C7A1F] dark:text-[#D6B26A]"
                  : "border-transparent text-[#8A8680] hover:text-[#1B1E24] dark:text-[#6E6A62] dark:hover:text-[#F4F1EA]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-none sm:ml-2 ${
                    selected
                      ? "bg-[#C9A24B]/15 text-[#80631A] dark:text-[#D6B26A]"
                      : "bg-black/[0.06] text-[#77736B] dark:bg-white/[0.08] dark:text-[#AAA59A]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="listing-tabpanel"
        role="tabpanel"
        aria-labelledby={`listing-tab-${activeTab}`}
        className="mt-6 min-w-0"
      >
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <SignalList
                title="Positive signals"
                icon={CheckCircle2}
                items={verdict.evidence}
                empty="No positive listing-specific signals were returned."
                tone="good"
              />
              <SignalList
                title="Things to check"
                icon={CircleAlert}
                items={verdict.warnings}
                empty="No specific warnings were returned."
                tone="warn"
              />
            </div>

            {facilities.length > 0 && (
              <div className={`${card} p-5 mt-5`}>
                <h3 className={`text-sm font-semibold ${heading}`}>
                  Reported facilities
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {facilities.map((facility, index) => (
                    <span
                      key={`${facility}-${index}`}
                      className="rounded-full border border-black/[0.08] px-3 py-1 text-xs text-[#403C35] dark:border-white/[0.1] dark:text-[#D8D4CB]"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {photos.length > 1 && (
              <div>
                <h3 className={`mb-3 mt-6 text-sm font-semibold ${heading}`}>
                  More listing photos
                </h3>
                <PhotoStrip photos={photos.slice(1)} name={listing.name} />
              </div>
            )}

            <p className={`text-xs leading-5 mt-2 ${muted}`}>
              Rent and facilities are shown only when mentioned in public
              sources. They may be outdated; confirm them with the property.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <Reviews
            reviews={reviews}
            reviewsLink={reviewsLink}
            unavailable={sourceErrors.includes("Google reviews")}
          />
        )}

        {activeTab === "mentions" && (
          <div className="space-y-8">
            {mentionCount === 0 && (
              <Empty
                text={
                  googleSource?.status === "failed" ||
                  newsSource?.status === "failed"
                    ? "Some web or news searches could not be completed. A failed search is not evidence that no mentions exist."
                    : "No web or news mentions were returned for the searches performed."
                }
              />
            )}
            <MentionGroup title="Web mentions" results={webResults} />
            <MentionGroup title="News mentions" results={newsResults} />
          </div>
        )}

        {activeTab === "nearby" && (
          <NearbyPlaces
            places={neighborhood}
            unavailable={sourceErrors.includes("Neighborhood")}
          />
        )}
      </div>

    </div>
  );
}

function HeroLink({ href, icon: Icon, label, light = false }) {
  const isPhone = href.startsWith("tel:");

  return (
    <a
      href={href}
      target={isPhone ? undefined : "_blank"}
      rel={isPhone ? undefined : "noreferrer"}
      className={`inline-flex max-w-full items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
        light
          ? "border border-black/[0.08] text-[#5A564F] hover:border-[#C9A24B]/40 hover:text-[#9C7A1F] dark:border-white/[0.1] dark:text-[#B7B2A8] dark:hover:text-[#D6B26A]"
          : "bg-white/10 text-[#F4F1EA] backdrop-blur hover:bg-white/20"
      }`}
    >
      <Icon size={13} className="shrink-0" />
      <span className="break-all">{label}</span>
      {!isPhone && <ArrowUpRight size={11} className="shrink-0" />}
    </a>
  );
}

function SignalList({ title, icon: Icon, items = [], empty, tone }) {
  const positive = tone === "good";
  const iconClass = positive
    ? "text-[#4A7A54] dark:text-[#6E9277]"
    : "text-[#9C7A1F] dark:text-[#D6B26A]";
  const shell = positive
    ? "border-black/[0.08] bg-white dark:border-white/[0.07] dark:bg-[#1B1E24]"
    : "border-[#C9A24B]/25 bg-[#C9A24B]/[0.06]";

  return (
    <section className={`min-w-0 rounded-2xl border p-5 ${shell}`}>
      <div className="flex items-center gap-2">
        <Icon size={17} className={iconClass} />
        <h3 className={`text-sm font-semibold ${heading}`}>{title}</h3>
      </div>
      {items?.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex min-w-0 items-start gap-3 text-sm leading-6 text-[#403C35] dark:text-[#B7B2A8]"
            >
              <Icon size={15} className={`mt-1 shrink-0 ${iconClass}`} />
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`mt-3 text-xs leading-5 ${muted}`}>{empty}</p>
      )}
    </section>
  );
}

function PhotoStrip({ photos, name }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {photos.map((photo, index) => (
        <a
          key={`${photo}-${index}`}
          href={photo}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.07]"
        >
          <img
            src={photo}
            alt={`${name || "Listing"} photo ${index + 2}`}
            loading="lazy"
            className="h-10 w-10 object-cover transition-transform hover:scale-105 sm:h-28 sm:w-44"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </a>
      ))}
    </div>
  );
}

function Reviews({ reviews, reviewsLink, unavailable }) {
  if (!reviews?.length) {
    return (
      <Empty
        text={
          unavailable
            ? "Google reviews could not be loaded for this investigation."
            : "No public Google reviews were returned for this listing."
        }
      />
    );
  }

  return (
    <div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {reviews.map((review, index) => (
          <article
            key={`${review.author}-${review.date}-${index}`}
            className={`${card} min-w-0 p-4`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`min-w-0 truncate text-sm font-medium ${heading}`}>
                {review.author || "Google reviewer"}
              </p>
              {review.rating != null && (
                <span className="flex shrink-0 items-center gap-1 text-xs text-[#9C7A1F] dark:text-[#D6B26A]">
                  <Star size={11} className="fill-current" />
                  {review.rating}
                </span>
              )}
            </div>
            {review.snippet && (
              <p className="mt-2 break-words text-xs leading-5 text-[#5A564F] dark:text-[#8A8680]">
                {review.snippet}
              </p>
            )}
            {review.date && (
              <p className={`mt-2 text-[10px] ${muted}`}>{review.date}</p>
            )}
          </article>
        ))}
      </div>
      {reviewsLink && (
        <a
          href={reviewsLink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-[#9C7A1F] hover:text-[#C9A24B] dark:text-[#C9A24B]"
        >
          See all reviews on Google
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}

function MentionGroup({ title, results }) {
  if (!results?.length) return null;

  return (
    <section className="min-w-0">
      <h3 className={`text-sm font-semibold ${heading}`}>{title}</h3>
      <div className="mt-4 space-y-3">
        {results.map((result, index) => (
          <a
            key={`${result.link || result.title}-${index}`}
            href={result.link}
            target="_blank"
            rel="noreferrer"
            className={`${card} block min-w-0 p-4 transition hover:border-[#C9A24B]/40`}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <p className={`min-w-0 break-words text-sm font-medium ${heading}`}>
                {result.title || "Untitled result"}
              </p>
              <ArrowUpRight
                size={14}
                className="mt-0.5 shrink-0 text-[#8A8680]"
              />
            </div>
            {result.snippet && (
              <p className="mt-2 break-words text-xs leading-5 text-[#5A564F] dark:text-[#8A8680]">
                {result.snippet}
              </p>
            )}
            {result.date && (
              <p className={`mt-2 text-[10px] ${muted}`}>{result.date}</p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function NearbyPlaces({ places, unavailable }) {
  if (!places.length) {
    return (
      <Empty
        text={
          unavailable
            ? "Nearby places could not be loaded for this investigation."
            : "No nearby places were returned for the searched area."
        }
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place, index) => {
        const link = mapsLink(
          place.coordinates,
          [place.name, place.address].filter(Boolean).join(" "),
        );

        return (
          <article
            key={`${place.name}-${place.address}-${index}`}
            className={`${card} flex min-w-0 items-start justify-between gap-3 p-4`}
          >
            <div className="min-w-0">
              <p className={`break-words text-sm ${heading}`}>
                {place.name || "Unnamed place"}
              </p>
              <p className={`mt-0.5 break-words text-xs ${muted}`}>
                {place.type || place.address || "Nearby place"}
              </p>
              {place.address && place.type && (
                <p className={`mt-1 break-words text-[11px] ${muted}`}>
                  {place.address}
                </p>
              )}
              {place.rating != null && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[#9C7A1F] dark:text-[#D6B26A]">
                  <Star size={10} className="fill-current" />
                  {place.rating}
                  {place.reviewCount != null &&
                    ` · ${place.reviewCount} reviews`}
                </p>
              )}
            </div>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${place.name || "nearby place"} on Google Maps`}
                className="shrink-0 rounded-md p-1.5 text-[#9C7A1F] transition hover:bg-[#C9A24B]/10 dark:text-[#C9A24B]"
              >
                <MapPin size={14} />
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Empty({ text }) {
  return <div className={`${card} p-6 text-center text-sm ${muted}`}>{text}</div>;
}

export default ListingDetails;
