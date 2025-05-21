import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-8 bg-background transition-colors duration-300 ease-in-out">
      <div className="container flex flex-col items-center">
        <ThemeToggle />
        <p className="mt-4 text-xs text-muted-foreground transition-colors duration-300 ease-in-out">
          © 2025 Lumman. All rights reserved. London.
        </p>
        <p className="mt-1 text-xs text-muted-foreground transition-colors duration-300 ease-in-out">
          <Link href="/legal" className="hover:text-muted-foreground/80 transition-colors duration-300 ease-in-out">
            Legal
          </Link>
        </p>
      </div>
    </footer>
  )
}
