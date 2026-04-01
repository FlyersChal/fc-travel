import { getPosts } from "@/lib/db/posts";
import { InfinitePostList } from "@/components/infinite-post-list";
import { PostsPageTitle } from "@/components/posts-page-title";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "글 목록",
  description: "플라이어스챨의 모든 글을 확인하세요.",
  alternates: { canonical: `${SITE_URL}/posts` },
};

const PER_PAGE = 10;

export default async function PostsPage() {
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  let count = 0;
  try {
    const result = await getPosts({ page: 1, perPage: PER_PAGE, published: true, language: "ko" });
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
        locale="ko"
      />
    </div>
  );
}
