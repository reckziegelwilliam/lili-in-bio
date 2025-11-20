import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lili - Visitor Console",
  description: "A context-aware link-in-bio that adapts to you. Built to demonstrate visitor-first product thinking.",
  keywords: ["portfolio", "developer", "context-aware", "product design"],
  authors: [{ name: "Lili" }],
  openGraph: {
    title: "Lili - Visitor Console",
    description: "A context-aware link-in-bio that adapts to you",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lili - Visitor Console",
    description: "A context-aware link-in-bio that adapts to you",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

