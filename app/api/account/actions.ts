"use server"

import { createServerSupabaseClient } from "@/lib/supabase/supabase"

export async function deleteUserAccount() {
  const supabase = createServerSupabaseClient()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

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

    return { success: true }
  } catch (error) {
    console.error("Error deleting user account:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
    }
  }
}
