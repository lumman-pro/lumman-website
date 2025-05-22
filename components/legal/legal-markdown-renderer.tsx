"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface LegalMarkdownRendererProps {
  content: string;
  className?: string;
}

export function LegalMarkdownRenderer({
  content,
  className,
}: LegalMarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none transition-colors duration-300 ease-in-out",
        // Headings
        "prose-headings:font-medium prose-headings:tracking-tight",
        // Links
        "prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground/80",
        // Lists
        "prose-ul:list-disc prose-ol:list-decimal",
        // Blockquotes
        "prose-blockquote:border-l-2 prose-blockquote:border-muted-foreground/50 prose-blockquote:pl-4 prose-blockquote:italic",
        // Code
        "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-foreground",
        // Pre
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md",
        // HR
        "prose-hr:border-border",
        // Custom class
        className,
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        // Simple code block without syntax highlighting
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <pre className="rounded-md border border-border bg-muted p-4 overflow-x-auto">
              <code className="text-sm" {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code
              className="rounded bg-muted px-1 py-0.5 font-mono text-foreground"
              {...props}
            >
              {children}
            </code>
          );
        },
        // Customize other elements as needed
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold tracking-tight mt-8 mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold tracking-tight mt-6 mb-3">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-6 border-l-2 border-muted-foreground/50 pl-6 italic">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
