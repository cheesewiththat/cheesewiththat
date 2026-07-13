import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { brandAssets } from "@/lib/brand-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f2e5",
    theme_color: "#111111",
    icons: [
      {
        src: brandAssets.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: brandAssets.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
