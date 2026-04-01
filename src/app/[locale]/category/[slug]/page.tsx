import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/db/categories";
import { getPosts } from "@/lib/db/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { isValidLocale } from "@/lib/i18n-config";
import { localePath } from "@/lib/locale-path";
import { Breadcrumb } from "@/components/breadcrumb";

const PER_PAGE = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: category.name,
      description: category.description || `${category.name}`,
      alternates: { canonical: `${SITE_URL}${localePath(locale, `/category/${slug}`)}` },
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));

  let category;
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  let count = 0;
  try {
    category = await getCategoryBySlug(slug);
    const result = await getPosts({
      page,
      perPage: PER_PAGE,
      published: true,
      categoryId: category.id,
      language: locale,
    });
    posts = result.posts;
    count = result.count;
  } catch {
    notFound();
  }
  const totalPages = Math.ceil(count / PER_PAGE);

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: category.name }]} />
      <div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
      </div>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={localePath(locale, `/category/${slug}`)}
      />
    </div>
  );
}
