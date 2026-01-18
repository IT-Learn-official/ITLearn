import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function TermsPage({
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
            {dict.marketing.termsPage.title}
          </h1>
        </header>

        <div className="space-y-10">
          {dict.marketing.termsPage.sections.map((section) => (
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

        <section className="space-y-4 rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="font-semibold text-2xl text-foreground">
            {dict.marketing.termsPage.contact.title}
          </h2>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p>
              {dict.marketing.termsPage.contact.emailLabel}:{" "}
              <a
                className="text-foreground underline"
                href="mailto:contact.itlearn@gmail.com"
              >
                {dict.marketing.termsPage.contact.email}
              </a>
            </p>
            <p>
              {dict.marketing.termsPage.contact.abuseLabel}:{" "}
              <a
                className="text-foreground underline"
                href="mailto:abuse-ithelp-be@googlegroups.com"
              >
                {dict.marketing.termsPage.contact.abuseEmail}
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
