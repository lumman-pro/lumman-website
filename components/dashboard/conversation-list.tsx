"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { LukeButton } from "@/components/luke-button";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  chat_name: string;
  created_at: string;
  chat_duration: number | null;
}

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedConversationId: string | null;
  onNewConversation: () => Promise<string>;
}

export function ConversationList({
  onSelectConversation,
  selectedConversationId,
  onNewConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated first
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error("Authentication error: " + sessionError.message);
      }

      // If no session exists, set empty conversations and return early
      if (!sessionData.session) {
        setError("You must be logged in to view conversations");
        setConversations([]);
        return;
      }

      const userId = sessionData.session.user.id;

      // Only proceed with fetching conversations if user is authenticated
      // RLS will automatically filter to only show the user's own chats,
      // but we're explicitly filtering by user_id for clarity
      const { data, error } = await supabase
        .from("chats")
        .select("id, chat_name, created_at, chat_duration")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error("Failed to load conversations: " + error.message);
      }

      setConversations(data || []);

      // If there are conversations and none is selected, select the first one
      if (data && data.length > 0 && !selectedConversationId) {
        onSelectConversation(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      setIsCreatingNew(true);

      // Check authentication first
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a conversation",
          variant: "destructive",
        });
        return;
      }

      const newConversationId = await onNewConversation();

      // Refresh the conversation list
      await fetchConversations();

      // Select the new conversation
      onSelectConversation(newConversationId);
    } catch (err) {
      console.error("Error creating new conversation:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to create new conversation",
        variant: "destructive",
      });
    } finally {
      setIsCreatingNew(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Loading conversations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={fetchConversations}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Your Conversations</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a new conversation with Luke
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 transition-colors duration-200",
                    selectedConversationId === conversation.id && "bg-muted",
                  )}
                >
                  <div className="font-medium truncate">
                    {conversation.chat_name || "Untitled Chat"}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(conversation.created_at))}
                    </span>
                    {conversation.chat_duration &&
                      conversation.chat_duration > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(conversation.chat_duration / 60)}:
                          {(conversation.chat_duration % 60)
                            .toString()
                            .padStart(2, "0")}
                        </span>
                      )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex justify-center">
          {isCreatingNew ? (
            <button
              disabled
              className="inline-flex items-center justify-center rounded-md text-sm font-medium opacity-70 cursor-not-allowed"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </button>
          ) : (
            <div onClick={handleNewConversation}>
              <LukeButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
