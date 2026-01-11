"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isValidLocale, type Locale } from "./config";

export function useLocale(): Locale {
  const pathname = usePathname();

  if (!pathname) {
    return defaultLocale;
  }

  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}
