import { describe, expect, it } from "vitest";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteAnalytics } from "./SiteAnalytics";

describe("production analytics configuration", () => {
  it("renders the official integration in production when the ID exists", () => {
    expect(
      SiteAnalytics({
        measurementId: " G-1G3R8K61VF ",
        nodeEnv: "production",
      }),
    ).toMatchObject({
      type: GoogleAnalytics,
      props: { gaId: "G-1G3R8K61VF" },
    });
  });

  it.each(["development", "test"])("renders nothing in %s mode", (nodeEnv) => {
    expect(
      SiteAnalytics({ measurementId: "G-1G3R8K61VF", nodeEnv }),
    ).toBeNull();
  });

  it("renders nothing in production when the ID is absent", () => {
    expect(
      SiteAnalytics({ measurementId: undefined, nodeEnv: "production" }),
    ).toBeNull();
    expect(
      SiteAnalytics({ measurementId: "  ", nodeEnv: "production" }),
    ).toBeNull();
  });
});
