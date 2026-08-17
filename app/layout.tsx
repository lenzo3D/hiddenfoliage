// The layout wraps every page of the site. It sets the <html> and <body> tags,
// the browser tab title and share-card metadata, loads the two site fonts, the
// global CSS, the skip link for keyboard users, and the navigation.

import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

// Large editorial serif for titles. Loaded once, self-hosted by Next.js.
const serif = Bodoni_Moda({
  subsets: ["latin"],
  weight: "variable", // variable font: gives us the optical-size axis below
  style: ["normal", "italic"],
  axes: ["opsz"], // optical sizing: crisper hairlines at large sizes
  variable: "--font-serif",
  display: "swap",
});

// Clean neutral sans-serif for small information text.
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

// The public address of the site, for absolute links in share cards. Set
// NEXT_PUBLIC_SITE_URL on the host (see .env.example); locally it falls back
// to the dev server.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
const DESCRIPTION =
  "A brand-new freehold house behind a screen of leaves — Berrima Road, Dunearn Estate, District 11, Singapore. Private viewings by appointment.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Hidden Foliage — Berrima Road, Singapore", template: "%s — Hidden Foliage" },
  description: DESCRIPTION,
  // Share cards (WhatsApp, iMessage, LinkedIn…) use app/opengraph-image.jpg,
  // which Next.js picks up by convention.
  openGraph: {
    type: "website",
    siteName: "Hidden Foliage",
    locale: "en_SG",
    url: "/",
    title: "Hidden Foliage — Berrima Road, Singapore",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} antialiased`}>
      <body>
        {/* Keyboard users can jump past the navigation; invisible until focused. */}
        <a
          href="#content"
          className="sr-only font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground focus:not-sr-only focus:fixed focus:left-[6vw] focus:top-5 focus:z-[60] focus:bg-background focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Nav />
        {children}
      </body>
    </html>
  );
}
