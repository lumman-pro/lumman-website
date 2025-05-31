"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  useSupabaseRequired,
  useSupabase,
  useSupabaseStatus,
} from "@/providers/supabase-provider";
import { handleSupabaseError } from "@/lib/utils";
import { CACHE_TIMES } from "@/lib/constants";
import { withAuthCheck, isSupabaseReady } from "@/lib/auth-utils";
import type { UserProfile } from "@/hooks/use-user-profile";
import type { Post, Category } from "@/lib/insights";

// Types
interface Chat {
  id: string;
  chat_name: string;
  created_at: string;
  user_id: string;
  chat_summary: string | null;
  chat_duration: number | null;
  chat_transcription: string | null;
  status?: string;
}

interface FetchChatsOptions {
  limit?: number;
  offset?: number;
}

interface FetchInsightsOptions {
  limit?: number;
  offset?: number;
  categorySlug?: string | null;
}

/**
 * Хук для получения и управления данными пользователя
 * Автоматически создает профиль пользователя если его не существует
 *
 * @param options - Дополнительные опции React Query
 * @returns Query объект с данными пользователя
 */
// User data hook
export function useUserData(options?: UseQueryOptions<UserProfile | null>) {
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          return null;
        }

        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        if (profile) {
          return profile as UserProfile;
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
          })
          .select("*")
          .single();

        if (insertError) {
          throw insertError;
        }

        return newProfile as UserProfile;
      } catch (err) {
        console.error("Error fetching user profile:", err);
        throw new Error(
          handleSupabaseError(err, "useUserData", "Failed to load user profile")
        );
      }
    },
    enabled: isInitialized && !!supabase, // Only run when Supabase is initialized and available
    ...options,
  });
}

/**
 * Мутация для обновления профиля пользователя
 * Автоматически обновляет кэш React Query после успешного обновления
 *
 * @returns Mutation объект для обновления профиля
 */
// Update user profile mutation
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!isInitialized || !supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("user_profiles")
          .update({
            ...updates,
          })
          .eq("user_id", user.id)
          .select("*")
          .single();

        if (error) {
          throw error;
        }

        return data as UserProfile;
      } catch (err) {
        console.error("Error updating profile:", err);
        throw new Error(
          handleSupabaseError(
            err,
            "useUpdateUserProfile",
            "Failed to update profile"
          )
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["userData"], data);
    },
  });
}

/**
 * Хук для получения списка чатов пользователя с пагинацией
 * Поддерживает умное кэширование и оптимизацию запросов
 *
 * @param options - Опции для пагинации (limit, offset)
 * @returns Query объект со списком чатов и общим количеством
 */
// Chats hooks
export function useChats(options?: FetchChatsOptions) {
  const limit = options?.limit || 20;
  const offset = options?.offset || 0;
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useQuery({
    queryKey: ["chats", limit, offset],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");

        const { data, error, count } = await supabase
          .from("chats")
          .select("id, chat_name, created_at, user_id, chat_summary", {
            count: "exact",
          })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw error;
        }

        return {
          chats: data as Chat[],
          count: count || 0,
        };
      } catch (err) {
        console.error("Error fetching chats:", err);
        throw new Error(
          handleSupabaseError(err, "useChats", "Failed to load chats")
        );
      }
    },
    enabled: isInitialized && !!supabase, // Only run when Supabase is initialized and available
    initialData: () => {
      // Try to get data from cache with larger limit if this is a smaller request
      if (offset === 0) {
        const cachedData = queryClient.getQueryData(["chats", 20, 0]) as
          | { chats: Chat[]; count: number }
          | undefined;
        if (cachedData && cachedData.chats.length >= limit) {
          return {
            chats: cachedData.chats.slice(0, limit),
            count: cachedData.count,
          };
        }
      }
      return undefined;
    },
    staleTime: CACHE_TIMES.CHATS,
  });
}

/**
 * Хук для получения детальной информации о конкретном чате
 * Включает проверку прав доступа (только владелец может просматривать)
 *
 * @param chatId - ID чата для получения деталей
 * @returns Query объект с данными чата
 */
