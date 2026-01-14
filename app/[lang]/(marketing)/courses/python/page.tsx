import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <div className="space-y-4">
          <h1 className="font-semibold text-4xl">
            {dict.marketing.courseDetail.title}
          </h1>
          <p className="text-muted-foreground">
            {dict.marketing.courseDetail.description}
          </p>
          <Button asChild size="lg">
            <Link href={`/${lang}/register`}>
              {dict.marketing.courseDetail.cta}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{dict.marketing.courseDetail.learnHeadline}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-sm">
            {dict.marketing.courseDetail.learnPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
