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
        "flex flex-col h-full w-full bg-background border-r transition-all duration-300 ease-in-out"
      )}
    >
      {/* Logo section */}
      <div className="px-6 h-16 border-b flex items-center">
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
      <div className="px-6 py-4 border-b">
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
      <div className="flex-1 overflow-y-auto py-2">
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
          <ul className="space-y-1">
            {chatsData.chats.map((conversation) => (
              <li key={conversation.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal px-4 py-2 h-auto",
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
      <div className="px-6 py-4 border-t mt-auto">
        <nav className="space-y-2">
          <Link href="/insights" onClick={onClose}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm",
                isActive("/insights") && "bg-muted font-medium"
              )}
            >
              Insights
            </Button>
          </Link>

          <Link href="/account" onClick={onClose}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm",
                isActive("/account") && "bg-muted font-medium"
              )}
            >
              <User className="h-4 w-4 mr-2" />
              {isUserLoading
                ? "Loading..."
                : userData?.user_name || "Account Settings"}
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </nav>
      </div>
    </div>
  );
}
