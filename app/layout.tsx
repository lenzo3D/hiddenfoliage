// The layout wraps every page of the site. It sets the <html> and <body> tags,
// the browser tab title, loads the two site fonts, and loads the global CSS.

import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Hidden Foliage",
  description: "Hidden Foliage — a private residence on Berrima Road, Singapore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
