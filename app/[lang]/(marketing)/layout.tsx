import { notFound } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { Spotlight } from "@/components/marketing/spotlight";
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

  return (
    <div className="flex h-screen min-h-screen flex-col">
      <MarketingNavbar dict={dict} locale={locale} />

      <div className="relative flex-1">
        <Spotlight />
        <main className="relative z-10">{children}</main>
      </div>

      <MarketingFooter dict={dict} locale={locale} />
    </div>
  );
}
