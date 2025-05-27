"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Add the import for handleSupabaseError
import { handleSupabaseError } from "@/lib/utils";

// Update the deleteAccount function
export async function deleteAccount() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(
        handleSupabaseError(
          userError,
          "deleteAccount:getUser",
          "Authentication failed"
        )
      );
    }

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Archive user's chats instead of deleting them
    // try {
    //   // Get all user's chats
    //   const { data: chats, error: chatsQueryError } = await supabase
    //     .from("chats")
    //     .select("*")
    //     .eq("user_id", user.id)
    //     .eq("is_archived", false)

    //   if (chatsQueryError) {
    //     console.error("Error fetching user chats:", chatsQueryError)
    //     // Continue with account deletion even if this fails
    //   } else if (chats && chats.length > 0) {
    //     // Archive each chat
    //     for (const chat of chats) {
    //       // Mark as archived
    //       const { error: updateError } = await supabase
    //         .from("chats")
    //         .update({ is_archived: true })
    //         .eq("id", chat.id)
    //         .eq("user_id", user.id)

    //       if (updateError) {
    //         console.error(`Error archiving chat ${chat.id}:`, updateError)
    //         // Continue with other chats
    //       }

    //       // Create archive record
    //       const { error: archiveError } = await supabase.from("chats_archive").insert({
    //         chat_id: chat.id,
    //         user_id: user.id,
    //         chat_data: chat,
    //         archived_at: new Date().toISOString(),
    //       })

    //       if (archiveError) {
    //         console.error(`Error creating archive record for chat ${chat.id}:`, archiveError)
    //         // Continue with other chats
    //       }
    //     }
    //   }
    // } catch (err) {
    //   console.error("Error in chat archiving process:", err)
    //   // Continue with account deletion even if this fails
    // }

    // Delete user's profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("user_id", user.id);

    if (profileError) {
      throw new Error(
        handleSupabaseError(
          profileError,
          "deleteAccount:deleteProfile",
          "Failed to delete user profile"
        )
      );
    }

    // Delete the user account
    const { error: userError2 } = await supabase.auth.admin.deleteUser(user.id);

    if (userError2) {
      throw new Error(
        handleSupabaseError(
          userError2,
          "deleteAccount:deleteUser",
          "Failed to delete user account"
        )
      );
    }

    // Sign out the user
    await supabase.auth.signOut();

    revalidatePath("/");
  } catch (err) {
    console.error("Error deleting account:", err);
    return {
      error: handleSupabaseError(
        err,
        "deleteAccount",
        "Failed to delete account"
      ),
    };
  }
}

// Update the updateUserProfile function
export async function updateUserProfile(updates: {
  user_name?: string | null;
  user_email?: string | null;
  company_name?: string | null;
  company_url?: string | null;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(
        handleSupabaseError(
          userError,
          "updateUserProfile:getUser",
          "Authentication failed"
        )
      );
    }

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Update the user profile
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...updates,
      })
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        handleSupabaseError(
          error,
          "updateUserProfile:update",
          "Failed to update user profile"
        )
      );
    }

    revalidatePath("/account");
    return { data };
  } catch (err) {
    console.error("Error updating user profile:", err);
    return {
      error: handleSupabaseError(
        err,
        "updateUserProfile",
        "Failed to update profile"
      ),
    };
  }
}
