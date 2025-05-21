"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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
  const [isInitialized, setIsInitialized] = useState(false)

  // Verify the Supabase client is working
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple health check
        await supabase.from("user_profiles").select("count").limit(0)
        setIsInitialized(true)
      } catch (error) {
        console.error("Supabase client initialization error:", error)
        // Still mark as initialized to avoid blocking the UI
        setIsInitialized(true)
      }
    }

    checkConnection()
  }, [supabase])

  // Show children even if there's an error with Supabase
  // This prevents the app from completely breaking if there's a Supabase issue
  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context.supabase
}
