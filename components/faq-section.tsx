"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <section className="space-y-8 transition-colors duration-300 ease-in-out">
      <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out">
        QUESTIONS OF SUBSTANCE
      </h3>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem
          value="item-1"
          className="border-t border-border py-4 transition-colors duration-300 ease-in-out"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground transition-colors duration-300 ease-in-out">
            What separates Lumman from traditional tech firms?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground transition-colors duration-300 ease-in-out">
              <p className="transition-colors duration-300 ease-in-out">Traditional vendors deliver scope.</p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Lumman delivers resolution tuned to business reality, not initial assumptions.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Where capability meets necessity, systems emerge.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="border-t border-border py-4 transition-colors duration-300 ease-in-out"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline text-foreground transition-colors duration-300 ease-in-out">
            Why is your implementation timeline so fast?
          </AccordionTrigger>
          <AccordionContent className="pt-4 leading-relaxed">
            <div className="text-muted-foreground transition-colors duration-300 ease-in-out">
              <p className="transition-colors duration-300 ease-in-out">
                Because no one here is paid to sit in meetings or make decks.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Lumman works architecturally: pressure point in, working system out.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">No scaffolding. No theater.</p>
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
                If you're repeating decisions, interpreting data, or processing text manually — you're already behind.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Lumman identifies points of intervention fast. No forms, no audits.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">Talk to Luke.</p>
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
                Hiring takes time, top talent comes at a premium, and expect them to spend several hours each week staying current.
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
                Automation modules typically start in the low four figures and scale with scope and complexity.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Advisory is offered as direct one-on-one work with executives, starting from several hundred per hour.
              </p>
              <p className="mt-2 transition-colors duration-300 ease-in-out">
                Luke can outline a working range based on real parameters. No sales pitch, no commitment.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
