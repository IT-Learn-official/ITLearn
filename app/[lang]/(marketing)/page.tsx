import Image from "next/image";
import Link from "next/link";
import BlurText from "@/components/marketing/blur-text";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const courses = dict.marketing.home.courses.cards;
  const pricingPlans = dict.marketing.home.pricing.plans;

  return (
    <div>
      <section className="relative min-h-screen overflow-hidden px-6 py-20">
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <Image
                alt="IT Learn logo"
                height={56}
                src="/Logo.png"
                width={56}
              />
              <span className="font-semibold text-lg">IT Learn</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {dict.marketing.home.hero.trustLine}
            </p>
            <BlurText
              animateBy="sentences"
              className="text-balance font-semibold text-4xl md:text-5xl"
              delay={50}
              direction="bottom"
              text={dict.marketing.home.hero.headline}
            />
            <BlurText
              animateBy="sentences"
              className="text-balance text-lg text-muted-foreground"
              delay={50}
              direction="bottom"
              text={dict.marketing.home.hero.subheadline}
            />

            <BlurText
              animateBy="words"
              className="text-balance text-lg text-muted-foreground"
              delay={50}
              direction="bottom"
              text={dict.marketing.home.hero.subheadline}
            />
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button asChild size="lg">
                <Link href={`/${lang}/register`}>
                  {dict.marketing.home.hero.primaryCta}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${lang}/#how-it-works`}>
                  {dict.marketing.home.hero.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-3xl border bg-background/70 p-8 backdrop-blur">
              <Image
                alt="IT Learn logo"
                className="mx-auto"
                height={140}
                src="/Logo.png"
                width={140}
              />
              <p className="mt-4 text-center text-muted-foreground text-sm">
                {dict.marketing.home.hero.trustLine}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 px-6 py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center">
          <p className="font-medium text-muted-foreground text-sm">
            {dict.marketing.home.socialProof.headline}
          </p>
          <div className="grid w-full gap-4 md:grid-cols-3">
            {dict.marketing.home.socialProof.stats.map((stat) => (
              <div
                className="rounded-xl border bg-background px-6 py-4"
                key={stat.label}
              >
                <p className="font-semibold text-2xl">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16" id="how-it-works">
        <div className="mx-auto w-full max-w-5xl space-y-10">
          <div className="text-center">
            <h2 className="font-semibold text-3xl">
              {dict.marketing.home.howItWorks.headline}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {dict.marketing.home.howItWorks.steps.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href={`/${lang}/register`}>
                {dict.marketing.home.howItWorks.cta}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-16" id="courses">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <div className="text-center">
            <h2 className="font-semibold text-3xl">
              {dict.marketing.home.courses.headline}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Card key={course.title}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.level}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    {course.description}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {course.project}
                  </p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    {course.time}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href={`/${lang}/courses`}>
                      {dict.marketing.home.courses.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-semibold text-3xl">
              {dict.marketing.home.gamification.headline}
            </h2>
            <p className="text-muted-foreground">
              {dict.marketing.home.gamification.supportingText}
            </p>
          </div>
          <ul className="space-y-3 text-muted-foreground text-sm">
            {dict.marketing.home.gamification.bullets.map((bullet) => (
              <li
                className="rounded-lg border bg-background px-4 py-3"
                key={bullet}
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-16" id="community">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-semibold text-3xl">
              {dict.marketing.home.community.headline}
            </h2>
            <p className="text-muted-foreground">
              {dict.marketing.home.community.text}
            </p>
            <Button asChild>
              <Link href={`/${lang}/community`}>
                {dict.marketing.home.community.cta}
              </Link>
            </Button>
          </div>
          <ul className="space-y-3 text-muted-foreground text-sm">
            {dict.marketing.home.community.features.map((feature) => (
              <li
                className="rounded-lg border bg-background px-4 py-3"
                key={feature}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-16" id="pricing">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          <div className="text-center">
            <h2 className="font-semibold text-3xl">
              {dict.marketing.home.pricing.headline}
            </h2>
            <p className="text-muted-foreground">
              {dict.marketing.home.pricing.subheadline}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{pricingPlans.free.title}</CardTitle>
                <CardDescription>{pricingPlans.free.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                {pricingPlans.free.features.map((feature) => (
                  <p key={feature}>{feature}</p>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`/${lang}/register`}>
                    {pricingPlans.free.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary/60 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{pricingPlans.pro.title}</CardTitle>
                  <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary text-xs">
                    {pricingPlans.pro.badge}
                  </span>
                </div>
                <CardDescription>{pricingPlans.pro.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                {pricingPlans.pro.features.map((feature) => (
                  <p key={feature}>{feature}</p>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/register`}>{pricingPlans.pro.cta}</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{pricingPlans.lifetime.title}</CardTitle>
                <CardDescription>{pricingPlans.lifetime.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                {pricingPlans.lifetime.features.map((feature) => (
                  <p key={feature}>{feature}</p>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`/${lang}/register`}>
                    {pricingPlans.lifetime.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          <p className="text-center text-muted-foreground text-sm">
            {dict.marketing.home.pricing.note}
          </p>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">
              {dict.marketing.home.pricing.comparison.headline}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  {dict.marketing.home.pricing.comparison.headers.map(
                    (header) => (
                      <TableHead key={header}>{header}</TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {dict.marketing.home.pricing.comparison.rows.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell>{row.feature}</TableCell>
                    <TableCell>{row.free}</TableCell>
                    <TableCell>{row.pro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 px-6 py-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <h2 className="font-semibold text-3xl">
            {dict.marketing.home.finalCta.headline}
          </h2>
          <p className="text-muted-foreground">
            {dict.marketing.home.finalCta.subheadline}
          </p>
          <Button asChild size="lg">
            <Link href={`/${lang}/register`}>
              {dict.marketing.home.finalCta.cta}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
