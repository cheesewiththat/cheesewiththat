import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type AnalyticsEventParameters,
  resetAnalyticsForTests,
  trackEvent,
} from "./analytics";

afterEach(() => {
  resetAnalyticsForTests();
  vi.unstubAllGlobals();
});

describe("analytics events", () => {
  it("does nothing when Google Analytics is unavailable", () => {
    vi.stubGlobal("window", { location: { pathname: "/engage/cv" } });
    expect(() => trackEvent("cv_request_submitted")).not.toThrow();
  });

  it("sends only allow-listed non-sensitive parameters", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {
      gtag,
      location: { pathname: "/mihir" },
    });
    const parameters = {
      link_label: "LinkedIn",
      destination_type: "linkedin",
      email: "not-for-analytics@example.com",
    } as AnalyticsEventParameters & { email: string };

    trackEvent("external_link_clicked", parameters);

    expect(gtag).toHaveBeenCalledWith("event", "external_link_clicked", {
      link_label: "LinkedIn",
      destination_type: "linkedin",
      page_path: "/mihir",
    });
    expect(gtag.mock.calls[0]).not.toContain("not-for-analytics@example.com");
  });

  it("suppresses an immediate duplicate without blocking later actions", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {
      gtag,
      location: { pathname: "/map" },
    });

    trackEvent("map_location_selected", {
      location_name: "Nagpur",
      location_category: "lived",
    });
    trackEvent("map_location_selected", {
      location_name: "Nagpur",
      location_category: "lived",
    });

    expect(gtag).toHaveBeenCalledTimes(1);
  });

  it("swallows provider failures", () => {
    vi.stubGlobal("window", {
      gtag: () => {
        throw new Error("blocked");
      },
      location: { pathname: "/map" },
    });
    expect(() =>
      trackEvent("map_filter_changed", {
        filter_value: "disabled",
        location_category: "travelled",
      }),
    ).not.toThrow();
  });
});
