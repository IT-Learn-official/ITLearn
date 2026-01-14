import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-6 text-center">
        <h1 className="font-semibold text-4xl">
          {dict.marketing.communityPage.headline}
        </h1>
        <p className="text-muted-foreground">
          {dict.marketing.communityPage.text}
        </p>
        <Button asChild size="lg">
          <Link href={`/${lang}/register`}>
            {dict.marketing.communityPage.cta}
          </Link>
        </Button>
      </div>
    </section>
  );
}
