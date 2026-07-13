import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  loadGoogleMaps,
  MihirMap,
  resetGoogleMapsLoaderForTests,
} from "./MihirMap";
import { locations } from "@/content/site";

afterEach(() => {
  resetGoogleMapsLoaderForTests();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Mihir Map fallback", () => {
  it("keeps the accessible location list and explicit map height without configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "");
    const html = renderToStaticMarkup(<MihirMap />);
    expect(html).toContain("Map preview");
    expect(html).toContain("h-[28rem]");
    expect(html).toContain('aria-label="Locations"');
    expect(html).toContain(locations[0].city);
  });
});

describe("Google Maps loader", () => {
  it("reuses one loader promise and appends the script once", () => {
    let appended = 0;
    const script = {
      dataset: {} as Record<string, string>,
      addEventListener: vi.fn(),
    };
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", {
      createElement: () => script,
      querySelector: () => null,
      head: { appendChild: () => (appended += 1) },
    });
    const first = loadGoogleMaps("example-key");
    const second = loadGoogleMaps("example-key");
    expect(second).toBe(first);
    expect(appended).toBe(1);
  });
});
