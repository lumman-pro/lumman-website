import { supabaseServer } from "./supabase/supabaseServer"
import type { Database } from "./supabase/database.types"

export type Post = Database["public"]["Tables"]["insights_posts"]["Row"] & {
  author?: Database["public"]["Tables"]["insights_authors"]["Row"] | null
  categories?: Database["public"]["Tables"]["insights_categories"]["Row"][]
}

export type Category = Database["public"]["Tables"]["insights_categories"]["Row"]

// Optimize the getPosts function to reduce sequential queries
export async function getPosts({
  limit = 10,
  offset = 0,
  categorySlug = null,
  includeUnpublished = false,
}: {
  limit?: number
  offset?: number
  categorySlug?: string | null
  includeUnpublished?: boolean
} = {}): Promise<{ posts: Post[]; count: number }> {
  // Start with a basic query
  let query = supabaseServer.from("insights_posts").select("*, author:insights_authors(*)", { count: "exact" })

  if (!includeUnpublished) {
    query = query.eq("is_published", true)
  }

  // If filtering by category, we need to handle this differently
  let categoryId: string | null = null
  if (categorySlug) {
    const { data: categoryData } = await supabaseServer
      .from("insights_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (categoryData) {
      categoryId = categoryData.id
      const { data: postIds } = await supabaseServer
        .from("insights_posts_categories")
        .select("post_id")
        .eq("category_id", categoryId)

      if (postIds && postIds.length > 0) {
        const ids = postIds.map((item) => item.post_id)
        query = query.in("id", ids)
      } else {
        // No posts in this category
        return { posts: [], count: 0 }
      }
    }
  }

  // Execute the query with pagination
  const {
    data: posts,
    error,
    count,
  } = await query.order("published_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], count: 0 }
  }

  // Fetch all categories for all posts in a single query
  const postIds = posts?.map((post) => post.id) || []

  // If there are no posts, return early
  if (postIds.length === 0) {
    return { posts: [], count: 0 }
  }

  // Get all post-category relationships in one query
  const { data: allPostCategories } = await supabaseServer
    .from("insights_posts_categories")
    .select("post_id, category_id")
    .in("post_id", postIds)

  // Get all unique category IDs
  const categoryIds = [...new Set(allPostCategories?.map((pc) => pc.category_id) || [])]

  // Fetch all categories in one query
  let categoriesMap: Record<string, any> = {}
  if (categoryIds.length > 0) {
    const { data: categories } = await supabaseServer.from("insights_categories").select("*").in("id", categoryIds)

    // Create a map for quick lookup
    categoriesMap = (categories || []).reduce(
      (acc, category) => {
        acc[category.id] = category
        return acc
      },
      {} as Record<string, any>,
    )
  }

  // Map categories to posts
  const postsWithCategories = (posts || []).map((post) => {
    const postCategoryRelations = allPostCategories?.filter((pc) => pc.post_id === post.id) || []
    const postCategories = postCategoryRelations.map((relation) => categoriesMap[relation.category_id]).filter(Boolean)

    return {
      ...post,
      categories: postCategories,
    }
  })

  return {
    posts: postsWithCategories,
    count: count || 0,
  }
}

// Optimize the getPostBySlug function to reduce sequential queries
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data: post, error } = await supabaseServer
    .from("insights_posts")
    .select("*, author:insights_authors(*)")
    .eq("slug", slug)
    .single()

  if (error || !post) {
    console.error("Error fetching post:", error)
    return null
  }

  // Fetch categories for the post in a single query chain
  const { data: postCategories } = await supabaseServer
    .from("insights_posts_categories")
    .select("category_id")
    .eq("post_id", post.id)

  if (!postCategories || postCategories.length === 0) {
    return {
      ...post,
      categories: [],
    }
  }

  const categoryIds = postCategories.map((pc) => pc.category_id)
  const { data: categories } = await supabaseServer.from("insights_categories").select("*").in("id", categoryIds)

  return {
    ...post,
    categories: categories || [],
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabaseServer.from("insights_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories
}
