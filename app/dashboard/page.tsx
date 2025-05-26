"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Try to get cached chats data first (from sidebar)
    const cachedChatsData = queryClient.getQueryData(["chats", 20, 0]) as
      | { chats: any[] }
      | undefined;

    if (cachedChatsData && cachedChatsData.chats.length > 0) {
      // Use cached data for immediate redirect
      const mostRecentChat = cachedChatsData.chats[0];
      router.replace(`/dashboard/chat/${mostRecentChat.id}`);
    } else {
      // No cached data or no chats, redirect to new chat page
      router.replace("/dashboard/new");
    }
  }, [router, queryClient]);

  // Return minimal loading state (will be very brief)
  return null;
}
