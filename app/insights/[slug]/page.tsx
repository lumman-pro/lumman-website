import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug } from "@/lib/insights"
import { formatDate } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | Lumman.ai",
    }
  }

  return {
    title: `${post.title} | Lumman.ai`,
    description: post.excerpt || undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <article className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/insights"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out"
          >
            ← Back to Insights
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-in-out">
            {post.title}
          </h1>

          <div className="flex items-center text-sm text-muted-foreground">
            {post.published_at && <time dateTime={post.published_at}>{formatDate(new Date(post.published_at))}</time>}

            {post.categories && post.categories.length > 0 && (
              <>
                <span className="mx-2">·</span>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/insights/category/${category.slug}`}
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

        <MarkdownRenderer content={post.content} />

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
  )
}
