"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChats } from "@/hooks/use-data-fetching";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Fetch chats data to get the most recent chat
  const { data: chatsData, isLoading } = useChats({ limit: 1 });

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Try to get cached chats data first for immediate redirect
    const cachedChatsData = queryClient.getQueryData(["chats", 20, 0]) as
      | { chats: any[] }
      | undefined;

    if (cachedChatsData && cachedChatsData.chats.length > 0) {
      // Use cached data for immediate redirect
      const mostRecentChat = cachedChatsData.chats[0];
      router.replace(`/dashboard/chat/${mostRecentChat.id}`);
      return;
    }

    // If no cached data, use fresh data from the hook
    if (chatsData && chatsData.chats.length > 0) {
      const mostRecentChat = chatsData.chats[0];
      router.replace(`/dashboard/chat/${mostRecentChat.id}`);
    } else {
      // No chats exist, redirect to new chat page
      router.replace("/dashboard/new");
    }
  }, [router, queryClient, chatsData, isLoading]);

  // Return minimal loading state
  return null;
}
