import { existsSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { brandAssets } from "@/lib/brand-assets";
import { BrandHomeLink } from "./BrandHomeLink";

const publicAssets = Object.values(brandAssets);

describe("BrandHomeLink", () => {
  it("renders a labelled homepage link with a fixed-size logo", () => {
    const markup = renderToStaticMarkup(<BrandHomeLink />);

    expect(markup).toContain('href="/"');
    expect(markup).toContain('aria-label="Cheesewiththat home"');
    expect(markup).toContain(brandAssets.headerMark.slice(1));
    expect(markup).toContain('width="32"');
    expect(markup).toContain('height="32"');
  });

  it.each(publicAssets)("ships the public asset %s", (asset) => {
    expect(existsSync(join(process.cwd(), "public", asset.slice(1)))).toBe(
      true,
    );
  });
});
