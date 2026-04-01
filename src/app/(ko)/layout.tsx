import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCategories } from "@/lib/db/categories";
import type { Category } from "@/types";
import { SITE_URL } from "@/lib/constants";

const meta = {
  title: "플라이어스챌 — 개발과 일상 사이, 유용한 정보 블로그",
  description: "개발, 기술 트렌드, 일상 속 유용한 정보를 나누는 블로그입니다.",
  siteName: "플라이어스챌",
};

export const metadata: Metadata = {
  title: {
    default: meta.title,
    template: `%s | ${meta.siteName}`,
  },
  description: meta.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: meta.siteName,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
    languages: {
      ko: SITE_URL,
      en: `${SITE_URL}/en`,
      ja: `${SITE_URL}/ja`,
    },
  },
};

export default async function KoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("[layout] Failed to load categories:", error);
  }

  return (
    <ThemeProvider>
      <Header categories={categories} locale="ko" />
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-4">
        {children}
      </main>
      <Footer locale="ko" />
    </ThemeProvider>
  );
}
