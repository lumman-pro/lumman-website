import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
  return (
    <footer className="w-full py-8 bg-background transition-colors duration-300 ease-in-out">
      <div className="container flex flex-col items-center">
        <ThemeToggle />
        <p className="mt-4 text-xs text-muted-foreground transition-colors duration-300 ease-in-out">
          © 2025 Lumman. All rights reserved. London.
        </p>
      </div>
    </footer>
  )
}
