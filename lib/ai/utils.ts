import { generateText, streamText } from "ai";
import { models, defaultSystemPrompt } from "./config";

/**
 * Generate text using the AI SDK
 */
export async function generateAIResponse({
  prompt,
  model = models.gpt4o,
  system = defaultSystemPrompt,
}: {
  prompt: string;
  model?: typeof models.gpt4o;
  system?: string;
}) {
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
}: {
  prompt: string;
  model?: typeof models.gpt4o;
  system?: string;
  onChunk?: (chunk: unknown) => void;
  onFinish?: (result: unknown) => void;
}) {
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
