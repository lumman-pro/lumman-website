import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { SupabaseProvider } from "@/providers/supabase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lumman.ai",
  description: "AI consulting and automation firm",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="theme-transition">
      <head>
        <link rel="preload" href="/lumman_black.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/lumman_white.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} antialiased theme-transition`}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
