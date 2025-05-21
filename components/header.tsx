"use client"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase/supabaseClient"
import { Menu, User, X } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"

export function Header({ onMenuToggle, isMenuOpen }: { onMenuToggle?: () => void; isMenuOpen?: boolean }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Only fetch profile if user is authenticated
  const { profile, isLoading: isProfileLoading } = useUserProfile()

  useEffect(() => {
    setMounted(true)

    // Check if user is logged in
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)
    }

    checkUser()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Use absolute URLs to ensure the images are found
  const logoSrc = mounted ? (resolvedTheme === "dark" ? "/lumman_white.svg" : "/lumman_black.svg") : null

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const isAuthenticated = !!user && !isLoading

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
      <div className="container max-w-7xl flex h-16 items-center justify-between">
        {isAuthenticated ? (
          // Authenticated header layout
          <>
            {/* Left side: Hamburger menu on mobile */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu" onClick={onMenuToggle} data-sidebar-toggle="true">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Center/Right: Logo */}
            <div className={cn("flex items-center", isAuthenticated ? "ml-auto md:ml-0" : "")}>
              <Link href="/" className="flex items-center space-x-2">
                {logoSrc ? (
                  <img
                    src={logoSrc || "/placeholder.svg"}
                    alt="Lumman.ai"
                    width={100}
                    height={24}
                    className="transition-opacity duration-300 ease-in-out"
                  />
                ) : (
                  <div className="w-[120px] h-[24px]" />
                )}
              </Link>
            </div>

            {/* Right: User profile link (visible on desktop) */}
            <div className="hidden md:flex">
              <Link href="/account">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm transition-colors duration-300 ease-in-out"
                >
                  <User className="h-4 w-4 text-foreground transition-colors duration-300 ease-in-out" />
                  <span>{isProfileLoading ? "Loading..." : profile?.user_name || "Your Account"}</span>
                </Button>
              </Link>
            </div>
          </>
        ) : (
          // Unauthenticated header layout
          <>
            {/* Left: Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {logoSrc ? (
                <img
                  src={logoSrc || "/placeholder.svg"}
                  alt="Lumman.ai"
                  width={100}
                  height={24}
                  className="transition-opacity duration-300 ease-in-out"
                />
              ) : (
                <div className="w-[120px] h-[24px]" />
              )}
            </Link>

            {/* Right: Navigation */}
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
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sm bg-transparent border-none transition-colors duration-300 ease-in-out"
                  >
                    <User className="h-4 w-4 text-foreground transition-colors duration-300 ease-in-out" />
                    <span className="sr-only">Sign in</span>
                  </Button>
                </Link>
              )}
            </nav>
          </>
        )}
      </div>
    </header>
  )
}
