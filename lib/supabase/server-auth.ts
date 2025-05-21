import { createServerSupabaseClient } from "./client"
import { redirect } from "next/navigation"

export async function getServerSession() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
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
