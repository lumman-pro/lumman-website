"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSupabase, useSupabaseStatus } from "@/providers/supabase-provider";
import { Menu, User as UserIcon, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const navigation = [
  { name: "Home", href: "/" },
  { name: "AI Insights", href: "/ai-insights" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header({
  onMenuToggle,
  isMenuOpen,
}: {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}) {
  const { resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const supabase = useSupabase(); // Can be null during SSR/initialization
  const { isInitialized } = useSupabaseStatus();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);

    // Only check auth when Supabase is initialized and available
    if (!isInitialized || !supabase) {
      setIsLoadingAuth(true);
      return;
    }

    // Check if user is logged in
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking auth session:", error);
        // Continue with null user if there's an error
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoadingAuth(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isInitialized, supabase]);

  // Determine which logo to show based on theme
  const logoSrc = mounted
    ? resolvedTheme === "dark"
      ? "/lumman_white.svg"
      : "/lumman_black.svg"
    : null;

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isAuthenticated = !!user && !isLoadingAuth;

  // Show a placeholder during SSR/before mounting to prevent layout shift
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
        <div className="container max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center flex-shrink-0">
            <div className="w-[100px] h-[18.85px] bg-muted/20 rounded animate-pulse" />
          </div>
          <nav className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
            <div className="w-[60px] h-[20px] bg-muted/20 rounded animate-pulse" />
            <div className="w-[24px] h-[24px] bg-muted/20 rounded-full animate-pulse" />
          </nav>
        </div>
      </header>
    );
  }

  // Check if we're on a dashboard page
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-colors duration-300 ease-in-out">
      <div className="container max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side: Logo and hamburger menu on mobile for authenticated users */}
        <div className="flex items-center flex-shrink-0">
          {/* Only show hamburger menu if authenticated AND on dashboard pages */}
          {isAuthenticated && isDashboardPage && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={onMenuToggle}
              data-sidebar-toggle="true"
              className="mr-2 sm:mr-4 md:hidden focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}

          <Link href="/" className="flex items-center">
            <div className="relative w-[100px] h-[24px]">
              <Image
                src={
                  logoSrc ||
                  (theme === "dark" ? "/lumman_white.svg" : "/lumman_black.svg")
                }
                alt="Lumman.ai"
                fill
                priority
                sizes="100px"
                style={{
                  objectFit: "contain",
                }}
                className="transition-opacity duration-300 ease-in-out"
              />
            </div>
          </Link>
        </div>

        {/* Right: Navigation - same for both authenticated and non-authenticated users */}
        <nav className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
          <Link
            href="/ai-insights"
            className={cn(
              "text-sm transition-colors duration-300 ease-in-out font-medium whitespace-nowrap",
              isActive("/ai-insights")
                ? "text-foreground"
                : "text-foreground/80 hover:text-foreground"
            )}
          >
            AI Insights
          </Link>

          {/* Only show auth button when Supabase is initialized */}
          {isInitialized && !isLoadingAuth && (
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button
                variant="ghost"
                size="icon"
                className="text-sm bg-transparent border-none transition-colors duration-300 ease-in-out flex-shrink-0"
              >
                <UserIcon className="h-4 w-4 text-foreground transition-colors duration-300 ease-in-out" />
                <span className="sr-only">
                  {isAuthenticated ? "Dashboard" : "Sign in"}
                </span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
