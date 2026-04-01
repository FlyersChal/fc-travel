export const defaultLocale = "ko";

export const locales = [
  "ko", "en", "ja", "zh", "vi", "th", "es", "fr", "de", "id", "hi",
] as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
