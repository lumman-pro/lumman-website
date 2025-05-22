import { createServerSupabaseClient } from "./server-client"
import { redirect } from "next/navigation"

export async function getServerSession() {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting server session:", error)
      return null
    }

    return session
  } catch (err) {
    console.error("Unexpected error in getServerSession:", err)
    return null
  }
}

export async function requireAuth() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function getServerUser() {
  const session = await getServerSession()
  return session?.user || null
}
