import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Creates a Supabase client for server environments
 * Note: This cannot be a singleton because cookies() must be called
 * in a Server Component or Route Handler context
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // This can happen in middleware or other contexts where cookies cannot be set
            console.error("Error setting cookies in server client", {
              error: error instanceof Error ? error.message : error,
            });
          }
        },
      },
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  );
}

/**
 * Creates a simple Supabase client for static generation contexts
 * where cookies are not available (like generateStaticParams)
 */
export function createStaticSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
