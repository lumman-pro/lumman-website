import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

// SEO Metadata
export const metadata: Metadata = {
  title: "Contact Lumman AI - Get in Touch with Our AI Experts",
  description:
    "Ready to transform your business with AI? Contact Lumman AI for AI automation, consulting, and R&D services. We help companies evolve using artificial intelligence.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Lumman AI - Get in Touch with Our AI Experts",
    description:
      "Ready to transform your business with AI? Contact Lumman AI for AI automation, consulting, and R&D services.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    title: "Contact Lumman AI - Get in Touch with Our AI Experts",
    description:
      "Ready to transform your business with AI? Contact Lumman AI for AI automation, consulting, and R&D services.",
  },
  robots: "index,follow",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
