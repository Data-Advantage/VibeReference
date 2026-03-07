import type { MetadataRoute } from "next";
import { CATEGORIES, getAllTopics } from "@/lib/directory";

export const dynamic = "force-static";

const BASE_URL = "https://vibereference.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const topics = getAllTopics();

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const topicUrls: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${BASE_URL}/${topic.category}/${topic.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...topicUrls,
  ];
}
