"use client"

import { createBrowserSupabaseClient } from "./client"

export async function signInWithPhone(phone: string) {
  const supabase = createBrowserSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error in signInWithPhone:", error instanceof Error ? error.message : error)
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Failed to send verification code. Please try again.",
      },
    }
  }
}

export async function verifyOtp(phone: string, token: string) {
  const supabase = createBrowserSupabaseClient()

  try {
    console.log(`Verifying OTP for phone: ${phone} with token length: ${token.length}`)

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    })

    console.log("OTP verification response:", { data, error })

    if (error) {
      // Handle specific error codes
      if (error.message.includes("Token has expired")) {
        return { data: null, error: { message: "Verification code has expired. Please request a new one." } }
      }

      if (error.message.includes("Invalid token")) {
        return { data: null, error: { message: "Invalid verification code. Please check and try again." } }
      }

      throw error
    }

    return { data, error: null }
  } catch (err) {
    console.error("Unexpected error during OTP verification:", err instanceof Error ? err.message : err)
    return {
      data: null,
      error: {
        message:
          err instanceof Error ? err.message : "An unexpected error occurred during verification. Please try again.",
      },
    }
  }
}

export async function signOut() {
  const supabase = createBrowserSupabaseClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Error signing out:", error instanceof Error ? error.message : error)
    return {
      error: {
        message: error instanceof Error ? error.message : "Failed to sign out. Please try again.",
      },
    }
  }
}

export async function getCurrentUser() {
  const supabase = createBrowserSupabaseClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    return user
  } catch (error) {
    console.error("Error getting current user:", error instanceof Error ? error.message : error)
    return null
  }
}
