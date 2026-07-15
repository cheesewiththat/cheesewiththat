import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ExternalProfiles } from "./ExternalProfiles";
import { externalProfiles, site } from "@/content/site";

describe("external profiles and brand", () => {
  it("renders only configured external profiles with safe accessible links", () => {
    const markup = renderToStaticMarkup(<ExternalProfiles />);
    const expectedLinks = {
      LinkedIn: "https://www.linkedin.com/in/mihirsatokar/",
      X: "https://x.com/cheesewiththat",
      Instagram: "https://www.instagram.com/cheesewiththat",
      GitHub: "https://github.com/cheesewiththat",
      "Current company": "https://cloudsmartz.com/contact-us/",
      "Previous blog": "https://mihirspeaks.blogspot.com",
      "0–1 Products": "https://0-1products.com",
    };
    for (const [label, href] of Object.entries(expectedLinks)) {
      expect(markup).toContain(label);
      expect(markup).toContain(`href="${href}"`);
    }
    expect(markup).not.toContain("Facebook");
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain("opens in a new tab");
    expect(
      externalProfiles.filter((profile) => !profile.configured),
    ).toHaveLength(1);
  });
  it("uses the exact public brand casing", () => {
    expect(site.name).toBe("Cheesewiththat");
    expect(site.name).not.toContain("Cheese With That");
  });
});
