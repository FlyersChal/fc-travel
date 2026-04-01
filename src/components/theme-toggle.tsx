"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLocale();

  useEffect(() => setMounted(true), []);

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onTouchEnd={(e) => {
        e.preventDefault();
        toggle();
      }}
      className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted hover:text-foreground transition-colors"
      aria-label={t("theme.toggle")}
      suppressHydrationWarning
    >
      {!mounted ? (
        <Sun className="h-5 w-5" />
      ) : (
        <>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      )}
    </button>
  );
}
