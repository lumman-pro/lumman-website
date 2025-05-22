import { generateText, streamText } from "ai";
import { models, defaultSystemPrompt } from "./config";
import type { GenerateTextOptions, StreamTextOptions } from "@/types/ai";

/**
 * Generate text using the AI SDK
 */
export async function generateAIResponse({
  prompt,
  model = models.gpt4o,
  system = defaultSystemPrompt,
}: GenerateTextOptions) {
  try {
    const { text } = await generateText({
      model,
      prompt,
      system,
    });

    return { text, error: null };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      text: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Stream text using the AI SDK
 */
export function streamAIResponse({
  prompt,
  model = models.gpt4o,
  system = defaultSystemPrompt,
  onChunk,
  onFinish,
}: StreamTextOptions) {
  try {
    const result = streamText({
      model,
      prompt,
      system,
      onChunk,
      onFinish,
    });

    return { result, error: null };
  } catch (error) {
    console.error("Error streaming AI response:", error);
    return {
      result: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
