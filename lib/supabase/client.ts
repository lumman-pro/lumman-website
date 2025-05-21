import { createBrowserClient } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Global variable to store the browser client instance
let browserInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Creates a Supabase client for browser environments
 * Uses a singleton pattern to ensure only one instance exists
 */
export function createBrowserSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("createBrowserSupabaseClient can only be called in the browser")
  }

  if (browserInstance) return browserInstance

  browserInstance = createBrowserClient<Database>(
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

  return browserInstance
}

/**
 * Creates a Supabase client for server environments
 * Note: This cannot be a singleton because cookies() must be called
 * in a Server Component or Route Handler context
 */
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

/**
 * Universal function that returns the appropriate Supabase client
 * based on the environment (browser or server)
 */
export function createClient() {
  if (typeof window === "undefined") {
    return createServerSupabaseClient()
  } else {
    return createBrowserSupabaseClient()
  }
}

// Initialize the browser client only once during module load if in browser environment
// This ensures we have a true singleton
export const supabase = typeof window !== "undefined" ? createBrowserSupabaseClient() : null
