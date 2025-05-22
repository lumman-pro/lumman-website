import type { Metadata } from "next";
import InsightsPageClient from "./InsightsPageClient";

export const metadata: Metadata = {
  title: "Insights | Lumman.ai",
  description: "Thoughts on AI, automation, and business transformation",
};

export default function InsightsPage() {
  return <InsightsPageClient />;
}
