import { getPosts } from "@/lib/db/posts";
import { HomeContent } from "@/components/home-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  try {
    const result = await getPosts({ perPage: 6, published: true, language: "en" });
    posts = result.posts;
  } catch (error) {
    console.error("[home] Failed to load posts:", error);
  }

  return <HomeContent posts={posts} locale="en" />;
}
