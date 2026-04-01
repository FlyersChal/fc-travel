"use client";

import { useLocale } from "@/lib/i18n";

export function Footer({ locale }: { locale?: string }) {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
