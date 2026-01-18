import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { Spotlight } from "@/components/marketing/spotlight";
import { auth } from "@/lib/auth";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar dict={dict} locale={lang as Locale} />
      <div className="relative flex-1">
        <Spotlight />
        <main className="relative z-10">{children}</main>
      </div>
      <MarketingFooter dict={dict} locale={lang as Locale} />
    </div>
  );
}
