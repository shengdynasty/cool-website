import type { MetadataRoute } from "next";
import { canonicalUrl, routes } from "@/content/seo";

export const dynamic = "force-static";

/** Same URL set and trailing-slash form as the previous site's sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return Object.keys(routes).map((route) => ({ url: canonicalUrl(route), lastModified }));
}
