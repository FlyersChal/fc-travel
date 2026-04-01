"use client";

import Link from "next/link";
import Image from "next/image";
import { localePath } from "@/lib/locale-path";
import type { Post } from "@/types";

function getPostImage(post: Post): string | null {
  if (post.cover_image) return post.cover_image;
  const mdMatch = post.content.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch) return mdMatch[1];
  const htmlMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (htmlMatch) return htmlMatch[1];
  return null;
}

function isNextOptimizable(src: string): boolean {
  // Static uploads are served by Nginx, not available inside the container
  if (src.startsWith("/uploads/") || src.includes("/uploads/")) return false;
  return src.startsWith("/");
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark> : part
  );
}

export function PostCard({ post, locale, highlightQuery }: { post: Post; locale?: string; highlightQuery?: string }) {
  const lang = locale || post.language || "ko";
  const image = getPostImage(post);

  return (
    <Link
      href={localePath(lang, `/posts/${post.slug}`)}
      className="relative block py-5 border-b border-border transition-all duration-200 hover:bg-muted/70 hover:border-l-[3px] hover:border-l-primary hover:pl-3"
    >
      {image && (
        isNextOptimizable(image) ? (
          <Image
            src={image}
            alt={post.title}
            width={800}
            height={176}
            className="w-full h-36 md:h-44 object-cover rounded mb-3"
            loading="lazy"
          />
        ) : (
          <img
            src={image}
            alt={post.title}
            className="w-full h-36 md:h-44 object-cover rounded mb-3"
            loading="lazy"
            style={{ aspectRatio: "16/9" }}
          />
        )
      )}
      <h3 className="text-base font-semibold leading-snug">
        {highlightQuery ? highlightText(post.title, highlightQuery) : post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {highlightQuery ? highlightText(post.excerpt, highlightQuery) : post.excerpt}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleDateString("ko-KR")}
        </time>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={localePath(lang, `/tags/${encodeURIComponent(tag)}`)}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground bg-muted px-3 py-2 min-h-[36px] inline-flex items-center rounded hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
