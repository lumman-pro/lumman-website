import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// Create a single supabase client for the browser
const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  )
}

// Export a singleton instance
export const supabase = createClient()
