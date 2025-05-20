import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types"

export const supabaseClient = createClientComponentClient<Database>()

export async function signInWithPhone(phone: string) {
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    phone,
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
