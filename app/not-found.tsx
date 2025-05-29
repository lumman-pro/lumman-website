import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Page Not Found | Lumman AI",
  description:
    "The page you're looking for doesn't exist. Explore our AI insights, services, or return to the homepage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <Header />
      <main className="flex-1 transition-colors duration-300 ease-in-out">
        <div className="container max-w-3xl py-12 md:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-in-out">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto transition-colors duration-300 ease-in-out">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Back to Homepage
              </Link>
              <Link
                href="/ai-insights"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Browse AI Insights
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
