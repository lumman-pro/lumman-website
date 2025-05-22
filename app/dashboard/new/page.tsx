"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function NewChatPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Show a toast message explaining that chat creation is now handled externally
    toast({
      title: "Chat Creation",
      description: "New chats are now created through the external system. Redirecting to dashboard.",
    })
    
    // Redirect to dashboard after a short delay
    const timeout = setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
    
    return () => clearTimeout(timeout)
  }, [router, toast])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
        <p className="text-sm text-muted-foreground mt-2">
          New conversations are now created through the external system.
        </p>
      </div>
    </div>
  )
}
