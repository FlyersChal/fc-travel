import { getPostsByTag } from "@/lib/db/posts";
import { PostCard } from "@/components/post-card";
import { TagsPageTitle } from "@/components/post-nav-labels";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Metadata } from "next";

const LOCALE = "en";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Tag: ${decodedTag}`,
    description: `Posts tagged with "${decodedTag}"`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const { posts } = await getPostsByTag(decodedTag, { language: LOCALE });

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-8 px-3 md:px-4">
      <Breadcrumb items={[{ label: "breadcrumb.tags", href: "/tags" }, { label: decodedTag }]} />
      <TagsPageTitle tag={decodedTag} />
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts found.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={LOCALE} />
          ))}
        </div>
      )}
    </div>
  );
}
