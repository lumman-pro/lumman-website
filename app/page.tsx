import { Footer } from "@/components/footer";
import { FaqSection } from "@/components/faq-section";
import { LukeButton } from "@/components/luke-button";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <Header />
      <main className="flex-1 transition-colors duration-300 ease-in-out">
        <div className="container max-w-3xl pt-12 pb-12 md:pt-24 md:pb-24">
          <div className="flex flex-col">
            <section className="mb-32">
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out">
                <div className="whitespace-nowrap">from signal to system.</div>
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
                Luke is an autonomous AI trained on real business cases. He’s
                here to listen, spot what’s holding you back, and share ideas
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
                    We build AI systems that operate behind screens — and where
                    there are no screens at all. From fragmented digital
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
  );
}
