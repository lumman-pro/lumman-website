import { createServerActionClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Create a Supabase client for server actions
export function getSupabaseActionClient() {
  return createServerActionClient<Database>({ cookies })
}
