"use client";

import type React from "react";

import { useParams, useRouter } from "next/navigation";
import {
  useChatMessages,
  useUpdateChatStatus,
  useUserData,
} from "@/hooks/use-data-fetching";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Menu, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatDropdown } from "@/components/chat/chat-dropdown";
import { useState } from "react";
import { deleteConversation } from "@/app/dashboard/actions";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.id as string;
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query hooks
  const updateChatStatus = useUpdateChatStatus();
  const { data: userData } = useUserData();

  // Function to trigger sidebar toggle via custom event
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  // Function to send chat for evaluation
  const handleSendForEvaluation = async () => {
    try {
      // Check if user has name and email
      if (!userData?.user_name || !userData?.user_email) {
        // Redirect to account page if profile is incomplete
        router.push("/dashboard/account");
        return;
      }

      await updateChatStatus.mutateAsync({
        chatId,
        status: "evaluation_requested",
      });
    } catch (error) {
      console.error("Error sending for evaluation:", error);
      // Ошибка логируется в консоль, но пользователю не показывается
    }
  };

  // Function to delete chat directly
  const handleDeleteChat = async () => {
    try {
      setIsDeleting(true);

      // Call server action to delete chat
      const result = await deleteConversation(chatId);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Invalidate chats cache to update the UI
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      // Redirect to dashboard after successful deletion
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error deleting chat:", error);
      setIsDeleting(false);
    }
  };

  const { data: chatData, isLoading, error } = useChatMessages(chatId);

  // Redirect to dashboard if chat not found
  useEffect(() => {
    if (error && error.message.includes("Chat not found")) {
      router.replace("/dashboard");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading chat...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-destructive text-center">
            {error instanceof Error ? error.message : "Failed to load chat"}
          </div>
        </div>
      </div>
    );
  }

  // Don't render content if chat data is missing
  if (!chatData?.chat) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Chat not found...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-medium">
            {chatData?.chat?.chat_name || "Chat"}
          </h1>
        </div>
        <ChatDropdown onDeleteChat={handleDeleteChat} isDeleting={isDeleting} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Display chat summary */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted/50 rounded-lg p-4 w-[96%] max-w-4xl">
            <h2 className="font-medium mb-2">Chat Summary</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {chatData?.chat?.chat_summary ||
                "No summary available for this chat."}
            </p>
            <div className="text-xs mt-4 opacity-70">
              {formatDate(new Date(chatData?.chat?.created_at || new Date()))}
            </div>
          </div>
        </div>

        {/* Information text before waitlist button */}
        <div className="flex justify-center mb-6">
          <div className="text-center text-sm text-muted-foreground max-w-2xl px-4">
            <p>
              We're in an early phase and navigating some growing pains,
              especially around capacity. As soon as we're able to take on your
              inquiry, we'll get back to you with next steps and timing. Just
              hit Join the Waitlist to save your spot — or feel free to start a
              new chat anytime and tell us more about your goals.
            </p>
          </div>
        </div>

        {/* Send for Evaluation button */}
        <div className="flex flex-col items-center mt-6">
          <Button
            variant="outline"
            onClick={handleSendForEvaluation}
            disabled={
              updateChatStatus.isPending ||
              chatData?.chat?.status === "evaluation_requested"
            }
            className="max-w-xs"
          >
            {updateChatStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : chatData?.chat?.status === "evaluation_requested" ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                You're on the list!
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Join the Waitlist
              </>
            )}
          </Button>

          {/* Evaluation status message */}
          {chatData?.chat?.status === "evaluation_requested" && (
            <div className="mt-4 text-center text-sm text-muted-foreground max-w-md">
              <p>We'll be in touch as soon as a spot opens up.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
