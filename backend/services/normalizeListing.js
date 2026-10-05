function photoUrl(photo) {
  if (typeof photo === "string") return photo;
  if (!photo || typeof photo !== "object") return null;

  return photo.image ?? photo.thumbnail ?? photo.url ?? null;
}

export function normalizeListing(listing) {
  const photos = [
    ...(Array.isArray(listing.photos) ? listing.photos : []),
    ...(Array.isArray(listing.images) ? listing.images : []),
  ]
    .map(photoUrl)
    .filter(Boolean);

  const image = listing.thumbnail ?? photos[0] ?? null;

  return {
    id: listing.place_id ?? listing.data_id ?? null,
    placeId: listing.place_id ?? null,
    dataId: listing.data_id ?? null,
    name: listing.title ?? null,
    address: listing.address ?? null,
    rating: listing.rating ?? null,
    reviewCount: listing.reviews ?? null,
    phone: listing.phone ?? null,
    website: listing.website ?? listing.links?.website ?? null,
    image,
    photos: [...new Set(photos.length ? photos : image ? [image] : [])],
    type: listing.type ?? null,
    coordinates: listing.gps_coordinates ?? null,
  };
}