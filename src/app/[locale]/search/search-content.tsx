"use client";

import { useState, useEffect, useRef } from "react";
import { PostCard } from "@/components/post-card";
import { useLocale } from "@/lib/i18n";
import type { Post } from "@/types";

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark> : part
  );
}

export function SearchContent({ locale }: { locale: string }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setPosts([]);
      setCount(0);
      setSearched(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&language=${locale}`
        );
        const data = await res.json();
        setPosts(data.posts);
        setCount(data.count);
        setSearched(true);
      } catch {
        setPosts([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, locale]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search.placeholder")}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        autoFocus
      />

      {loading && (
        <p className="text-sm text-muted-foreground">{t("search.searching")}</p>
      )}

      {searched && !loading && count === 0 && (
        <p className="text-muted-foreground">{t("search.noResults")}</p>
      )}

      {searched && !loading && count > 0 && (
        <p className="text-sm text-muted-foreground">
          {count}{t("search.results")}
        </p>
      )}

      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} highlightQuery={query.trim()} />
        ))}
      </div>
    </div>
  );
}
