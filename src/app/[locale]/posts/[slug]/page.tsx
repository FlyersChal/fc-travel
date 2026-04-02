import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getAdjacentPosts, getRelatedPosts, incrementViewCount } from "@/lib/db/posts";
import { getReadingTime } from "@/lib/reading-time";
import { PostContent } from "@/components/post-content";
import { extractTocFromMarkdown, extractTocFromHtml } from "@/lib/toc";
import { TableOfContents } from "@/components/table-of-contents";
import { FadeIn } from "@/components/fade-in";
import { ShareButtons } from "@/components/share-buttons";
import { PostViewCount, PrevPostLabel, NextPostLabel, RelatedPostsTitle, ReadingTime } from "@/components/post-nav-labels";
import { Breadcrumb } from "@/components/breadcrumb";
import { ReadingProgress } from "@/components/reading-progress";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { isValidLocale } from "@/lib/i18n-config";
import { localePath } from "@/lib/locale-path";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const post = await getPostBySlug(slug, locale);
    const title = post.meta_title || post.title;
    const description = post.meta_description || post.excerpt || undefined;
    const images = post.og_image || post.cover_image ? [{ url: post.og_image || post.cover_image! }] : undefined;
    const canonical = post.canonical_url || `${SITE_URL}${localePath(locale, `/posts/${post.slug}`)}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        images,
        type: "article",
        locale: locale,
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
      },
      twitter: {
        card: images ? "summary_large_image" : "summary",
        title,
        description,
        images,
      },
      robots: post.no_index ? { index: false } : undefined,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  let post;
  try {
    post = await getPostBySlug(slug, locale);
  } catch {
    notFound();
  }

  if (!post.published) {
    notFound();
  }

  // Fire-and-forget view count increment
  incrementViewCount(post.id).catch((error) => {
    console.error("[post] Failed to increment view count:", error);
  });

  const tocItems =
    post.content_type === "html"
      ? extractTocFromHtml(post.content)
      : extractTocFromMarkdown(post.content);

  const readingMinutes = getReadingTime(post.content);

  const [adjacent, relatedPosts] = await Promise.all([
    getAdjacentPosts(post.id, true, locale),
    getRelatedPosts(post.id, {
      categoryId: post.category_id,
      tags: post.tags,
      language: locale,
      limit: 3,
    }),
  ]);

  const dateLocaleMap: Record<string, string> = {
    ko: "ko-KR", en: "en-US", ja: "ja-JP", zh: "zh-CN",
    vi: "vi-VN", th: "th-TH", es: "es-ES", fr: "fr-FR",
    de: "de-DE", id: "id-ID", hi: "hi-IN",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    inLanguage: locale,
    author: { "@type": "Person", name: "Author" },
    ...(post.cover_image && { image: post.cover_image }),
    ...(post.excerpt && { description: post.excerpt }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <div className="max-w-5xl mx-auto py-4 md:py-8 px-3 md:px-4">
        <Breadcrumb
          items={[
            { label: "breadcrumb.posts", href: localePath(locale, "/posts") },
            { label: post.title },
          ]}
        />
        <article>
          {post.cover_image && (
            post.cover_image.includes("/uploads/") ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full max-h-48 md:max-h-96 object-cover rounded-sm mb-4 md:mb-8"
              />
            ) : (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full max-h-48 md:max-h-96 object-cover rounded-sm mb-4 md:mb-8"
                loading="lazy"
                style={{ aspectRatio: "16/9" }}
              />
            )
          )}
          <header className="mb-6 md:mb-10">
            <FadeIn delay={100}>
              <h1 className="text-2xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight tracking-tight">
                {post.title}
              </h1>
            </FadeIn>
            <div className="mt-3 flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString(dateLocaleMap[locale] || "ko-KR")}
              </time>
              <span className="text-border">|</span>
              <PostViewCount count={post.view_count} />
              <span className="text-border">|</span>
              <ReadingTime minutes={readingMinutes} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={localePath(locale, `/tags/${encodeURIComponent(tag)}`)}
                      className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              <ShareButtons
                url={`${SITE_URL}${localePath(locale, `/posts/${post.slug}`)}`}
                title={post.title}
              />
            </div>
            <div className="mt-6 md:mt-8 border-b border-border" />
          </header>

          {/* Mobile TOC (select only) */}
          <div className="md:hidden">
            {tocItems.length > 0 && <TableOfContents items={tocItems} />}
          </div>

          <div className="md:flex md:gap-10">
            {/* Main content */}
            <div className="max-w-3xl flex-1 min-w-0">
              <PostContent content={post.content} contentType={post.content_type} />
            </div>

            {/* Desktop TOC sidebar (nav only) */}
            {tocItems.length > 0 && (
              <aside className="hidden md:block w-64 shrink-0">
                <div className="sticky top-20">
                  <TableOfContents items={tocItems} />
                </div>
              </aside>
            )}
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border mt-8 md:mt-12 pt-4 md:pt-8">
            <RelatedPostsTitle />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={localePath(locale, `/posts/${rp.slug}`)}
                  className="group block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  {rp.cover_image && (
                    <img
                      src={rp.cover_image}
                      alt={rp.title}
                      className="w-full h-24 object-cover rounded mb-2"
                      loading="lazy"
                    />
                  )}
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {rp.title}
                  </h3>
                  {rp.excerpt && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {rp.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-10">
          <div className="rounded-2xl bg-muted/50 border border-border p-6 md:p-10 text-center">
            <p className="text-lg md:text-xl font-semibold mb-2">Planning a trip to Korea?</p>
            <p className="text-sm text-muted-foreground mb-4">
              Need help with itinerary, transportation, or local tips? Feel free to reach out.
            </p>
            <a
              href="https://travel.flyerschal.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </a>
          </div>
        </section>

        {/* Previous/Next post navigation */}
        {(adjacent.prev || adjacent.next) && (
          <nav className="border-t border-border mt-8 md:mt-12 pt-4 md:pt-8">
            <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4">
              {adjacent.prev ? (
                <Link
                  href={localePath(locale, `/posts/${adjacent.prev.slug}`)}
                  className="group flex-1 min-w-0 p-3 md:p-4 rounded-lg transition-colors hover:bg-muted"
                >
                  <PrevPostLabel />
                  <p className="text-xs md:text-sm font-medium truncate group-hover:text-foreground">
                    {adjacent.prev.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1 hidden sm:block" />
              )}
              {adjacent.next ? (
                <Link
                  href={localePath(locale, `/posts/${adjacent.next.slug}`)}
                  className="group flex-1 min-w-0 p-3 md:p-4 rounded-lg transition-colors hover:bg-muted sm:text-right"
                >
                  <NextPostLabel />
                  <p className="text-xs md:text-sm font-medium truncate group-hover:text-foreground">
                    {adjacent.next.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
