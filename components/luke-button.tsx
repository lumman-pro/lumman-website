"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useChat } from "ai/react"
import { Loader2 } from "lucide-react"

export function LukeButton() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [conversationState, setConversationState] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/elevenlabs/agent",
    onResponse: async (response) => {
      // When we get a response, we're connected and the agent is speaking
      setConversationState("connected")
      setIsSpeaking(true)
      console.log("Connected to Luke")
    },
    onFinish: async (message) => {
      // When finished, we're still connected but not speaking
      setIsSpeaking(false)
    },
  })

  // Update error state when there's an error from useChat
  useEffect(() => {
    if (error) {
      setErrorMessage(error.message || "Connection error")
      setConversationState("error")
      console.error("Conversation error:", error)
    }
  }, [error])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleButtonClick = async () => {
    if (conversationState === "error") {
      // Reset error state and try again
      setConversationState("idle")
      setErrorMessage(null)
      return
    }

    if (conversationState === "idle") {
      setConversationState("connecting")

      try {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true })

        // Correct way to submit a message with useChat hook
        handleInputChange({ target: { value: "Hello, I need some assistance." } } as any)
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} } as any)
        }, 100)
      } catch (err: any) {
        console.error("Failed to initialize conversation:", err)
        setErrorMessage(err?.message || "Failed to initialize conversation")
        setConversationState("error")
      }
    } else if (conversationState === "connected") {
      // If already connected, end the session
      setConversationState("idle")
      setIsSpeaking(false)
    }
  }

  // Get button text based on state
  const getButtonText = () => {
    if (conversationState === "connecting" || isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    } else if (conversationState === "connected") {
      return isSpeaking ? "Speaking..." : "Listening..."
    } else if (conversationState === "error") {
      return "Try later"
    } else {
      return "talk to Luke"
    }
  }

  return (
    <button
      className={cn(
        "relative px-6 py-3 text-sm font-medium rounded-md overflow-hidden border border-transparent",
        "text-white dark:text-white",
        "shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out",
        "group isolate w-[120px] h-[42px] flex items-center justify-center", // Fixed width and height for consistency
        conversationState === "connecting" && "cursor-wait",
        conversationState === "error" && "opacity-70",
      )}
      style={{
        WebkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)",
      }}
      onClick={handleButtonClick}
      disabled={conversationState === "connecting" || isLoading}
      title={errorMessage || undefined}
    >
      <span className="relative z-10 flex items-center justify-center whitespace-nowrap">{getButtonText()}</span>
      <div
        className={cn(
          "absolute inset-0 -z-10 bg-gradient-to-br opacity-90 dark:opacity-100",
          conversationState === "connected"
            ? "from-blue-600 via-purple-600 to-pink-500" // deep emerald, viridian, midnight teal
            : conversationState === "error"
              ? "from-gray-500 via-gray-600 to-gray-700"
              : "from-cyan-500 via-blue-700 to-emerald-400",
        )}
        style={{
          backgroundSize: "200% 200%",
          animation:
            conversationState !== "error"
              ? `gradient-shift ${conversationState === "connected" ? "5s" : "8s"} ease infinite`
              : "none",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 -z-10",
          conversationState === "connected"
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.8),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.5),transparent_60%)]"
            : conversationState === "error"
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(75,75,75,0.8),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(75,75,75,0.5),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(22,219,192,0.8),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(22,219,192,0.5),transparent_60%)]",
        )}
        style={{
          animation: conversationState !== "error" ? "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 -z-10 opacity-70 dark:opacity-50",
          conversationState === "connected"
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(13,148,136,0.8),transparent_40%)]"
            : conversationState === "error"
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(75,75,75,0.8),transparent_40%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.8),transparent_40%)]",
        )}
        style={{
          left: conversationState !== "error" ? `calc(${mousePosition.x}px - 50%)` : "50%",
          top: conversationState !== "error" ? `calc(${mousePosition.y}px - 50%)` : "50%",
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
