"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleSupabaseError } from "@/lib/utils";
import { deleteAccount } from "@/app/api/account/actions";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      // Call server action to delete account
      const result = await deleteAccount();

      if (result?.error) {
        throw new Error(result.error);
      }

      // Success case - server action handles redirect and signout
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: handleSupabaseError(
          error,
          "handleDeleteAccount",
          "Failed to delete account. Please try again."
        ),
        variant: "destructive",
      });
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          disabled={isDeleting}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-6">
        <div className="w-full">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting account...
              </>
            ) : (
              "I understand and confirm deletion"
            )}
          </Button>
        </div>

        <div className="text-center max-w-md">
          <p className="text-lg font-medium text-destructive mb-2">Warning</p>
          <p className="text-muted-foreground">
            All your data will be permanently deleted. This action cannot be
            undone.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onClose}
          disabled={isDeleting}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
