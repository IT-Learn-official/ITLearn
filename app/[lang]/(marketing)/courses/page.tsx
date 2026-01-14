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
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-6xl space-y-12">
        <div className="text-center">
          <h1 className="font-semibold text-4xl">
            {dict.marketing.coursesPage.headline}
          </h1>
          <p className="text-muted-foreground">
            {dict.marketing.coursesPage.subheadline}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {dict.marketing.coursesPage.courses.map((course) => (
            <Card key={course.title}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.level}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                <p>{course.description}</p>
                <p>
                  <span className="font-medium text-foreground">
                    {course.time}
                  </span>{" "}
                  · {course.build}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={
                      course.title === "Python"
                        ? `/${lang}/courses/python`
                        : `/${lang}/register`
                    }
                  >
                    {dict.marketing.coursesPage.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
