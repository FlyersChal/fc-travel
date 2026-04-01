"use client";

import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/fade-in";

export function PostsPageTitle() {
  const { t } = useLocale();

  return (
    <FadeIn delay={0}>
      <h1 className="text-3xl font-bold tracking-tight">{t("posts.title")}</h1>
    </FadeIn>
  );
}
