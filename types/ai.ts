import type { AIModel, Chunk, StreamResult } from "ai"

export interface GenerateTextOptions {
  prompt: string
  model?: AIModel
  system?: string
}

export interface StreamTextOptions {
  prompt: string
  model?: AIModel
  system?: string
  onChunk?: (chunk: Chunk) => void
  onFinish?: (result: StreamResult) => void
}

export interface AIResponse {
  text: string | null
  error: string | null
}

export interface AIStreamResponse {
  result: StreamResult | null
  error: string | null
}
