"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { useUserData, useUpdateUserProfile } from "@/hooks/use-data-fetching";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { signOut } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AccountPage() {
  const { data: profile, isLoading, error } = useUserData();
  const updateProfileMutation = useUpdateUserProfile();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    user_email: "",
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || "",
        user_email: profile.user_email || "",
      });
    }
  }, [profile]);

  // Check if there are any changes
  const hasChanges = useMemo(() => {
    if (!profile) return false;

    return (
      formData.user_name !== (profile.user_name || "") ||
      formData.user_email !== (profile.user_email || "")
    );
  }, [formData, profile]);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "";

    // Basic email format validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }

    // Check for common mistakes
    const trimmedEmail = email.trim().toLowerCase();

    // Check for double dots or dots at start/end
    if (
      trimmedEmail.includes("..") ||
      trimmedEmail.startsWith(".") ||
      trimmedEmail.includes(".@") ||
      trimmedEmail.includes("@.")
    ) {
      return "Please check your email address format";
    }

    // Check for missing @ or multiple @
    const atCount = (trimmedEmail.match(/@/g) || []).length;
    if (atCount !== 1) {
      return "Email address must contain exactly one @ symbol";
    }

    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailBlur = () => {
    const emailError = validateEmail(formData.user_email);
    setValidationErrors((prev) => ({ ...prev, user_email: emailError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateEmail(formData.user_email);

    setValidationErrors({
      user_email: emailError,
    });

    // Don't submit if there are validation errors
    if (emailError) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        user_name: formData.user_name || null,
        user_email: formData.user_email || null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();

      if (error) {
        throw new Error(error.message);
      }

      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <div className="space-y-8 animate-pulse">
          <div className="h-10 bg-muted rounded-md w-1/3" />
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/4" />
            <div className="h-10 bg-muted rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/4" />
            <div className="h-10 bg-muted rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded-md w-1/4" />
            <div className="h-10 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl">
        <div className="text-destructive text-center">
          {error instanceof Error ? error.message : "Failed to load profile"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6 pt-12" noValidate>
          <div className="space-y-2">
            <Label htmlFor="user_name">Name</Label>
            <Input
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_email">Email</Label>
            <Input
              id="user_email"
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={
                validationErrors.user_email ? "border-destructive" : ""
              }
              onBlur={handleEmailBlur}
            />
            {validationErrors.user_email && (
              <p className="text-sm text-destructive">
                {validationErrors.user_email}
              </p>
            )}
          </div>

          {hasChanges && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  updateProfileMutation.isPending ||
                  validationErrors.user_email !== ""
                }
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>

        <div className="flex flex-col sm:flex-row gap-4 pt-36">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
