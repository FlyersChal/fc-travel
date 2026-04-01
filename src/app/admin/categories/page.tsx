import { getCategories } from "@/lib/db/categories";
import { CategoryManager } from "@/components/category-manager";
import type { Category } from "@/types";

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    // DB not configured or no categories yet
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">카테고리 관리</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
