import { supabaseClient } from "./supabaseClient"

export async function signInWithPhone(phone: string) {
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    phone,
    options: {
      // Set session expiry to 1 year (in seconds)
      // 60 seconds * 60 minutes * 24 hours * 365 days = 31,536,000 seconds
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabaseClient.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()
  return user
}
