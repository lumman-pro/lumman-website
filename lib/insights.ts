import { supabaseServer } from "./supabase/supabaseServer"
import type { Database } from "./supabase/database.types"

export type Post = Database["public"]["Tables"]["insights_posts"]["Row"] & {
  author?: Database["public"]["Tables"]["insights_authors"]["Row"] | null
  categories?: Database["public"]["Tables"]["insights_categories"]["Row"][]
}

export type Category = Database["public"]["Tables"]["insights_categories"]["Row"]

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
  let query = supabaseServer.from("insights_posts").select("*, author:insights_authors(*)")

  if (!includeUnpublished) {
    query = query.eq("is_published", true)
  }

  // If filtering by category, we need to handle this differently
  // We'll get the post IDs that belong to the category first
  if (categorySlug) {
    const { data: categoryData } = await supabaseServer
      .from("insights_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (categoryData) {
      const { data: postIds } = await supabaseServer
        .from("insights_posts_categories")
        .select("post_id")
        .eq("category_id", categoryData.id)

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

  // Fetch categories for each post
  const postsWithCategories = await Promise.all(
    (posts || []).map(async (post) => {
      const { data: postCategories } = await supabaseServer
        .from("insights_posts_categories")
        .select("category_id")
        .eq("post_id", post.id)

      if (postCategories && postCategories.length > 0) {
        const categoryIds = postCategories.map((pc) => pc.category_id)

        const { data: categories } = await supabaseServer.from("insights_categories").select("*").in("id", categoryIds)

        return {
          ...post,
          categories: categories || [],
        }
      }

      return {
        ...post,
        categories: [],
      }
    }),
  )

  return {
    posts: postsWithCategories,
    count: count || 0,
  }
}

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

  // Fetch categories for the post
  const { data: postCategories } = await supabaseServer
    .from("insights_posts_categories")
    .select("category_id")
    .eq("post_id", post.id)

  if (postCategories && postCategories.length > 0) {
    const categoryIds = postCategories.map((pc) => pc.category_id)

    const { data: categories } = await supabaseServer.from("insights_categories").select("*").in("id", categoryIds)

    return {
      ...post,
      categories: categories || [],
    }
  }

  return {
    ...post,
    categories: [],
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
