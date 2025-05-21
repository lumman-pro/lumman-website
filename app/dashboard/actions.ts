"use server"

import { createServerSupabaseClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

export async function createConversation() {
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()

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
