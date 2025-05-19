"use client"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use absolute URLs to ensure the images are found
  const logoSrc = mounted ? (resolvedTheme === "dark" ? "/lumman_white.svg" : "/lumman_black.svg") : null

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
      <div className="container max-w-3xl flex h-16 items-center justify-between">
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
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/insights"
                className={cn(
                  "text-sm transition-colors duration-300 ease-in-out",
                  isActive("/insights") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Insights
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
