import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-4 text-center">
        <h1 className="font-semibold text-4xl">
          {dict.marketing.aboutPage.headline}
        </h1>
        <p className="text-muted-foreground">{dict.marketing.aboutPage.text}</p>
      </div>
    </section>
  );
}
