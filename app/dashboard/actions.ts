"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

// Helper function to create a Supabase client for server actions
function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 })
        },
      },
    },
  )
}

export async function createConversation() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Create a new conversation
  const { data, error } = await supabase
    .from("chats")
    .insert({
      user_id: user.id,
      title: "New chat",
    })
    .select("*")
    .single()

  if (error) {
    console.error("Error creating conversation:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard")

  return { data }
}

export async function deleteConversation(id: string) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Delete the conversation
  const { error } = await supabase.from("chats").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting conversation:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard")

  return { success: true }
}
