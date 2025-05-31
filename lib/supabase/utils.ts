import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type SafeSupabaseClient = SupabaseClient<Database>;

/**
 * Type guard to check if Supabase client is available
 */
export function isSupabaseAvailable(
  client: SafeSupabaseClient | null
): client is SafeSupabaseClient {
  return client !== null;
}

/**
 * Safely execute a Supabase query with error handling
 */
export async function safeSupabaseQuery<T>(
  client: SafeSupabaseClient | null,
  queryFn: (
    client: SafeSupabaseClient
  ) => Promise<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: unknown }> {
  if (!isSupabaseAvailable(client)) {
    return {
      data: null,
      error: { message: "Supabase client is not available" },
    };
  }

  try {
    return await queryFn(client);
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : { message: "Unknown error occurred" },
    };
  }
}

/**
 * Check if a Supabase response contains an error
 */
export function hasSupabaseError<T>(response: {
  data: T | null;
  error: unknown;
}): response is { data: null; error: unknown } {
  return response.error !== null;
}

/**
 * Extract data from Supabase response or return null if error
 */
export function extractSupabaseData<T>(response: {
  data: T | null;
  error: unknown;
}): T | null {
  return hasSupabaseError(response) ? null : response.data;
}
