import { NextResponse } from "next/server"
import { ElevenLabsAgentStream, StreamingTextResponse } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 })
    }

    if (!process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID) {
      return NextResponse.json({ error: "NEXT_PUBLIC_ELEVENLABS_AGENT_ID not configured" }, { status: 500 })
    }

    const stream = await ElevenLabsAgentStream({
      apiKey: process.env.ELEVENLABS_API_KEY,
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
      messages,
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error processing ElevenLabs agent request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
