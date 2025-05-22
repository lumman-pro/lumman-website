"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useChatMessages, useAddChatMessage } from "@/hooks/use-data-fetching"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params?.id as string
  const { toast } = useToast()

  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use React Query hooks
  const { data: chatData, isLoading, error } = useChatMessages(chatId)
  const addMessageMutation = useAddChatMessage()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatData?.messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    try {
      await addMessageMutation.mutateAsync({
        chatId,
        content: message,
        role: "user",
      })

      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 overflow-y-auto space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4",
                  i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
                style={{ width: `${Math.random() * 40 + 20}%`, height: `${Math.random() * 40 + 40}px` }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-destructive text-center">
            {error instanceof Error ? error.message : "Failed to load chat"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatData?.messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4",
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-xs mt-2 opacity-70">{formatDate(new Date(msg.created_at))}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={addMessageMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
