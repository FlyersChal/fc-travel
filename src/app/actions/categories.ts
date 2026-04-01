"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/types";

interface CategoryData {
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    sort_order: row.sortOrder as number,
    created_at: (row.createdAt as Date).toISOString(),
  };
}

export async function saveCategoryAction(
  categoryId: string | null,
  data: CategoryData
): Promise<{ data?: Category; error?: string }> {
  try {
    await requireAdmin();

    const prismaData = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      sortOrder: data.sort_order,
    };

    if (categoryId) {
      const row = await prisma.category.update({
        where: { id: categoryId },
        data: prismaData,
      });
      revalidatePath("/admin/categories");
      revalidatePath("/");
      return { data: toCategory(row as unknown as Record<string, unknown>) };
    } else {
      const row = await prisma.category.create({ data: prismaData });
      revalidatePath("/admin/categories");
      revalidatePath("/");
      return { data: toCategory(row as unknown as Record<string, unknown>) };
    }
  } catch (err) {
    console.error("saveCategoryAction error:", err);
    return { error: "저장에 실패했습니다" };
  }
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    await prisma.category.delete({ where: { id: categoryId } });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return {};
  } catch (err) {
    console.error("deleteCategoryAction error:", err);
    return { error: "삭제에 실패했습니다" };
  }
}
