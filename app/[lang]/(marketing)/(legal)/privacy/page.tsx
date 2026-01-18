import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="bg-muted/20 px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <header className="space-y-3">
          <p className="text-muted-foreground text-sm uppercase tracking-wide">
            {dict.marketing.footer.legal}
          </p>
          <h1 className="font-semibold text-4xl">
            {dict.marketing.privacyPage.title}
          </h1>
          <div className="text-muted-foreground text-sm">
            <p>{dict.marketing.privacyPage.effectiveDate}</p>
            <p>{dict.marketing.privacyPage.lastUpdated}</p>
            <p>{dict.marketing.privacyPage.controller}</p>
          </div>
        </header>

        <div className="space-y-10">
          {dict.marketing.privacyPage.sections.map((section) => (
            <section className="space-y-4" key={section.title}>
              <h2 className="font-semibold text-2xl text-foreground">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  className="text-base text-muted-foreground leading-relaxed"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li className="text-base leading-relaxed" key={bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
