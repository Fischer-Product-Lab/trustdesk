import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustDesk — Customer Security Questionnaire Automation",
  description:
    "Classify customer trust questions, map them to approved control evidence, draft governed responses, and surface SLA and revenue risk. A read-only, synthetic-data demo from Fischer Product Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} ${hankenGrotesk.variable} h-full`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
