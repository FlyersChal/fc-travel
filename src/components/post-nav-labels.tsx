"use client";

import { useLocale } from "@/lib/i18n";

export function PostViewCount({ count }: { count: number }) {
  const { t } = useLocale();
  return <span>{t("post.views")} {count}</span>;
}

export function PrevPostLabel() {
  const { t } = useLocale();
  return <p className="text-xs text-muted-foreground mb-1">&larr; {t("post.prev")}</p>;
}

export function NextPostLabel() {
  const { t } = useLocale();
  return <p className="text-xs text-muted-foreground mb-1">{t("post.next")} &rarr;</p>;
}

export function RelatedPostsTitle() {
  const { t } = useLocale();
  return <h2 className="text-lg md:text-xl font-bold mb-4">{t("post.related")}</h2>;
}

export function ReadingTime({ minutes }: { minutes: number }) {
  const { t } = useLocale();
  const text = t("post.readTime").replace("{min}", String(minutes));
  return <span>{text}</span>;
}

export function TagsPageTitle({ tag }: { tag: string }) {
  const { t } = useLocale();
  return <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("tags.title")}: {tag}</h1>;
}
