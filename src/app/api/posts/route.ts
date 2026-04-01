import { getPosts } from "@/lib/db/posts";
import { requireAdmin } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") ?? "10", 10)));
  const publishedParam = searchParams.get("published");
  let published: boolean | undefined = true;

  if (publishedParam !== "true") {
    // Requesting drafts or all posts requires admin auth
    try {
      await requireAdmin();
      published = publishedParam === "false" ? false : undefined;
    } catch {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const language = searchParams.get("language") || undefined;

  try {
    const { posts, count } = await getPosts({ page, perPage, published, language });
    const hasMore = page * perPage < count;
    return Response.json({ posts, count, hasMore });
  } catch (error) {
    console.error("[api/posts] Failed to fetch posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
