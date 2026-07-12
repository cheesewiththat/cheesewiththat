import type { Location, LocationCategory } from "@/content/types";

export const locationCategories: LocationCategory[] = [
  "Lived",
  "Worked",
  "Visited",
  "Client work",
  "Events and conferences",
  "Photographed",
  "Want to visit",
];

export function validateLocation(location: Location) {
  const [latitude, longitude] = location.coordinates;
  const errors: string[] = [];
  if (!location.city.trim() || !location.country.trim())
    errors.push("City and country are required");
  if (latitude < -90 || latitude > 90) errors.push("Latitude is out of range");
  if (longitude < -180 || longitude > 180)
    errors.push("Longitude is out of range");
  if (
    !location.categories.length ||
    location.categories.some(
      (category) => !locationCategories.includes(category),
    )
  )
    errors.push("At least one valid category is required");
  if (!location.reason.trim() || !location.story.trim())
    errors.push("Reason and public story are required");
  return { valid: errors.length === 0, errors };
}

export function hasGoogleMapsConfiguration(
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
) {
  return Boolean(apiKey?.trim() && mapId?.trim());
}
