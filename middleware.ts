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
      set(
        name: string,
        value: string,
        options: {
          path: string;
          maxAge?: number;
          domain?: string;
          sameSite?: string;
          secure?: boolean;
        }
      ) {
        // Set cookie in both request and response to ensure consistency
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: { path: string; domain?: string }) {
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
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Error in middleware session check:",
        sessionError.message,
        {
          status: sessionError.status,
          name: sessionError.name,
          details: sessionError.details,
        }
      );
      // Continue without session on error, but log detailed information
    }

    // Check for standard Supabase cookies instead of custom ones
    const hasSupabaseCookies = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("sb-") && cookie.value);
    console.log("Has Supabase cookies:", hasSupabaseCookies);

    // Если сессия пустая, но есть куки аутентификации, попробуем явно получить пользователя
    if (!session && hasSupabaseCookies) {
      console.log(
        "Session is empty but Supabase cookies exist, trying to get user explicitly"
      );
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user in middleware:", userError);
        } else if (userData?.user) {
          console.log("Successfully retrieved user data in middleware");
          // Если пользователь получен, но сессия отсутствует, попробуем обновить сессию
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();

          if (refreshError) {
            console.error(
              "Error refreshing session in middleware:",
              refreshError
            );
          } else if (refreshData?.session) {
            console.log("Successfully refreshed session in middleware");
          }
        }
      } catch (userError) {
        console.error(
          "Unexpected error getting user in middleware:",
          userError
        );
      }
    }

    // Debug logging for authentication state
    console.log("=== MIDDLEWARE DEBUG ===");
    console.log(`Path: ${request.nextUrl.pathname}`);
    console.log(`Session exists: ${!!session}`);
    console.log(
      "All cookies:",
      Object.fromEntries(request.cookies.getAll().map((c) => [c.name, c.value]))
    );
    console.log(
      "Supabase cookies:",
      request.cookies.getAll().filter((c) => c.name.startsWith("sb-"))
    );

    console.log(
      `Middleware: Path=${request.nextUrl.pathname}, Authenticated=${!!session}`
    );

    // Handle protected routes - redirect to login if not authenticated
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
      console.log(
        `Redirecting unauthenticated user from ${request.nextUrl.pathname} to login`
      );
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    if (session && isAuthRoute(request.nextUrl.pathname)) {
      console.log(
        `Redirecting authenticated user from ${request.nextUrl.pathname} to dashboard`
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Return the response with all cookies properly set
    return response;
  } catch (error) {
    // Log any unexpected errors with detailed information
    console.error(
      "Unexpected error in middleware:",
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error
    );

    // Return the original response if an error occurs
    return response;
  }
}

// Helper function to determine if a route requires authentication
function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = ["/dashboard", "/account"];

  return protectedPaths.some((path) => pathname.startsWith(path));
}

// Helper function to determine if a route is an auth route
function isAuthRoute(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
