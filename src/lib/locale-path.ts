/**
 * Returns the URL path prefix for a given locale.
 * English (en) is the default locale and has no prefix.
 * All other locales use /{locale} as prefix.
 */
export function localePath(locale: string, path: string = ""): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  if (!path || path === "/") return prefix || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${normalized}`;
}
