"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useChats } from "@/hooks/use-data-fetching"
import { MessageSquarePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LukeButton } from "@/components/luke-button"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Use React Query hooks
  const { data: chatsData, isLoading } = useChats({ limit: 5 })

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground transition-colors duration-300 ease-in-out mb-4">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
            View your conversations with Luke or start a new one.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
            <MessageSquarePlus className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">Start a New Conversation</h2>
            <p className="text-muted-foreground">
              Begin a fresh conversation with Luke about your business challenges.
            </p>
            <LukeButton />
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded-md" />
                ))}
              </div>
            ) : !chatsData || chatsData.chats.length === 0 ? (
              <p className="text-muted-foreground">No recent conversations.</p>
            ) : (
              <div className="space-y-2">
                {chatsData.chats.slice(0, 5).map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{chat.chat_name || "Untitled Chat"}</span>
                      {chat.chat_summary && (
                        <span className="text-xs text-muted-foreground mt-1 truncate max-w-full">
                          {chat.chat_summary.substring(0, 60)}...
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
