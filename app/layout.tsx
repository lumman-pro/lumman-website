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
import { getStaticGlobalSEOSettings } from "@/lib/seo-static";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStaticGlobalSEOSettings();

  const siteName = settings.site_name || "Lumman AI";
  const siteDescription =
    settings.site_description ||
    "AI R&D Lab helping companies automate operations and evolve using AI. From signal to system. Cognition. In motion.";
  const siteUrl =
    settings.site_url ||
    (process.env.NODE_ENV === "production"
      ? "https://www.lumman.ai"
      : "http://localhost:3000");
  const defaultOgImage = settings.default_og_image || "/og-image.png";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    generator: "Next.js",
    applicationName: siteName,
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
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: siteUrl,
      siteName: siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [defaultOgImage],
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
      title: siteName,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

// Get organization schema from settings
async function getOrganizationSchema() {
  const settings = await getStaticGlobalSEOSettings();
  return (
    settings.organization_schema || {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Lumman AI",
      description:
        "AI R&D Lab helping companies automate operations and evolve using AI",
      url: "https://www.lumman.ai",
      logo: "https://www.lumman.ai/lumman_black.svg",
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
        addressCountry: "GB",
        addressLocality: "London",
      },
    }
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = await getOrganizationSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link
          rel="preconnect"
          href="https://xkhtcpwgziilmjdaymfu.supabase.co"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://vercel.live" />

        <JsonLd data={organizationSchema} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  );
}
