"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface PostData {
  title: string;
  slug: string;
  content: string;
  content_type: "markdown" | "html" | "mdx";
  excerpt: string | null;
  cover_image: string | null;
  category_id: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  scheduled_at: string | null;
  published: boolean;
  source: "web" | "api" | "cron";
}

export async function savePostAction(
  postId: string | null,
  data: PostData
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    const prismaData = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      contentType: data.content_type,
      excerpt: data.excerpt,
      coverImage: data.cover_image,
      categoryId: data.category_id,
      tags: data.tags,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      ogImage: data.og_image,
      canonicalUrl: data.canonical_url,
      noIndex: data.no_index,
      scheduledAt: data.scheduled_at ? new Date(data.scheduled_at) : null,
      published: data.published,
      source: data.source,
    };

    if (postId) {
      await prisma.post.update({ where: { id: postId }, data: prismaData });
    } else {
      await prisma.post.create({ data: prismaData });
    }

    revalidatePath("/admin");
    revalidatePath("/posts");
    revalidatePath("/");
    return {};
  } catch (err) {
    console.error("savePostAction error:", err);
    return { error: "저장에 실패했습니다" };
  }
}

export async function deletePostAction(
  postId: string
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    await prisma.post.delete({ where: { id: postId } });

    revalidatePath("/admin");
    revalidatePath("/posts");
    revalidatePath("/");
    return {};
  } catch (err) {
    console.error("deletePostAction error:", err);
    return { error: "삭제에 실패했습니다" };
  }
}
