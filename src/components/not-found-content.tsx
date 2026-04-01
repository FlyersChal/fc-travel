"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import { FadeIn } from "@/components/fade-in";

export function NotFoundContent() {
  const { locale, t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FadeIn>
        <p className="text-8xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("notFound.description")}
        </p>
      </FadeIn>
      <FadeIn delay={150}>
        <Link
          href={localePath(locale)}
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {t("notFound.goHome")}
        </Link>
        <div className="mt-4 flex gap-4 justify-center">
          <Link
            href={localePath(locale, "/posts")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("notFound.posts")}
          </Link>
          <Link
            href={localePath(locale, "/search")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("notFound.search")}
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
