import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "lili.in.bio",
  description: "A context-aware link-in-bio that adapts to you. Built to demonstrate visitor-first product thinking.",
  keywords: ["portfolio", "developer", "context-aware", "product design", "link in bio"],
  authors: [{ name: "Lili" }],
  // Essential for Instagram link previews
  openGraph: {
    title: "lili.in.bio",
    description: "A context-aware link-in-bio that adapts to you",
    type: "website",
    siteName: "lili.in.bio",
  },
  twitter: {
    card: "summary_large_image",
    title: "lili.in.bio",
    description: "A context-aware link-in-bio that adapts to you",
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
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
            <h1 className="noscript-title">lili.in.bio</h1>
            <div className="noscript-links">
              <a href="https://drip-e.com" className="noscript-link">drip-e</a>
              <a href="https://comm-fridge.vercel.app/" className="noscript-link">wefrigerator</a>
              <a href="https://github.com/reckziegelwilliam" className="noscript-link">GitHub</a>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  );
}

