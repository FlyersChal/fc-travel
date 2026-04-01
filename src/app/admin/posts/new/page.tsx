import { getCategories } from "@/lib/db/categories";
import { PostForm } from "@/components/post-form";
import type { Category } from "@/types";

export default async function NewPostPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    // DB not configured or no categories yet
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">새 글 작성</h1>
      <PostForm categories={categories} />
    </div>
  );
}
