import { createServerSupabaseClient } from "./supabase/server-client";
import { getServerSession } from "./supabase/server-auth";
import type { Database } from "./supabase/database.types";

// Add the import for handleSupabaseError
import { handleSupabaseError } from "./utils";

export type Post = Database["public"]["Tables"]["insights_posts"]["Row"] & {
  author?: Database["public"]["Tables"]["insights_authors"]["Row"] | null;
  categories?: Database["public"]["Tables"]["insights_categories"]["Row"][];
};

export type Category =
  Database["public"]["Tables"]["insights_categories"]["Row"];

// Update the getPosts function
export async function getPosts({
  limit = 10,
  offset = 0,
  categorySlug = null,
  includeUnpublished = false,
}: {
  limit?: number;
  offset?: number;
  categorySlug?: string | null;
  includeUnpublished?: boolean;
} = {}): Promise<{ posts: Post[]; count: number }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated (for admin access to unpublished posts)
    const session = await getServerSession();
    const isAuthenticated = !!session?.user;

    // If filtering by category, get the category ID first
    let categoryId: string | null = null;
    if (categorySlug) {
      const { data: category, error: categoryError } = await supabase
        .from("insights_categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (categoryError) {
        console.error("Error fetching category:", categoryError);
        throw new Error(
          handleSupabaseError(
            categoryError,
            "getPosts:fetchCategory",
            "Category not found"
          )
        );
      }

      categoryId = category?.id || null;

      // If category not found, return empty result
      if (!categoryId) {
        return { posts: [], count: 0 };
      }
    }

    // Build the query for posts with authors
    let query = supabase
      .from("insights_posts")
      .select("*, author:insights_authors(*)", { count: "exact" });

    // Apply published filter based on authentication status
    // RLS will handle this automatically, but we're being explicit for clarity
    if (!isAuthenticated || !includeUnpublished) {
      query = query.eq("is_published", true);
    }

    // Add ordering with fallback for null published_at
    // First order by published_at (nulls last), then by created_at as fallback
    query = query.order("published_at", {
      ascending: false,
      nullsFirst: false,
    });
    query = query.order("created_at", { ascending: false });

    // If filtering by category, use a more efficient approach
    if (categoryId) {
      // Get post IDs that belong to the category
      const { data: postRelations, error: relationsError } = await supabase
        .from("insights_posts_categories")
        .select("post_id")
        .eq("category_id", categoryId);

      if (relationsError) {
        console.error("Error fetching post relations:", relationsError);
        throw new Error(
          handleSupabaseError(
            relationsError,
            "getPosts:fetchPostRelations",
            "Failed to load category posts"
          )
        );
      }

      // If no posts in this category, return empty result
      if (!postRelations || postRelations.length === 0) {
        return { posts: [], count: 0 };
      }

      // Filter posts by the IDs we found
      const postIds = postRelations.map((relation) => relation.post_id);
      query = query.in("id", postIds);
    }

    // Execute the query with pagination
    const {
      data: postsWithAuthors,
      error: postsError,
      count,
    } = await query.range(offset, offset + limit - 1);

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      throw new Error(
        handleSupabaseError(
          postsError,
          "getPosts:fetchPosts",
          "Failed to load posts"
        )
      );
    }

    // If no posts, return early
    if (!postsWithAuthors || postsWithAuthors.length === 0) {
      return { posts: [], count: 0 };
    }

    // Get all post IDs
    const postIds = postsWithAuthors.map((post) => post.id);

    // Fetch categories for all posts in a single query with join
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("insights_posts_categories")
      .select("post_id, category:insights_categories(*)")
      .in("post_id", postIds);

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      // Return posts without categories rather than failing completely
      return {
        posts: postsWithAuthors.map((post) => ({ ...post, categories: [] })),
        count: count || 0,
      };
    }

    // Group categories by post_id for efficient mapping
    const categoriesByPostId: Record<string, Category[]> = {};
    categoriesData?.forEach((item) => {
      if (!categoriesByPostId[item.post_id]) {
        categoriesByPostId[item.post_id] = [];
      }
      if (item.category) {
        categoriesByPostId[item.post_id].push(item.category);
      }
    });

    // Map categories to posts
    const postsWithCategories = postsWithAuthors.map((post) => ({
      ...post,
      categories: categoriesByPostId[post.id] || [],
    }));

    return {
      posts: postsWithCategories,
      count: count || 0,
    };
  } catch (error) {
    console.error("Error in getPosts:", error);
    // Return empty array instead of throwing to prevent page crashes
    return { posts: [], count: 0 };
  }
}

// Update the getCategories function
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: categories, error } = await supabase
      .from("insights_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error(
        handleSupabaseError(error, "getCategories", "Failed to load categories")
      );
    }

    return categories || [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

// Update the getPostBySlug function
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated (for admin access to unpublished posts)
    const session = await getServerSession();
    const isAuthenticated = !!session?.user;

    // Build query
    let query = supabase
      .from("insights_posts")
      .select("*, author:insights_authors(*)")
      .eq("slug", slug);

    // For non-authenticated users, only show published posts
    // RLS will handle this automatically, but we're being explicit for clarity
    if (!isAuthenticated) {
      query = query.eq("is_published", true);
    }

    const { data: post, error } = await query.single();

    if (error) {
      console.error("Error fetching post:", error);
      if (error.code === "PGRST116") {
        // No rows returned - post not found or not published
        return null;
      }
      throw new Error(
        handleSupabaseError(
          error,
          "getPostBySlug:fetchPost",
          "Failed to load post"
        )
      );
    }

    if (!post) {
      return null;
    }

    try {
      // Fetch categories for the post in a single query chain
      const { data: postCategories, error: categoriesError } = await supabase
        .from("insights_posts_categories")
        .select("category:insights_categories(*)")
        .eq("post_id", post.id);

      if (categoriesError) {
        console.error("Error fetching post categories:", categoriesError);
        // Return post without categories rather than failing completely
        return {
          ...post,
          categories: [],
        };
      }

      // Extract categories from the joined query
      const categories =
        (postCategories
          ?.map((item) => item.category)
          .filter(Boolean) as Category[]) || [];

      return {
        ...post,
        categories,
      };
    } catch (err) {
      console.error("Error processing post categories:", err);
      return {
        ...post,
        categories: [],
      };
    }
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    return null;
  }
}
