import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/utils/get-site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getSiteUrl().toString(), changeFrequency: "monthly" }];
}
