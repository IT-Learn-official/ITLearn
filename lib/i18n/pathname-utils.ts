import type { Locale } from "./config";
import { locales } from "./config";

const FILE_EXTENSION_REGEX = /\.[^/]+$/;

export function hasFileExtension(pathname: string): boolean {
  return FILE_EXTENSION_REGEX.test(pathname);
}

export function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return null;
}

export function stripLocalePrefix(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.replace(`/${locale}`, "");
    }
    if (pathname === `/${locale}`) {
      return "/";
    }
  }
  return pathname;
}

export function addLocalePrefix(pathname: string, locale: Locale): string {
  const withoutLocale = stripLocalePrefix(pathname);
  return `/${locale}${withoutLocale === "/" ? "" : withoutLocale}`;
}

export function shouldExcludeFromLocaleRouting(pathname: string): boolean {
  if (pathname.startsWith("/api")) {
    return true;
  }

  if (pathname.startsWith("/_next")) {
    return true;
  }

  if (hasFileExtension(pathname)) {
    return true;
  }

  return false;
}
