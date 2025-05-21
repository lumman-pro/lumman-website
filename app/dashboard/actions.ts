"use server"

import { createServerActionClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

export async function createNewChat() {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated", chatId: null }
  }

  const { data, error } = await supabase
    .from("chats")
    .insert({
      user_id: user.id,
      chat_name: "New chat",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating chat:", error)
    return { error: error.message, chatId: null }
  }

  revalidatePath("/dashboard")
  return { error: null, chatId: data.id }
}

export async function deleteConversation(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Perform a hard delete instead of soft delete
  const { error } = await supabase.from("chats").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting chat:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { error: null }
}

export async function updateChatName(id: string, name: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("chats").update({ chat_name: name }).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating chat name:", error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/chat/${id}`)
  return { error: null }
}
