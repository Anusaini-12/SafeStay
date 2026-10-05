import test from "node:test";
import assert from "node:assert/strict";
import { normalizeListing } from "../services/normalizeListing.js";

test("normalizes available Google Maps listing fields without inventing missing values", () => {
  const listing = normalizeListing({
    title: "Example PG",
    place_id: "google-place-id",
    data_id: "maps-data-id",
    address: "Exact address, Bengaluru",
    rating: 4.6,
    reviews: 27,
    phone: "+91 12345 67890",
    website: "https://example.invalid",
    gps_coordinates: { latitude: 12.9, longitude: 77.6 },
    thumbnail: "https://example.invalid/thumb.jpg",
    images: [
      { title: "Front", thumbnail: "https://example.invalid/photo.jpg" },
    ],
  });

  assert.equal(listing.name, "Example PG");
  assert.equal(listing.placeId, "google-place-id");
  assert.equal(listing.dataId, "maps-data-id");
  assert.equal(listing.address, "Exact address, Bengaluru");
  assert.equal(listing.rating, 4.6);
  assert.equal(listing.reviewCount, 27);
  assert.equal(listing.phone, "+91 12345 67890");
  assert.equal(listing.website, "https://example.invalid");
  assert.deepEqual(listing.coordinates, {
    latitude: 12.9,
    longitude: 77.6,
  });
  assert.ok(listing.photos.includes("https://example.invalid/photo.jpg"));

  const sparseListing = normalizeListing({ title: "Sparse PG" });
  assert.equal(sparseListing.reviewCount, null);
  assert.equal(sparseListing.website, null);
  assert.deepEqual(sparseListing.photos, []);
});
