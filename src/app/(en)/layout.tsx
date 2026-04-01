import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCategories } from "@/lib/db/categories";
import type { Category } from "@/types";
import { SITE_URL } from "@/lib/constants";

const meta = {
  title: "Visit Korea Guide — Your Travel Companion",
  description: "Discover the best of Korea — destinations, food, transportation, culture tips, and more for foreign visitors.",
  siteName: "Visit Korea Guide",
};

export const metadata: Metadata = {
  title: {
    default: meta.title,
    template: `%s | ${meta.siteName}`,
  },
  description: meta.description,
  openGraph: {
    type: "website",
    locale: "en_US",
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

export default async function EnLayout({
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
      <Header categories={categories} locale="en" />
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-4">
        {children}
      </main>
      <Footer locale="en" />
    </ThemeProvider>
  );
}
