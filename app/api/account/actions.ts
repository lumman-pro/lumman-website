"use server"

import { createServerActionClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export async function deleteUserAccount() {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    // Delete user's chats
    await supabase.from("chats").delete().eq("user_id", user.id)

    // Delete user's profile
    await supabase.from("user_profiles").delete().eq("user_id", user.id)

    // Delete the user account
    const { error } = await supabase.auth.admin.deleteUser(user.id)

    if (error) {
      throw error
    }

    // Sign out the user
    await supabase.auth.signOut()

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting account:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
    }
  }
}
