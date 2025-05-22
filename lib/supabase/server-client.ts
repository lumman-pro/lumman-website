import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Creates a Supabase client for server environments
 * Note: This cannot be a singleton because cookies() must be called
 * in a Server Component or Route Handler context
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: {
            path: string;
            maxAge: number;
            domain?: string;
            sameSite?: string;
            secure?: boolean;
          },
        ) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can happen in middleware or other contexts where cookies cannot be set
            console.error("Error setting cookie in server client", {
              name,
              error: error instanceof Error ? error.message : error,
            });
          }
        },
        remove(name: string, options: { path: string; domain?: string }) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
            // This can happen in middleware or other contexts where cookies cannot be modified
            console.error("Error removing cookie in server client", {
              name,
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
    },
  );
}
