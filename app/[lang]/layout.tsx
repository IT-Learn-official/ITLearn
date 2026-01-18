import type { Metadata } from "next";
import proximaNova from "next/font/local";
import { ViewTransition } from "react";
import "../globals.css";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { Toaster } from "@/components/ui/sonner";

const ProximaNova = proximaNova({
  src: "../fonts/Proxima-Nova.woff",
  variable: "--font-proxima-nova",
});

export const metadata: Metadata = {
  title: "ITLearn",
  description: "Learn how to program",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "nl" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className={`${ProximaNova.variable} dark antialiased`}>
        <TRPCProvider>
          <ViewTransition>{children}</ViewTransition>
          <Toaster
            closeButton={true}
            duration={5000}
            position="bottom-right"
            richColors={true}
          />
        </TRPCProvider>
      </body>
    </html>
  );
}
