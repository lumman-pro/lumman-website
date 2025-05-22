"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  contentHtml?: string | null
  className?: string
  useHtml?: boolean
}

export function MarkdownRenderer({ content, contentHtml, className, useHtml = false }: MarkdownRendererProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // If HTML content is available and useHtml is true, render it directly
  if (useHtml && contentHtml) {
    return (
      <div
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-none transition-colors duration-300 ease-in-out",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    )
  }

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
        "prose-pre:bg-muted prose-pre:text-foreground",
        // HR
        "prose-hr:border-border",
        // Custom class
        className,
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter
              style={isDark ? oneDark : oneLight}
              language={match[1]}
              PreTag="div"
              className="rounded-md border border-border !bg-muted !p-0"
              showLineNumbers
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground" {...props}>
              {children}
            </code>
          )
        },
        // Customize other elements as needed
        h1: ({ children }) => <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold tracking-tight mt-8 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold tracking-tight mt-6 mb-3">{children}</h3>,
        p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
        ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
        ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="mt-6 border-l-2 border-muted-foreground/50 pl-6 italic">{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
