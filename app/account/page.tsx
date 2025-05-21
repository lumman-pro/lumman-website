"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeleteAccountModal } from "@/components/account/delete-account-modal"
import { signOut } from "@/lib/supabase/auth"

export default function AccountPage() {
  const router = useRouter()
  const { profile, isLoading, updateProfile } = useUserProfile()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (profile) {
      setName(profile.user_name || "")
      setEmail(profile.user_email || "")
    }
  }, [profile])

  const handleSave = async () => {
    if (!name || !email) return

    try {
      setIsSaving(true)
      const { success } = await updateProfile(name, email)

      if (success) {
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-medium mb-6">Your Account</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your full name</Label>
          <Input id="name" placeholder="Luke Skywalker" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Your work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@yourcompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={!name || !email || isSaving || showSaved} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : showSaved ? (
            "Saved!"
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <div className="mt-12 space-y-4 flex flex-col items-center">
        <Button variant="outline" onClick={handleSignOut} className="w-40">
          Sign out
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 w-40"
        >
          Delete account
        </Button>
      </div>

      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  )
}
