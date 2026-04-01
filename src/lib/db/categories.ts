import { prisma } from "@/lib/prisma";
import type { Category } from "@/types";

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

export async function getCategories() {
  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => toCategory(r as unknown as Record<string, unknown>));
}

export async function getCategoryBySlug(slug: string) {
  const row = await prisma.category.findUniqueOrThrow({ where: { slug } });
  return toCategory(row as unknown as Record<string, unknown>);
}

export async function createCategory(
  data: Pick<Category, "name" | "slug" | "description" | "sort_order">
) {
  const row = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      sortOrder: data.sort_order,
    },
  });
  return toCategory(row as unknown as Record<string, unknown>);
}

export async function updateCategory(
  id: string,
  data: Partial<Pick<Category, "name" | "slug" | "description" | "sort_order">>
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.sort_order !== undefined) updateData.sortOrder = data.sort_order;

  const row = await prisma.category.update({ where: { id }, data: updateData });
  return toCategory(row as unknown as Record<string, unknown>);
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
}
