import type { LanguageModelV1 } from "ai";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
}

export interface Chunk {
  content: string;
  metadata?: Record<string, any>;
}

export interface StreamResult {
  content: string;
  finished: boolean;
}

export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface ConversationData {
  id: string;
  messages: ConversationMessage[];
  metadata?: Record<string, any>;
}

export interface GenerateTextOptions {
  prompt: string;
  model?: LanguageModelV1;
  system?: string;
}

export interface StreamTextOptions {
  prompt: string;
  model?: LanguageModelV1;
  system?: string;
  onChunk?: (chunk: any) => void;
  onFinish?: (result: any) => void;
}

export interface AITextResponse {
  text: string | null;
  error: string | null;
}

export interface AIStreamResponse {
  result: any | null;
  error: string | null;
}
