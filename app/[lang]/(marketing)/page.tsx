import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher currentLocale={lang} />
      </div>
      <h1 className="font-bold text-4xl">{dict.marketing.home.title}</h1>
      <div className="flex gap-4">
        <Button>
          <Link href={`/${lang}/login`}>{dict.marketing.home.login}</Link>
        </Button>
        <Button>
          <Link href={`/${lang}/register`}>{dict.marketing.home.register}</Link>
        </Button>
      </div>
    </div>
  );
}
