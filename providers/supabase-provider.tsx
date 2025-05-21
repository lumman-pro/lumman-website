"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { supabaseClient } from "@/lib/supabase/supabaseClient"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  // Use the singleton instance directly
  const [supabase] = useState(() => supabaseClient)

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context.supabase
}
