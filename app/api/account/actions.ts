"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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

export async function deleteAccount() {
  const supabase = createClient()

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
