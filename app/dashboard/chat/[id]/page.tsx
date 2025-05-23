"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useChatMessages } from "@/hooks/use-data-fetching"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params?.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use React Query hooks
  const { data: chatData, isLoading, error } = useChatMessages(chatId)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatData?.messages])

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
      <div className="p-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-medium">{chatData?.chat?.chat_name || "Chat"}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Display chat summary */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted/50 rounded-lg p-4 max-w-[80%]">
            <h2 className="font-medium mb-2">Chat Summary</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {chatData?.chat?.chat_summary || "No summary available for this chat."}
            </p>
            <div className="text-xs mt-4 opacity-70">
              {formatDate(new Date(chatData?.chat?.created_at || new Date()))}
            </div>
          </div>
        </div>
        
        {/* Display chat transcription if available */}
        {chatData?.chat?.chat_transcription && (
          <div className="border-t pt-4 mt-8">
            <h3 className="font-medium mb-4">Transcription</h3>
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {chatData.chat.chat_transcription}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
