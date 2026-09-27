export function normalizeListing(listing) {
  return {
    id: listing.place_id,
    dataId: listing.data_id ?? null, // needed for a follow-up "place details" call
    name: listing.title,
    address: listing.address,
    rating: listing.rating ?? null,
    reviewCount: listing.reviews ?? 0,
    phone: listing.phone ?? null,
    image: listing.thumbnail ?? null,
    type: listing.type ?? null,
    coordinates: listing.gps_coordinates ?? null,
  };
}