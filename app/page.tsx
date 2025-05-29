import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { FaqSection } from "@/components/faq-section";
import { LukeButton } from "@/components/luke-button";
import { Header } from "@/components/header";
import { getStaticSEOData, generateCanonicalUrl } from "@/lib/seo-static";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getStaticSEOData("/");

  if (!seoData) {
    return {};
  }

  const canonicalUrl = generateCanonicalUrl("/");

  return {
    title: seoData.meta_title,
    description: seoData.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoData.meta_title,
      description: seoData.meta_description,
      url: canonicalUrl,
      type: "website",
      images: seoData.og_image_url
        ? [
            {
              url: seoData.og_image_url,
              width: 1200,
              height: 630,
              alt: seoData.meta_title,
            },
          ]
        : undefined,
    },
    twitter: {
      title: seoData.meta_title,
      description: seoData.meta_description,
      images: seoData.og_image_url ? [seoData.og_image_url] : undefined,
    },
    robots: seoData.robots_directive || "index,follow",
  };
}

export default function Home() {
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What exactly is Lumman?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lumman is an AI R&D lab built for execution. We explore the best ways AI can be applied in business, then work with leadership to turn complex needs into working systems, aligned, fast, and grounded in business logic.",
        },
      },
      {
        "@type": "Question",
        name: "What does it cost to work with Lumman?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Costs vary based on what's being solved. AI Agents and Automation modules typically start in the low four figures and scale with scope and complexity. Advisory is offered as direct one-on-one work with executives, starting from several hundred per hour.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know if my business is ready for AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If your team spends time on routine calls, follows up manually, copies data between tools, or reads through documents to act — there's room to move. We also handle complex multi-step flows, fragmented processes, decisions that depend on messy context.",
        },
      },
      {
        "@type": "Question",
        name: "Do we need to hire AI specialists to get started?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In most cases, there is no need to hire new dedicated AI teams. But you absolutely need to train your current team. We help you start with a hybrid model. Move now. Build internal strength as you go.",
        },
      },
      {
        "@type": "Question",
        name: "Is AI just for fast-moving startups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That's exactly why you should move now. Just not blindly, smart moves only. The risk isn't adopting AI too early. The risk is doing nothing and watching clients quietly switch sides.",
        },
      },
      {
        "@type": "Question",
        name: "Can we start by automating documentation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You could. But why? We used to write docs so people could understand the system. Now the system guides, responds, and learns. Don't speed up dying processes. Rethink them.",
        },
      },
      {
        "@type": "Question",
        name: "What if we don't even know where to apply AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Perfect. That's exactly where R&D begins. Most companies wait for 'ready-made use cases' and clear ROI. Smarter ones create their own. We'll help you spot leverage points and test fast.",
        },
      },
    ],
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lumman AI",
    description:
      "AI R&D Lab helping companies automate operations and evolve using AI",
    url: "https://lumman.ai",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://lumman.ai/ai-insights?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd data={faqSchema} />
      <JsonLd data={websiteSchema} />

      <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
        <Header />
        <main className="flex-1 transition-colors duration-300 ease-in-out">
          <div className="container max-w-3xl pt-12 pb-12 md:pt-24 md:pb-24">
            <div className="flex flex-col">
              <section className="mb-32">
                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out">
                  <div className="whitespace-nowrap">
                    from signal to system.
                  </div>
                  <div className="mt-2 md:mt-2">
                    cognition. in motion<span className="blinking-dot">.</span>
                  </div>
                </h1>
                <h2 className="text-foreground text-lg font-medium mt-4 transition-colors duration-300 ease-in-out">
                  AI solutions & ops R&D Lab
                </h2>
              </section>

              <section className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center mb-48">
                <p className="text-sl text-muted-foreground leading-relaxed max-w-md transition-colors duration-300 ease-in-out">
                  Luke is an autonomous AI trained on real business cases. He's
                  here to listen, spot what's holding you back, and share ideas
                  from the field. 24/7
                </p>
                <div className="inline-block">
                  <LukeButton />
                </div>
              </section>

              <div className="mb-10 mt-[-3rem]">
                <h3 className="text-lg font-medium tracking-tight text-left text-foreground transition-colors duration-300 ease-in-out">
                  OUR FOCUS
                </h3>
              </div>

              <section className="space-y-12 text-right mb-32">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div></div> {/* Empty div to maintain the flex layout */}
                    <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
                      AI AGENTS & AUTOMATIONS
                    </h3>
                  </div>
                  <div className="text-muted-foreground space-y-4 leading-relaxed max-w-lg ml-auto">
                    <p className="transition-colors duration-300 ease-in-out">
                      We build AI systems that operate behind screens — and
                      where there are no screens at all. From fragmented digital
                      workflows to entirely human-run routines, Lumman automates
                      what drains time, focus, and resources. Each system is
                      custom-fit, quiet, and built to work in real operational
                      conditions. Fast.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
                    ADVISORY
                  </h3>
                  <div className="text-muted-foreground space-y-4 leading-relaxed max-w-lg ml-auto">
                    <p className="transition-colors duration-300 ease-in-out">
                      We help founders and leadership teams make sense of AI —
                      where it fits, what it's for, and how to start. From
                      exploring use cases to shaping first steps, our work is
                      focused, practical, and grounded in the needs of the
                      business.
                    </p>
                  </div>
                </div>

                {/* <div className="space-y-6">
                  <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
                    OWN PROJECTS
                  </h3>
                  <div className="text-muted-foreground space-y-4 leading-relaxed max-w-lg ml-auto">
                    <p className="transition-colors duration-300 ease-in-out">
                      Alongside our client work, we build products of our own — ideas we want to exist and are ready to
                      stand behind. From real-world pain points to working software, each product is shaped by what we
                      know, need, and use.
                    </p>
                  </div>
                </div> */}
              </section>

              <FaqSection />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
