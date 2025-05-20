"use client"

import { useState } from "react"
import { ConversationList } from "@/components/dashboard/conversation-list"
import { ConversationDetail } from "@/components/dashboard/conversation-detail"
import { createNewConversation, deleteConversation } from "./actions"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const router = useRouter()

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
  }

  const handleNewConversation = async () => {
    const newId = await createNewConversation()
    return newId
  }

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id)
    setSelectedConversationId(null)
    router.refresh()
  }

  return (
    <div className="container max-w-7xl py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="md:col-span-1 border rounded-lg overflow-hidden h-full">
          <ConversationList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
            onNewConversation={handleNewConversation}
          />
        </div>
        <div className="md:col-span-2 border rounded-lg overflow-hidden h-full">
          <ConversationDetail conversationId={selectedConversationId} onDelete={handleDeleteConversation} />
        </div>
      </div>
    </div>
  )
}
