"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export async function createNewConversation() {
  const supabase = createServerActionClient<Database>({ cookies })

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Create a new conversation
  const { data, error } = await supabase
    .from("chats")
    .insert({
      user_id: user.id,
      chat_name: "New Conversation",
      chat_summary: "This conversation has just started. Speak with Luke to generate content.",
      chat_transcription: "",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating conversation:", error)
    throw new Error("Failed to create new conversation")
  }

  return data.id
}

export async function deleteConversation(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Actually delete the conversation instead of marking it as deleted
  const { error } = await supabase.from("chats").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting conversation:", error)
    throw new Error("Failed to delete conversation")
  }
}

export async function sendCaseToEstimate(id: string) {
  // This would typically involve some backend processing
  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}
