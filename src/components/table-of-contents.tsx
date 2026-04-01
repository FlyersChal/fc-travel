"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useLocale } from "@/lib/i18n";
import type { TocItem } from "@/lib/toc";

export type { TocItem };

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [items]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80; // sticky header height + padding
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: "smooth" });
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <nav className="hidden md:block" aria-label={t("post.toc")}>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          {t("post.toc")}
        </p>
        <ul className="space-y-1.5 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`text-left w-full transition-colors duration-150 hover:text-foreground ${
                  item.level === 3 ? "pl-4" : ""
                } ${
                  activeId === item.id
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
                style={{ fontSize: "14px", lineHeight: "1.6" }}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: select dropdown */}
      <div className="md:hidden mb-6 relative">
        <select
          className="w-full appearance-none border border-border rounded-md px-3 py-2.5 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          value={activeId}
          onChange={(e) => {
            setActiveId(e.target.value);
            scrollTo(e.target.value);
          }}
        >
          <option value="">{t("post.tocPlaceholder")}</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.level === 3 ? `  ${item.text}` : item.text}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </>
  );
}
