"use client"

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { handleSupabaseError } from "@/lib/utils"
import type { UserProfile } from "@/hooks/use-user-profile"
import type { Post, Category } from "@/lib/insights"

// Types
interface Chat {
  id: string
  chat_name: string
  created_at: string
  user_id: string
  last_message_at: string | null
  is_archived: boolean
}

interface ChatMessage {
  id: string
  chat_id: string
  content: string
  role: string
  created_at: string
}

interface FetchChatsOptions {
  limit?: number
  offset?: number
  includeArchived?: boolean
}

interface FetchInsightsOptions {
  limit?: number
  offset?: number
  categorySlug?: string | null
}

// User data hook
export function useUserData(options?: UseQueryOptions<UserProfile | null>) {
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          return null
        }

        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        if (profile) {
          return profile as UserProfile
        }

        // Create a new profile if one doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            user_name: user.user_metadata?.name || user.phone || null,
            user_email: user.email || null,
            user_phone: user.phone || null,
            company_name: null,
            company_url: null,
            account_type: "free",
            subscription_status: "inactive",
            subscription_id: null,
          })
          .select("*")
          .single()

        if (insertError) {
          throw insertError
        }

        return newProfile as UserProfile
      } catch (err) {
        console.error("Error fetching user profile:", err)
        throw new Error(handleSupabaseError(err, "useUserData", "Failed to load user profile"))
      }
    },
    ...options,
  })
}

// Update user profile mutation
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not authenticated")

        const { data, error } = await supabase
          .from("user_profiles")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select("*")
          .single()

        if (error) {
          throw error
        }

        return data as UserProfile
      } catch (err) {
        console.error("Error updating profile:", err)
        throw new Error(handleSupabaseError(err, "useUpdateUserProfile", "Failed to update profile"))
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["userData"], data)
    },
  })
}

// Chats hooks
export function useChats(options?: FetchChatsOptions) {
  const limit = options?.limit || 20
  const offset = options?.offset || 0
  const includeArchived = options?.includeArchived || false

  return useQuery({
    queryKey: ["chats", limit, offset, includeArchived],
    queryFn: async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not authenticated")

        let query = supabase
          .from("chats")
          .select("id, chat_name, created_at, user_id, last_message_at, is_archived", { count: "exact" })
          .eq("user_id", user.id)

        if (!includeArchived) {
          query = query.eq("is_archived", false)
        }

        const { data, error, count } = await query
          .order("last_message_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) {
          throw error
        }

        return {
          chats: data as Chat[],
          count: count || 0,
        }
      } catch (err) {
        console.error("Error fetching chats:", err)
        throw new Error(handleSupabaseError(err, "useChats", "Failed to load chats"))
      }
    },
  })
}

// Chat messages hook
export function useChatMessages(chatId: string, limit = 50) {
  return useQuery({
    queryKey: ["chatMessages", chatId, limit],
    queryFn: async () => {
      try {
        if (!chatId) {
          return { messages: [], count: 0 }
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not authenticated")

        // First verify the user owns this chat
        const { data: chatData, error: chatError } = await supabase
          .from("chats")
          .select("id")
          .eq("id", chatId)
          .eq("user_id", user.id)
          .single()

        if (chatError) {
          if (chatError.code === "PGRST116") {
            throw new Error("Chat not found or you don't have permission to access it")
          }
          throw chatError
        }

        const { data, error, count } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact" })
          .eq("chat_id", chatId)
          .order("created_at", { ascending: false })
          .limit(limit)

        if (error) {
          throw error
        }

        return {
          messages: (data as ChatMessage[]).reverse(), // Reverse to get chronological order
          count: count || 0,
        }
      } catch (err) {
        console.error("Error fetching chat messages:", err)
        throw new Error(handleSupabaseError(err, "useChatMessages", "Failed to load chat messages"))
      }
    },
    enabled: !!chatId,
  })
}

// Create new chat mutation
export function useCreateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (chatName: string) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not authenticated")

        const { data, error } = await supabase
          .from("chats")
          .insert({
            chat_name: chatName || "New Chat",
            user_id: user.id,
          })
          .select("*")
          .single()

        if (error) {
          throw error
        }

        return data as Chat
      } catch (err) {
        console.error("Error creating chat:", err)
        throw new Error(handleSupabaseError(err, "useCreateChat", "Failed to create chat"))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}

