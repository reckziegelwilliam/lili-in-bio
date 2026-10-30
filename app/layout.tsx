import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "lili-in.bio";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

// Fraunces: soft, variable serif for the few phrases that should read as voice ("curious everywhere.", project names).
const displayFont = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  // Page-level canonical URLs and share images resolve against this.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://liamrex.world"),
  title: "liam rex",
  description: "Software engineer in space. Building founder tools, climate maps, and a horror RPG.",
  keywords: ["portfolio", "developer", "context-aware", "product design", "link in bio"],
  authors: [{ name: "Liam Rex" }],
  // Essential for Instagram link previews
  openGraph: {
    title: "liam rex",
    description: "Software engineer in space. Building founder tools, climate maps, and a horror RPG.",
    type: "website",
    siteName: "liam rex",
  },
  twitter: {
    card: "summary_large_image",
    title: "liam rex",
    description: "Software engineer in space. Building founder tools, climate maps, and a horror RPG.",
  },
  // Ensures proper behavior in in-app browsers
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    // Prevents some WebViews from caching aggressively
    "Cache-Control": "no-cache, no-store, must-revalidate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Prevents zoom issues in Instagram WebView
  userScalable: true,
  // Theme color for browser chrome
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${displayFont.variable}`}>
      <body className={`${dmSans.className} antialiased`}>
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.tagged-events.outbound-links.js"
          strategy="afterInteractive"
        />
        {children}
        {/* Fallback for when JavaScript fails in WebView */}
        <noscript>
          <style>{`
            body { background: #030712; color: white; font-family: system-ui, sans-serif; }
            .noscript-content { 
              min-height: 100vh; 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              padding: 2rem;
              text-align: center;
            }
            .noscript-title { font-size: 3rem; font-weight: 900; margin-bottom: 2rem; }
            .noscript-links { display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 320px; }
            .noscript-link { 
              display: block; 
              padding: 1rem 1.5rem; 
              background: rgba(255,255,255,0.1); 
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 1rem; 
              color: white; 
              text-decoration: none;
              font-weight: 600;
            }
            .noscript-link:hover { background: rgba(255,255,255,0.2); }
          `}</style>
          <div className="noscript-content">
            <h1 className="noscript-title">liam rex</h1>
            <div className="noscript-links">
              <a href="/projects/longsignal" className="noscript-link">Longsignal</a>
              <a href="/projects/terratrace" className="noscript-link">TerraTrace</a>
              <a href="/projects/ashwake" className="noscript-link">Ashwake</a>
              <a href="https://github.com/reckziegelwilliam" className="noscript-link">GitHub</a>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  );
}

