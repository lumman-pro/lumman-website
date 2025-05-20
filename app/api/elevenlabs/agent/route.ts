import { NextResponse } from "next/server"
import { elevenlabs } from "@ai-sdk/elevenlabs"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("Missing ELEVENLABS_API_KEY")
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 })
    }

    if (!process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID) {
      console.error("Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID")
      return NextResponse.json({ error: "NEXT_PUBLIC_ELEVENLABS_AGENT_ID not configured" }, { status: 500 })
    }

    // Create a custom ElevenLabs provider instance with the API key
    const customElevenLabs = elevenlabs.withOptions({
      apiKey: process.env.ELEVENLABS_API_KEY,
    })

    // Make a direct fetch to the ElevenLabs API for agent conversation
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({ messages }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)
      return NextResponse.json(
        {
          error: "Error from ElevenLabs API",
          status: response.status,
          details: errorText,
        },
        { status: response.status },
      )
    }

    // Use the new streaming API from AI SDK 4.0
    const textStream = streamText()

    // Process the response body
    const reader = response.body?.getReader()
    if (!reader) {
      return NextResponse.json({ error: "Failed to get response reader" }, { status: 500 })
    }
    // Start reading the stream in the background
    ;(async () => {
      try {
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            textStream.close()
            break
          }
          const text = decoder.decode(value)
          textStream.append(text)
        }
      } catch (error) {
        console.error("Error reading stream:", error)
        textStream.abort(error instanceof Error ? error : new Error(String(error)))
      }
    })()

    // Return the stream using the new API
    return textStream.toDataStreamResponse()
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
