import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/insights";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="space-y-4 transition-colors duration-300 ease-in-out">
      <Link href={`/ai-insights/${post.slug}`} className="block group">
        {post.featured_image && (
          <div className="mb-4 overflow-hidden">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors duration-300 ease-in-out group-hover:underline">
          {post.title}
        </h3>
      </Link>

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

      {post.excerpt && (
        <p className="text-muted-foreground leading-relaxed transition-colors duration-300 ease-in-out">
          {post.excerpt}
        </p>
      )}
    </article>
  );
}
