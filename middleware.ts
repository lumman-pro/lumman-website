import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Initialize response object
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            // Only create a new response object when setting cookies
            request.cookies.set({
              name,
              value,
              ...options,
            })

            // Update the response cookies
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options) {
            // Only create a new response object when removing cookies
            request.cookies.set({
              name,
              value: "",
              ...options,
            })

            // Update the response cookies
            response.cookies.set({
              name,
              value: "",
              ...options,
            })
          },
        },
      },
    )

    // Get the user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Error in middleware session check:", sessionError)
      // Continue without session on error
    } else {
      // If no session and trying to access protected routes
      if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
        const redirectUrl = new URL("/login", request.url)
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // If session exists and trying to access login
      if (session && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return response
  } catch (error) {
    // Log any unexpected errors
    console.error("Unexpected error in middleware:", error)

    // Return the original response if an error occurs
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
