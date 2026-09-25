export function normalizeListing(listing) {
  return {
    id: listing.place_id,
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
