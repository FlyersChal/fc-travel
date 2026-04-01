import { notFound } from "next/navigation";
import { getPosts } from "@/lib/db/posts";
import { HomeContent } from "@/components/home-content";
import { isValidLocale } from "@/lib/i18n-config";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  try {
    const result = await getPosts({ perPage: 6, published: true, language: locale });
    posts = result.posts;
  } catch (error) {
    console.error("[home] Failed to load posts:", error);
  }

  return <HomeContent posts={posts} locale={locale} />;
}
