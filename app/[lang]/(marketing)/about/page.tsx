import Link from "next/link";
import BlurText from "@/components/marketing/blur-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="flex flex-col gap-16 py-16">
      <section className="px-6">
        <div className="mx-auto w-full max-w-4xl text-center">
          <BlurText
            animateBy="words"
            className="mb-6 font-bold text-4xl leading-tight tracking-tight md:text-5xl"
            delay={50}
            direction="bottom"
            text={dict.marketing.aboutPage.hero.headline}
          />
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {dict.marketing.aboutPage.hero.subheadline}
          </p>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-16">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h2 className="mb-6 font-semibold text-3xl">
            {dict.marketing.aboutPage.mission.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {dict.marketing.aboutPage.mission.description}
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto w-full max-w-5xl space-y-10">
          <div className="text-center">
            <h2 className="font-semibold text-3xl">
              {dict.marketing.aboutPage.values.title}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {dict.marketing.aboutPage.values.cards.map((card) => (
              <Card className="bg-card" key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto w-full max-w-3xl space-y-6 text-center">
          <h2 className="font-semibold text-3xl">
            {dict.marketing.aboutPage.story.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {dict.marketing.aboutPage.story.text}
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl border bg-muted/50 px-6 py-12 text-center">
          <h2 className="font-semibold text-3xl">
            {dict.marketing.aboutPage.cta.title}
          </h2>
          <Button asChild size="lg">
            <Link href={`/${lang}/register`}>
              {dict.marketing.aboutPage.cta.button}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
