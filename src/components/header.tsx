"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Search, Menu, X, Home, FileText, Code, Coffee, Cpu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import type { Category } from "@/types";

const categoryIconMap: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  dev: Code,
  daily: Coffee,
  tech: Cpu,
};

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function Header({ categories = [], locale = "ko" }: { categories?: Category[]; locale?: string }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  const baseNavItems = [
    { href: localePath(locale), label: t("nav.home"), icon: Home },
    { href: localePath(locale, "/posts"), label: t("nav.posts"), icon: FileText },
  ];

  const navItems = [
    ...baseNavItems,
    ...categories.map((cat) => ({
      href: localePath(locale, `/category/${cat.slug}`),
      label: cat.name,
      icon: categoryIconMap[cat.slug] || FileText,
    })),
  ];

  // When open becomes true, mount the DOM then trigger the animation
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href={localePath(locale)} className="mr-6 flex items-center space-x-2">
          <span className="text-base font-bold text-foreground">
            {locale === "ko" ? "플라이어스챌" : "Flyerschal"}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-3 px-4 inline-flex items-center min-h-[44px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            href={localePath(locale, "/search")}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">{t("nav.search")}</span>
          </Link>
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted hover:text-foreground transition-colors md:hidden"
            aria-label={t("menu.label")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

    </header>
      {/* Mobile sheet */}
      {open && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu.label")}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.15)",
              opacity: visible ? 1 : 0,
              transition: "opacity 200ms ease",
              zIndex: 9999,
            }}
            onClick={handleClose}
            onTouchEnd={handleClose}
          />
          {/* Sheet panel */}
          <div
            ref={sheetRef}
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              right: 0,
              width: 260,
              backgroundColor: isDark ? "#202020" : "#ffffff",
              borderLeft: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column" as const,
              padding: "16px 12px",
              boxShadow: isDark
                ? "-8px 0 24px rgba(0, 0, 0, 0.4)"
                : "-8px 0 24px rgba(0, 0, 0, 0.06)",
              transform: visible ? "translateX(0)" : "translateX(100%)",
              transition: "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
              zIndex: 10000,
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 4,
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: "#9b9a97",
              }}
              aria-label={t("menu.close")}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>

            {/* Header / Blog name */}
            <div style={{ padding: "8px 12px", marginBottom: 4 }}>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: isDark ? "#ffffffcf" : "#37352f",
                letterSpacing: "-0.01em",
              }}>
                {locale === "ko" ? "플라이어스챌" : "Flyerschal"}
              </span>
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              margin: "2px 12px 4px",
            }} />

            {/* Navigation */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== localePath(locale) && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: isActive
                        ? (isDark ? "#ffffff" : "#37352f")
                        : (isDark ? "#ffffff99" : "#37352fa6"),
                      textDecoration: "none",
                      padding: "10px 12px",
                      borderRadius: 4,
                      transition: "background-color 100ms ease",
                      backgroundColor: isActive
                        ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)")
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isActive
                        ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)")
                        : "transparent";
                    }}
                  >
                    <Icon style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.7 }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div style={{ marginTop: "auto" }}>
              {/* Divider */}
              <div style={{
                height: 1,
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                margin: "4px 12px 6px",
              }} />

              {/* Search link */}
              <Link
                href={localePath(locale, "/search")}
                onClick={handleClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isDark ? "#ffffff99" : "#37352fa6",
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: 4,
                  transition: "background-color 100ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Search style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.7 }} />
                {t("sidebar.search")}
              </Link>

              {/* Theme toggle */}
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isDark ? "#ffffff99" : "#37352fa6",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 4,
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "background-color 100ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {isDark
                  ? <Sun style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.7 }} />
                  : <Moon style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.7 }} />
                }
                {isDark ? t("sidebar.lightMode") : t("sidebar.darkMode")}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
