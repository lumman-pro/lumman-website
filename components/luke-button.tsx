"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"
import { useConversation } from "@/lib/elevenlabs"
import { Loader2 } from "lucide-react"

interface LukeButtonProps {
  onConversationStart?: () => Promise<string> | void
}

export function LukeButton({ onConversationStart }: LukeButtonProps = {}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [conversationState, setConversationState] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const conversationRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      setErrorMessage(err?.message || "Connection error")
      setConversationState("error")
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

        // If there's a callback for conversation start, call it
        if (onConversationStart) {
          await onConversationStart()
        }

        // Start the conversation session
        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
        const isPublic = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_PUBLIC === "true"

        if (isPublic && agentId) {
          await conversation.startSession({ agentId })
        } else {
          try {
            // For private agents, fetch a signed URL
            const response = await fetch("/api/elevenlabs/get-signed-url")

            // Check if response is ok
            if (!response.ok) {
              throw new Error("Failed to get signed URL: " + response.status)
            }

            // Make sure response is a valid Response object before calling json()
            if (response && typeof response.json === "function") {
              const data = await response.json()

              // Check if data contains url property
              if (data && data.url) {
                await conversation.startSession({ url: data.url })
              } else {
                throw new Error("Invalid response format: missing URL")
              }
            } else {
              throw new Error("Invalid response format: json method not available")
            }
          } catch (urlError) {
            console.error("Failed to get signed URL:", urlError)
            setErrorMessage(urlError instanceof Error ? urlError.message : "Failed to get signed URL")
            setConversationState("error")
          }
        }
      } catch (err: any) {
        console.error("Failed to initialize conversation:", err)
        setErrorMessage(err?.message || "Failed to initialize conversation")
        setConversationState("error")
      }
    } else if (conversationState === "connected") {
      // If already connected, end the session
      try {
        await conversation.endSession()
      } catch (err) {
        console.error("Error ending session:", err)
        setConversationState("idle") // Still set to idle even if there's an error ending
      }
    }
  }

  // Clean up the conversation when component unmounts
  useEffect(() => {
    return () => {
      if (conversationRef.current && conversationState === "connected") {
        try {
          // @ts-ignore - we know this exists
          conversationRef.current.endSession()
        } catch (err) {
          console.error("Error ending session during cleanup:", err)
        }
      }
    }
  }, [conversationState])

  // Get button text based on state
  const getButtonText = () => {
    if (conversationState === "connecting") {
      return <Loader2 className="h-4 w-4 animate-spin" />
    } else if (conversationState === "connected") {
      return conversation.isSpeaking ? "Speaking..." : "Listening..."
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
      disabled={conversationState === "connecting"}
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
