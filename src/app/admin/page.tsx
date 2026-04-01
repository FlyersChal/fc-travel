import Link from "next/link";
import { getPosts } from "@/lib/db/posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function AdminPage() {
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  try {
    const result = await getPosts({ perPage: 100 });
    posts = result.posts;
  } catch {
    // DB not configured or no posts yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <Link href="/admin/posts/new">
          <Button>새 글 작성</Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/categories">
          <Button variant="outline">카테고리 관리</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">전체 글</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">아직 작성된 글이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "발행됨" : "임시저장"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/posts/${post.id}`}>
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
