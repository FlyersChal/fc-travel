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
    scheduled_at: row.scheduledAt ? (row.scheduledAt as Date).toISOString() : null,
    category_id: row.categoryId as string | null,
    source: row.source as Post["source"],
    tags: row.tags as string[],
    language: (row.language as string) ?? "ko",
    view_count: row.viewCount as number,
    created_at: (row.createdAt as Date).toISOString(),
    updated_at: (row.updatedAt as Date).toISOString(),
  };
}

export async function getPosts({
  page = 1,
  perPage = 10,
  published,
  categoryId,
  language,
}: {
  page?: number;
  perPage?: number;
  published?: boolean | null;
  categoryId?: string;
  language?: string;
} = {}) {
  const where: Record<string, unknown> = {};
  if (published !== null && published !== undefined) {
    where.published = published;
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (language) {
    where.language = language;
  }

  const [rows, count] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts: rows.map((r) => toPost(r as unknown as Record<string, unknown>)), count };
}

export async function getPostBySlug(slug: string, language?: string) {
  if (language) {
    const row = await prisma.post.findUnique({
      where: { slug_language: { slug, language } },
    });
    if (!row) throw new Error(`Post not found: ${slug} (${language})`);
    return toPost(row as unknown as Record<string, unknown>);
  }
  // Fallback: find by slug only (for admin/api usage)
  const row = await prisma.post.findFirst({ where: { slug } });
  if (!row) throw new Error(`Post not found: ${slug}`);
  return toPost(row as unknown as Record<string, unknown>);
}

export async function getPostById(id: string) {
  const row = await prisma.post.findUniqueOrThrow({ where: { id } });
  return toPost(row as unknown as Record<string, unknown>);
}

export async function createPost(
  data: Omit<Post, "id" | "created_at" | "updated_at" | "view_count">
) {
  const row = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      contentType: data.content_type,
      excerpt: data.excerpt,
      coverImage: data.cover_image,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      ogImage: data.og_image,
      canonicalUrl: data.canonical_url,
      noIndex: data.no_index,
      published: data.published,
      scheduledAt: data.scheduled_at ? new Date(data.scheduled_at) : null,
      categoryId: data.category_id,
      source: data.source,
      tags: data.tags,
      language: data.language || "ko",
    },
  });
  return toPost(row as unknown as Record<string, unknown>);
}

export async function updatePost(
  id: string,
  data: Partial<Omit<Post, "id" | "created_at" | "updated_at">>
) {
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.content_type !== undefined) updateData.contentType = data.content_type;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.cover_image !== undefined) updateData.coverImage = data.cover_image;
  if (data.meta_title !== undefined) updateData.metaTitle = data.meta_title;
  if (data.meta_description !== undefined) updateData.metaDescription = data.meta_description;
  if (data.og_image !== undefined) updateData.ogImage = data.og_image;
  if (data.canonical_url !== undefined) updateData.canonicalUrl = data.canonical_url;
  if (data.no_index !== undefined) updateData.noIndex = data.no_index;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.scheduled_at !== undefined) updateData.scheduledAt = data.scheduled_at ? new Date(data.scheduled_at) : null;
  if (data.category_id !== undefined) updateData.categoryId = data.category_id;
  if (data.source !== undefined) updateData.source = data.source;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.language !== undefined) updateData.language = data.language;

  const row = await prisma.post.update({ where: { id }, data: updateData });
  return toPost(row as unknown as Record<string, unknown>);
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
}

export async function getAdjacentPosts(currentId: string, published: boolean = true, language?: string) {
  const current = await prisma.post.findUniqueOrThrow({
    where: { id: currentId },
    select: { createdAt: true, language: true },
  });

  const where: Record<string, unknown> = {};
  if (published) where.published = true;
  // Adjacent posts should be in the same language
  where.language = language || current.language;

  const [prevRow, nextRow] = await Promise.all([
    prisma.post.findFirst({
      where: { ...where, createdAt: { lt: current.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.post.findFirst({
      where: { ...where, createdAt: { gt: current.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return {
    prev: prevRow ? { slug: prevRow.slug, title: prevRow.title } : null,
    next: nextRow ? { slug: nextRow.slug, title: nextRow.title } : null,
  };
}

export async function getRelatedPosts(
  postId: string,
  options: {
    categoryId?: string | null;
    tags?: string[];
    language?: string;
    limit?: number;
  }
): Promise<
  {
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image: string | null;
  }[]
> {
  const limit = options.limit ?? 3;
  const lang = options.language ?? "ko";

  // Find posts that share the same category OR have overlapping tags
  const orConditions: Record<string, unknown>[] = [];
  if (options.categoryId) {
    orConditions.push({ categoryId: options.categoryId });
  }
  if (options.tags && options.tags.length > 0) {
    orConditions.push({ tags: { hasSome: options.tags } });
  }

  if (orConditions.length === 0) return [];

  const rows = await prisma.post.findMany({
    where: {
      id: { not: postId },
      published: true,
      language: lang,
      OR: orConditions,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
    },
  });

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    cover_image: r.coverImage,
  }));
}

export async function getPostsByTag(
  tag: string,
  options: { language?: string }
): Promise<{ posts: Post[]; count: number }> {
  const where: Record<string, unknown> = {
    published: true,
    tags: { has: tag },
  };
  if (options.language) {
    where.language = options.language;
  }

  const [rows, count] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: rows.map((r) => toPost(r as unknown as Record<string, unknown>)),
    count,
  };
}

export async function incrementViewCount(id: string) {
  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}
