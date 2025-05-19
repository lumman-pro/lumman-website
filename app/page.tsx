import { Footer } from "@/components/footer"
import { FaqSection } from "@/components/faq-section"
import { LukeButton } from "@/components/luke-button"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <Header />
      <main className="flex-1 transition-colors duration-300 ease-in-out">
        <div className="container max-w-3xl py-12 md:py-24">
          <div className="space-y-32">
            <section className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl leading-loose text-foreground transition-colors duration-300 ease-in-out">
                <div>from signal to system.</div>
                <div>
                  cognition. in motion<span className="blinking-dot">.</span>
                </div>
              </h1>
              <h2 className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
                AI solutions & ops R&D Lab
              </h2>
            </section>
            <section className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center my-16">
              <p className="text-sl text-muted-foreground leading-relaxed max-w-md transition-colors duration-300 ease-in-out">
                Luke is an autonomous AI trained on real business cases. He listens, evaluates, and offers strategic
                answers, including timeframes and cost ranges. Available anytime.
              </p>
              <div className="inline-block">
                <LukeButton />
              </div>
            </section>
            <section className="space-y-12 text-right">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium tracking-tight text-left text-foreground transition-colors duration-300 ease-in-out">
                    PRACTICAL AI
                  </h3>
                  <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
                    AUTOMATION BEYOND CODE
                  </h3>
                </div>
                <div className="text-muted-foreground space-y-4 leading-relaxed max-w-lg ml-auto">
                  <p className="transition-colors duration-300 ease-in-out">
                    Most automation stops at what can be wrapped in a tool, workflow, or template.
                  </p>
                  <p className="transition-colors duration-300 ease-in-out">
                    Lumman goes deeper, into processes that are fragmented, manual, or too context-specific for
                    off-the-shelf solutions.
                  </p>
                  <p className="transition-colors duration-300 ease-in-out">
                    The result isn't a product. It's an operational asset: invisible, custom-fit, and deployed in weeks,
                    not quarters.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
                  BOARDROOM CLARITY
                </h3>
                <div className="text-muted-foreground space-y-4 leading-relaxed max-w-lg ml-auto">
                  <p className="transition-colors duration-300 ease-in-out">
                    AI strategy isn't about trends. It's about leverage.
                  </p>
                  <p className="transition-colors duration-300 ease-in-out">
                    Lumman works directly with founders and leadership teams to identify where intelligence systems can
                    replace noise, not just add features.
                  </p>
                  <p className="transition-colors duration-300 ease-in-out">
                    Advisory outcomes are specific, tactical, and immediate, designed to unlock value without disrupting
                    what already works.
                  </p>
                </div>
              </div>
            </section>
            <FaqSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
