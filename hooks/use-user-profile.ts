"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabase/supabaseClient"
import { useToast } from "@/hooks/use-toast"

export interface UserProfile {
  id: string
  user_id: string
  user_name: string | null
  user_email: string | null
  created_at: string
  updated_at: string | null
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser()

        if (userError) throw userError

        if (!user) {
          // Handle unauthenticated state gracefully
          if (isMounted) {
            setIsLoading(false)
          }
          return null
        }

        // Check if user profile exists
        const { data: existingProfile, error: fetchError } = await supabaseClient
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw fetchError
        }

        if (existingProfile) {
          if (isMounted) {
            setProfile(existingProfile)
          }
        } else {
          // Create a new profile if one doesn't exist
          const { data: newProfile, error: insertError } = await supabaseClient
            .from("user_profiles")
            .insert({
              user_id: user.id,
              user_name: user.phone || null,
              user_email: user.email || null,
            })
            .select("*")
            .single()

          if (insertError) {
            throw insertError
          }

          if (isMounted) {
            setProfile(newProfile)
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load user profile")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUserProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const updateProfile = async (name: string, email: string) => {
    try {
      if (!profile) {
        throw new Error("Profile not loaded")
      }

      const { data, error } = await supabaseClient
        .from("user_profiles")
        .update({
          user_name: name,
          user_email: email,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id)
        .select("*")
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
      return { success: true, data }
    } catch (err) {
      console.error("Error updating profile:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      })
      return { success: false, error: err }
    }
  }

  return {
    profile,
    isLoading,
    error,
    fetchUserProfile: async () => {}, // Placeholder to maintain API
    updateProfile,
  }
}
