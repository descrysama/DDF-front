import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sans Croquettes Fixes - Association de protection animale à Lyon",
  description: "Sans Croquettes Fixes est une association 100% bénévole basée à Lyon, active dans la région Auvergne-Rhône-Alpes. Nous aidons les animaux en détresse et leurs humains.",
  keywords: ["association animale", "protection animale", "refuge animaux Lyon", "adoption chat Lyon", "don animaux", "sans croquettes fixes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
