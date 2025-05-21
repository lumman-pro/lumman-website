import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check if the user is trying to access a protected route
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Get the session cookie
    const sessionCookie = req.cookies.get("sb-auth-token")

    // If no session cookie, redirect to login
    if (!sessionCookie) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If trying to access login page with a session cookie, redirect to dashboard
  if (req.nextUrl.pathname === "/login" && req.cookies.get("sb-auth-token")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
