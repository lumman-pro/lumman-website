"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { revalidatePath } from "next/cache";
// Add the import for handleSupabaseError
import { handleSupabaseError } from "@/lib/utils";

// Update the deleteConversation function
export async function deleteConversation(id: string) {
  try {
    const supabase = createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(
        handleSupabaseError(
          userError,
          "deleteConversation:getUser",
          "Authentication failed",
        ),
      );
    }

    if (!user) {
      throw new Error("Not authenticated");
    }

    // First, verify the user owns this conversation
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("user_id")
      .eq("id", id)
      .eq("user_id", user.id) // Explicitly filter by user_id for RLS
      .single();

    if (chatError) {
      if (chatError.code === "PGRST116") {
        throw new Error(
          "Conversation not found or you don't have permission to delete it",
        );
      }
      throw new Error(
        handleSupabaseError(
          chatError,
          "deleteConversation:fetchChat",
          "Failed to verify conversation ownership",
        ),
      );
    }

    if (chat.user_id !== user.id) {
      throw new Error("You don't have permission to delete this conversation");
    }

    // Delete the conversation
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(
        handleSupabaseError(
          error,
          "deleteConversation:delete",
          "Failed to delete conversation",
        ),
      );
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (err) {
    console.error("Error deleting conversation:", err);
    return {
      error: handleSupabaseError(
        err,
        "deleteConversation",
        "Failed to delete conversation",
      ),
    };
  }
}

// Update the updateConversation function
export async function updateConversation(
  id: string,
  updates: {
    chat_name?: string;
    chat_summary?: string | null;
    chat_transcription?: string | null;
    chat_duration?: number | null;
  },
) {
  try {
    const supabase = createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(
        handleSupabaseError(
          userError,
          "updateConversation:getUser",
          "Authentication failed",
        ),
      );
    }

    if (!user) {
      throw new Error("Not authenticated");
    }

    // First, verify the user owns this conversation
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("user_id")
      .eq("id", id)
      .eq("user_id", user.id) // Explicitly filter by user_id for RLS
      .single();

    if (chatError) {
      if (chatError.code === "PGRST116") {
        throw new Error(
          "Conversation not found or you don't have permission to update it",
        );
      }
      throw new Error(
        handleSupabaseError(
          chatError,
          "updateConversation:fetchChat",
          "Failed to verify conversation ownership",
        ),
      );
    }

    if (chat.user_id !== user.id) {
      throw new Error("You don't have permission to update this conversation");
    }

    // Update the conversation
    const { data, error } = await supabase
      .from("chats")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        handleSupabaseError(
          error,
          "updateConversation:update",
          "Failed to update conversation",
        ),
      );
    }

    revalidatePath(`/dashboard/chat/${id}`);

    return { data };
  } catch (err) {
    console.error("Error updating conversation:", err);
    return {
      error: handleSupabaseError(
        err,
        "updateConversation",
        "Failed to update conversation",
      ),
    };
  }
}
