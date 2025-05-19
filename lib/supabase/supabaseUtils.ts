import { useSupabase } from "@/providers/supabase-provider"

// Example of a typed query helper
export function useTypedQuery<T>(
  tableName: string,
  queryBuilder: (query: ReturnType<typeof useSupabase>["from"]) => Promise<{ data: T | null; error: any }>,
) {
  const supabase = useSupabase()

  const executeQuery = async () => {
    const query = supabase.from(tableName)
    return await queryBuilder(query)
  }

  return executeQuery
}
