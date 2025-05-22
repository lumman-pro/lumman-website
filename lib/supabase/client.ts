import { createBrowserClient } from "@supabase/ssr"
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

// Initialize the browser client only once during module load if in browser environment
// This ensures we have a true singleton
export const supabase = typeof window !== "undefined" ? createBrowserSupabaseClient() : null
