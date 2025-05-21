import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Server-side Supabase client
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can happen in middleware or other contexts where cookies cannot be set
            console.error("Error setting cookie", error)
          }
        },
        remove(name: string, options: { path: string; domain?: string }) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 })
          } catch (error) {
            // This can happen in middleware or other contexts where cookies cannot be modified
            console.error("Error removing cookie", error)
          }
        },
      },
    },
  )
}

// Browser-side Supabase client (singleton pattern)
let browserSupabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createBrowserSupabaseClient() {
  if (browserSupabaseClient) return browserSupabaseClient

  browserSupabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: "pkce",
        detectSessionInUrl: true,
        storageKey: "lumman-auth",
      },
    },
  )

  return browserSupabaseClient
}

// For direct imports in client components
export const supabase = typeof window !== "undefined" ? createBrowserSupabaseClient() : null
