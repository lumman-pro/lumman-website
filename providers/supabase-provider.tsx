"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type SupabaseContext = {
  supabase: SupabaseClient<Database> | null;
  isInitialized: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only create the client on the browser side
    if (typeof window !== "undefined") {
      try {
        const client = createBrowserSupabaseClient();
        setSupabase(client);
      } catch (error) {
        console.error("Failed to initialize Supabase client:", error);
        // Set supabase to null but mark as initialized so the app doesn't hang
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  return (
    <Context.Provider value={{ supabase, isInitialized }}>
      {children}
    </Context.Provider>
  );
}

export function useSupabase() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  const { supabase, isInitialized } = context;

  // During SSR or before initialization, return null instead of throwing
  if (!isInitialized) {
    return null;
  }

  // If initialized but supabase is null, it means initialization failed
  if (supabase === null) {
    console.warn("Supabase client failed to initialize");
    return null;
  }

  return supabase;
}

// Hook that throws an error if Supabase is not available (for components that require it)
export function useSupabaseRequired() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabaseRequired must be used inside SupabaseProvider");
  }

  const { supabase, isInitialized } = context;

  // If not initialized yet, throw an error to prevent usage
  if (!isInitialized) {
    throw new Error(
      "Supabase client is still initializing. Please wait for initialization to complete."
    );
  }

  // If initialized but supabase is null, it means initialization failed
  if (supabase === null) {
    throw new Error(
      "Supabase client failed to initialize. Please check your configuration."
    );
  }

  return supabase;
}

// Optional: Hook to check initialization status
export function useSupabaseStatus() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabaseStatus must be used inside SupabaseProvider");
  }

  return {
    isInitialized: context.isInitialized,
    hasSupabase: context.supabase !== null,
  };
}
