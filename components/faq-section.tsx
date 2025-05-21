"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <section className="space-y-8 transition-colors duration-300 ease-in-out">
      <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out mt-16">
        QUESTIONS OF SUBSTANCE
      </h3>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem
          value="item-1"
          className="border-t border-border py-4 transition-colors duration-300 ease-in-out"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground transition-colors duration-300 ease-in-out">
            What exactly is Lumman?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground transition-colors duration-300 ease-in-out">
              <p className="transition-colors duration-300 ease-in-out">Lumman is an AI R&D lab built for execution.</p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                We work with leadership to turn complex needs into working systems — aligned, fast, and grounded in
                business logic.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                It's not about building more software. It's about making less noise.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="border-t border-border py-4 transition-colors duration-300 ease-in-out"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground transition-colors duration-300 ease-in-out">
            How do I know if my business is ready for AI?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground transition-colors duration-300 ease-in-out">
              <p className="transition-colors duration-300 ease-in-out">
                If your team spends time on routine calls, follows up manually, copies data between tools, or reads
                through documents to act — there's room to move.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                But that's just the surface. We also handle the complex: multi-step flows, fragmented processes,
                decisions that depend on messy context. AI is not about replacing effort. It's about redirecting it to
                where it counts.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Talk to Luke and find out what's possible.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="border-t border-border py-4 transition-colors duration-300 ease-in-out"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground transition-colors duration-300 ease-in-out">
            Why not build an internal AI team?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground transition-colors duration-300 ease-in-out">
              <p className="transition-colors duration-300 ease-in-out">
                You should. If AI is part of your future, your team should own it.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Hiring takes time, top talent comes at a premium, and expect them to spend several hours each week
                staying current.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">We help you start with a hybrid model.</p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Move now. Build internal strength as you go.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-5"
          className="border-t border-border border-b py-4 transition-colors duration-300 ease-in-out"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground transition-colors duration-300 ease-in-out">
            What does it cost to work with Lumman?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground transition-colors duration-300 ease-in-out">
              <p className="transition-colors duration-300 ease-in-out">Costs vary based on what's being solved.</p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                AI Agents and Automation modules typically start in the low four figures and scale with scope and complexity.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Advisory is offered as direct one-on-one work with executives, starting from several hundred per hour.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
