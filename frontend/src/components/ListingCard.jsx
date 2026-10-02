import {
  MapPin,
  Phone,
  Star,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

function ListingCard({
  listing,
  onInvestigate,
  isLoading = false,
  disabled = false,
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] dark:border-white/[0.07] dark:bg-[#1B1E24] dark:shadow-none dark:hover:border-[#C9A24B]/30 dark:hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1EFE9] dark:bg-[#14161A]">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#B0AAA0] dark:text-[#5A564F]">
            <MapPin size={22} strokeWidth={1.4} />
            <span className="text-[10px] uppercase tracking-[0.16em]">
              No image available
            </span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Type */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#403C35] shadow-sm backdrop-blur dark:bg-[#14161A]/90 dark:text-[#D8D4CB]">
          {listing.type || "PG"}
        </span>

        {/* Rating */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#9C7A1F] shadow-sm backdrop-blur dark:bg-[#14161A]/90 dark:text-[#D6B26A]">
          <Star size={12} className="fill-current" />
          <span>{listing.rating ?? "N/A"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display line-clamp-2 text-xl leading-tight text-[#1B1E24] dark:text-[#F4F1EA]">
              {listing.name}
            </h3>

            <ArrowUpRight
              size={17}
              className="mt-1 shrink-0 text-[#B0AAA0] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C9A24B] dark:text-[#5A564F]"
            />
          </div>

          {/* Address */}
          <div className="mt-4 flex items-start gap-2.5">
            <MapPin
              size={15}
              className="mt-0.5 shrink-0 text-[#C9A24B]"
            />
            <p className="line-clamp-2 text-sm leading-5 text-[#5A564F] dark:text-[#9B968C]">
              {listing.address || "Address not available"}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/[0.07] pt-4 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <MessageSquare
                size={14}
                className="shrink-0 text-[#8A8680] dark:text-[#6E6A62]"
              />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#A19C93] dark:text-[#6E6A62]">
                  Reviews
                </p>
                <p className="mt-0.5 text-xs font-medium text-[#403C35] dark:text-[#C8C3B9]">
                  {listing.reviewCount ?? 0}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <Phone
                size={14}
                className="shrink-0 text-[#8A8680] dark:text-[#6E6A62]"
              />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-[#A19C93] dark:text-[#6E6A62]">
                  Contact
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-[#403C35] dark:text-[#C8C3B9]">
                  {listing.phone || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onInvestigate(listing)}
          disabled={disabled}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B1E24] px-4 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#292D34] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#EDEAE3] dark:text-[#1B1E24] dark:hover:bg-white"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-[#1B1E24]/30 dark:border-t-[#1B1E24]" />
              <span>Investigating...</span>
            </>
          ) : (
            <>
              <span>Investigate this stay</span>
              <ArrowUpRight size={15} />
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default ListingCard;
