"use client";

import enDict from "./dictionaries/en.json";
import nlDict from "./dictionaries/nl.json";
import { useLocale } from "./use-locale";

const clientDictionaries = {
  en: enDict,
  nl: nlDict,
} as const;

export type Dictionary = typeof enDict;

export function useDictionary(): Dictionary {
  const locale = useLocale();
  return clientDictionaries[locale] ?? clientDictionaries.nl;
}

export function getClientDictionary(locale: "en" | "nl"): Dictionary {
  return clientDictionaries[locale] ?? clientDictionaries.nl;
}
