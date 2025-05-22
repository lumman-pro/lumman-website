"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LegalMarkdownRenderer } from "@/components/legal/legal-markdown-renderer";
import { Loader2 } from "lucide-react";

type TabInfo = {
  id: string;
  label: string;
  file: string;
};

const legalTabs: TabInfo[] = [
  { id: "privacy", label: "Privacy Policy", file: "privacy.md" },
  { id: "terms", label: "Terms of Use", file: "terms.md" },
  { id: "refund", label: "Refund Policy", file: "refund.md" },
  { id: "business", label: "Business Info", file: "business-info.md" },
  { id: "other", label: "Other", file: "other.md" },
];

export function LegalTabs() {
  const [activeTab, setActiveTab] = useState<string>("privacy");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tab = legalTabs.find((tab) => tab.id === activeTab);
        if (!tab) return;

        const response = await fetch(`/legal/${tab.file}`);

        if (!response.ok) {
          throw new Error(`Failed to load ${tab.label}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error("Failed to load legal content:", err);
        setError(err instanceof Error ? err.message : "Failed to load content");
        setContent("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [activeTab]);

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-8 w-full flex overflow-x-auto">
        {legalTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="text-sm font-medium transition-colors duration-300 ease-in-out flex-1"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {legalTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-0">
          <div className="border rounded-md p-6 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <p className="text-destructive">{error}</p>
                <p className="text-muted-foreground mt-2">
                  Legal document may be missing or unavailable.
                </p>
              </div>
            ) : (
              <div className="overflow-auto max-h-[70vh]">
                <LegalMarkdownRenderer content={content} />
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
