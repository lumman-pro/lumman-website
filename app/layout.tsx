import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { ReactQueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lumman AI - AI R&D Lab for Business Automation",
    template: "%s | Lumman AI",
  },
  description:
    "AI R&D Lab helping companies automate operations and evolve using AI. From signal to system. Cognition. In motion.",
  generator: "Next.js",
  applicationName: "Lumman AI",
  keywords: [
    "AI automation",
    "artificial intelligence",
    "business automation",
    "AI R&D lab",
    "AI consulting",
    "machine learning",
    "AI strategy",
    "AI agents",
    "process automation",
    "digital transformation",
  ],
  authors: [{ name: "Lumman AI", url: "https://lumman.ai" }],
  creator: "Lumman AI",
  publisher: "Lumman AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://lumman.ai"
      : "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lumman AI - AI R&D Lab for Business Automation",
    description:
      "AI R&D Lab helping companies automate operations and evolve using AI. From signal to system. Cognition. In motion.",
    url:
      process.env.NODE_ENV === "production"
        ? "https://lumman.ai"
        : "http://localhost:3000",
    siteName: "Lumman AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lumman AI - AI R&D Lab for Business Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumman AI - AI R&D Lab for Business Automation",
    description:
      "AI R&D Lab helping companies automate operations and evolve using AI. From signal to system. Cognition. In motion.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      {
        url: "/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lumman AI",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Organization Schema.org data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lumman AI",
  description:
    "AI R&D Lab helping companies automate operations and evolve using AI",
  url: "https://lumman.ai",
  logo: "https://lumman.ai/logo.png",
  sameAs: [
    "https://linkedin.com/company/lumman-ai",
    "https://twitter.com/lumman_ai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@lumman.ai",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className={inter.className}>
        <SupabaseProvider>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              <Analytics />
            </ThemeProvider>
          </ReactQueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
