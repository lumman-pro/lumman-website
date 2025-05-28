"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section className="space-y-8">
      <h3 className="text-2xl font-medium tracking-tight text-foreground mt-16">
        QUESTIONS OF SUBSTANCE
      </h3>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1" className="border-t border-border py-4">
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            What exactly is Lumman?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>Lumman is an AI R&D lab built for execution.</p>
              <p className="mt-2">
                We explore the best ways AI can be applied in business, then
                work with leadership to turn complex needs into working systems,
                aligned, fast, and grounded in business logic.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-t border-border py-4">
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            What does it cost to work with Lumman?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>Costs vary based on what's being solved.</p>
              <p className="mt-2">
                AI Agents and Automation modules typically start in the low four
                figures and scale with scope and complexity.
              </p>
              <p className="mt-2">
                Advisory is offered as direct one-on-one work with executives,
                starting from several hundred per hour.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-t border-border py-4">
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            How do I know if my business is ready for AI?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>
                If your team spends time on routine calls, follows up manually,
                copies data between tools, or reads through documents to act —
                there's room to move.
              </p>
              <p className="mt-2">
                But that's just the surface. We also handle the complex:
                multi-step flows, fragmented processes, decisions that depend on
                messy context. AI is not about replacing effort. It's about
                redirecting it to where it counts.
              </p>
              <p className="mt-2">Talk to Luke and find out what's possible.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-t border-border py-4">
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            Do we need to hire AI specialists to get started?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>
                In most cases, there is no need to hire new dedicated AI teams.
                But you absolutely need to train your current team.
              </p>
              <p className="mt-2">We help you start with a hybrid model.</p>
              <p className="mt-2">
                Move now. Build internal strength as you go.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-t border-border py-4">
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            Is AI just for fast-moving startups? We have real
            customers/money/regulation/etc.
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>
                That's exactly why you should move now. Just not blindly, smart
                moves only.
              </p>
              <p className="mt-2">
                Startups move fast not because they're reckless, but because
                they need to do so. While enterprises worry about "control and
                governance", their customers are trying out faster, simpler
                alternatives. The risk isn't adopting AI too early. The risk is
                doing nothing and watching clients quietly switch sides.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="border-t border-border py-4">
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            Can we start by automating documentation?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>You could. But why?</p>
              <p className="mt-2">
                We used to write docs so people could understand the system. Now
                the system guides, responds, and learns.
              </p>
              <p className="mt-2">
                If your first instinct is "how can we generate documentation
                with AI", you're still playing last year's game. Don't speed up
                dying processes. Rethink them.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-7"
          className="border-t border-border border-b py-4"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground">
            What if we don't even know where to apply AI?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground">
              <p>Perfect. That's exactly where R&D begins.</p>
              <p className="mt-2">
                Most companies wait for "ready-made use cases" and clear ROI.
                Smarter ones create their own. We'll help you spot leverage
                points and test fast, not because "AI is trendy", but because
                friction is expensive and silence costs money.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
