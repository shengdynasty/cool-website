import localFont from "next/font/local";

// Switzer (variable, 100-900) — the site's sans. Self-hosted, extracted from the source site.
export const switzer = localFont({
  src: "../fonts/switzer-variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-sans-face",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: "Arial",
});

// JetBrains Mono (variable, 100-800, latin subset) — titles, buttons, labels, and every canvas glyph.
export const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-mono-face",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: "Arial",
});
