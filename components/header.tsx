"use client"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { Menu, User, X } from "lucide-react"

export function Header({ onMenuToggle, isMenuOpen }: { onMenuToggle?: () => void; isMenuOpen?: boolean }) {
  const { resolvedTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Check if user is logged in
    const checkUser = async () => {
      try {
        if (!supabase) return // Ensure supabase is available

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error checking auth session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Set up auth state listener
    let subscription: { unsubscribe: () => void } | undefined

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
      })
      subscription = data.subscription
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Determine which logo to show based on theme
  const logoSrc = mounted ? (resolvedTheme === "dark" ? "/lumman_white.svg" : "/lumman_black.svg") : null

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const isAuthenticated = !!user && !isLoading

  // Show a placeholder during SSR/before mounting to prevent layout shift
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
        <div className="container max-w-7xl flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="w-[100px] h-[24px] bg-muted/20 rounded animate-pulse" />
          </div>
          <nav className="flex items-center space-x-6">
            <div className="w-[60px] h-[20px] bg-muted/20 rounded animate-pulse" />
            <div className="w-[24px] h-[24px] bg-muted/20 rounded-full animate-pulse" />
          </nav>
        </div>
      </header>
    )
  }

  // Check if we're on a dashboard page
  const isDashboardPage = pathname.startsWith("/dashboard")

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
      <div className="container max-w-7xl flex h-16 items-center justify-between">
        {/* Left side: Logo and hamburger menu on mobile for authenticated users */}
        <div className="flex items-center">
          {/* Only show hamburger menu if authenticated AND on dashboard pages */}
          {isAuthenticated && isDashboardPage && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={onMenuToggle}
              data-sidebar-toggle="true"
              className="mr-4 md:hidden focus:outline-none"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          <Link href="/" className="flex items-center space-x-2">
            <img
              src={logoSrc || (theme === "dark" ? "/lumman_white.svg" : "/lumman_black.svg")}
              alt="Lumman.ai"
              width={100}
              height={24}
              className="transition-opacity duration-300 ease-in-out"
            />
          </Link>
        </div>

        {/* Right: Navigation - same for both authenticated and non-authenticated users */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/insights"
            className={cn(
              "text-sm transition-colors duration-300 ease-in-out font-medium",
              isActive("/insights") ? "text-foreground" : "text-foreground/80 hover:text-foreground",
            )}
          >
            Insights
          </Link>

          {!isLoading && (
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button
                variant="ghost"
                size="icon"
                className="text-sm bg-transparent border-none transition-colors duration-300 ease-in-out"
              >
                <User className="h-4 w-4 text-foreground transition-colors duration-300 ease-in-out" />
                <span className="sr-only">{isAuthenticated ? "Dashboard" : "Sign in"}</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
