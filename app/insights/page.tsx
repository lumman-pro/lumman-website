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
  // Fix: Convert searchParams.page to number safely
  const pageParam = searchParams?.page
  const currentPage = pageParam ? Number.parseInt(pageParam, 10) : 1
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  // Fetch data in parallel
  const [{ posts, count }, categories] = await Promise.all([
    getPosts({
      limit: POSTS_PER_PAGE,
      offset,
    }),
    getCategories(),
  ])

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
