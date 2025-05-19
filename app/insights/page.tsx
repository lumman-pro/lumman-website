import type { Metadata } from "next"
import { getPosts, getCategories } from "@/lib/insights"
import { PostCard } from "@/components/insights/post-card"
import { CategoryList } from "@/components/insights/category-list"
import { Pagination } from "@/components/insights/pagination"

export const metadata: Metadata = {
  title: "Insights | Lumman.ai",
  description: "Thoughts on AI, automation, and business transformation",
}

const POSTS_PER_PAGE = 9

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  const { posts, count } = await getPosts({
    limit: POSTS_PER_PAGE,
    offset,
  })

  const categories = await getCategories()
  const totalPages = Math.ceil(count / POSTS_PER_PAGE)

  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out mb-4">
            Insights
          </h1>
          <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
            Thoughts on AI, automation, and business transformation
          </p>
        </div>

        <CategoryList categories={categories} />

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} basePath="/insights" />
          </>
        ) : (
          <p className="text-muted-foreground py-12 text-center">No posts found.</p>
        )}
      </div>
    </div>
  )
}
