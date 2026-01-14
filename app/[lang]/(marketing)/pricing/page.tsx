import Link from "next/link";
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

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const pricingPlans = dict.marketing.home.pricing.plans;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-6xl space-y-12">
        <div className="text-center">
          <h1 className="font-semibold text-4xl">
            {dict.marketing.pricingPage.headline}
          </h1>
          <p className="text-muted-foreground">
            {dict.marketing.pricingPage.subheadline}
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
                <Link href={`/${lang}/register`}>{pricingPlans.free.cta}</Link>
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
        <p className="text-center text-muted-foreground text-sm">
          {dict.marketing.pricingPage.upgradeNote}
        </p>

        <div className="space-y-4">
          <h2 className="font-semibold text-xl">
            {dict.marketing.home.pricing.comparison.headline}
          </h2>
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
  );
}
