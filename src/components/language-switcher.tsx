"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, useLocale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ currentLocale = "ko" }: { currentLocale?: string }) {
  const { setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  function switchLocale(newLocale: string) {
    // Extract the content path from the current URL.
    // Current locale could be "ko" (no prefix) or another locale (with prefix).
    let contentPath = pathname;
    if (currentLocale === "ko") {
      // Korean has no prefix, so the entire pathname is the content path
      // e.g., /posts/slug -> /posts/slug
    } else {
      // Remove the current locale prefix
      // e.g., /en/posts/slug -> /posts/slug
      contentPath = pathname.replace(new RegExp(`^/${currentLocale}`), "") || "/";
    }

    // Build the new path with the new locale
    const newPath = localePath(newLocale, contentPath);

    // Also update the client-side i18n store
    setLocale(newLocale as Parameters<typeof setLocale>[0]);

    router.push(newPath);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors gap-1 text-sm"
        aria-label="Language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">{current.flag}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-background shadow-lg py-1 z-50">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => switchLocale(l.code)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-muted ${
                l.code === currentLocale ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
