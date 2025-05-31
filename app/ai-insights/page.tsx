import type { Metadata } from "next";
import {
  getStaticSEOData,
  generateCanonicalUrl,
  generateBreadcrumbSchema,
} from "@/lib/seo-static";
import JsonLd from "@/components/seo/JsonLd";
import InsightsPageClient from "./InsightsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getStaticSEOData("/ai-insights");

  const canonicalUrl = generateCanonicalUrl("/ai-insights");

  return {
    title:
      seoData?.meta_title ||
      "AI Insights - Expert Analysis on AI Automation & Strategy | Lumman AI",
    description:
      seoData?.meta_description ||
      "Discover expert insights on AI automation, business transformation, and AI strategy. Stay ahead with the latest trends in artificial intelligence and machine learning.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title:
        seoData?.meta_title ||
        "AI Insights - Expert Analysis on AI Automation & Strategy",
      description:
        seoData?.meta_description ||
        "Discover expert insights on AI automation, business transformation, and AI strategy. Stay ahead with the latest trends in artificial intelligence and machine learning.",
      url: canonicalUrl,
      type: "website",
      images: seoData?.og_image_url
        ? [
            {
              url: seoData.og_image_url,
              width: 1200,
              height: 630,
              alt: "AI Insights - Expert Analysis on AI Automation & Strategy",
            },
          ]
        : [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: "AI Insights - Expert Analysis on AI Automation & Strategy",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        seoData?.meta_title ||
        "AI Insights - Expert Analysis on AI Automation & Strategy",
      description:
        seoData?.meta_description ||
        "Discover expert insights on AI automation, business transformation, and AI strategy.",
      images: seoData?.og_image_url
        ? [seoData.og_image_url]
        : ["/og-image.png"],
    },
    robots: seoData?.robots_directive || "index,follow",
  };
}

export default function InsightsPage() {
  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.lumman.ai" },
    { name: "AI Insights", url: "https://www.lumman.ai/ai-insights" },
  ]);

  // Blog schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AI Insights",
    description:
      "Expert insights on AI automation, business transformation, and AI strategy",
    url: "https://www.lumman.ai/ai-insights",
    publisher: {
      "@type": "Organization",
      name: "Lumman AI",
      url: "https://www.lumman.ai",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.lumman.ai/ai-insights",
    },
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogSchema} />

      <InsightsPageClient />
    </>
  );
}
