import type { MetadataRoute } from "next";
import { SITE_URL, PROFILE_IMAGE, PUBLIC_CONTENT_UPDATED_AT } from "../lib/site-profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      images: [`${SITE_URL}${PROFILE_IMAGE}`],
      lastModified: PUBLIC_CONTENT_UPDATED_AT,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
