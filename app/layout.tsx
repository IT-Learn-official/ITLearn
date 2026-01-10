import type { Metadata } from "next";
import proximaNova from "next/font/local";
import { ViewTransition } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const ProximaNova = proximaNova({
  src: "./fonts/Proxima-Nova.woff",
  variable: "--font-proxima-nova",
});

export const metadata: Metadata = {
  title: "ITLearn",
  description: "Gegenereerd door create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${ProximaNova.variable} dark antialiased`}>
        <ViewTransition>{children}</ViewTransition>
        <Toaster position="bottom-right" richColors={true} />
      </body>
    </html>
  );
}
