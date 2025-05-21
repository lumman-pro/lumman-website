"use client"

import { LukeButton } from "@/components/luke-button"

export default function NewChatPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <h1 className="text-2xl font-medium mb-8">New chat</h1>

      {/* Use the LukeButton exactly as it is on the homepage */}
      <LukeButton />
    </div>
  )
}
