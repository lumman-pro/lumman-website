import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"

// Singleton instance
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Creates and returns a singleton instance of the Supabase client
 * This ensures only one instance exists across the entire application
 */
export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(
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
  }
  return supabaseInstance
}

// Export a singleton instance directly for imports that need the client immediately
export const supabaseClient = getSupabaseClient()
