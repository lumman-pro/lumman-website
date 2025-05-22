"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteAccount() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Delete user's chats
  const { error: chatsError } = await supabase.from("chats").delete().eq("user_id", user.id)

  if (chatsError) {
    console.error("Error deleting user chats:", chatsError)
    return { error: chatsError.message }
  }

  // Delete user's profile
  const { error: profileError } = await supabase.from("user_profiles").delete().eq("user_id", user.id)

  if (profileError) {
    console.error("Error deleting user profile:", profileError)
    return { error: profileError.message }
  }

  // Delete the user account
  const { error: userError } = await supabase.auth.admin.deleteUser(user.id)

  if (userError) {
    console.error("Error deleting user account:", userError)
    return { error: userError.message }
  }

  // Sign out the user
  await supabase.auth.signOut()

  revalidatePath("/")
  redirect("/")
}
