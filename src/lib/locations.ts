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

export type MapDiagnostic =
  | "api-key-missing"
  | "map-id-missing"
  | "script-failed"
  | "location-data-invalid"
  | "initialisation-failed";

export function hasValidCoordinates(location: Pick<Location, "coordinates">) {
  const [latitude, longitude] = location.coordinates;
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function getMapConfigurationDiagnostic(
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
): MapDiagnostic | undefined {
  if (!apiKey?.trim()) return "api-key-missing";
  if (!mapId?.trim()) return "map-id-missing";
  return undefined;
}

export function getVisibleMapLocations(
  records: Location[],
  categories: LocationCategory[],
) {
  return records.filter(
    (location) =>
      location.public &&
      hasValidCoordinates(location) &&
      location.categories.some((category) => categories.includes(category)),
  );
}

export function validateLocation(location: Location) {
  const [latitude, longitude] = location.coordinates;
  const errors: string[] = [];
  if (!location.city.trim() || !location.country.trim())
    errors.push("City and country are required");
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    errors.push("Latitude is invalid or out of range");
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    errors.push("Longitude is invalid or out of range");
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
  return getMapConfigurationDiagnostic(apiKey, mapId) === undefined;
}
