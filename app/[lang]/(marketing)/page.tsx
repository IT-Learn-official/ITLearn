import {
  ArrowRight01Icon,
  Award01Icon,
  SparklesIcon,
  StarIcon,
  Tick01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
  const howItWorksId = "how-it-works";
  const coursesId = "courses";
  const pricingId = "pricing";
  const howItWorksMedia = [
    {
      videoSrc: "/marketing/done-with-the-old-way.mp4",
      poster: "/marketing/done-with-the-old-way.jpg",
    },
    {
      videoSrc: "/marketing/choose-a-course.mp4",
      poster: "/marketing/choose-a-course.jpg",
    },
    {
      videoSrc: "/marketing/build-real-projects.mp4",
      poster: "/marketing/build-real-projects.jpg",
    },
  ];
  const howItWorksCards = dict.marketing.home.howItWorks.steps.map(
    (step, index) => ({
      ...step,
      ...howItWorksMedia[index],
    })
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40">
        {/* Background Gradients/Glows */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 h-125 w-250 -translate-x-1/2 rounded-full bg-primary/10 opacity-50 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-150 w-200 rounded-full bg-secondary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 font-medium text-muted-foreground text-sm backdrop-blur-md transition-colors hover:bg-muted/80 hover:text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {dict.marketing.home.hero.trustLine}
            </div>

            {/* Headlines */}
            <div className="space-y-6">
              <BlurText
                animateBy="sentences"
                className="text-balance font-bold text-5xl leading-[1.1] tracking-tighter sm:text-6xl lg:text-7xl"
                delay={50}
                direction="bottom"
                text={dict.marketing.home.hero.headline}
              />
              <BlurText
                animateBy="words"
                className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl"
                delay={50}
                direction="bottom"
                text={dict.marketing.home.hero.subheadline}
              />
            </div>

            {/* CTAs */}
            <div className="mt-4 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/40"
                size="lg"
              >
                <Link href={`/${lang}/register`}>
                  {dict.marketing.home.hero.primaryCta}
                  <HugeiconsIcon
                    className="ml-2 h-4 w-4"
                    icon={ArrowRight01Icon}
                    strokeWidth={1.8}
                  />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full bg-background/50 px-8 text-base backdrop-blur-sm hover:bg-muted/50"
                size="lg"
                variant="outline"
              >
                <Link href={`/${lang}/#${howItWorksId}`}>
                  {dict.marketing.home.hero.secondaryCta}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid w-full grid-cols-2 gap-8 border-border/40 border-t pt-12 md:grid-cols-3 md:gap-16">
              {dict.marketing.home.socialProof.stats.map((stat) => (
                <div
                  className="flex flex-col items-center gap-1"
                  key={stat.label}
                >
                  <span className="font-bold text-3xl tabular-nums tracking-tight sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section
        className="border-border/40 border-y bg-muted/20 py-24"
        id={howItWorksId}
      >
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
              {dict.marketing.home.howItWorks.headline}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorksCards.map((card, index) => (
              <div
                className="group relative min-h-105 overflow-hidden rounded-2xl border border-border/50 bg-[#181d2c] p-8 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                key={card.title}
              >
                <div className="mb-6 overflow-hidden rounded-xl">
                  <video
                    autoPlay
                    className="h-52 w-full object-contain"
                    loop
                    muted
                    playsInline
                    poster={card.poster}
                    src={card.videoSrc}
                  />
                </div>
                <div className="pointer-events-none absolute top-6 right-6 select-none font-bold text-6xl text-muted/20">
                  {index + 1}
                </div>
                <div className="mt-6">
                  <h3 className="mb-3 font-bold text-xl">{card.title}</h3>
                  <p className="text-white/70 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COURSES --- */}
      <section className="relative py-24" id={coursesId}>
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="space-y-4">
              <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
                {dict.marketing.home.courses.headline}
              </h2>
              <div className="h-1 w-20 rounded-full bg-primary" />
            </div>
            <Button asChild className="group" variant="ghost">
              <Link href={`/${lang}/courses`}>
                View all paths{" "}
                <HugeiconsIcon
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  icon={ArrowRight01Icon}
                  strokeWidth={1.8}
                />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Card
                className="group flex h-full flex-col border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                key={course.title}
              >
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                      {course.level}
                    </span>
                    <HugeiconsIcon
                      className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                      icon={SparklesIcon}
                      strokeWidth={1.6}
                    />
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="line-clamp-2 text-muted-foreground text-sm">
                    {course.description}
                  </p>
                  <div className="flex flex-col gap-2 pt-2 font-medium text-muted-foreground text-xs">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        className="h-3.5 w-3.5 text-primary"
                        icon={Award01Icon}
                        strokeWidth={1.6}
                      />{" "}
                      {course.project}
                    </div>
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        className="h-3.5 w-3.5 text-primary"
                        icon={UserGroupIcon}
                        strokeWidth={1.6}
                      />{" "}
                      {course.time}
                    </div>
                  </div>
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

      {/* --- FEATURES SPLIT SECTION (Gamification + Community) --- */}
      <section className="border-border border-y bg-card py-24">
        <div className="container mx-auto max-w-6xl space-y-24 px-6">
          {/* Gamification */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 space-y-8 lg:order-1">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <HugeiconsIcon
                  className="h-6 w-6"
                  icon={Award01Icon}
                  strokeWidth={1.8}
                />
              </div>
              <div className="space-y-4">
                <h2 className="font-bold text-3xl tracking-tight">
                  {dict.marketing.home.gamification.headline}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {dict.marketing.home.gamification.supportingText}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {dict.marketing.home.gamification.bullets.map((bullet) => (
                  <li
                    className="flex items-center gap-3 rounded-lg border bg-background/50 p-3"
                    key={bullet}
                  >
                    <HugeiconsIcon
                      className="h-4 w-4 shrink-0 text-primary"
                      icon={Tick01Icon}
                      strokeWidth={1.8}
                    />
                    <span className="font-medium text-sm">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual Placeholder for Gamification */}
            <div className="relative order-1 flex h-75 items-center justify-center overflow-hidden rounded-2xl border bg-linear-to-br from-orange-500/20 via-background to-background lg:order-2 lg:h-100">
              <div className="absolute inset-0 opacity-20" />
              <HugeiconsIcon
                className="h-32 w-32 text-orange-500"
                icon={Award01Icon}
                strokeWidth={1.4}
              />
            </div>
          </div>

          {/* Community */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative flex h-75 items-center justify-center overflow-hidden rounded-2xl border bg-linear-to-br from-blue-500/20 via-background to-background lg:h-100">
              <div className="absolute inset-0 opacity-20" />
              <HugeiconsIcon
                className="h-32 w-32 text-blue-500"
                icon={UserGroupIcon}
                strokeWidth={1.4}
              />
            </div>

            <div className="space-y-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <HugeiconsIcon
                  className="h-6 w-6"
                  icon={UserGroupIcon}
                  strokeWidth={1.8}
                />
              </div>
              <div className="space-y-4">
                <h2 className="font-bold text-3xl tracking-tight">
                  {dict.marketing.home.community.headline}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {dict.marketing.home.community.text}
                </p>
              </div>
              <ul className="space-y-3">
                {dict.marketing.home.community.features.map((feature) => (
                  <li className="flex items-center gap-3" key={feature}>
                    <HugeiconsIcon
                      className="h-5 w-5 shrink-0 text-blue-500"
                      icon={StarIcon}
                      strokeWidth={1.6}
                    />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${lang}/community`}>
                  {dict.marketing.home.community.cta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className="relative overflow-hidden py-24" id={pricingId}>
        {/* Background Blob for Pricing */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="container mx-auto max-w-6xl space-y-16 px-6">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
              {dict.marketing.home.pricing.headline}
            </h2>
            <p className="text-lg text-muted-foreground">
              {dict.marketing.home.pricing.subheadline}
            </p>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-3">
            {/* Free */}
            <Card className="border-border/60 shadow-none transition-colors hover:border-border">
              <CardHeader>
                <CardTitle>{pricingPlans.free.title}</CardTitle>
                <CardDescription className="mt-2 font-bold text-3xl text-foreground">
                  {pricingPlans.free.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pricingPlans.free.features.map((f) => (
                  <div
                    className="flex gap-2 text-muted-foreground text-sm"
                    key={f}
                  >
                    <HugeiconsIcon
                      className="mt-0.5 h-4 w-4"
                      icon={Tick01Icon}
                      strokeWidth={1.6}
                    />{" "}
                    {f}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/${lang}/register`}>
                    {pricingPlans.free.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro - Highlighted */}
            <Card className="relative z-10 scale-105 border-primary bg-background shadow-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 font-bold text-primary-foreground text-xs uppercase tracking-wide">
                Most Popular
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary">
                    {pricingPlans.pro.title}
                  </CardTitle>
                  <span className="rounded bg-primary/10 px-2 py-1 font-bold text-primary text-xs">
                    {pricingPlans.pro.badge}
                  </span>
                </div>
                <CardDescription className="mt-2 font-bold text-4xl text-foreground">
                  {pricingPlans.pro.price}
                </CardDescription>
                <p className="text-muted-foreground text-xs">Billed annually</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricingPlans.pro.features.map((f) => (
                  <div className="flex gap-2 font-medium text-sm" key={f}>
                    <div className="rounded-full bg-primary/20 p-0.5">
                      <HugeiconsIcon
                        className="h-3 w-3 text-primary"
                        icon={Tick01Icon}
                        strokeWidth={1.6}
                      />
                    </div>{" "}
                    {f}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full shadow-lg shadow-primary/20">
                  <Link href={`/${lang}/register`}>{pricingPlans.pro.cta}</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Lifetime */}
            <Card className="border-border/60 shadow-none transition-colors hover:border-border">
              <CardHeader>
                <CardTitle>{pricingPlans.lifetime.title}</CardTitle>
                <CardDescription className="mt-2 font-bold text-3xl text-foreground">
                  {pricingPlans.lifetime.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pricingPlans.lifetime.features.map((f) => (
                  <div
                    className="flex gap-2 text-muted-foreground text-sm"
                    key={f}
                  >
                    <HugeiconsIcon
                      className="mt-0.5 h-4 w-4"
                      icon={Tick01Icon}
                      strokeWidth={1.6}
                    />{" "}
                    {f}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/${lang}/register`}>
                    {pricingPlans.lifetime.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 overflow-hidden rounded-xl border bg-card/50">
            <div className="border-b bg-muted/30 p-6">
              <h3 className="font-bold text-lg">
                {dict.marketing.home.pricing.comparison.headline}
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {dict.marketing.home.pricing.comparison.headers.map((h) => (
                    <TableHead className="font-bold text-foreground" key={h}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dict.marketing.home.pricing.comparison.rows.map((row) => (
                  <TableRow className="hover:bg-muted/30" key={row.feature}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.free}
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      {row.pro}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-b from-primary to-primary/80 p-12 text-center text-primary-foreground shadow-2xl">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-10" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="max-w-2xl font-bold text-3xl tracking-tight md:text-5xl">
              {dict.marketing.home.finalCta.headline}
            </h2>
            <p className="max-w-xl text-lg text-primary-foreground/90">
              {dict.marketing.home.finalCta.subheadline}
            </p>
            <Button
              asChild
              className="h-14 rounded-full bg-background px-10 text-foreground text-lg shadow-xl transition-transform hover:scale-105 hover:bg-muted"
              size="lg"
              variant="secondary"
            >
              <Link href={`/${lang}/register`}>
                {dict.marketing.home.finalCta.cta}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
