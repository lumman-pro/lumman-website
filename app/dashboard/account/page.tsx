"use client";

import type React from "react";

import { useState } from "react";
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

  // Update form data when profile is loaded
  useState(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || "",
        user_email: profile.user_email || "",
        company_name: profile.company_name || "",
        company_url: profile.company_url || "",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        user_name: formData.user_name || null,
        user_email: formData.user_email || null,
        company_name: formData.company_name || null,
        company_url: formData.company_url || null,
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated.",
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
        <div className="flex items-center justify-end">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={handleEditToggle}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              type="email"
              value={formData.user_email}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Your email"
            />
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
              type="url"
              value={formData.company_url}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://example.com"
            />
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button type="submit" disabled={updateProfileMutation.isPending}>
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
