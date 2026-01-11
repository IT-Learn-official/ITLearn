"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCookie } from "@/lib/i18n/cookies";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-detection";

const languages = [
  { code: "nl", label: "Nederlands" },
  { code: "en", label: "English" },
] as const;

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) {
      return;
    }

    setCookie(LOCALE_COOKIE_NAME, newLocale);

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");

    router.push(newPathname);
  };

  return (
    <Select onValueChange={handleLanguageChange} value={currentLocale}>
      <SelectTrigger className="w-45">
        <SelectValue>
          {languages.find((lang) => lang.code === currentLocale)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
