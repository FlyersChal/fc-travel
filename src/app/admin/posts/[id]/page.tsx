import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db/posts";
import { getCategories } from "@/lib/db/categories";
import { PostForm } from "@/components/post-form";
import type { Category } from "@/types";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post;
  let categories: Category[] = [];
  try {
    post = await getPostById(id);
    try {
      categories = await getCategories();
    } catch {
      // ok
    }
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">글 수정</h1>
      <PostForm post={post} categories={categories} />
    </div>
  );
}
