import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Create a single response object at the beginning that we'll use throughout
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // Create a cookie handler that uses the same response object
    const supabaseCookieHandler = {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        // Set cookie in both request and response to ensure consistency
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        // Remove cookie from both request and response
        response.cookies.set({
          name,
          value: "",
          ...options,
          maxAge: 0,
        });
      },
    };

    // Create Supabase server client with our consistent cookie handler
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: supabaseCookieHandler,
        auth: {
          flowType: "pkce",
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
      }
    );

    // Get the user session
    let {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error in middleware session check:", sessionError);
      // Continue without session on error
    }

    // Check for standard Supabase cookies
    const hasSupabaseCookies = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("sb-") && cookie.value);

    // If session is empty but Supabase cookies exist, try to refresh session
    if (!session && hasSupabaseCookies) {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (!userError && userData?.user) {
          // If user found but session is missing, try to refresh session
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();

          if (!refreshError && refreshData?.session) {
            // Update session variable with refreshed session
            session = refreshData.session;
          }
        }
      } catch (userError) {
        console.error("Error getting user in middleware:", userError);
      }
    }

    // Handle protected routes - redirect to login if not authenticated
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    if (session && isAuthRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Return the response with all cookies properly set
    return response;
  } catch (error) {
    // Log any unexpected errors
    console.error("Unexpected error in middleware:", error);
    // Return the original response if an error occurs
    return response;
  }
}

// Helper function to determine if a route requires authentication
function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = ["/dashboard"];
  return protectedPaths.some((path) => pathname.startsWith(path));
}

// Helper function to determine if a route is an auth route
function isAuthRoute(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
