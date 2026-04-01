"use client";

import { useLocale } from "@/lib/i18n";

export function SearchPageTitle() {
  const { t } = useLocale();
  return <h1 className="text-3xl font-bold tracking-tight">{t("search.title")}</h1>;
}
