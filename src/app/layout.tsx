import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { personJsonLd, routeMetadata, SITE_URL } from "@/content/seo";
import { jetbrainsMono, switzer } from "@/lib/fonts";
import "./globals.css";
import "@/styles/site.css";
import "@/styles/home.css";
import "@/styles/overrides.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...routeMetadata(""),
  authors: [{ name: "Sheng Yan", url: SITE_URL }],
  icons: { icon: "/favicon.png" },
};

const rootStyle = { "--mono": jetbrainsMono.style.fontFamily } as CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${switzer.variable} ${jetbrainsMono.variable}`} style={rootStyle} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Same as the source: flag JS before first paint so no-JS fallbacks never flash. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
