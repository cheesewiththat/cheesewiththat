import { describe, expect, it } from "vitest";
import { getProductionAnalyticsId } from "@/lib/analytics-config";

describe("production analytics configuration", () => {
  it.each(["cheesewiththat.com", "www.cheesewiththat.com"])(
    "allows the production host %s when the build gate is enabled",
    (hostname) => {
      expect(
        getProductionAnalyticsId({
          measurementId: " G-1G3R8K61VF ",
          enabled: true,
          hostname,
        }),
      ).toBe("G-1G3R8K61VF");
    },
  );

  it.each([
    "localhost",
    "127.0.0.1",
    "main.example.amplifyapp.com",
    "pr-7.example.amplifyapp.com",
    "preview.cheesewiththat.com",
  ])("rejects non-production host %s", (hostname) => {
    expect(
      getProductionAnalyticsId({
        measurementId: "G-1G3R8K61VF",
        enabled: true,
        hostname,
      }),
    ).toBeUndefined();
  });

  it("rejects a missing ID or disabled build gate", () => {
    expect(
      getProductionAnalyticsId({
        measurementId: undefined,
        enabled: true,
        hostname: "cheesewiththat.com",
      }),
    ).toBeUndefined();
    expect(
      getProductionAnalyticsId({
        measurementId: "G-1G3R8K61VF",
        enabled: false,
        hostname: "cheesewiththat.com",
      }),
    ).toBeUndefined();
  });
});
