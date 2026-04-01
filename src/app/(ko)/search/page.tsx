import type { Metadata } from "next";
import { SearchContent } from "@/app/[locale]/search/search-content";
import { SearchPageTitle } from "@/components/search-page-title";
import { Breadcrumb } from "@/components/breadcrumb";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "검색",
  description: "플라이어스챌 글 검색",
  alternates: { canonical: `${SITE_URL}/search` },
};

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Breadcrumb items={[{ label: "breadcrumb.search" }]} />
      <SearchPageTitle />
      <SearchContent locale="ko" />
    </div>
  );
}
