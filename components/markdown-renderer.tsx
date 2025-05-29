"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  contentHtml?: string | null;
  className?: string;
  useHtml?: boolean;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
