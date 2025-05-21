"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export async function deleteUserAccount() {
  const supabase = createServerActionClient<Database>({ cookies })

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Delete user profile
  const { error: profileError } = await supabase.from("user_profiles").delete().eq("user_id", user.id)

  if (profileError) {
    throw profileError
  }

  // Delete user's chats
  const { error: chatsError } = await supabase.from("chats").delete().eq("user_id", user.id)

  if (chatsError) {
    throw chatsError
  }

  // Delete the user account
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

  if (deleteError) {
    throw deleteError
  }

  // Sign out
  await supabase.auth.signOut()

  return { success: true }
}
