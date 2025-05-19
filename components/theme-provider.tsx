"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force immediate theme detection to avoid flashing
  React.useEffect(() => {
    document.documentElement.classList.add("theme-ready")
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
