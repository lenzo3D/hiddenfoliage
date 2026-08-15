// The layout wraps every page of the site. It sets the <html> and <body> tags,
// the browser tab title, and loads the global CSS. Fonts will be chosen later.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hidden Foliage",
  description: "Hidden Foliage — a private residence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
