"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUserData, useUpdateUserProfile } from "@/hooks/use-data-fetching";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DeleteAccountModal } from "@/components/account/delete-account-modal";
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
    company_name: "",
    company_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    user_email: "",
    company_url: "",
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || "",
        user_email: profile.user_email || "",
        company_name: profile.company_name || "",
        company_url: profile.company_url || "",
      });
    }
  }, [profile]);

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

  const validateAndFormatUrl = (
    url: string
  ): { isValid: boolean; formattedUrl: string; error: string } => {
    if (!url) return { isValid: true, formattedUrl: "", error: "" };

    let formattedUrl = url.trim();

    // Remove any existing protocol to normalize
    formattedUrl = formattedUrl.replace(/^https?:\/\//, "");

    // Remove www. prefix if exists for normalization
    const wwwPrefix = formattedUrl.startsWith("www.") ? "www." : "";
    if (wwwPrefix) {
      formattedUrl = formattedUrl.substring(4);
    }

    // Check for localhost or IP addresses
    const isLocalhost =
      formattedUrl.startsWith("localhost") ||
      formattedUrl.startsWith("127.0.0.1");
    const isIP = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/.test(formattedUrl);

    // Basic domain validation - must have at least one dot and valid characters (unless localhost or IP)
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}\.)*[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

    if (!isLocalhost && !isIP && !domainRegex.test(formattedUrl)) {
      return {
        isValid: false,
        formattedUrl: url,
        error: "Please enter a valid website address (e.g., example.com)",
      };
    }

    // Add https:// protocol and www prefix if it was there originally
    const finalUrl = `https://${wwwPrefix}${formattedUrl}`;

    try {
      new URL(finalUrl);
      return { isValid: true, formattedUrl: finalUrl, error: "" };
    } catch {
      return {
        isValid: false,
        formattedUrl: url,
        error: "Please enter a valid website address (e.g., example.com)",
      };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailBlur = () => {
    const emailError = validateEmail(formData.user_email);
    setValidationErrors((prev) => ({ ...prev, user_email: emailError }));
  };

  const handleUrlBlur = () => {
    const { error } = validateAndFormatUrl(formData.company_url);
    setValidationErrors((prev) => ({ ...prev, company_url: error }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data to profile values
      if (profile) {
        setFormData({
          user_name: profile.user_name || "",
          user_email: profile.user_email || "",
          company_name: profile.company_name || "",
          company_url: profile.company_url || "",
        });
      }
      // Clear validation errors
      setValidationErrors({
        user_email: "",
        company_url: "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateEmail(formData.user_email);
    const {
      isValid: isUrlValid,
      formattedUrl,
      error: urlError,
    } = validateAndFormatUrl(formData.company_url);

    setValidationErrors({
      user_email: emailError,
      company_url: urlError,
    });

    // Don't submit if there are validation errors
    if (emailError || urlError) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        user_name: formData.user_name || null,
        user_email: formData.user_email || null,
        company_name: formData.company_name || null,
        company_url: formattedUrl || null, // Use formatted URL
      });

      // Update local form data with formatted URL
      if (formattedUrl !== formData.company_url) {
        setFormData((prev) => ({ ...prev, company_url: formattedUrl }));
      }

      setIsEditing(false);
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
        <div className="flex items-center justify-end">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={handleEditToggle}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="user_name">Name</Label>
            <Input
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
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

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_url">Company Website</Label>
            <Input
              id="company_url"
              name="company_url"
              value={formData.company_url}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="example.com or https://example.com"
              className={
                validationErrors.company_url ? "border-destructive" : ""
              }
              onBlur={handleUrlBlur}
            />
            {validationErrors.company_url && (
              <p className="text-sm text-destructive">
                {validationErrors.company_url}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  updateProfileMutation.isPending ||
                  validationErrors.user_email !== "" ||
                  validationErrors.company_url !== ""
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

          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Delete Account
          </Button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
