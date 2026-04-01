"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { PostCard } from "@/components/post-card";
import { FadeIn } from "@/components/fade-in";
import { localePath } from "@/lib/locale-path";
import type { Post } from "@/types";

export function HomeContent({ posts, locale }: { posts: Post[]; locale: string }) {
  const { t } = useLocale();

  const descLines = t("home.description").split("\n");

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4 md:py-8">
      {/* Hero section */}
      <section className="py-2 md:py-4">
        <FadeIn delay={0}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" style={{ letterSpacing: "-0.02em" }}>
            {t("home.title")}
          </h1>
        </FadeIn>
        <FadeIn delay={100}>
          <p className="mt-4 text-base md:text-lg text-muted-foreground/80 leading-relaxed">
            {descLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < descLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </FadeIn>
      </section>

      {/* Latest posts */}
      <section>
        <FadeIn delay={200}>
          <h2 className="text-xl font-semibold mb-1">{t("home.recent")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t("home.recent.desc")}</p>
        </FadeIn>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">{t("home.empty")}</p>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={280 + i * 80}>
                <PostCard post={post} locale={locale} />
              </FadeIn>
            ))}
          </div>
        )}
        <FadeIn delay={280 + posts.length * 80}>
          <div className="mt-6">
            <Link
              href={localePath(locale, "/posts")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("home.viewAll")} &rarr;
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
