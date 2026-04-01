import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import { localePath } from "@/lib/locale-path";

const supportedLocales = ["en", "ko", "ja"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [];

  // Generate locale-specific static pages
  for (const locale of supportedLocales) {
    staticPages.push(
      {
        url: `${SITE_URL}${localePath(locale)}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${SITE_URL}${localePath(locale, "/posts")}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}${localePath(locale, "/search")}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      },
    );
  }

  let postEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = await prisma.post.findMany({
      where: { published: true, noIndex: false },
      select: { slug: true, updatedAt: true, language: true },
    });

    postEntries = posts.map((post) => ({
      url: `${SITE_URL}${localePath(post.language || "en", `/posts/${post.slug}`)}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const categories = await prisma.category.findMany({
      select: { slug: true, createdAt: true },
    });

    // Categories exist in all locales
    for (const locale of supportedLocales) {
      categoryEntries.push(
        ...categories.map((cat) => ({
          url: `${SITE_URL}${localePath(locale, `/category/${cat.slug}`)}`,
          lastModified: cat.createdAt,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      );
    }
  } catch {
    // DB not configured
  }

  return [...staticPages, ...postEntries, ...categoryEntries];
}
