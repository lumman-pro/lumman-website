import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Create a singleton instance for the server
const supabaseServerInstance: ReturnType<typeof createServerClient<Database>> | null = null

export function getSupabaseServerClient() {
  // We still need to create a new instance on each request in server components
  // because cookies() can only be called in a Server Component or Route Handler
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
            console.error("Error setting cookie", error)
          }
        },
        remove(name: string, options: { path: string; domain?: string }) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 })
          } catch (error) {
            console.error("Error removing cookie", error)
          }
        },
      },
    },
  )
}

// Export a convenience variable
export const supabaseServer = getSupabaseServerClient()
