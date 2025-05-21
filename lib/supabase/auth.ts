"use client"

import { createBrowserSupabaseClient } from "./client"

export async function signInWithPhone(phone: string) {
  const supabase = createBrowserSupabaseClient()

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export async function verifyOtp(phone: string, token: string) {
  const supabase = createBrowserSupabaseClient()

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  })

  return { data, error }
}

export async function signOut() {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const supabase = createBrowserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