// Add message to chat mutation
export function useAddChatMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
      role,
    }: {
      chatId: string
      content: string
      role: "user" | "assistant" | "system"
    }) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not authenticated")

        // First verify the user owns this chat
        const { data: chatData, error: chatError } = await supabase
          .from("chats")
          .select("id")
          .eq("id", chatId)
          .eq("user_id", user.id)
          .single()

        if (chatError) {
          if (chatError.code === "PGRST116") {
            throw new Error("Chat not found or you don't have permission to access it")
          }
          throw chatError
        }

        // Add the message
        const { data, error } = await supabase
          .from("chat_messages")
          .insert({
            chat_id: chatId,
            content,
            role,
          })
          .select("*")
          .single()

        if (error) {
          throw error
        }

        // Update the last_message_at timestamp
        await supabase
          .from("chats")
          .update({
            last_message_at: new Date().toISOString(),
          })
          .eq("id", chatId)
          .eq("user_id", user.id)

        return data as ChatMessage
      } catch (err) {
        console.error("Error adding chat message:", err)
        throw new Error(handleSupabaseError(err, "useAddChatMessage", "Failed to add message"))
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages", data.chat_id] })
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}

// Archive chat mutation
export function useArchiveChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (chatId: string) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not authenticated")

        // First verify the user owns this chat
        const { data: chatData, error: chatError } = await supabase
          .from("chats")
          .select("id")
          .eq("id", chatId)
          .eq("user_id", user.id)
          .single()

        if (chatError) {
          if (chatError.code === "PGRST116") {
            throw new Error("Chat not found or you don't have permission to access it")
          }
          throw chatError
        }

        // Archive the chat
        const { data, error } = await supabase
          .from("chats")
          .update({
            is_archived: true,
          })
          .eq("id", chatId)
          .eq("user_id", user.id)
          .select("*")
          .single()

        if (error) {
          throw error
        }

        // Create an archive record
        await supabase.from("chats_archive").insert({
          chat_id: chatId,
          user_id: user.id,
          archived_at: new Date().toISOString(),
        })

        return data as Chat
      } catch (err) {
        console.error("Error archiving chat:", err)
        throw new Error(handleSupabaseError(err, "useArchiveChat", "Failed to archive chat"))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}

// Insights hooks
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("insights_categories").select("*").order("name")

        if (error) {
          throw error
        }

        return data as Category[]
      } catch (err) {
        console.error("Error fetching categories:", err)
        throw new Error(handleSupabaseError(err, "useCategories", "Failed to load categories"))
      }
    },
  })
}

