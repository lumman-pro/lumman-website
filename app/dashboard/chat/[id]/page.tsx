"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { Loader2, Send, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { deleteConversation } from "@/app/dashboard/actions"

interface Conversation {
  id: string
  chat_name: string
  chat_summary: string | null
  chat_transcription: string | null
  created_at: string
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSendingEstimate, setIsSendingEstimate] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchConversation(params.id)
    }
  }, [params.id])

  const fetchConversation = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabaseClient
        .from("chats")
        .select("id, chat_name, chat_summary, chat_transcription, created_at")
        .eq("id", id)
        .single()

      if (error) {
        throw error
      }

      setConversation(data)
    } catch (err) {
      console.error("Error fetching conversation:", err)
      setError("Failed to load conversation details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!params.id) return

    try {
      setIsDeleting(true)
      await deleteConversation(params.id)
      toast({
        title: "Conversation deleted",
        description: "The conversation has been successfully deleted.",
      })
      router.push("/dashboard/new")
    } catch (err) {
      console.error("Error deleting conversation:", err)
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSendForEstimate = async () => {
    if (!params.id) return

    try {
      setIsSendingEstimate(true)

      // Simulate sending for estimate
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Estimate requested",
        description: "Your conversation has been sent for an estimate. We'll get back to you soon.",
      })
    } catch (err) {
      console.error("Error sending for estimate:", err)
      toast({
        title: "Error",
        description: "Failed to send for estimate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingEstimate(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading conversation...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => params.id && fetchConversation(params.id)} className="mt-4" variant="outline">
          Try again
        </Button>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <p className="text-muted-foreground">Conversation not found</p>
        <Button onClick={() => router.push("/dashboard/new")} className="mt-4" variant="outline">
          Start a new conversation
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">{conversation.chat_name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{formatDate(new Date(conversation.created_at))}</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        {conversation.chat_summary ? (
          conversation.chat_summary.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
        ) : (
          <p className="text-muted-foreground">No summary available for this conversation.</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button onClick={handleSendForEstimate} disabled={isSendingEstimate} className="sm:order-1">
          {isSendingEstimate ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send for Estimate
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleDelete} disabled={isDeleting} className="sm:order-2">
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Chat
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