// Chat details hook
export function useChatMessages(chatId: string) {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useQuery({
    queryKey: ["chatDetails", chatId],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        if (!chatId) {
          return { chat: null };
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");

        // Get the chat details
        const { data: chatData, error: chatError } = await supabase
          .from("chats")
          .select(
            "id, user_id, chat_name, chat_summary, chat_duration, created_at, status"
          )
          .eq("id", chatId)
          .eq("user_id", user.id)
          .single();

        if (chatError) {
          if (chatError.code === "PGRST116") {
            throw new Error("Chat not found");
          }
          throw chatError;
        }

        return { chat: chatData as Chat };
      } catch (err) {
        console.error("Error fetching chat details:", err);
        throw new Error(
          handleSupabaseError(
            err,
            "useChatMessages",
            "Failed to load chat details"
          )
        );
      }
    },
    enabled: !!chatId && isInitialized && !!supabase, // Only run when Supabase is initialized, available, and chatId exists
    staleTime: CACHE_TIMES.CHAT_DETAILS,
  });
}

/**
 * Мутация для создания нового чата
 * Автоматически инвалидирует кэш списка чатов после создания
 *
 * @returns Mutation объект для создания чата
 */
// Create chat mutation
export function useCreateChat() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useMutation({
    mutationFn: async ({ chatName }: { chatName: string }) => {
      return withAuthCheck(supabase, isInitialized, async (user) => {
        const { data, error } = await supabase!
          .from("chats")
          .insert({
            user_id: user.id,
            chat_name: chatName,
            status: "active",
          })
          .select("*")
          .single();

        if (error) {
          throw error;
        }

        return data as Chat;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Мутация для обновления статуса чата и связанных данных
 * Поддерживает обновление summary и duration чата
 *
 * @returns Mutation объект для обновления чата
 */
// Update chat status mutation
export function useUpdateChatStatus() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useMutation({
    mutationFn: async ({
      chatId,
      status,
      summary,
      duration,
    }: {
      chatId: string;
      status: string;
      summary?: string;
      duration?: number;
    }) => {
      if (!isInitialized || !supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");

        const updateData: any = { status };
        if (summary !== undefined) updateData.chat_summary = summary;
        if (duration !== undefined) updateData.chat_duration = duration;

        const { data, error } = await supabase
          .from("chats")
          .update(updateData)
          .eq("id", chatId)
          .eq("user_id", user.id)
          .select("*")
          .single();

        if (error) {
          throw error;
        }

        return data as Chat;
      } catch (err) {
        console.error("Error updating chat status:", err);
        throw new Error(
          handleSupabaseError(
            err,
            "useUpdateChatStatus",
            "Failed to update chat"
          )
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["chatDetails", data.id], { chat: data });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Хук для получения всех категорий Insights
 * Используется для навигации и фильтрации статей
 *
 * @returns Query объект со списком категорий
 */
// Insights hooks
export function useCategories() {
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        const { data, error } = await supabase
          .from("insights_categories")
          .select("*")
          .order("name");

        if (error) {
          throw error;
        }

        return data as Category[];
      } catch (err) {
        console.error("Error fetching categories:", err);
        throw new Error(
          handleSupabaseError(err, "useCategories", "Failed to load categories")
        );
      }
    },
    enabled: isInitialized && !!supabase, // Only run when Supabase is initialized and available
  });
}

/**
 * Комплексный хук для получения статей блога с расширенной функциональностью:
 * - Поддержка пагинации
 * - Фильтрация по категориям
 * - Автоматическое получение связанных категорий для каждой статьи
 * - Разделение доступа для аутентифицированных и публичных пользователей
 *
 * @param options - Опции для пагинации и фильтрации
 * @returns Query объект с постами, категориями и метаданными
 */
export function useInsights(options?: FetchInsightsOptions) {
  const limit = options?.limit || 10;
  const offset = options?.offset || 0;
  const categorySlug = options?.categorySlug;
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useQuery({
    queryKey: ["insights", limit, offset, categorySlug],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        // Check if user is authenticated (for admin access to unpublished posts)
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const isAuthenticated = !!session?.user;

        // If categorySlug is provided, get category first
        if (categorySlug) {
          const { data: category, error: categoryError } = await supabase
            .from("insights_categories")
            .select("id, name, slug")
            .eq("slug", categorySlug)
            .single();

          if (categoryError) {
            if (categoryError.code === "PGRST116") {
              return {
                posts: [],
                count: 0,
                category: null,
              };
            }
            throw categoryError;
          }
        }

        // Build query
        let query = supabase
          .from("insights_posts")
          .select("*, author:insights_authors(*)", { count: "exact" });

        // For non-authenticated users, only show published posts
        if (!isAuthenticated) {
          query = query.eq("is_published", true);
        }

        // Add category filter if provided
        if (categorySlug) {
          // Get posts that have this category via the many-to-many relationship
          const { data: postRelations, error: relationsError } = await supabase
            .from("insights_posts_categories")
            .select("post_id, category:insights_categories!inner(slug)")
            .eq("category.slug", categorySlug);

          if (relationsError) throw relationsError;

          const postIds = postRelations?.map((rel) => rel.post_id) || [];
          if (postIds.length === 0) {
            return {
              posts: [],
              count: 0,
              category: categorySlug
                ? await supabase
                    .from("insights_categories")
                    .select("*")
                    .eq("slug", categorySlug)
                    .single()
                    .then(({ data }) => data)
                : null,
            };
          }

          query = query.in("id", postIds);
        }

        const { data, error, count } = await query
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw error;
        }

        // Get category data if categorySlug is provided
        const categoryData = categorySlug
          ? await supabase
              .from("insights_categories")
              .select("*")
              .eq("slug", categorySlug)
              .single()
              .then(({ data }) => data)
          : null;

        // Get all categories for reference
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("insights_categories")
          .select("*")
          .order("name");

        if (categoriesError) {
          console.warn("Failed to fetch categories:", categoriesError);
        }

        const posts = data as Post[];

        // Add categories to posts
        const postsWithCategories = await Promise.all(
          posts.map(async (post) => {
            try {
              const { data: postCategories, error: categoriesError } =
                await supabase
                  .from("insights_posts_categories")
                  .select("category:insights_categories(*)")
                  .eq("post_id", post.id);

              if (categoriesError) {
                console.warn(
                  `Failed to fetch categories for post ${post.id}:`,
                  categoriesError
                );
                return {
                  ...post,
                  categories: [],
                };
              }

              return {
                ...post,
                categories:
                  postCategories?.map((pc) => pc.category).filter(Boolean) ||
                  [],
              };
            } catch (err) {
              console.warn(
                `Error processing categories for post ${post.id}:`,
                err
              );
              return {
                ...post,
                categories: [],
              };
            }
          })
        );

        return {
          posts: postsWithCategories,
          count: count || 0,
          category: categoryData,
          allCategories: categoriesData || [],
        };
      } catch (err) {
        console.error("Error fetching insights:", err);
        throw new Error(
          handleSupabaseError(err, "useInsights", "Failed to load insights")
        );
      }
    },
    enabled: isInitialized && !!supabase, // Only run when Supabase is initialized and available
    staleTime: CACHE_TIMES.INSIGHTS,
  });
}

/**
 * Хук для получения отдельной статьи по slug
 * Включает автоматическое получение связанных категорий и автора
 * Поддерживает разные права доступа для опубликованных/неопубликованных статей
 *
 * @param slug - URL slug статьи (может быть null)
 * @returns Query объект с данными статьи или null
 */
export function useInsightBySlug(slug: string | null) {
  const supabase = useSupabase();
  const { isInitialized } = useSupabaseStatus();

  return useQuery({
    queryKey: ["insight", slug],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      try {
        if (!slug) {
          return null;
        }

        // Check if user is authenticated (for admin access to unpublished posts)
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const isAuthenticated = !!session?.user;

        // Build query
        let query = supabase
          .from("insights_posts")
          .select("*, author:insights_authors(*)")
          .eq("slug", slug);

        // For non-authenticated users, only show published posts
        if (!isAuthenticated) {
          query = query.eq("is_published", true);
        }

        const { data: post, error } = await query.single();

        if (error) {
          console.error("Error fetching post:", error);
          return null;
        }

        if (!post) {
          return null;
        }

        // Get post categories
        const { data: postCategories, error: categoriesError } = await supabase
          .from("insights_posts_categories")
          .select("category:insights_categories(*)")
          .eq("post_id", post.id);

        if (categoriesError) {
          console.warn(
            `Failed to fetch categories for post ${post.id}:`,
            categoriesError
          );
        }

        return {
          ...post,
          categories:
            postCategories?.map((pc) => pc.category).filter(Boolean) || [],
        } as Post;
      } catch (err) {
        console.error("Error fetching insight by slug:", err);
        return null;
      }
    },
    enabled: !!slug && isInitialized && !!supabase, // Only run when Supabase is initialized, available, and slug exists
    staleTime: CACHE_TIMES.INSIGHT_BY_SLUG,
  });
}
