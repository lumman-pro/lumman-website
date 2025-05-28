"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useInsightBySlug } from "@/hooks/use-data-fetching";
import { formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PostSkeleton } from "@/components/insights/post-skeleton";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // Use React Query hook
  const { data: post, isLoading, error } = useInsightBySlug(slug);

  // If post not found after loading, redirect to 404
  if (!isLoading && !post) {
    router.push("/404");
    return null;
  }

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    return (
      <div className="container max-w-3xl py-12 md:py-24">
        <div className="text-destructive text-center">
          {error instanceof Error ? error.message : "Failed to load post"}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <article className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/ai-insights"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out"
          >
            ← Back to AI Insights
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-in-out">
            {post.title}
          </h1>

          <div className="flex items-center text-sm text-muted-foreground">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {formatDate(new Date(post.published_at))}
              </time>
            )}

            {post.categories && post.categories.length > 0 && (
              <>
                <span className="mx-2">·</span>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/ai-insights/category/${category.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {post.featured_image && (
          <div className="overflow-hidden">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <MarkdownRenderer
          content={post.content}
          contentHtml={post.content_html}
          useHtml={!!post.content_html}
        />

        {post.author && (
          <div className="border-t border-border pt-8 mt-12">
            <div className="flex items-center gap-4">
              {post.author.avatar_url && (
                <img
                  src={post.author.avatar_url || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-medium text-foreground transition-colors duration-300 ease-in-out">
                  {post.author.name}
                </h3>
                {post.author.bio && (
                  <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
