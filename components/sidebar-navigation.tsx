"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";
import { MessageSquarePlus, User, LogOut } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUserData, useChats } from "@/hooks/use-data-fetching";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarNavigation({ isOpen, onClose }: SidebarNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use React Query hooks
  const { data: userData, isLoading: isUserLoading } = useUserData();
  const {
    data: chatsData,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useChats({ limit: 20 });

  // Prefetch the most recent chat for faster navigation
  useEffect(() => {
    if (chatsData && chatsData.chats.length > 0) {
      const mostRecentChat = chatsData.chats[0];
      queryClient.prefetchQuery({
        queryKey: ["chatDetails", mostRecentChat.id],
        queryFn: async () => {
          // Return the cached chat data with messages structure
          return {
            chat: mostRecentChat,
            messages: [
              {
                id: "system-message",
                chat_id: mostRecentChat.id,
                content:
                  mostRecentChat.chat_summary ||
                  "No summary available for this chat.",
                role: "system",
                created_at: mostRecentChat.created_at,
              },
            ],
          };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [chatsData, queryClient]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();

      if (error) {
        throw new Error(error.message);
      }

      router.push("/");
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewChat = () => {
    // Redirect to new chat page
    router.push("/dashboard/new");
    onClose();
  };

  const handleChatSelect = (id: string) => {
    router.push(`/dashboard/chat/${id}`);
    onClose();
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Get the correct logo based on theme
  const logoSrc = mounted
    ? resolvedTheme === "dark"
      ? "/lumman_white.svg"
      : "/lumman_black.svg"
    : null;

  return (
    <div
      className={cn(
        "grid grid-rows-[auto_auto_1fr_auto] h-screen h-[100svh] w-full bg-background border-r transition-all duration-300 ease-in-out"
      )}
    >
      {/* Logo section */}
      <div className="px-6 h-16 flex items-center">
        {logoSrc ? (
          <Link href="/" onClick={onClose}>
            <img
              src={logoSrc}
              alt="Lumman.ai"
              width={100}
              className="h-auto transition-opacity duration-300 ease-in-out cursor-pointer hover:opacity-80"
            />
          </Link>
        ) : (
          <div className="w-[100px] h-[18.85px]" />
        )}
      </div>

      {/* New Chat section */}
      <div className="px-6 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm font-medium"
          onClick={handleNewChat}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Scrollable conversations list */}
      <div className="min-h-0 overflow-y-auto overflow-x-hidden border-0 outline-0 shadow-none ring-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="px-3 py-2">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wide">
            Recent chats
          </h3>
        </div>
        {isChatsLoading ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Loading conversations...
          </div>
        ) : chatsError ? (
          <div className="px-4 py-2 text-sm text-destructive">
            {chatsError instanceof Error
              ? chatsError.message
              : "Failed to load conversations"}
          </div>
        ) : !chatsData || chatsData.chats.length === 0 ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          <ul className="border-0 outline-0 shadow-none before:content-none after:content-none [&>:last-child]:border-b-0">
            {chatsData.chats.map((conversation) => (
              <li
                key={conversation.id}
                className="border-0 outline-0 shadow-none before:content-none after:content-none -my-px bg-background"
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal px-4 py-2 h-auto border-0 outline-0 shadow-none ring-0 before:content-none after:content-none",
                    isActive(`/dashboard/chat/${conversation.id}`) &&
                      "bg-muted font-medium"
                  )}
                  onClick={() => handleChatSelect(conversation.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="truncate w-full text-left">
                      {conversation.chat_name || "Untitled Chat"}
                    </span>
                    {conversation.chat_summary && (
                      <span className="text-xs text-muted-foreground mt-1 truncate w-full">
                        {conversation.chat_summary.substring(0, 40)}...
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDate(new Date(conversation.created_at))}
                    </span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom section with links and user profile */}
      <div className="px-6 py-4">
        <nav className="space-y-2 -mt-4">
          <Link href="/dashboard/account" onClick={onClose}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm",
                isActive("/dashboard/account") && "bg-muted font-medium"
              )}
            >
              <User className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {isUserLoading
                  ? "Loading..."
                  : userData?.user_name || "Account Settings"}
              </span>
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
