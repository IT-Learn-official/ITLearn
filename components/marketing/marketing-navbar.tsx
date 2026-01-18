import { MenuTwoLineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Locale } from "@/lib/i18n/dictionaries";

type MarketingDictionary = Awaited<
  ReturnType<typeof import("@/lib/i18n/dictionaries").getDictionary>
>;

interface MarketingNavbarProps {
  locale: Locale;
  dict: MarketingDictionary;
}

export function MarketingNavbar({ locale, dict }: MarketingNavbarProps) {
  const navLinks = [
    { label: dict.marketing.nav.courses, href: `/${locale}/courses` },
    { label: dict.marketing.nav.pricing, href: `/${locale}/pricing` },
    { label: dict.marketing.nav.community, href: `/${locale}/community` },
    { label: dict.marketing.nav.about, href: `/${locale}/about` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            className="flex items-center gap-2 font-semibold text-lg"
            href={`/${locale}`}
          >
            <Image alt="IT Learn logo" height={28} src="/Logo.png" width={28} />
            IT Learn
          </Link>
          <nav className="hidden items-center gap-6 text-muted-foreground text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                className="transition-colors hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher currentLocale={locale} />
          <Button asChild variant="ghost">
            <Link href={`/${locale}/login`}>{dict.marketing.nav.login}</Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/register`}>
              {dict.marketing.nav.startFree}
            </Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <HugeiconsIcon
                  color="currentColor"
                  icon={MenuTwoLineIcon}
                  size={20}
                  strokeWidth={1.75}
                />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    alt="IT Learn logo"
                    height={24}
                    src="/Logo.png"
                    width={24}
                  />
                  IT Learn
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-6 text-sm">
                <LanguageSwitcher currentLocale={locale} />
                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        className="text-muted-foreground hover:text-foreground"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button asChild variant="ghost">
                      <Link href={`/${locale}/login`}>
                        {dict.marketing.nav.login}
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild>
                      <Link href={`/${locale}/register`}>
                        {dict.marketing.nav.startFree}
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
