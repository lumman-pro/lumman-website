"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Trash2 } from "lucide-react";
import { formatDate, handleSupabaseError } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Chat } from "@/lib/supabase/database.types";

interface ConversationDetailProps {
  conversationId: string | null;
  onDelete: (id: string) => Promise<void>;
}

export function ConversationDetail({
  conversationId,
  onDelete,
}: ConversationDetailProps) {
  const [conversation, setConversation] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingEstimate, setIsSendingEstimate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
    } else {
      setConversation(null);
    }
  }, [conversationId]);

  const fetchConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if supabase client is available
      if (!supabase) {
        throw new Error("Supabase client is not available");
      }

      // Check authentication first
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          handleSupabaseError(
            sessionError,
            "fetchConversation:getSession",
            "Authentication error"
          )
        );
      }

      if (!sessionData.session) {
        throw new Error("You must be logged in to view conversation details");
      }

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId) // Explicitly filter by user_id for RLS
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(
            "Conversation not found or you don't have permission to view it"
          );
        }
        throw new Error(
          handleSupabaseError(
            error,
            "fetchConversation:fetchChat",
            "Failed to load conversation"
          )
        );
      }

      setConversation(data);
    } catch (err) {
      console.error("Error fetching conversation:", err);
      setError(
        handleSupabaseError(
          err,
          "fetchConversation",
          "Failed to load conversation details"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!conversationId) return;

    try {
      setIsDeleting(true);

      // Check if supabase client is available
      if (!supabase) {
        throw new Error("Supabase client is not available");
      }

      // Check authentication first
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          handleSupabaseError(
            sessionError,
            "handleDelete:getSession",
            "Authentication error"
          )
        );
      }

      if (!sessionData.session) {
        throw new Error("You must be logged in to delete a conversation");
      }

      // Verify ownership before attempting to delete
      if (
        conversation &&
        conversation.user_id !== sessionData.session.user.id
      ) {
        throw new Error(
          "You don't have permission to delete this conversation"
        );
      }

      await onDelete(conversationId);
      toast({
        title: "Conversation deleted",
        description: "The conversation has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting conversation:", err);
      toast({
        title: "Error",
        description: handleSupabaseError(
          err,
          "handleDelete",
          "Failed to delete conversation. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendForEstimate = async () => {
    if (!conversationId) return;

    try {
      setIsSendingEstimate(true);

      // Check if supabase client is available
      if (!supabase) {
        throw new Error("Supabase client is not available");
      }

      // Check authentication first
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          handleSupabaseError(
            sessionError,
            "handleSendForEstimate:getSession",
            "Authentication error"
          )
        );
      }

      if (!sessionData.session) {
        throw new Error("You must be logged in to request an estimate");
      }

      // Verify ownership before proceeding
      if (
        conversation &&
        conversation.user_id !== sessionData.session.user.id
      ) {
        throw new Error(
          "You don't have permission to request an estimate for this conversation"
        );
      }

      // Simulate sending for estimate
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Estimate requested",
        description:
          "Your conversation has been sent for an estimate. We'll get back to you soon.",
      });
    } catch (err) {
      console.error("Error sending for estimate:", err);
      toast({
        title: "Error",
        description: handleSupabaseError(
          err,
          "handleSendForEstimate",
          "Failed to send for estimate. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsSendingEstimate(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">
          Select a conversation to view its summary
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Loading conversation...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => conversationId && fetchConversation(conversationId)}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-medium">
          {conversation.chat_name || "Untitled Chat"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {conversation.created_at
            ? formatDate(new Date(conversation.created_at))
            : "Unknown date"}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {conversation.chat_summary ? (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {conversation.chat_summary.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No summary available for this conversation.
          </p>
        )}
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="sm:order-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Chat
              </>
            )}
          </Button>

          <Button
            onClick={handleSendForEstimate}
            disabled={isSendingEstimate}
            className="sm:order-1"
          >
            {isSendingEstimate ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send for Estimate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
