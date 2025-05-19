"use client"

// This file contains both the ElevenLabs SDK wrapper and the fallback implementation

// Fallback implementation types
interface ConversationOptions {
  onConnect?: () => void
  onDisconnect?: () => void
  onMessage?: (message: any) => void
  onError?: (error: any) => void
}

interface SessionOptions {
  url?: string
  agentId?: string
}

interface VolumeOptions {
  volume: number
}

// Fallback implementation
function fallbackUseConversation(options: ConversationOptions = {}) {
  console.warn("Using fallback ElevenLabs conversation implementation")

  const { onConnect, onDisconnect, onError } = options

  // Mock status state
  let _status = "disconnected"
  const _isSpeaking = false

  return {
    status: _status,
    isSpeaking: _isSpeaking,
    startSession: async (sessionOptions: SessionOptions) => {
      console.log("Mock conversation: startSession called with", sessionOptions)

      try {
        _status = "connected"
        if (onConnect) {
          // Simulate a delay before connecting
          setTimeout(() => {
            onConnect()

            // Simulate a welcome message after connection
            if (options.onMessage) {
              setTimeout(() => {
                options.onMessage({
                  type: "response",
                  text: "Hello, I'm Luke. How can I help you today?",
                })
              }, 500)
            }
          }, 1000)
        }
        return "mock-conversation-id"
      } catch (error) {
        if (onError) onError(error)
        throw error
      }
    },
    endSession: async () => {
      console.log("Mock conversation: endSession called")

      try {
        _status = "disconnected"
        if (onDisconnect) onDisconnect()
      } catch (error) {
        if (onError) onError(error)
        throw error
      }
    },
    setVolume: async (volumeOptions: VolumeOptions) => {
      console.log("Mock conversation: setVolume called with", volumeOptions)
    },
  }
}

// Export the fallback implementation as the default
export const useConversation = fallbackUseConversation
