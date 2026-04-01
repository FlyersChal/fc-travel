"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/post-card";
import { FadeIn } from "@/components/fade-in";
import { useLocale } from "@/lib/i18n";
import type { Post } from "@/types";

interface InfinitePostListProps {
  initialPosts: Post[];
  initialHasMore: boolean;
  perPage: number;
  locale?: string;
}

export function InfinitePostList({
  initialPosts,
  initialHasMore,
  perPage,
  locale = "ko",
}: InfinitePostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialCount] = useState(initialPosts.length);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/posts?page=${page}&perPage=${perPage}&published=true&language=${locale}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("[infinite-post-list] Failed to fetch posts:", err);
      setError(t("posts.error"));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, perPage, locale, t]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground">{t("posts.empty")}</p>
    );
  }

  return (
    <>
      <div className="divide-y divide-border">
        {posts.map((post, i) => (
          i < initialCount ? (
            <PostCard key={post.id} post={post} locale={locale} />
          ) : (
            <FadeIn key={post.id} delay={(i - initialCount) % perPage * 60}>
              <PostCard post={post} locale={locale} />
            </FadeIn>
          )
        ))}
      </div>

      {error && (
        <div className="flex flex-col items-center gap-2 py-6">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={loadMore}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
          >
            {t("posts.retry")}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">
          {t("posts.allLoaded")}
        </p>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </>
  );
}
