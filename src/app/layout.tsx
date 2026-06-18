import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getSiteUrl } from "@/lib/site";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Moviebox — movie search",
    template: "%s — Moviebox",
  },
  description:
    "Search movies and series, browse details and save your favorites. Powered by the OMDb API.",
  applicationName: "Moviebox",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Moviebox",
    title: "Moviebox — movie search",
    description:
      "Search movies and series, browse details and save your favorites.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moviebox — movie search",
    description:
      "Search movies and series, browse details and save your favorites.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://ia.media-imdb.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <div id="main-content" className="flex flex-1 flex-col">
            {children}
          </div>
          {modal}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
