import type { Location, LocationCategory } from "@/content/types";

export const locationCategories: LocationCategory[] = ["lived", "travelled"];

export const locationCategoryLabels: Record<LocationCategory, string> = {
  lived: "Places lived",
  travelled: "Places travelled",
};

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
  return records
    .filter(
      (location) =>
        location.publicationStatus === "public" &&
        location.verified &&
        hasValidCoordinates(location) &&
        categories.includes(location.category),
    )
    .sort((first, second) => {
      if (first.category !== second.category)
        return first.category === "lived" ? -1 : 1;
      if (first.category === "lived")
        return (
          (first.sequence ?? Number.MAX_SAFE_INTEGER) -
          (second.sequence ?? Number.MAX_SAFE_INTEGER)
        );
      return `${first.country}-${first.name}`.localeCompare(
        `${second.country}-${second.name}`,
      );
    });
}

export function validateLocation(location: Location) {
  const [latitude, longitude] = location.coordinates;
  const errors: string[] = [];
  if (!location.name.trim() || !location.country.trim())
    errors.push("Name and country are required");
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    errors.push("Latitude is invalid or out of range");
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    errors.push("Longitude is invalid or out of range");
  if (!locationCategories.includes(location.category))
    errors.push("A valid place category is required");
  if (!location.context.trim()) errors.push("Confirmed context is required");
  if (!location.verified) errors.push("Location must be verified");
  if (location.current && location.category !== "lived")
    errors.push("Current home must be a lived location");
  if (
    location.chapters.some(
      (chapter) =>
        !chapter.label.trim() ||
        !chapter.approximateDuration.trim() ||
        !chapter.context.trim() ||
        !Number.isInteger(chapter.sequence),
    )
  )
    errors.push("Location chapters are incomplete");
  return { valid: errors.length === 0, errors };
}

export function hasGoogleMapsConfiguration(
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
) {
  return getMapConfigurationDiagnostic(apiKey, mapId) === undefined;
}
