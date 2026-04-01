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
  en: {
    title: "Visit Korea Guide — Your Travel Companion",
    description: "Discover the best of Korea — destinations, food, transportation, culture tips, and more for foreign visitors.",
    siteName: "Visit Korea Guide",
  },
  ko: {
    title: "Visit Korea Guide — 한국 여행 가이드",
    description: "외국인 방문객을 위한 한국 여행 정보 — 명소, 음식, 교통, 문화 팁 등.",
    siteName: "Visit Korea Guide",
  },
  ja: {
    title: "Visit Korea Guide — 韓国旅行ガイド",
    description: "外国人旅行者のための韓国ガイド — 観光地、グルメ、交通、文化のヒントなど。",
    siteName: "Visit Korea Guide",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] || metaByLocale.en;
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
      locale: ogLocaleMap[locale] || "en_US",
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
        en: SITE_URL,
        ko: `${SITE_URL}/ko`,
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
