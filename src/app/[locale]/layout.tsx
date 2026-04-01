import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCategories } from "@/lib/db/categories";
import { isValidLocale } from "@/lib/i18n-config";
import type { Category } from "@/types";
import { SITE_URL } from "@/lib/constants";

const metaByLocale: Record<string, { title: string; description: string; siteName: string }> = {
  ko: {
    title: "플라이어스챌 — 개발과 일상 사이, 유용한 정보 블로그",
    description: "개발, 기술 트렌드, 일상 속 유용한 정보를 나누는 블로그입니다.",
    siteName: "플라이어스챌",
  },
  en: {
    title: "Flyerschal — Useful Insights Between Dev & Life",
    description: "A blog sharing development, tech trends, and useful everyday insights.",
    siteName: "Flyerschal",
  },
  ja: {
    title: "フライヤースチャル — 開発と日常の間、役立つ情報ブログ",
    description: "開発、技術トレンド、日常の役立つ情報を共有するブログです。",
    siteName: "フライヤースチャル",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] || metaByLocale.ko;
  const ogLocaleMap: Record<string, string> = {
    ko: "ko_KR", en: "en_US", ja: "ja_JP", zh: "zh_CN",
    vi: "vi_VN", th: "th_TH", es: "es_ES", fr: "fr_FR",
    de: "de_DE", id: "id_ID", hi: "hi_IN",
  };

  return {
    title: {
      default: meta.title,
      template: `%s | ${meta.siteName}`,
    },
    description: meta.description,
    openGraph: {
      type: "website",
      locale: ogLocaleMap[locale] || "ko_KR",
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("[layout] Failed to load categories:", error);
  }

  return (
    <ThemeProvider>
      <Header categories={categories} locale={locale} />
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-4">
        {children}
      </main>
      <Footer locale={locale} />
    </ThemeProvider>
  );
}
