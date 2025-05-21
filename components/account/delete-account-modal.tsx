"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  if (!isOpen) return null

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Delete user profile
      const { error: profileError } = await supabase.from("user_profiles").delete().eq("user_id", user.id)

      if (profileError) {
        throw profileError
      }

      // Delete user's chats - directly delete them, no soft delete
      const { error: chatsError } = await supabase.from("chats").delete().eq("user_id", user.id)

      if (chatsError) {
        throw chatsError
      }

      // Delete the user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

      if (deleteError) {
        throw deleteError
      }

      // Sign out
      await supabase.auth.signOut()

      // Redirect to home page
      router.push("/")

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-6">
        <div className="w-full">
          <Button variant="destructive" className="w-full" onClick={handleDeleteAccount} disabled={isDeleting}>
            I understand and confirm deletion
          </Button>
        </div>

        <div className="text-center max-w-md">
          <p className="text-lg font-medium text-destructive mb-2">Warning</p>
          <p className="text-muted-foreground">
            All your data will be permanently deleted. This action cannot be undone.
          </p>
        </div>

        <Button variant="outline" className="w-full" onClick={onClose}>
          Back
        </Button>
      </div>
    </div>
  )
}
