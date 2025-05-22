"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useChats, useCreateChat } from "@/hooks/use-data-fetching"
import { MessageSquarePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Use React Query hooks
  const { data: chatsData, isLoading } = useChats({ limit: 5 })
  const createChatMutation = useCreateChat()

  const handleNewChat = async () => {
    try {
      const newChat = await createChatMutation.mutateAsync("New Chat")
      router.push(`/dashboard/chat/${newChat.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create new chat",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground transition-colors duration-300 ease-in-out mb-4">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
            Start a conversation with Luke or continue where you left off.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
            <MessageSquarePlus className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">Start a New Conversation</h2>
            <p className="text-muted-foreground">
              Begin a fresh conversation with Luke about your business challenges.
            </p>
            <Button onClick={handleNewChat} disabled={createChatMutation.isPending}>
              {createChatMutation.isPending ? "Creating..." : "New Conversation"}
            </Button>
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
                    {chat.chat_name || "Untitled Chat"}
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
