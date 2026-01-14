import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n/dictionaries";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  const navLinks = [
    { label: dict.marketing.nav.courses, href: `/${locale}/courses` },
    { label: dict.marketing.nav.pricing, href: `/${locale}/pricing` },
    { label: dict.marketing.nav.community, href: `/${locale}/community` },
    { label: dict.marketing.nav.about, href: `/${locale}/about` },
  ];

  const productLinks = [
    { label: dict.marketing.footer.courses, href: `/${locale}/courses` },
    { label: dict.marketing.footer.pricing, href: `/${locale}/pricing` },
    { label: dict.marketing.footer.roadmap, href: `/${locale}/#roadmap` },
  ];

  const companyLinks = [
    { label: dict.marketing.footer.about, href: `/${locale}/about` },
    { label: dict.marketing.footer.team, href: `/${locale}/about#team` },
    { label: dict.marketing.footer.contact, href: `/${locale}/about#contact` },
  ];

  const legalLinks = [
    { label: dict.marketing.footer.terms, href: `/${locale}/terms` },
    { label: dict.marketing.footer.privacy, href: `/${locale}/privacy` },
  ];

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-y-auto bg-background text-foreground [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              className="flex items-center gap-2 font-semibold text-lg"
              href={`/${locale}`}
            >
              <Image
                alt="IT Learn logo"
                height={28}
                src="/Logo.png"
                width={28}
              />
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
                  <MenuIcon className="size-5" />
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

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-4">
          <div className="space-y-2">
            <Link className="font-semibold text-lg" href={`/${locale}`}>
              IT Learn
            </Link>
            <p className="text-muted-foreground text-sm">
              {dict.marketing.footer.tagline}
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-sm">
              {dict.marketing.footer.product}
            </p>
            <div className="space-y-2 text-muted-foreground text-sm">
              {productLinks.map((link) => (
                <Link
                  className="block hover:text-foreground"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-sm">
              {dict.marketing.footer.company}
            </p>
            <div className="space-y-2 text-muted-foreground text-sm">
              {companyLinks.map((link) => (
                <Link
                  className="block hover:text-foreground"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-sm">{dict.marketing.footer.legal}</p>
            <div className="space-y-2 text-muted-foreground text-sm">
              {legalLinks.map((link) => (
                <Link
                  className="block hover:text-foreground"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