export function useInsights(options?: FetchInsightsOptions) {
  const limit = options?.limit || 10
  const offset = options?.offset || 0
  const categorySlug = options?.categorySlug || null

  return useQuery({
    queryKey: ["insights", limit, offset, categorySlug],
    queryFn: async () => {
      try {
        // Check if user is authenticated (for admin access to unpublished posts)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const isAuthenticated = !!session?.user

        // If filtering by category, get the category ID first
        let categoryId: string | null = null
        if (categorySlug) {
          const { data: category, error: categoryError } = await supabase
            .from("insights_categories")
            .select("id")
            .eq("slug", categorySlug)
            .single()

          if (categoryError) {
            console.error("Error fetching category:", categoryError)
            return { posts: [], count: 0 }
          }

          categoryId = category?.id || null

          // If category not found, return empty result
          if (!categoryId) {
            return { posts: [], count: 0 }
          }
        }

        // Build the query for posts with authors
        let query = supabase.from("insights_posts").select("*, author:insights_authors(*)", { count: "exact" })

        // Apply published filter based on authentication status
        if (!isAuthenticated) {
          query = query.eq("is_published", true)
        }

        // If filtering by category, use a more efficient approach
        if (categoryId) {
          // Get post IDs that belong to the category
          const { data: postRelations, error: relationsError } = await supabase
            .from("insights_posts_categories")
            .select("post_id")
            .eq("category_id", categoryId)

          if (relationsError) {
            console.error("Error fetching post relations:", relationsError)
            return { posts: [], count: 0 }
          }

          // If no posts in this category, return empty result
          if (!postRelations || postRelations.length === 0) {
            return { posts: [], count: 0 }
          }

          // Filter posts by the IDs we found
          const postIds = postRelations.map((relation) => relation.post_id)
          query = query.in("id", postIds)
        }

        // Execute the query with pagination
        const {
          data: postsWithAuthors,
          error: postsError,
          count,
        } = await query.order("published_at", { ascending: false }).range(offset, offset + limit - 1)

        if (postsError) {
          console.error("Error fetching posts:", postsError)
          return { posts: [], count: 0 }
        }

        // If no posts, return early
        if (!postsWithAuthors || postsWithAuthors.length === 0) {
          return { posts: [], count: 0 }
        }

        // Get all post IDs
        const postIds = postsWithAuthors.map((post) => post.id)

        // Fetch categories for all posts in a single query with join
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("insights_posts_categories")
          .select("post_id, category:insights_categories(*)")
          .in("post_id", postIds)

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError)
          // Return posts without categories rather than failing completely
          return {
            posts: postsWithAuthors.map((post) => ({ ...post, categories: [] })),
            count: count || 0,
          }
        }

        // Group categories by post_id for efficient mapping
        const categoriesByPostId: Record<string, Category[]> = {}
        categoriesData?.forEach((item) => {
          if (!categoriesByPostId[item.post_id]) {
            categoriesByPostId[item.post_id] = []
          }
          if (item.category) {
            categoriesByPostId[item.post_id].push(item.category)
          }
        })

        // Map categories to posts
        const postsWithCategories = postsWithAuthors.map((post) => ({
          ...post,
          categories: categoriesByPostId[post.id] || [],
        }))

        return {
          posts: postsWithCategories as Post[],
          count: count || 0,
        }
      } catch (err) {
        console.error("Error fetching insights:", err)
        throw new Error(handleSupabaseError(err, "useInsights", "Failed to load insights"))
      }
    },
  })
}

export function useInsightBySlug(slug: string | null) {
  return useQuery({
    queryKey: ["insight", slug],
    queryFn: async () => {
      try {
        if (!slug) {
          return null
        }

        // Check if user is authenticated (for admin access to unpublished posts)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const isAuthenticated = !!session?.user

        // Build query
        let query = supabase.from("insights_posts").select("*, author:insights_authors(*)").eq("slug", slug)

        // For non-authenticated users, only show published posts
        if (!isAuthenticated) {
          query = query.eq("is_published", true)
        }

        const { data: post, error } = await query.single()

        if (error) {
          console.error("Error fetching post:", error)
          return null
        }

        if (!post) {
          return null
        }

        try {
          // Fetch categories for the post in a single query chain
          const { data: postCategories, error: categoriesError } = await supabase
            .from("insights_posts_categories")
            .select("category:insights_categories(*)")
            .eq("post_id", post.id)

          if (categoriesError) {
            console.error("Error fetching post categories:", categoriesError)
            // Return post without categories rather than failing completely
            return {
              ...post,
              categories: [],
            }
          }

          // Extract categories from the joined query
          const categories = (postCategories?.map((item) => item.category).filter(Boolean) as Category[]) || []

          return {
            ...post,
            categories,
          } as Post
        } catch (err) {
          console.error("Error processing post categories:", err)
          return {
            ...post,
            categories: [],
          } as Post
        }
      } catch (err) {
        console.error("Error fetching insight by slug:", err)
        throw new Error(handleSupabaseError(err, "useInsightBySlug", "Failed to load insight"))
      }
    },
    enabled: !!slug,
  })
}
