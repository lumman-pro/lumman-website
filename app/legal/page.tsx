import type { Metadata } from "next"
import { LegalTabs } from "@/components/legal/legal-tabs"

export const metadata: Metadata = {
  title: "Legal | Lumman.ai",
  description: "Legal information, terms of use, and privacy policy",
}

export default function LegalPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <h1 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground transition-colors duration-300 ease-in-out mb-8">
        Legal Information
      </h1>
      <LegalTabs />
    </div>
  )
}
