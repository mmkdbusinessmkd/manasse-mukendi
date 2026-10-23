import type { MetadataRoute } from "next";
import { SITE_URL, PROFILE_IMAGE } from "../lib/site-profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      images: [`${SITE_URL}${PROFILE_IMAGE}`],
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
