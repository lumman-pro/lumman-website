import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPosts, getCategories } from "@/lib/insights"
import { PostCard } from "@/components/insights/post-card"
import { CategoryList } from "@/components/insights/category-list"
import { Pagination } from "@/components/insights/pagination"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === params.slug)

  if (!category) {
    return {
      title: "Category Not Found | Lumman.ai",
    }
  }

  return {
    title: `${category.name} | Insights | Lumman.ai`,
    description: `Insights about ${category.name}`,
  }
}

const POSTS_PER_PAGE = 9

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  // Fix: Convert searchParams.page to number safely
  const pageParam = searchParams?.page
  const currentPage = pageParam ? Number.parseInt(pageParam, 10) : 1
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  // Fetch data in parallel
  const [categories, { posts, count }] = await Promise.all([
    getCategories(),
    getPosts({
      limit: POSTS_PER_PAGE,
      offset,
      categorySlug: params.slug,
    }),
  ])

  const category = categories.find((c) => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  const totalPages = Math.ceil(count / POSTS_PER_PAGE)

  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out mb-4">
            {category.name}
          </h1>
          <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
            Insights about {category.name.toLowerCase()}
          </p>
        </div>

        <CategoryList categories={categories} currentCategory={params.slug} />

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              basePath={`/insights/category/${params.slug}`}
            />
          </>
        ) : (
          <p className="text-muted-foreground py-12 text-center">No posts found in this category.</p>
        )}
      </div>
    </div>
  )
}
