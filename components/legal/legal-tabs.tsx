"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LegalMarkdownRenderer } from "@/components/legal/legal-markdown-renderer";
import { Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Legal } from "@/lib/supabase/database.types";

export function LegalTabs() {
  const [activeTab, setActiveTab] = useState<string>("privacy");
  const [documents, setDocuments] = useState<Legal[]>([]);
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Загружаем список документов при монтировании компонента
  useEffect(() => {
    if (!isClient) return;

    const fetchDocuments = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase
          .from("legal")
          .select("*")
          .eq("is_active", true)
          .order("sort_order");

        if (error) throw error;

        setDocuments(data || []);

        // Устанавливаем первый документ как активный по умолчанию
        if (data && data.length > 0) {
          setActiveTab(data[0].slug);
        }
      } catch (err) {
        console.error("Failed to load legal documents:", err);
        setError("Failed to load legal documents");
      }
    };

    fetchDocuments();
  }, [isClient]);

  // Загружаем контент активной вкладки
  useEffect(() => {
    if (!isClient || !activeTab || documents.length === 0) return;

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const document = documents.find((doc) => doc.slug === activeTab);
        if (document) {
          setContent(document.content);
        } else {
          setError("Document not found");
        }
      } catch (err) {
        console.error("Failed to load legal content:", err);
        setError("Failed to load content");
        setContent("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [isClient, activeTab, documents]);

  // Показываем загрузку во время SSR или пока не загрузились документы
  if (!isClient || (documents.length === 0 && !error)) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <p className="text-destructive">{error}</p>
        <p className="text-muted-foreground mt-2">
          Legal documents may be unavailable.
        </p>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-8 w-full flex overflow-x-auto">
        {documents.map((doc) => (
          <TabsTrigger
            key={doc.slug}
            value={doc.slug}
            className="text-sm font-medium transition-colors duration-300 ease-in-out flex-1"
          >
            {doc.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {documents.map((doc) => (
        <TabsContent key={doc.slug} value={doc.slug} className="mt-0">
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
