import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["ko", "en", "ja", "zh", "vi", "th", "es", "fr", "de", "id", "hi"];
const defaultLocale = "ko";

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") || "";
  // Parse accept-language: "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
  const languages = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    if (locales.includes(lang)) return lang;
  }
  return defaultLocale;
}

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale routing for these paths
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/feed.xml") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/actions")
  ) {
    // Auth check for admin
    if (pathname.startsWith("/admin") && process.env.ENABLE_AUTH === "true") {
      const token = await getToken({ req: request });
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // If pathname already has a locale, continue
  if (pathnameHasLocale(pathname)) {
    // Auth check for /[locale]/login is not needed, but let it pass
    return NextResponse.next();
  }

  // No locale prefix means Korean content (default locale).
  // Non-Korean users accessing root paths will see Korean content;
  // they can switch via the language switcher.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
