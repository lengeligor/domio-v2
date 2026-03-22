import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: Replace with Supabase query when connected
  const properties = MOCK_PROPERTIES;

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/nehnutelnost/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/nehnutelnosti`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...propertyUrls,
  ];
}
