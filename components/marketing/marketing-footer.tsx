import Link from "next/link";
import type { Locale } from "@/lib/i18n/dictionaries";

type MarketingDictionary = Awaited<
  ReturnType<typeof import("@/lib/i18n/dictionaries").getDictionary>
>;

interface MarketingFooterProps {
  locale: Locale;
  dict: MarketingDictionary;
}

export function MarketingFooter({ locale, dict }: MarketingFooterProps) {
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
          <p className="font-medium text-sm">{dict.marketing.footer.product}</p>
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
          <p className="font-medium text-sm">{dict.marketing.footer.company}</p>
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
  );
}
