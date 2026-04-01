import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Post } from "@/types";

function toPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    content: row.content as string,
    content_type: row.contentType as Post["content_type"],
    excerpt: row.excerpt as string | null,
    cover_image: row.coverImage as string | null,
    meta_title: row.metaTitle as string | null,
    meta_description: row.metaDescription as string | null,
    og_image: row.ogImage as string | null,
    canonical_url: row.canonicalUrl as string | null,
    no_index: row.noIndex as boolean,
    published: row.published as boolean,
    scheduled_at: row.scheduledAt
      ? (row.scheduledAt as Date).toISOString()
      : null,
    category_id: row.categoryId as string | null,
    source: row.source as Post["source"],
    tags: row.tags as string[],
    language: (row.language as string) ?? "ko",
    view_count: row.viewCount as number,
    created_at: (row.createdAt as Date).toISOString(),
    updated_at: (row.updatedAt as Date).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const language = request.nextUrl.searchParams.get("language") || undefined;

  if (!q) {
    return Response.json({ posts: [], count: 0 });
  }

  const where: Record<string, unknown> = {
    published: true,
    OR: [
      { title: { contains: q, mode: "insensitive" as const } },
      { content: { contains: q, mode: "insensitive" as const } },
    ],
  };

  if (language) {
    where.language = language;
  }

  const [rows, count] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.post.count({ where }),
  ]);

  const posts = rows.map((r) => toPost(r as unknown as Record<string, unknown>));

  return Response.json({ posts, count });
}
