"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";

export default function LocaleError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { locale, t } = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-semibold">
        {t("error.title")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t("error.description")}
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => unstable_retry()}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {t("error.retry")}
        </button>
        <Link
          href={localePath(locale)}
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
        >
          {t("error.goHome")}
        </Link>
      </div>
    </div>
  );
}
