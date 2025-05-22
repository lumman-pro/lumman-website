"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useCreateChat } from "@/hooks/use-data-fetching"
import { useToast } from "@/hooks/use-toast"

export default function NewChatPage() {
  const router = useRouter()
  const createChatMutation = useCreateChat()
  const { toast } = useToast()

  useEffect(() => {
    const createNewChat = async () => {
      try {
        const newChat = await createChatMutation.mutateAsync("New Chat")
        router.push(`/dashboard/chat/${newChat.id}`)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create new chat",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    createNewChat()
  }, [router, createChatMutation, toast])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Creating a new conversation...</p>
      </div>
    </div>
  )
}
