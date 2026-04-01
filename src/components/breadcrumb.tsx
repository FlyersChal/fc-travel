"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { locale, t } = useLocale();

  const allItems: BreadcrumbItem[] = [
    { label: t("breadcrumb.home"), href: localePath(locale) },
    ...items.map((item) => ({ ...item, label: t(item.label) || item.label })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-muted-foreground/50 select-none">/</span>
              )}
              {isLast || !item.href ? (
                <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
