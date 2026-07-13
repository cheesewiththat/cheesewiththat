"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { locations } from "@/content/site";
import type { LocationCategory } from "@/content/types";
import {
  getMapConfigurationDiagnostic,
  getVisibleMapLocations,
  hasValidCoordinates,
  locationCategories,
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

const markerColours: Record<LocationCategory, string> = {
  Lived: "#FF5A36",
  Worked: "#315CFF",
  Visited: "#C3A46B",
  "Client work": "#653C78",
  "Events and conferences": "#C7F43D",
  Photographed: "#087F78",
  "Want to visit": "#E10600",
};

export function MihirMap() {
  const invalidLocationCount = useMemo(
    () =>
      locations.filter(
        (location) => location.public && !hasValidCoordinates(location),
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
          const pin = document.createElement("button");
          pin.type = "button";
          pin.className =
            "h-7 w-7 rounded-full border-4 border-white shadow-lg";
          pin.style.background = markerColours[location.categories[0]];
          pin.setAttribute(
            "aria-label",
            `${location.city}, ${location.country}`,
          );
          const marker = new AdvancedMarker({
            map,
            position: { lat, lng },
            title: `${location.city}, ${location.country}`,
            content: pin,
            gmpClickable: true,
          });
          marker.addEventListener("gmp-click", () =>
            setSelectedId(location.id),
          );
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
  }, [invalidLocationCount, visible]);

  function toggleCategory(category: LocationCategory) {
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
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ background: markerColours[category] }}
                  aria-hidden
                />
                {category}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="relative mt-5 h-[28rem] w-full overflow-hidden rounded-2xl bg-teal sm:h-[32rem] lg:h-[36rem]">
          <div
            ref={mapElement}
            className={`absolute inset-0 ${status === "ready" ? "block" : "hidden"}`}
            aria-label="Google map of public locations"
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
                  The stories still work without Google.
                </h2>
                <p className="text-cream/80 mt-4 text-sm">
                  {status === "fallback"
                    ? "Configure the Google Maps API key and Map ID to enable the interactive map. The accessible city list remains available now."
                    : "Use the city list while the map is unavailable."}
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
        <p className="eyebrow mb-4">{visible.length} public locations</p>
        {visible.length ? (
          <div className="space-y-2">
            {visible.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => setSelectedId(location.id)}
                aria-pressed={selected?.id === location.id}
                className={`w-full rounded-xl border p-4 text-left ${selected?.id === location.id ? "border-cobalt bg-cobalt text-white" : "border-ink/20"}`}
              >
                <span className="eyebrow">
                  {location.country} · {location.period}
                </span>
                <span className="mt-2 block font-serif text-3xl">
                  {location.city}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="card p-5">No public locations match those filters.</p>
        )}
        {selected && (
          <article className="card mt-4 bg-cream p-5" aria-live="polite">
            <p className="eyebrow">
              {selected.contextType} · {selected.categories.join(" · ")}
            </p>
            <h2 className="mt-3 font-serif text-4xl">{selected.city}</h2>
            <p className="mt-3 font-semibold">{selected.reason}</p>
            <p className="mt-3 text-sm leading-relaxed">{selected.story}</p>
          </article>
        )}
      </aside>
    </div>
  );
}
