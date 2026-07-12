import type { MetadataRoute } from "next";
import { articles, photographs, prints, site } from "@/content/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/mihir",
    "/work",
    "/work/profile",
    "/work/selected-work",
    "/ideas",
    "/map",
    "/photography",
    "/collect",
    "/collect/prints",
    "/engage",
    "/engage/consulting",
    "/engage/training",
    "/engage/book",
    "/engage/cv",
    "/now",
    "/privacy",
    "/terms",
  ];
  return [
    ...routes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...articles
      .filter((a) => !a.draft)
      .map((a) => ({
        url: `${site.url}/ideas/${a.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...photographs.map((p) => ({
      url: `${site.url}/photography/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...prints.map((p) => ({
      url: `${site.url}/collect/prints/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
