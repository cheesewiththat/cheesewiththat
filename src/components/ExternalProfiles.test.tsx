import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ExternalProfiles } from "./ExternalProfiles";
import { externalProfiles, site } from "@/content/site";

describe("external profiles and brand", () => {
  it("renders only configured external profiles with safe accessible links", () => {
    const markup = renderToStaticMarkup(<ExternalProfiles />);
    expect(markup).toContain("Mihir’s previous blog");
    expect(markup).toContain("0–1 Products");
    expect(markup).not.toContain("LinkedIn");
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain("opens in a new tab");
    expect(
      externalProfiles.filter((profile) => !profile.configured),
    ).toHaveLength(4);
  });
  it("uses the exact public brand casing", () => {
    expect(site.name).toBe("Cheesewiththat");
    expect(site.name).not.toContain("Cheese With That");
  });
});
