"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/supabase/auth"
import { supabaseClient } from "@/lib/supabase/supabaseClient"
import { MessageSquarePlus, User } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useUserProfile } from "@/hooks/use-user-profile"

interface Conversation {
  id: string
  chat_name: string
  created_at: string
}

interface SidebarNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarNavigation({ isOpen, onClose }: SidebarNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Fix: Correctly destructure the useUserProfile hook as an object
  const { profile, isLoading: isProfileLoading } = useUserProfile()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()
      setUser(session?.user || null)
    }

    checkUser()
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabaseClient
        .from("chats")
        .select("id, chat_name, created_at")
        // Removed the deleted filter since the column no longer exists
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setConversations(data || [])
    } catch (err) {
      console.error("Error fetching conversations:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    onClose()
  }

  const handleNewChat = () => {
    router.push("/dashboard/new")
    onClose()
  }

  const handleChatSelect = (id: string) => {
    router.push(`/dashboard/chat/${id}`)
    onClose()
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Top section with New Chat button */}
      <div className="p-4 border-b">
        <Button variant="ghost" className="w-full justify-start text-sm font-medium" onClick={handleNewChat}>
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Scrollable conversations list */}
      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">No conversations yet</div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal px-4 py-2 h-auto",
                    isActive(`/dashboard/chat/${conversation.id}`) && "bg-muted font-medium",
                  )}
                  onClick={() => handleChatSelect(conversation.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="truncate w-full text-left">{conversation.chat_name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDate(new Date(conversation.created_at))}
                    </span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom section with links and user profile */}
      <div className="p-4 border-t mt-auto">
        <nav className="space-y-2">
          <Link href="/insights" onClick={onClose}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start text-sm", isActive("/insights") && "bg-muted font-medium")}
            >
              Insights
            </Button>
          </Link>

          <Link href="/account" onClick={onClose}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start text-sm", isActive("/account") && "bg-muted font-medium")}
            >
              <User className="h-4 w-4 mr-2" />
              {isProfileLoading ? "Loading..." : profile?.user_name || "Your Account"}
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}
