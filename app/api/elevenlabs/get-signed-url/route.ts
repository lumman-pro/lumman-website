import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only needed for private agents
    if (process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_PUBLIC === "true") {
      return NextResponse.json({ error: "Agent is public, no signed URL needed" }, { status: 400 })
    }

    const agentId = process.env.ELEVENLABS_AGENT_ID
    if (!agentId) {
      return NextResponse.json({ error: "Agent ID not configured" }, { status: 500 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const requestHeaders = new Headers()
    requestHeaders.set("xi-api-key", apiKey)

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: requestHeaders,
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)
      return NextResponse.json({ error: "Failed to get signed URL from ElevenLabs" }, { status: response.status })
    }

    try {
      const data = await response.json()
      if (!data || !data.signed_url) {
        return NextResponse.json({ error: "Invalid response from ElevenLabs API" }, { status: 500 })
      }
      return NextResponse.json({ url: data.signed_url })
    } catch (jsonError) {
      console.error("Error parsing JSON from ElevenLabs API:", jsonError)
      return NextResponse.json({ error: "Failed to parse response from ElevenLabs API" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error getting signed URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
