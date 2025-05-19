"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"
import { useConversation } from "@/lib/elevenlabs"
import { Loader2 } from "lucide-react"

export function LukeButton() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [conversationState, setConversationState] = useState<"idle" | "connecting" | "connected">("idle")
  const conversationRef = useRef<ReturnType<typeof useConversation> | null>(null)

  // Initialize the conversation hook
  const conversation = useConversation({
    onConnect: () => {
      setConversationState("connected")
      console.log("Connected to Luke")
    },
    onDisconnect: () => {
      setConversationState("idle")
      console.log("Disconnected from Luke")
    },
    onMessage: (message) => {
      console.log("Received message:", message)
    },
    onError: (err) => {
      console.error("Conversation error:", err)
      setConversationState("idle")
    },
  })

  // Store the conversation reference
  useEffect(() => {
    conversationRef.current = conversation
  }, [conversation])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleButtonClick = async () => {
    if (conversationState === "idle") {
      setConversationState("connecting")

      try {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true })

        // Start the conversation session
        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
        const isPublic = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_PUBLIC === "true"

        if (isPublic && agentId) {
          await conversation.startSession({ agentId })
        } else {
          try {
            // For private agents, fetch a signed URL
            const response = await fetch("/api/elevenlabs/get-signed-url")
            if (!response.ok) {
              throw new Error("Failed to get signed URL")
            }
            const { url } = await response.json()
            await conversation.startSession({ url })
          } catch (urlError) {
            console.warn("Failed to get signed URL, using fallback:", urlError)
            await conversation.startSession({ agentId: "fallback-agent-id" })
          }
        }
      } catch (err) {
        console.error("Failed to initialize conversation:", err)
        setConversationState("idle")
      }
    } else if (conversationState === "connected") {
      // If already connected, end the session
      await conversation.endSession()
      setConversationState("idle")
    }
  }

  // Clean up the conversation when component unmounts
  useEffect(() => {
    return () => {
      if (conversationRef.current && conversationState === "connected") {
        conversationRef.current.endSession()
      }
    }
  }, [conversationState])

  return (
    <button
      className={cn(
        "relative px-6 py-3 text-sm font-medium rounded-md overflow-hidden border border-transparent",
        "text-white dark:text-white",
        "shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out",
        "group isolate w-[120px] h-[42px] flex items-center justify-center", // Fixed width and height for consistency
        conversationState === "connecting" && "cursor-wait",
      )}
      style={{
        WebkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)",
      }}
      onClick={handleButtonClick}
      disabled={conversationState === "connecting"}
    >
      <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
        {conversationState === "connecting" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : conversationState === "connected" ? (
          "All good now"
        ) : (
          "talk to Luke"
        )}
      </span>
      <div
        className={cn(
          "absolute inset-0 -z-10 bg-gradient-to-br opacity-90 dark:opacity-100",
          conversationState === "connected"
            ? "from-blue-600 via-purple-600 to-pink-500" // deep emerald, viridian, midnight teal
            : "from-cyan-500 via-blue-700 to-emerald-400",
        )}
        style={{
          backgroundSize: "200% 200%",
          animation: `gradient-shift ${conversationState === "connected" ? "5s" : "8s"} ease infinite`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 -z-10",
          conversationState === "connected"
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.8),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.5),transparent_60%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(22,219,192,0.8),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(22,219,192,0.5),transparent_60%)]",
        )}
        style={{
          animation: "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 -z-10 opacity-70 dark:opacity-50",
          conversationState === "connected"
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(13,148,136,0.8),transparent_40%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.8),transparent_40%)]",
        )}
        style={{
          left: `calc(${mousePosition.x}px - 50%)`,
          top: `calc(${mousePosition.y}px - 50%)`,
          width: "100%",
          height: "100%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7 }
          50% { opacity: 0.3 }
        }
      `}</style>
    </button>
  )
}
