import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PostgrestError } from "@supabase/supabase-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function handleSupabaseError(
  error: PostgrestError | Error | unknown,
  context = "Supabase operation",
  defaultMessage = "An unexpected error occurred. Please try again.",
): string {
  // If it's a PostgrestError from Supabase
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const pgError = error as PostgrestError

    // Log detailed error for debugging
    console.error(`Supabase error in ${context}:`, {
      code: pgError.code,
      message: pgError.message,
      details: pgError.details,
      hint: pgError.hint,
    })

    // Handle common Supabase error codes
    switch (pgError.code) {
      case "42501":
      case "42P07":
      case "PGRST301":
        return "You don't have permission to perform this action."

      case "PGRST116":
        return "The requested resource was not found."

      case "23505":
        return "This record already exists."

      case "23503":
        return "This operation cannot be completed due to related data constraints."

      case "P0001":
        // Custom error messages from RLS policies often come through as P0001
        if (pgError.message.includes("permission") || pgError.message.includes("access")) {
          return "You don't have permission to access this resource."
        }
        return pgError.message || defaultMessage

      case "PGRST109":
        return "The request payload is too large."

      case "22P02":
        return "Invalid input format."

      default:
        // For other PostgrestErrors, use the message if available
        return pgError.message || defaultMessage
    }
  }

  // If it's a standard Error object
  if (error instanceof Error) {
    console.error(`Error in ${context}:`, error)

    // Check for common authentication error messages
    if (error.message.includes("not authenticated") || error.message.includes("JWT")) {
      return "Your session has expired. Please sign in again."
    }

    // Check for network-related errors
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Network error. Please check your connection and try again."
    }

    return error.message || defaultMessage
  }

  // For unknown error types
  console.error(`Unknown error in ${context}:`, error)
  return defaultMessage
}
