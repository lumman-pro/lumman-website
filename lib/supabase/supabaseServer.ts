import { createServerComponentClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Create a Supabase client for server components
export function getSupabaseServerClient() {
  return createServerComponentClient<Database>({ cookies })
}

// For direct imports where cookies() is available in the context
export const supabaseServer = createServerComponentClient<Database>({ cookies })
