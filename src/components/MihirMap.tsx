"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { locations } from "@/content/site";
import type { Location, LocationCategory } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import {
  getMapConfigurationDiagnostic,
  getVisibleMapLocations,
  hasValidCoordinates,
  locationCategories,
  locationCategoryLabels,
  type MapDiagnostic,
} from "@/lib/locations";

type GoogleMap = { fitBounds(bounds: unknown): void };
type GoogleMapsRuntime = {
  LatLngBounds: new () => { extend(point: { lat: number; lng: number }): void };
  Map?: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => GoogleMap;
  marker?: {
    AdvancedMarkerElement?: new (options: Record<string, unknown>) => {
      addEventListener(event: string, callback: () => void): void;
    };
  };
};
declare global {
  interface Window {
    google?: { maps: GoogleMapsRuntime };
    initialiseMihirMap?: () => void;
  }
}

let googleMapsPromise: Promise<GoogleMapsRuntime> | undefined;

export function loadGoogleMaps(apiKey: string) {
  if (
    window.google?.maps.Map &&
    window.google.maps.marker?.AdvancedMarkerElement
  ) {
    return Promise.resolve(window.google.maps);
  }
  if (googleMapsPromise) return googleMapsPromise;
  googleMapsPromise = new Promise<GoogleMapsRuntime>((resolve, reject) => {
    window.initialiseMihirMap = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error("Google Maps did not initialise"));
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=marker&v=weekly&loading=async&callback=initialiseMihirMap`;
    script.async = true;
    script.dataset.googleMaps = "true";
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps='true']",
    );
    if (existing) {
      existing.addEventListener("error", () =>
        reject(new Error("Google Maps failed to load")),
      );
    } else {
      document.head.appendChild(script);
    }
  });
  return googleMapsPromise;
}

export function resetGoogleMapsLoaderForTests() {
  googleMapsPromise = undefined;
}

export const markerStyles: Record<
  LocationCategory,
  { colour: string; size: number; borderWidth: number }
> = {
  lived: { colour: "#FF5A36", size: 32, borderWidth: 4 },
  travelled: { colour: "#C3A46B", size: 18, borderWidth: 3 },
};

export function MihirMap() {
  const invalidLocationCount = useMemo(
    () =>
      locations.filter(
        (location) =>
          location.publicationStatus === "public" &&
          !hasValidCoordinates(location),
      ).length,
    [],
  );
  const [activeCategories, setActiveCategories] =
    useState<LocationCategory[]>(locationCategories);
  const [selectedId, setSelectedId] = useState(
    () => getVisibleMapLocations(locations, locationCategories)[0]?.id ?? "",
  );
  const [status, setStatus] = useState<
    "fallback" | "loading" | "ready" | "error"
  >(
    getMapConfigurationDiagnostic() === undefined && !invalidLocationCount
      ? "loading"
      : "fallback",
  );
  const [diagnostic, setDiagnostic] = useState<MapDiagnostic | undefined>(
    invalidLocationCount
      ? "location-data-invalid"
      : getMapConfigurationDiagnostic(),
  );
  const mapElement = useRef<HTMLDivElement>(null);
  const visible = useMemo(
    () => getVisibleMapLocations(locations, activeCategories),
    [activeCategories],
  );
  const selected =
    visible.find((location) => location.id === selectedId) ?? visible[0];
  const selectLocation = useCallback((location: Location) => {
    setSelectedId(location.id);
    trackEvent("map_location_selected", {
      location_name: location.name,
      location_category: location.category,
    });
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
    const configurationDiagnostic = getMapConfigurationDiagnostic(key, mapId);
    if (configurationDiagnostic) {
      setDiagnostic(configurationDiagnostic);
      setStatus("fallback");
      return;
    }
    if (!visible.length || !mapElement.current) {
      if (!visible.length && invalidLocationCount) {
        setDiagnostic("location-data-invalid");
        setStatus("fallback");
      }
      return;
    }
    const apiKey = key!;
    let cancelled = false;
    async function initialise() {
      try {
        const mapsRuntime = await loadGoogleMaps(apiKey);
        if (cancelled || !mapElement.current) return;
        const MapConstructor = mapsRuntime.Map;
        const AdvancedMarker = mapsRuntime.marker
          ?.AdvancedMarkerElement as NonNullable<
          NonNullable<GoogleMapsRuntime["marker"]>["AdvancedMarkerElement"]
        >;
        if (!MapConstructor || !AdvancedMarker) {
          throw new Error("Google Maps libraries are unavailable");
        }
        const map = new MapConstructor(mapElement.current, {
          mapId,
          disableDefaultUI: true,
          zoomControl: true,
        });
        const bounds = new mapsRuntime.LatLngBounds();
        visible.forEach((location) => {
          const [lat, lng] = location.coordinates;
          const markerStyle = markerStyles[location.category];
          const pin = document.createElement("button");
          pin.type = "button";
          pin.className = "rounded-full border-white shadow-lg";
          pin.dataset.placeCategory = location.category;
          pin.style.width = `${markerStyle.size}px`;
          pin.style.height = `${markerStyle.size}px`;
          pin.style.borderWidth = `${markerStyle.borderWidth}px`;
          pin.style.background = markerStyle.colour;
          if (location.current)
            pin.style.boxShadow = "0 0 0 4px #C7F43D, 0 8px 18px #11111133";
          pin.setAttribute(
            "aria-label",
            `${location.name}, ${location.country}, ${locationCategoryLabels[location.category]}${location.current ? ", current home" : ""}`,
          );
          const marker = new AdvancedMarker({
            map,
            position: { lat, lng },
            title: `${location.name}, ${location.country}`,
            content: pin,
            gmpClickable: true,
          });
          marker.addEventListener("gmp-click", () => selectLocation(location));
          bounds.extend({ lat, lng });
        });
        if (visible.length) map.fitBounds(bounds);
        if (!cancelled) {
          setDiagnostic(undefined);
          setStatus("ready");
        }
      } catch (error) {
        const nextDiagnostic =
          error instanceof Error && error.message.includes("failed to load")
            ? "script-failed"
            : "initialisation-failed";
        if (process.env.NODE_ENV === "development") {
          console.warn(`Mihir Map: ${nextDiagnostic}`, error);
        }
        if (!cancelled) {
          setDiagnostic(nextDiagnostic);
          setStatus("error");
        }
      }
    }
    void initialise();
    return () => {
      cancelled = true;
    };
  }, [invalidLocationCount, selectLocation, visible]);

  function toggleCategory(category: LocationCategory) {
    const enabling = !activeCategories.includes(category);
    trackEvent("map_filter_changed", {
      filter_value: enabling ? "enabled" : "disabled",
      location_category: category,
    });
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,.5fr)]">
      <div className="min-w-0">
        <fieldset>
          <legend className="eyebrow mb-4">Filter the map</legend>
          <div className="flex flex-wrap gap-2">
            {locationCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategories.includes(category)}
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-3 py-2 text-xs ${activeCategories.includes(category) ? "bg-ink text-cream" : "bg-transparent"}`}
              >
                <span
                  className="mr-2 inline-block rounded-full"
                  style={{
                    width: `${Math.max(markerStyles[category].size / 2.5, 8)}px`,
                    height: `${Math.max(markerStyles[category].size / 2.5, 8)}px`,
                    background: markerStyles[category].colour,
                  }}
                  aria-hidden
                />
                {locationCategoryLabels[category]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="relative mt-5 h-[28rem] w-full overflow-hidden rounded-2xl bg-teal sm:h-[32rem] lg:h-[36rem]">
          <div
            ref={mapElement}
            className={`absolute inset-0 ${status === "ready" ? "block" : "hidden"}`}
            aria-label="Google map of confirmed places"
          />
          {status !== "ready" && (
            <div className="absolute inset-0 grid place-items-center p-7 text-center text-cream">
              <div className="max-w-md">
                <p className="eyebrow">
                  {status === "loading"
                    ? "Loading the map"
                    : status === "error"
                      ? "Map temporarily unavailable"
                      : "Map preview"}
                </p>
                <h2 className="mt-4 font-serif text-4xl">
                  The places remain visible without Google.
                </h2>
                <p className="text-cream/80 mt-4 text-sm">
                  {status === "fallback"
                    ? "Configure the Google Maps API key and Map ID to enable the interactive map. The accessible place list remains available now."
                    : "Use the place list while the map is unavailable."}
                </p>
                {process.env.NODE_ENV === "development" && diagnostic && (
                  <p className="mt-4 font-mono text-xs" role="status">
                    Diagnostic: {diagnostic}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <aside aria-label="Locations" className="min-w-0">
        <p className="eyebrow mb-4">{visible.length} confirmed places</p>
        {selected && (
          <article className="card bg-cream p-5" aria-live="polite">
            <p className="eyebrow">
              {locationCategoryLabels[selected.category]} · {selected.country}
              {selected.region ? ` · ${selected.region}` : ""}
            </p>
            <h2 className="mt-3 font-serif text-4xl">{selected.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.approximateDuration && (
                <span className="border-ink/25 rounded-full border px-3 py-1 font-mono text-xs">
                  {selected.approximateDuration}
                </span>
              )}
              {selected.current && (
                <span className="rounded-full bg-chartreuse px-3 py-1 font-mono text-xs text-ink">
                  Current home
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed">{selected.context}</p>
            {selected.chapters.length > 1 && (
              <ol className="border-ink/15 mt-5 space-y-3 border-t pt-4">
                {[...selected.chapters]
                  .sort((first, second) => first.sequence - second.sequence)
                  .map((chapter) => (
                    <li key={`${selected.id}-${chapter.sequence}`}>
                      <p className="font-semibold">{chapter.label}</p>
                      <p className="mt-1 font-mono text-xs">
                        {chapter.approximateDuration}
                      </p>
                      <p className="mt-1 text-sm">{chapter.context}</p>
                    </li>
                  ))}
              </ol>
            )}
          </article>
        )}
        {visible.length ? (
          <>
            <p
              id="places-scroll-note"
              className="text-ink/70 mt-4 font-mono text-xs"
            >
              Scroll to explore all {visible.length} places.
            </p>
            <div
              role="region"
              aria-label="Confirmed places list"
              aria-describedby="places-scroll-note"
              tabIndex={0}
              className="mt-2 max-h-[34rem] space-y-5 overflow-y-auto rounded-sm pr-1"
            >
              {locationCategories.map((category) => {
                const categoryLocations = visible.filter(
                  (location) => location.category === category,
                );
                if (!categoryLocations.length) return null;
                return (
                  <section
                    key={category}
                    aria-labelledby={`places-${category}`}
                  >
                    <h2
                      id={`places-${category}`}
                      className="eyebrow sticky top-0 z-10 bg-bone py-2"
                    >
                      {locationCategoryLabels[category]} ·{" "}
                      {categoryLocations.length}
                    </h2>
                    <div className="space-y-2">
                      {categoryLocations.map((location) => (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => selectLocation(location)}
                          aria-pressed={selected?.id === location.id}
                          aria-label={`${location.name}, ${locationCategoryLabels[location.category]}`}
                          className={`w-full rounded-xl border p-3 text-left ${selected?.id === location.id ? "border-cobalt bg-cobalt text-white" : "border-ink/20 bg-cream"}`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block shrink-0 rounded-full border-2 border-current"
                              style={{
                                width: `${Math.max(markerStyles[location.category].size / 2, 10)}px`,
                                height: `${Math.max(markerStyles[location.category].size / 2, 10)}px`,
                                background:
                                  markerStyles[location.category].colour,
                              }}
                              aria-hidden
                            />
                            <span>
                              <span className="block font-serif text-2xl">
                                {location.name}
                              </span>
                              <span className="mt-1 block text-xs">
                                {location.region ? `${location.region}, ` : ""}
                                {location.country}
                                {location.current ? " · Current home" : ""}
                              </span>
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <p className="card mt-4 p-5">
            No confirmed places match those filters.
          </p>
        )}
      </aside>
    </div>
  );
}
