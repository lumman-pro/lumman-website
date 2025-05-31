"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleSupabaseError } from "@/lib/utils";
import type { UserProfile as DBUserProfile } from "@/lib/supabase/database.types";

// Use the database type directly
export type UserProfile = DBUserProfile;

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createBrowserSupabaseClient();

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          // Handle unauthenticated state gracefully
          if (isMounted) {
            setIsLoading(false);
          }
          return null;
        }

        // Check if user profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw fetchError;
        }

        if (existingProfile) {
          if (isMounted) {
            setProfile(existingProfile);
          }
        } else {
          // Create a new profile if one doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              user_id: user.id,
              user_name: user.user_metadata?.name || user.phone || null,
              user_email: user.email || null,
              user_phone: user.phone || null,
              company_name: null,
              company_url: null,
            })
            .select("*")
            .single();

          if (insertError) {
            throw insertError;
          }

          if (isMounted && newProfile) {
            setProfile(newProfile);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        if (isMounted) {
          setError(
            handleSupabaseError(
              err,
              "fetchUserProfile",
              "Failed to load user profile"
            )
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = async (updates: {
    user_name?: string | null;
    user_email?: string | null;
    company_name?: string | null;
    company_url?: string | null;
    user_phone?: string | null;
  }) => {
    try {
      if (!profile) {
        throw new Error("Profile not loaded");
      }

      const supabase = createBrowserSupabaseClient();

      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
        })
        .eq("user_id", profile.user_id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
      return { success: true, data };
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = handleSupabaseError(
        err,
        "updateProfile",
        "Failed to update profile"
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: err, message: errorMessage };
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchUserProfile: async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createBrowserSupabaseClient();

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          setIsLoading(false);
          return null;
        }

        // Check if user profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw fetchError;
        }

        if (existingProfile) {
          setProfile(existingProfile);
        } else {
          // Create a new profile if one doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              user_id: user.id,
              user_name: user.user_metadata?.name || user.phone || null,
              user_email: user.email || null,
              user_phone: user.phone || null,
              company_name: null,
              company_url: null,
            })
            .select("*")
            .single();

          if (insertError) {
            throw insertError;
          }

          if (newProfile) {
            setProfile(newProfile);
          }
        }

        setIsLoading(false);
        return profile;
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(
          handleSupabaseError(
            err,
            "fetchUserProfile",
            "Failed to load user profile"
          )
        );
        setIsLoading(false);
        return null;
      }
    },
    updateProfile,
  };
}
