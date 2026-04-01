import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SearchContent } from "./search-content";
import { SearchPageTitle } from "@/components/search-page-title";
import { Breadcrumb } from "@/components/breadcrumb";
import { SITE_URL } from "@/lib/constants";
import { isValidLocale } from "@/lib/i18n-config";
import { localePath } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { ko: "검색", en: "Search", ja: "検索" };
  const descriptions: Record<string, string> = {
    ko: "한국 여행 가이드 검색",
    en: "Search Korea travel guides",
    ja: "韓国旅行ガイド検索",
  };
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: { canonical: `${SITE_URL}${localePath(locale, "/search")}` },
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Breadcrumb items={[{ label: "breadcrumb.search" }]} />
      <SearchPageTitle />
      <SearchContent locale={locale} />
    </div>
  );
}
