export const locales = ["nl", "en"] as const;
export const defaultLocale = "nl" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return null;
}

export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);

  if (locale) {
    return pathname.replace(`/${locale}`, "") || "/";
  }

  return pathname;
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const withoutLocale = removeLocaleFromPathname(pathname);
  return `/${locale}${withoutLocale}`;
}
