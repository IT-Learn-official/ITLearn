import "server-only";
import type en from "./dictionaries/en.json";

const dictionaries = {
  en: () => import("./dictionaries/en.json"),
  nl: () => import("./dictionaries/nl.json"),
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof en;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dict = await dictionaries[locale]();
  return dict.default ?? dict;
};
