"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // 768px is the md breakpoint in Tailwind
        setIsSidebarOpen(false); // Reset mobile sidebar state
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isSidebarOpen &&
        !target.closest('[data-sidebar="true"]') &&
        !target.closest('[data-sidebar-toggle="true"]')
      ) {
        setIsSidebarOpen(false);
      }
    };

    setIsMounted(true);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <div className="flex flex-1 relative">
        {/* Mobile menu toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
          data-sidebar-toggle="true"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed md:sticky top-0 left-0 z-40 w-64 h-screen",
            isSidebarOpen ? "block" : "hidden md:block",
          )}
          data-sidebar="true"
        >
          <SidebarNavigation
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="container py-6 md:py-10 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
