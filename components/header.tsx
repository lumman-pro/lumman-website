"use client"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut, supabaseClient } from "@/lib/supabase/auth"
import { LogOut, Menu, User, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

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

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
      <div className="container max-w-7xl flex h-16 items-center justify-between">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/insights"
                className={cn(
                  "text-sm transition-colors duration-300 ease-in-out font-medium",
                  isActive("/insights") ? "text-foreground" : "text-foreground/80 hover:text-foreground",
                )}
              >
                Insights
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-sm transition-colors duration-300 ease-in-out font-medium",
                    isActive("/dashboard") ? "text-foreground" : "text-foreground/80 hover:text-foreground",
                  )}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {user && !isLoading && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          )}

          {!user && !isLoading && (
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium">Menu</h2>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Close">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/insights"
                    className={cn(
                      "px-2 py-2 text-sm transition-colors duration-300 ease-in-out font-medium rounded-md",
                      isActive("/insights")
                        ? "bg-muted text-foreground"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted/50",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Insights
                  </Link>
                  {user && (
                    <Link
                      href="/dashboard"
                      className={cn(
                        "px-2 py-2 text-sm transition-colors duration-300 ease-in-out font-medium rounded-md",
                        isActive("/dashboard")
                          ? "bg-muted text-foreground"
                          : "text-foreground/80 hover:text-foreground hover:bg-muted/50",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                </nav>
                <div className="mt-auto pt-6 border-t">
                  {user && !isLoading ? (
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  ) : !isLoading ? (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                        <User className="h-4 w-4 mr-2" />
                        Sign in
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
