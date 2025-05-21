"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // 768px is the md breakpoint in Tailwind
        setIsSidebarOpen(false) // Reset mobile sidebar state
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        isSidebarOpen &&
        !target.closest('[data-sidebar="true"]') &&
        !target.closest('[data-sidebar-toggle="true"]')
      ) {
        setIsSidebarOpen(false)
      }
    }

    setIsMounted(true)
    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarOpen])

  if (!isMounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <Header onMenuToggle={toggleSidebar} isMenuOpen={isSidebarOpen} />

      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" aria-hidden="true" />
        )}

        {/* Sidebar */}
        <div className="fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] md:flex" data-sidebar="true">
          <SidebarNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main className={cn("flex-1 transition-all duration-300 ease-in-out", isSidebarOpen ? "md:ml-0" : "md:ml-0")}>
          <div className="container py-6 md:py-10 max-w-full">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
