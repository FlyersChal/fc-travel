import { notFound } from "next/navigation";
import { getPosts } from "@/lib/db/posts";
import { InfinitePostList } from "@/components/infinite-post-list";
import { PostsPageTitle } from "@/components/posts-page-title";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { isValidLocale } from "@/lib/i18n-config";
import { localePath } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { ko: "글 목록", en: "Posts", ja: "記事一覧" };
  const descriptions: Record<string, string> = {
    ko: "플라이어스챨의 모든 글을 확인하세요.",
    en: "Browse all posts on Flyerschal.",
    ja: "フライヤースチャルのすべての記事をご覧ください。",
  };
  return {
    title: titles[locale] || titles.ko,
    description: descriptions[locale] || descriptions.ko,
    alternates: { canonical: `${SITE_URL}${localePath(locale, "/posts")}` },
  };
}

const PER_PAGE = 10;

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  let count = 0;
  try {
    const result = await getPosts({ page: 1, perPage: PER_PAGE, published: true, language: locale });
    posts = result.posts;
    count = result.count;
  } catch {
    // DB not configured
  }
  const hasMore = PER_PAGE < count;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Breadcrumb items={[{ label: "breadcrumb.posts" }]} />
      <PostsPageTitle />
      <InfinitePostList
        initialPosts={posts}
        initialHasMore={hasMore}
        perPage={PER_PAGE}
        locale={locale}
      />
    </div>
  );
}
