import { createServerSupabaseClient } from "@/lib/supabase/server-client"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectTo = requestUrl.searchParams.get("redirect") || "/dashboard"

    if (!code) {
      console.error("Auth callback: No code provided in URL")
      return NextResponse.redirect(new URL("/login?error=missing_code", request.url))
    }

    // Create a Supabase client
    const supabase = await createServerSupabaseClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth callback: Error exchanging code for session", {
        message: error.message,
        status: error.status,
      })
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
    }

    // Redirect to the dashboard or the original requested URL
    console.log(`Auth callback: Successfully authenticated, redirecting to ${redirectTo}`)
    return NextResponse.redirect(new URL(redirectTo, request.url))
  } catch (error) {
    console.error("Unexpected error in auth callback:", error instanceof Error ? error.message : error)
    return NextResponse.redirect(new URL("/login?error=server_error", request.url))
  }
}
