import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type AnalyticsEventParameters,
  resetAnalyticsForTests,
  trackEvent,
} from "./analytics";

afterEach(() => {
  resetAnalyticsForTests();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function enableProductionAnalytics() {
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-1G3R8K61VF");
  vi.stubEnv("NODE_ENV", "production");
}

describe("analytics events", () => {
  it("does nothing when Google Analytics is unavailable", () => {
    enableProductionAnalytics();
    vi.stubGlobal("window", {
      location: {
        pathname: "/engage/cv",
      },
    });
    expect(() => trackEvent("cv_request_submitted")).not.toThrow();
  });

  it.each(["development", "test"])(
    "does not emit events in %s mode",
    (nodeEnv) => {
      vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-1G3R8K61VF");
      vi.stubEnv("NODE_ENV", nodeEnv);
      const gtag = vi.fn();
      vi.stubGlobal("window", {
        gtag,
        location: { pathname: "/map" },
      });
      trackEvent("map_location_selected", {
        location_name: "Nagpur",
        location_category: "lived",
      });
      expect(gtag).not.toHaveBeenCalled();
    },
  );

  it("sends only allow-listed non-sensitive parameters", () => {
    enableProductionAnalytics();
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
    enableProductionAnalytics();
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
    enableProductionAnalytics();
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
