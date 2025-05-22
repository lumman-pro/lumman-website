"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mic, Send } from "lucide-react"
import { useChatMessages } from "@/hooks/use-data-fetching"
import { VoiceRecorder } from "@/components/voice-recorder"

export default function NewChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("chat_id")
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  // Fetch chat data if we have a chat ID
  const { data: chatData, isLoading } = useChatMessages(chatId || "")

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() && !isRecording) return
    
    try {
      // In a real implementation, this would send the message to the API
      // For now, we'll just redirect to the chat page
      if (chatId) {
        router.push(`/dashboard/chat/${chatId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  // Handle voice recording completion
  const handleVoiceRecordingComplete = (text: string) => {
    setMessage(text)
    setIsRecording(false)
  }

  // If no chat ID is provided, redirect to dashboard
  useEffect(() => {
    if (!chatId) {
      toast({
        title: "Error",
        description: "No chat ID provided. Redirecting to dashboard.",
      })
      router.push("/dashboard")
    }
  }, [chatId, router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">New Conversation</h1>
          <p className="text-muted-foreground mt-2">
            Start a conversation with Luke by typing a message or using voice input.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message here..."
                className="min-h-32 resize-none pr-12"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 bottom-2"
                onClick={toggleRecording}
              >
                <Mic className={isRecording ? "text-destructive" : "text-muted-foreground"} />
              </Button>
            </div>

            {isRecording && (
              <div className="p-4 bg-muted rounded-md">
                <VoiceRecorder onComplete={handleVoiceRecordingComplete} />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={!message.trim() && !isRecording}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
