import { MapPin, Phone, Star, MessageSquare } from "lucide-react";

function ListingCard({ listing, onInvestigate, isLoading = false, disabled = false }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#1B1E24] transition-colors hover:border-[#C9A24B]/30">
      <div className="relative h-52 w-full overflow-hidden bg-[#14161A]">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wider text-[#5A564F]">
            No image preview
          </div>
        )}

        <span className="absolute top-3 left-3 rounded-full border border-white/[0.12] bg-[#14161A]/80 px-3 py-1 text-[11px] font-medium text-[#D8D4CB]">
          {listing.type || "PG"}
        </span>

        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/[0.12] bg-[#14161A]/80 px-2.5 py-1 text-[11px] font-medium text-[#D6B26A]">
          <Star size={12} className="fill-current" />
          {listing.rating ?? "N/A"}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-display line-clamp-1 text-lg text-[#F4F1EA]">{listing.name}</h3>

          <div className="mt-2 flex items-start gap-2 text-sm text-[#8A8680]">
            <MapPin size={14} className="mt-0.5 shrink-0 text-[#6E6A62]" />
            <span className="line-clamp-1">{listing.address || "Address not available"}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#6E6A62]">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={13} />
              <span>{listing.reviewCount ?? 0} reviews</span>
            </div>
            {listing.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={13} />
                <span>{listing.phone}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onInvestigate(listing)}
          disabled={disabled}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-4 py-3 text-sm font-medium text-[#D6B26A] transition-colors hover:bg-[#C9A24B]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#D6B26A]/30 border-t-[#D6B26A]" />
              <span>Investigating...</span>
            </>
          ) : (
            <span>Investigate this stay</span>
          )}
        </button>
      </div>
    </article>
  );
}

export default ListingCard;
