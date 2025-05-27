"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if current page is a chat page
  const isChatPage = pathname?.includes("/dashboard/chat/");

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check authentication session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/");
        return;
      }
    };

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/");
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, [router]);

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

    const handleToggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    setIsMounted(true);
    window.addEventListener("resize", handleResize);
    window.addEventListener("toggleSidebar", handleToggleSidebar);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("toggleSidebar", handleToggleSidebar);
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
        {!isSidebarOpen && !isChatPage && (
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
        )}

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
            "fixed md:sticky top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:block"
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
          <div
            className={cn(
              isChatPage ? "h-full" : "container py-6 md:py-10 max-w-full"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
